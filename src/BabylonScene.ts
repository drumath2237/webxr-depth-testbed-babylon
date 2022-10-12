import { Engine, Scene, WebXRExperienceHelper } from '@babylonjs/core';
import { AdvancedDynamicTexture, Button } from '@babylonjs/gui';

export default class BabylonScene {
  private readonly engine: Engine;
  private readonly scene: Scene;

  private refSpace?: XRReferenceSpace;

  public constructor(
    canvas: HTMLCanvasElement,
    private readonly ctxDepthImage: CanvasRenderingContext2D,
    private readonly domRoot: Element
  ) {
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
  }

  public readonly InitSceneAsync = async (): Promise<void> => {
    this.scene.createDefaultCamera(true, true, true);
    this.scene.createDefaultLight(true);

    const { enterExitButton } = BabylonScene.SetupDefaultGUI(this.scene);

    const xrHelper = await WebXRExperienceHelper.CreateAsync(this.scene);

    enterExitButton.onPointerDownObservable.add(async (): Promise<void> => {
      // user activationのために待機
      await new Promise((resolve) => setTimeout(resolve, 100));

      // createDefaultXRExperienceではdepth-sensingを有効にできないので自分でenterXRを呼び出す
      // （現行バージョンでは）
      await xrHelper.enterXRAsync('immersive-ar', 'unbounded', undefined, {
        requiredFeatures: ['depth-sensing'],
        depthSensing: {
          usagePreference: ['cpu-optimized'],
          dataFormatPreference: ['luminance-alpha'],
        },
        domOverlay: {
          root: this.domRoot,
        },
        optionalFeatures: ['dom-overlay'],
      } as any);

      this.refSpace = xrHelper.sessionManager.referenceSpace;

      enterExitButton.isVisible = false;
    });

    xrHelper.sessionManager.onXRSessionInit.add(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      xrHelper.sessionManager.onXRFrameObservable.add(async (frame) => {
        const imageData = await this.CreateDepthImageDataFromXRFrame(frame);
        if (imageData == null) {
          return;
        }

        this.ctxDepthImage.putImageData(imageData, 0, 0);
      });
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    this.engine.runRenderLoop(() => this.scene.render());
  };

  /**
   * WebXRモードに移行するためのボタンを作成
   * @param s
   * @returns Buttonオブジェクト
   */
  private static readonly SetupDefaultGUI = (s: Scene) => {
    // setup gui
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      'UI',
      undefined,
      s
    );
    const enterExitButton = Button.CreateSimpleButton(
      'enterButton',
      'Enter XR'
    );
    enterExitButton.width = 0.3;
    enterExitButton.height = 0.05;
    enterExitButton.background = 'green';
    enterExitButton.color = 'white';
    advancedTexture.addControl(enterExitButton);

    return {
      enterExitButton,
    };
  };

  /**
   * フレームデータからdepth-sensingでDepth推定結果を取得し、Depth画像を生成する
   * @param frame フレームデータ（WebXRモードでの動作）
   * @returns Depth画像のImageData
   */
  private readonly CreateDepthImageDataFromXRFrame = async (
    frame: XRFrame
  ): Promise<ImageData | null> => {
    if (this.refSpace == null) {
      return null;
    }

    const pose = frame.getViewerPose(this.refSpace);
    if (pose == null) {
      return null;
    }

    const view = pose.views[0];
    const depthInfo = (frame as any).getDepthInformation(view);

    if (depthInfo == null) {
      return null;
    }

    const width: number = depthInfo.width;
    const height: number = depthInfo.height;

    const numArr = Array<number>(width * height);

    const dataArr = new Int16Array(depthInfo.data);
    for (let i = 0; i < width * height; i++) {
      numArr[i] = dataArr[i] * depthInfo.rawValueToMeters;
    }

    const depthLimit = 4.0;

    const colorArray = numArr
      .map((val) =>
        val <= 0.0 || val > depthLimit
          ? [0.0, 0.0, 0.0, 1.0]
          : [
              1.0 - val / depthLimit,
              1.0 - val / depthLimit,
              1.0 - val / depthLimit,
              1.0,
            ]
      )
      .flat()
      .map((val) => val * 255.0);

    const colorBuffer = new Uint8ClampedArray(colorArray);
    const imageData = new ImageData(colorBuffer, width);

    return imageData;
  };
}
