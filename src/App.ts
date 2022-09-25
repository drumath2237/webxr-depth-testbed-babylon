import BabylonScene from './BabylonScene';

export default class App {
  private readonly babylonScene: BabylonScene;

  public constructor(canvas: HTMLCanvasElement) {
    this.babylonScene = new BabylonScene(canvas);
  }

  public readonly Run = (): void => {
    this.babylonScene.InitScene();
  };
}
