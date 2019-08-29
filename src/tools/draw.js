import Frames from '../frames';

export default function () {
  let isMouseDown = false;
  let rightKey;
  let x1;
  let x2;
  let y1;
  let y2;

  const line = (color) => {
    const deltaX = Math.abs(x2 - x1);
    const deltaY = Math.abs(y2 - y1);

    const signX = x1 < x2 ? 1 : -1;
    const signY = y1 < y2 ? 1 : -1;

    let error = deltaX - deltaY;
    this.drawPixel(x2, y2, color);

    while (x1 !== x2 || y1 !== y2) {
      this.drawPixel(x1, y1, color);
      const error2 = error * 2;

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
    rightKey = true;

    [x1, y1] = [event.offsetX, event.offsetY];
    this.drawPixel(x1, y1, this.firstColor);
  };

  const mouseMoveHandler = (event) => {
    if (!isMouseDown) {
      const [x, y] = [event.offsetX, event.offsetY];

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawPixel(x, y, 'rgba(179, 179, 179, 0.3)', false);
      return;
    }

    [x2, y2] = [event.offsetX, event.offsetY];

    line(rightKey ? this.firstColor : this.secondColor);
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
    rightKey = false;
    this.drawPixel(x1, y1, this.secondColor);
  };

  this.addListners([
    mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseUpHandler,
  ]);
}
