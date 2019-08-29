import Frames from '../frames';

export default function () {
  let mouseDown = false;
  let x1;
  let x2;
  let y1;
  let y2;
  let imageData;

  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  const mouseDownHandler = (event) => {
    mouseDown = true;

    [x1, y1] = [event.offsetX, event.offsetY];

    imageData = this.context.getImageData(0, 0, this.mainCanvas.width, this.mainCanvas.height);
  };

  const mouseMoveHandler = (event) => {
    if (!mouseDown) return;

    [x2, y2] = [event.offsetX, event.offsetY];

    this.context.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
    this.context.putImageData(imageData, x2 - x1, y2 - y1);
  };

  const mouseUpHandler = () => {
    mouseDown = false;
    this.transferImage();
    Frames.getFrame();
  };

  const contextMenuHandler = (event) => {
    event.preventDefault();
  };

  this.addListners([
    mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseUpHandler,
  ]);
}
