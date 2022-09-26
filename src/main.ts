import App from './App';
import './style.scss';

const main = async (): Promise<void> => {
  const renderCanvas = document.getElementById(
    'renderCanvas'
  ) as HTMLCanvasElement;
  if (renderCanvas == null) {
    return;
  }

  renderCanvas.width = window.innerWidth;
  renderCanvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    renderCanvas.width = window.innerWidth;
    renderCanvas.height = window.innerHeight;
  });

  const app = new App(renderCanvas);
  await app.RunAsync();
};

await main();
