import Frames from '../frames';
import { rgbToHex } from '../lib';

export default function () {
  let mouseDown = false;

  const isMatchStartColor = (x, y, color) => {
    const { data } = this.context.getImageData(x, y, 1, 1);

    return data[0] === color[0] && data[1] === color[1] && data[2] === color[2]
      && data[3] === color[3];
  };

  const fill = (startX, startY, startColor, fillColor) => {
    const color = rgbToHex([...startColor].slice(0, -1));
    if (color === fillColor && startColor[3] === 255) return;
    let reachLeft;
    let reachRight;

    const pixelStack = [[startX, startY]];

    const canvasWidth = this.mainCanvas.width;
    const canvasHeight = this.mainCanvas.height;

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      const [x] = newPos;
      let [, y] = newPos;

      while (y >= 0 && isMatchStartColor(x, y, startColor)) {
        y -= this.pixelWidth;
      }

      y += this.pixelWidth;

      while (y < canvasHeight && isMatchStartColor(x, y, startColor)) {
        this.drawPixel(x, y, fillColor);

        if (x > 0) {
          if (isMatchStartColor(x - this.pixelWidth, y, startColor)) {
            if (!reachLeft) {
              pixelStack.push([x - this.pixelWidth, y]);
              reachLeft = true;
            }
          }
          reachLeft = false;
        }

        if (x < canvasWidth) {
          if (isMatchStartColor(x + this.pixelWidth, y, startColor)) {
            if (!reachRight) {
              pixelStack.push([x + this.pixelWidth, y]);
              reachRight = true;
            }
          }
          reachRight = false;
        }

        y += this.pixelWidth;
      }
      this.transferImage();
    }
  };


  const mouseDownHandler = (event) => {
    mouseDown = true;
    const [x1, y1] = [event.offsetX, event.offsetY];
    const { data } = this.context.getImageData(x1, y1, 1, 1);
    fill(x1, y1, data, event.which === 1 ? this.firstColor : this.secondColor);
  };

  const mouseMoveHandler = (event) => {
    const [x, y] = [event.offsetX, event.offsetY];

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPixel(x, y, 'rgba(179, 179, 179, 0.3)', false);
  };

  const mouseUpHandler = () => {
    if (mouseDown) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

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
