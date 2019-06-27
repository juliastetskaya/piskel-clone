import ToolsView from './views/ToolsView';
import CanvasView from './views/CanvasView';

export default class App {
  constructor() {
    this.canvas = document.querySelector('.canvas__drawing');
    this.mainCanvas = document.querySelector('.canvas__main');
    this.ctx = this.canvas.getContext('2d');
    this.context = this.mainCanvas.getContext('2d');
    this.currentTool = 'pen';
    this.canvasSize = 128;
    this.pixelWidth = 4;
    this.toolsList = document.querySelector('.tools__list');
    this.tools = {
      pen: document.querySelector('.pen-tool'),
      bucket: document.querySelector('.paint-bucket-tool'),
      eraser: document.querySelector('.eraser-tool'),
      stroke: document.querySelector('.stroke-tool'),
      rectangle: document.querySelector('.rectangle-tool'),
      circle: document.querySelector('.circle-tool'),
      move: document.querySelector('.move-tool'),
      picker: document.querySelector('.color-picker'),
    };
    this.handlers = {
      pen: () => this.draw(),
      bucket: () => this.bucket(),
      eraser: () => this.draw(),
      stroke: () => this.drawStroke(),
      rectangle: () => console.log('rectangle'),
      circle: () => this.drawCircle(),
      move: () => this.move(),
      picker: () => console.log('picker'),
    };
    this.listners = {};
    this.events = ['mousedown', 'contextmenu', 'mousemove', 'mouseup', 'mouseleave'];
    this.firstColor = document.querySelector('.first-color__input').value;
    this.secondColor = document.querySelector('.second-color__input').value;
  }

  setTool() {
    this.toolsList.addEventListener('click', ({ target }) => {
      if (target.tagName !== 'LI') return;
      [this.currentTool] = Object.keys(this.tools).filter(key => this.tools[key] === target);

      ToolsView.addClassActiveTool(target);
      CanvasView.addClassCursor(this.currentTool);

      this.removeListners();
      this.handlers[this.currentTool]();
    });
  }

  setPixelWidth() {
    const penSizeList = document.querySelector('.pen-size__list');
    penSizeList.addEventListener('click', ({ target }) => {
      if (target.tagName !== 'LI') return;
      this.pixelWidth = (this.canvas.width / this.canvasSize) * Number(target.dataset.size);
      ToolsView.addClassActiveSize(target);
    });
  }

  setColors() {
    const inputFC = document.querySelector('.first-color__input');
    const inputSC = document.querySelector('.second-color__input');
    const swap = document.querySelector('.swap-colors');

    inputFC.addEventListener('input', ({ target }) => {
      this.firstColor = target.value;
    });

    inputSC.addEventListener('input', ({ target }) => {
      this.secondColor = target.value;
    });

    swap.addEventListener('click', () => {
      [this.firstColor, this.secondColor] = [this.secondColor, this.firstColor];
      [inputFC.value, inputSC.value] = [inputSC.value, inputFC.value];
    });
  }

  addListners(handlers) {
    this.events.forEach((event, index) => {
      this.canvas.addEventListener(event, handlers[index]);
      this.listners[event] = handlers[index];
    });
  }

  removeListners() {
    Object.keys(this.listners).forEach(e => this.canvas.removeEventListener(e, this.listners[e]));
    this.listners = {};
  }

  bucket() {
    this.mainCanvas.addEventListener('mousedown', () => console.log('mousedown'));
    this.mainCanvas.addEventListener('mousemove', () => console.log('mousemove'));
    this.mainCanvas.addEventListener('mouseup', () => console.log('mouseup'));
  }

  drawPixel(x, y, color, mouseDown = true) {
    this.ctx.fillStyle = color;
    if (this.currentTool === 'eraser' && mouseDown) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.clearRect(Math.floor(x / this.pixelWidth) * this.pixelWidth,
        Math.floor(y / this.pixelWidth) * this.pixelWidth, this.pixelWidth, this.pixelWidth);
    } else {
      this.ctx.fillRect(Math.floor(x / this.pixelWidth) * this.pixelWidth,
        Math.floor(y / this.pixelWidth) * this.pixelWidth, this.pixelWidth, this.pixelWidth);
    }
  }

  move() {
    let isMouseDown = false;
    let x1;
    let x2;
    let y1;
    let y2;
    let imageData;

    const mouseDownHandler = (event) => {
      isMouseDown = true;

      [x1, y1] = [event.offsetX, event.offsetY];

      imageData = this.context.getImageData(0, 0, this.mainCanvas.width, this.mainCanvas.height);
    };

    const mouseMoveHandler = (event) => {
      if (!isMouseDown) return;

      [x2, y2] = [event.offsetX, event.offsetY];

      this.context.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

      this.context.putImageData(imageData, x2 - x1, y2 - y1);
    };

    const mouseUpHandler = () => {
      isMouseDown = false;
    };

    const contextMenuHandler = (event) => {
      event.preventDefault();
    };

    this.addListners([
      mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseUpHandler,
    ]);
  }

  draw() {
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
      isMouseDown = false;
      this.ctx.beginPath();

      this.transferImage();
    };

    const mouseLeaveHandler = () => {
      if (!isMouseDown) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      isMouseDown = false;
      this.ctx.beginPath();

      this.transferImage();
    };

    const contextMenuHandler = (event) => {
      event.preventDefault();
      rightKey = false;
      this.drawPixel(x1, y1, this.secondColor);
    };

    this.addListners([
      mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseLeaveHandler,
    ]);
  }

  transferImage() {
    const { width } = this.canvas;
    const { height } = this.canvas;

    this.context.drawImage(this.canvas, 0, 0, width, height, 0, 0, width, height);
    this.ctx.clearRect(0, 0, width, height);
  }

  drawCircle() {
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
        } else if (delta > 0 && gap > 0) {
          y0 -= 1;
          delta -= 2 * y0 + 1;
        } else {
          x0 += 1;
          delta += 2 * (x0 - y0);
          y0 -= 1;
        }
      }
    };

    const mouseDownHandler = (event) => {
      isMouseDown = true;
      rightKey = true;

      [x1, y1] = [event.offsetX, event.offsetY];
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
      isMouseDown = false;
      this.ctx.beginPath();

      this.transferImage();
    };

    const mouseLeaveHandler = () => {
      if (!isMouseDown) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      isMouseDown = false;
      this.ctx.beginPath();

      this.transferImage();
    };

    const contextMenuHandler = (event) => {
      event.preventDefault();
      rightKey = false;
    };

    this.addListners([
      mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseLeaveHandler,
    ]);
  }

  drawStroke() {
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
      line([x1, y1, x2, y2], rightKey ? this.firstColor : this.secondColor);
    };

    const mouseUpHandler = () => {
      isMouseDown = false;
      this.ctx.beginPath();

      this.transferImage();
    };

    const mouseLeaveHandler = () => {
      if (!isMouseDown) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      isMouseDown = false;
      this.ctx.beginPath();

      this.transferImage();
    };

    const contextMenuHandler = (event) => {
      event.preventDefault();
      rightKey = false;
      this.drawPixel(x1, y1, this.secondColor);
    };

    this.addListners([
      mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseLeaveHandler,
    ]);
  }

  start() {
    this.setTool();
    this.setPixelWidth();
    this.setColors();
    this.draw();
  }
}
