import BabylonScene from './BabylonScene';

export default class App {
  private readonly babylonScene: BabylonScene;

  public constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    element: Element
  ) {
    this.babylonScene = new BabylonScene(canvas, ctx, element);
  }

  public readonly RunAsync = async (): Promise<void> => {
    await this.babylonScene.InitSceneAsync();
  };
}
