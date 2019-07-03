import Frames from '../frames';

export default function () {
  let isMouseDown = false;
  let rightKey;
  let x1;
  let x2;
  let y1;
  let y2;

  const circle = (x, y, radius, color) => {
    let x0 = 0;
    let y0 = radius;
    let gap = 0;
    let delta = (1 - 2 * radius);

    while (y0 >= 0) {
      this.drawPixel(x + x0, y - y0, color);
      this.drawPixel(x - x0, y - y0, color);
      this.drawPixel(x - x0, y + y0, color);
      this.drawPixel(x + x0, y + y0, color);
      gap = 2 * (delta + y0) - 1;
      if (delta < 0 && gap <= 0) {
        x0 += 1;
        delta += 2 * x0 + 1;
        continue;
      }
      gap = 2 * (delta - x0) - 1;
      if (delta > 0 && gap > 0) {
        y0 -= 1;
        delta += 1 - 2 * y0;
        continue;
      }
      x0 += 1;
      delta += 2 * (x0 - y0);
      y0 -= 1;
    }
  };

  const mouseDownHandler = (event) => {
    isMouseDown = true;
    rightKey = true;

    [x1, y1] = [event.offsetX, event.offsetY];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  const mouseMoveHandler = (event) => {
    if (!isMouseDown) {
      const [x, y] = [event.offsetX, event.offsetY];

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawPixel(x, y, 'rgba(179, 179, 179, 0.3)');
      return;
    }

    [x2, y2] = [event.offsetX, event.offsetY];

    const radius = Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    circle(x1, y1, radius, rightKey ? this.firstColor : this.secondColor);
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
  };

  this.addListners([
    mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseUpHandler,
  ]);
}
