import Frames from '../frames';

export default function () {
  let x1;
  let y1;
  let mouseDown = false;

  const canvasWidth = this.mainCanvas.width;
  const canvasHeight = this.mainCanvas.height;

  const isMatchStartColor = (x, y, color) => {
    const { data } = this.context.getImageData(x, y, 1, 1);

    return data[0] === color[0] && data[1] === color[1] && data[2] === color[2]
      && data[3] === color[3];
  };

  const colorFill = (startColor, fillColor) => {
    for (let x = 0; x < canvasWidth; x += 1) {
      for (let y = 0; y < canvasHeight; y += 1) {
        if (isMatchStartColor(x, y, startColor)) {
          this.drawPixel(x, y, fillColor);
        }
      }
    }
  };

  const mouseDownHandler = (event) => {
    mouseDown = true;
    [x1, y1] = [event.offsetX, event.offsetY];
    const { data } = this.context.getImageData(x1, y1, 1, 1);
    colorFill(data, event.which === 1 ? this.firstColor : this.secondColor);
  };

  const mouseMoveHandler = (event) => {
    if (!mouseDown) {
      const [x, y] = [event.offsetX, event.offsetY];

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawPixel(x, y, 'rgba(179, 179, 179, 0.3)', false);
    }
  };

  const mouseUpHandler = () => {
    mouseDown = false;
    this.transferImage();
    Frames.getFrame();
  };

  const mouseLeaveHandler = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  const contextMenuHandler = (event) => {
    event.preventDefault();
  };

  this.addListners([
    mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseLeaveHandler,
  ]);
}
