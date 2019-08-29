import Frames from '../frames';

export default function () {
  let isMouseDown = false;
  let rightKey;
  let x1;
  let x2;
  let y1;
  let y2;

  const line = (coords, color) => {
    let [startX, startY] = coords;
    const [,, endX, endY] = coords;

    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);

    const signX = startX < endX ? 1 : -1;
    const signY = startY < endY ? 1 : -1;

    let error = deltaX - deltaY;
    this.drawPixel(endX, endY, color);

    while (startX !== endX || startY !== endY) {
      this.drawPixel(startX, startY, color);
      const error2 = error;

      if (error2 > -deltaY) {
        error -= deltaY;
        startX += signX;
      }

      if (error2 < deltaX) {
        error += deltaX;
        startY += signY;
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
      this.drawPixel(x, y, 'rgba(179, 179, 179, 0.3)');
      return;
    }

    [x2, y2] = [event.offsetX, event.offsetY];

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const color = rightKey ? this.firstColor : this.secondColor;
    line([x1, y1, x2, y1], color);
    line([x1, y1, x1, y2], color);
    line([x1, y2, x2, y2], color);
    line([x2, y1, x2, y2], color);
  };

  const mouseUpHandler = () => {
    if (!isMouseDown) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.transferImage();
    if (isMouseDown) Frames.getFrame();

    isMouseDown = false;
    this.ctx.beginPath();
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
