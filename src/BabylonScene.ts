import {
  Engine,
  MeshBuilder,
  Scene,
  Vector3,
  WebXRExperienceHelper,
} from '@babylonjs/core';
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

    const cube = MeshBuilder.CreateBox('box', { size: 0.1 });
    cube.position = new Vector3(0, 1.2, 0);

    // setup gui
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
    const enterExitButton = Button.CreateSimpleButton(
      'enterButton',
      'Enter XR'
    );
    enterExitButton.width = 0.3;
    enterExitButton.height = 0.05;
    enterExitButton.background = 'green';
    enterExitButton.color = 'white';
    advancedTexture.addControl(enterExitButton);

    const xrHelper = await WebXRExperienceHelper.CreateAsync(this.scene);

    enterExitButton.onPointerDownObservable.add(() => {
      advancedTexture.dispose();

      const handler = async (): Promise<void> => {
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
      };
      handler().catch(null);
    });

    xrHelper.sessionManager.onXRSessionInit.add(() => {
      setTimeout(() => {
        const updater = this.InitXRGUI();
        xrHelper.sessionManager.onXRFrameObservable.add((frame) => {
          this.OnFrame(frame, updater);
        });
      }, 1000);
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    this.engine.runRenderLoop(() => this.scene.render());
  };

  private readonly OnFrame = (
    frame: XRFrame,
    depthCallback: (d: number) => void
  ): void => {
    (async () => {
      if (this.refSpace == null) {
        return;
      }

      const pose = frame.getViewerPose(this.refSpace);
      if (pose == null) {
        return;
      }

      const view = pose.views[0];

      const depthInfo = (frame as any).getDepthInformation(view);
      const d1 = depthInfo.getDepthInMeters(0.25, 0.5);

      depthCallback(d1);
    })().catch(null);
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

    fullUI.addControl(text1);

    const depthTextUpdater = (d: number): void => {
      text1.text = d.toPrecision(5);
    };

    return depthTextUpdater;
  };
}
