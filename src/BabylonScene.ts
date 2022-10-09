import { Engine, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';

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

    const xr = await this.scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: 'immersive-ar',
        referenceSpaceType: 'unbounded',
      },
    });

    xr.baseExperience.sessionManager.onXRFrameObservable.add(
      (eventData, eventState) => {
        console.log(eventData.session.depthUsage);
      }
    );

    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    this.engine.runRenderLoop(() => this.scene.render());
  };
}
