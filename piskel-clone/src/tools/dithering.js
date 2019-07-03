import Frames from '../frames';

export default function () {
  let isMouseDown = false;
  let colorFirst;
  let colorSecond;
  let x1;
  let y1;
  let x2;
  let y2;

  const lineDithering = (color1, color2) => {
    const deltaX = Math.abs(x2 - x1);
    const deltaY = Math.abs(y2 - y1);

    const signX = x1 < x2 ? 1 : -1;
    const signY = y1 < y2 ? 1 : -1;

    let error = deltaX - deltaY;
    if ((x2 + y2) % 2 === 0) {
      this.drawPixel(x2, y2, color1);
    } else {
      this.drawPixel(x2, y2, color2);
    }

    while (x1 !== x2 || y1 !== y2) {
      if ((x1 + y1) % 2 === 0) {
        this.drawPixel(x1, y1, color1);
      } else {
        this.drawPixel(x1, y1, color2);
      }
      const error2 = error;

      if (error2 > -deltaY) {
        error -= deltaY;
        x1 += signX;
      }

      if (error2 < deltaX) {
        error += deltaX;
        y1 += signY;
      }
    }
  };

  const mouseDownHandler = (event) => {
    isMouseDown = true;
    [x1, y1] = [event.offsetX, event.offsetY];
    colorFirst = event.which === 1 ? this.firstColor : this.secondColor;
    colorSecond = event.which === 1 ? this.secondColor : this.firstColor;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  const mouseMoveHandler = (event) => {
    if (!isMouseDown) {
      const [x, y] = [event.offsetX, event.offsetY];

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawPixel(x, y, 'rgba(179, 179, 179, 0.3)', false);
      return;
    }

    [x2, y2] = [event.offsetX, event.offsetY];

    lineDithering(colorFirst, colorSecond);
  };

  const mouseUpHandler = () => {
    if (!isMouseDown) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.transferImage();
    if (isMouseDown) Frames.getFrame();

    isMouseDown = false;
  };

  const contextMenuHandler = (event) => {
    event.preventDefault();
  };

  this.addListners([
    mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseUpHandler,
  ]);
}
