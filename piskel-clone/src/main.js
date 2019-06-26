import ToolsView from './views/ToolsView';
import CanvasView from './views/CanvasView';

export default class App {
  constructor() {
    this.canvas = document.querySelector('.canvas__main');
    this.ctx = this.canvas.getContext('2d');
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
      eraser: () => console.log('eraser'),
      stroke: () => console.log('stroke'),
      rectangle: () => console.log('rectangle'),
      circle: () => console.log('circle'),
      move: () => console.log('move'),
      picker: () => console.log('picker'),
    };
    this.listners = {};
    this.events = ['mousedown', 'contextmenu', 'mousemove', 'mouseup', 'mouseleave'];
    this.firstColor = document.querySelector('.first-color__input').value;
    this.secondColor = document.querySelector('.second-color__input').value;
  }

  setTool() {
    this.toolsList.addEventListener('click', this.clickToolsHandler.bind(this));
  }

  setPixelWidth() {
    const penSizeList = document.querySelector('.pen-size__list');
    penSizeList.addEventListener('click', ({ target }) => {
      if (target.tagName !== 'LI') return;
      this.pixelWidth = (this.canvas.width / this.canvasSize) * Number(target.dataset.size);
      ToolsView.addClassActiveSize(target);
    });
  }

  start() {
    this.setTool();
    this.setPixelWidth();
    this.draw();
  }

  clickToolsHandler({ target }) {
    if (target.tagName !== 'LI') return;
    [this.currentTool] = Object.keys(this.tools).filter(key => this.tools[key] === target);

    ToolsView.addClassActiveTool(target);
    CanvasView.addClassCursor(this.currentTool);

    this.removeListners();
    this.handlers[this.currentTool]();
  }

  removeListners() {
    Object.keys(this.listners).forEach(e => this.canvas.removeEventListener(e, this.listners[e]));
    this.listners = {};
  }

  bucket() {
    const canvas = document.querySelector('.canvas__main');
    canvas.addEventListener('mousedown', () => console.log('mousedown'));
    canvas.addEventListener('mousemove', () => console.log('mousemove'));
    canvas.addEventListener('mouseup', () => console.log('mouseup'));
  }

  draw() {
    let isMouseDown = false;
    let rightKey;
    let x1;
    let x2;
    let y1;
    let y2;

    const drawPixel = (x, y, color) => {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(Math.floor(x / this.pixelWidth) * this.pixelWidth,
        Math.floor(y / this.pixelWidth) * this.pixelWidth, this.pixelWidth, this.pixelWidth);
    };

    const drawLine = (color) => {
      const deltaX = Math.abs(x2 - x1);
      const deltaY = Math.abs(y2 - y1);

      const signX = x1 < x2 ? 1 : -1;
      const signY = y1 < y2 ? 1 : -1;

      let error = deltaX - deltaY;
      drawPixel(x2, y2, color);

      while (x1 !== x2 || y1 !== y2) {
        drawPixel(x1, y1, color);
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
      drawPixel(x1, y1, this.firstColor);
    };

    const mouseMoveHandler = (event) => {
      if (!isMouseDown) return;

      [x2, y2] = [event.offsetX, event.offsetY];
      drawLine(rightKey ? this.firstColor : this.secondColor);
    };

    const mouseUpHandler = () => {
      isMouseDown = false;
      this.ctx.beginPath();

      // this.getFrame();
    };

    const mouseLeaveHandler = () => {
      isMouseDown = false;
      this.ctx.beginPath();
    };

    const contextMenuHandler = (event) => {
      event.preventDefault();
      rightKey = false;
      drawPixel(x1, y1, this.secondColor);
    };

    this.addListners([
      mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseLeaveHandler,
    ]);
  }

  addListners(handlers) {
    this.events.forEach((event, index) => {
      this.canvas.addEventListener(event, handlers[index]);
      this.listners[event] = handlers[index];
    });
  }
}
