import {
  Engine,
  MeshBuilder,
  Scene,
  Vector3,
  WebXRExperienceHelper,
} from '@babylonjs/core';
import { AdvancedDynamicTexture, Button } from '@babylonjs/gui';

export default class BabylonScene {
  private readonly engine: Engine;
  private readonly scene: Scene;

  public constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
  }

  public readonly InitSceneAsync = async (): Promise<void> => {
    this.scene.createDefaultCamera(true, true, true);
    this.scene.createDefaultLight(true);

    const cube = MeshBuilder.CreateBox('box', { size: 0.1 });
    cube.position = new Vector3(0, 1.2, 0);

    // setup gui@
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
      setTimeout(() => {
        const handler = async (): Promise<void> => {
          await xrHelper.enterXRAsync('immersive-ar', 'unbounded', undefined, {
            requiredFeatures: ['depth-sensing'],
            depthSensing: {
              usagePreference: ['cpu-optimized'],
              dataFormatPreference: ['luminance-alpha'],
            },
          } as any);
        };
        handler().catch(null);
      }, 100);
      enterExitButton.isVisible = false;
    });
    xrHelper.sessionManager.onXRSessionEnded.add(() => {
      enterExitButton.isVisible = true;
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    this.engine.runRenderLoop(() => this.scene.render());
  };
}
