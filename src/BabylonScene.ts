import { Engine, Scene, WebXRExperienceHelper } from '@babylonjs/core';
import { AdvancedDynamicTexture, Button, TextBlock } from '@babylonjs/gui';

export default class BabylonScene {
  private readonly engine: Engine;
  private readonly scene: Scene;

  private refSpace?: XRReferenceSpace;

  public constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
  }

  public readonly InitSceneAsync = async (): Promise<void> => {
    this.scene.createDefaultCamera(true, true, true);
    this.scene.createDefaultLight(true);

    const { enterExitButton } = BabylonScene.SetupDefaultGUI(this.scene);

    const xrHelper = await WebXRExperienceHelper.CreateAsync(this.scene);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    enterExitButton.onPointerDownObservable.add(async (): Promise<void> => {
      // user activationのために待機
      await new Promise((resolve) => setTimeout(resolve, 100));

      await xrHelper.enterXRAsync('immersive-ar', 'unbounded', undefined, {
        requiredFeatures: ['depth-sensing'],
        depthSensing: {
          usagePreference: ['cpu-optimized'],
          dataFormatPreference: ['luminance-alpha'],
        },
      } as any);

      this.refSpace = xrHelper.sessionManager.referenceSpace;

      enterExitButton.isVisible = false;
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    xrHelper.sessionManager.onXRSessionInit.add(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { fullUI } = this.InitXRGUI();

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      xrHelper.sessionManager.onXRFrameObservable.add(async (frame) => {
        const imageData = await this.CreateDepthImageDataFromXRFrame(frame);
        if (imageData == null) {
          return;
        }

        const ctx = fullUI.getContext();
        ctx.putImageData(imageData, imageData.width, imageData.height);
        fullUI.update();
      });
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    this.engine.runRenderLoop(() => this.scene.render());
  };

  private static readonly SetupDefaultGUI = (
    s: Scene
  ): {
    enterExitButton: Button;
  } => {
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

    const width: number = depthInfo.width;
    const height: number = depthInfo.height;

    const numArr = Array<number>(width * height);

    const dataArr = new Int16Array(depthInfo.data);

    for (let i = 0; i < width * height; i++) {
      numArr[i] = dataArr[i] * depthInfo.rawValueToMeters;
    }

    const depthLimit = 5.0;

    const colorArray = numArr
      .map((val) =>
        val <= 0.0 || val > depthLimit
          ? [0.0, 0.0, 0.0, 1.0]
          : [depthLimit - val, depthLimit - val, depthLimit - val, 1.0]
      )
      .flat()
      .map((val) => (val * 255.0) / depthLimit);
    const colorBuffer = new Uint8ClampedArray(colorArray);
    const imageData = new ImageData(colorBuffer, width);

    return imageData;
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private readonly InitXRGUI = () => {
    const fullUI = AdvancedDynamicTexture.CreateFullscreenUI('XRUI');

    const text1 = new TextBlock();
    text1.top = 0;
    text1.left = 0;
    text1.text = '(0.25, 0.50)';
    text1.color = 'white';
    text1.fontSize = 25;

    // fullUI.addControl(text1);

    return { fullUI, text1 };
  };
}
