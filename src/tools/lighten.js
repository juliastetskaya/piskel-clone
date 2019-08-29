import Frames from '../frames';

export default function () {
  let x1;
  let y1;
  let mouseDown = false;

  const light = (x, y, image, which) => {
    const color = image.data;
    const delta = which === 1 ? 25 : 15;
    color[0] = color[0] < 255 ? color[0] + delta : color[0];
    color[1] = color[1] < 255 ? color[1] + delta : color[1];
    color[2] = color[2] < 255 ? color[2] + delta : color[2];
    this.context.putImageData(image, x, y);
  };

  const mouseDownHandler = (event) => {
    mouseDown = true;
    [x1, y1] = [event.offsetX, event.offsetY];
    const image = this.context.getImageData(x1, y1, 1, 1);
    light(x1, y1, image, event.which);
  };

  const mouseMoveHandler = (event) => {
    if (!mouseDown) return;
    [x1, y1] = [event.offsetX, event.offsetY];
    const image = this.context.getImageData(x1, y1, 1, 1);
    light(x1, y1, image);
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
