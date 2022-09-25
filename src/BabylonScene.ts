import { Engine, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';

export default class BabylonScene {
  private readonly engine: Engine;
  private readonly scene: Scene;

  public constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
  }

  public readonly InitScene = (): void => {
    this.scene.createDefaultCamera(true, true, true);
    this.scene.createDefaultEnvironment();
    this.scene.createDefaultLight(true);

    const cube = MeshBuilder.CreateBox('box', { size: 0.1 });
    cube.position = new Vector3(0, 0.05, 0);

    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    this.engine.runRenderLoop(() => this.scene.render());
  };
}
