import './style.scss';

const main = (): void => {
  const renderCanvas = document.getElementById(
    'renderCanvas'
  ) as HTMLCanvasElement;
  if (renderCanvas == null) {
    return;
  }

  renderCanvas.width = window.innerWidth;
  renderCanvas.height = window.innerHeight;
};

main();
