import App from './App';
import './style.scss';

const main = async (): Promise<void> => {
  const renderCanvas = document.getElementById(
    'renderCanvas'
  ) as HTMLCanvasElement;
  if (renderCanvas == null) {
    return;
  }

  const depthCanvas = document.getElementById(
    'depthImageCanvas'
  ) as HTMLCanvasElement;
  if (depthCanvas == null) {
    return;
  }

  const overlayRoot = document.getElementById('overlay-container');
  if (overlayRoot == null) {
    return;
  }

  renderCanvas.width = window.innerWidth;
  renderCanvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    renderCanvas.width = window.innerWidth;
    renderCanvas.height = window.innerHeight;
  });

  const ctx = depthCanvas.getContext('2d');

  if (ctx == null) {
    return;
  }

  const app = new App(renderCanvas, ctx, overlayRoot);
  await app.RunAsync();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
