import ToolsView from './views/ToolsView';
import CanvasView from './views/CanvasView';
import Frames from './frames';

import dithering from './tools/dithering';
import draw from './tools/draw';
import bucket from './tools/bucket';
import colorSwap from './tools/colorSwap';
import drawStroke from './tools/stroke';
import drawRectangle from './tools/rectangle';
import drawCircle from './tools/circle';
import move from './tools/move';
import lighten from './tools/lighten';
import colorPicker from './tools/picker';


export default class App {
  constructor() {
    this.canvas = document.querySelector('.canvas__drawing');
    this.mainCanvas = document.querySelector('.canvas__main');
    this.ctx = this.canvas.getContext('2d');
    this.context = this.mainCanvas.getContext('2d');
    this.currentTool = 'pen';
    this.pixelSize = 1;
    this.scale = 20;
    this.toolsList = document.querySelector('.tools__list');
    this.tools = {
      pen: document.querySelector('.pen-tool'),
      bucket: document.querySelector('.paint-bucket-tool'),
      colorSwap: document.querySelector('.paint-all-pixels-of-the-same-color'),
      eraser: document.querySelector('.eraser-tool'),
      stroke: document.querySelector('.stroke-tool'),
      rectangle: document.querySelector('.rectangle-tool'),
      circle: document.querySelector('.circle-tool'),
      move: document.querySelector('.move-tool'),
      lighten: document.querySelector('.lighten'),
      dithering: document.querySelector('.dithering-tool'),
      picker: document.querySelector('.color-picker'),
    };
    this.handlers = {
      pen: () => draw.call(this),
      bucket: () => bucket.call(this),
      colorSwap: () => colorSwap.call(this),
      eraser: () => draw.call(this),
      stroke: () => drawStroke.call(this),
      rectangle: () => drawRectangle.call(this),
      circle: () => drawCircle.call(this),
      move: () => move.call(this),
      lighten: () => lighten.call(this),
      dithering: () => dithering.call(this),
      picker: () => colorPicker.call(this),
    };
    this.listners = {};
    this.events = ['mousedown', 'contextmenu', 'mousemove', 'mouseup', 'mouseleave'];
    this.firstColor = document.querySelector('.first-color__input').value;
    this.secondColor = document.querySelector('.second-color__input').value;
    this.scales = {
      32: 20,
      64: 10,
      128: 5,
    };
  }

  showCursorCoords() {
    const cursorCoords = document.querySelector('.coords');
    [this.canvas, this.mainCanvas].forEach((canvas) => {
      canvas.addEventListener('mousemove', (event) => {
        cursorCoords.innerHTML = `${event.offsetX}:${event.offsetY}`;
      });
      canvas.addEventListener('mouseleave', () => {
        cursorCoords.innerHTML = '';
      });
    });
  }

  setTool() {
    this.toolsList.addEventListener('click', ({ target }) => {
      if (target.tagName !== 'LI') return;
      this.canvas.style.display = '';
      [this.currentTool] = Object.keys(this.tools).filter(key => this.tools[key] === target);

      ToolsView.addClassActiveTool(target);
      CanvasView.addClassCursor(this.currentTool);

      this.removeListners();
      this.handlers[this.currentTool]();
    });
    this.handlers[this.currentTool]();
  }

  setPixelWidth() {
    const penSizeList = document.querySelector('.pen-size__list');
    penSizeList.addEventListener('click', ({ target }) => {
      if (target.tagName !== 'LI') return;
      this.pixelSize = Number(target.dataset.size);
      ToolsView.addClassActiveSize(target);
    });
  }

  resize() {
    const buttons = document.querySelector('.size-field__buttons');
    buttons.addEventListener('click', ({ target }) => {
      if (target.tagName.toLowerCase() !== 'button') return;

      const activeButton = document.querySelector('.resize-button--active');
      if (activeButton) activeButton.classList.remove('resize-button--active');
      target.classList.add('resize-button--active');

      const newSize = target.dataset.canvasSize;
      const oldSize = this.mainCanvas.width;
      this.mainCanvas.style.setProperty('--width', `${newSize}px`);
      this.canvas.style.setProperty('--width', `${newSize}px`);

      this.scale = this.scales[newSize];

      const image = this.context.getImageData(0, 0, this.mainCanvas.width, this.mainCanvas.height);

      this.mainCanvas.width = newSize;
      this.mainCanvas.height = newSize;

      const coord = (newSize - oldSize) / 2;
      this.context.putImageData(image, coord, coord);

      this.canvas.width = newSize;
      this.canvas.height = newSize;

      const background = document.querySelector('.canvas__background');
      background.style.width = `${newSize * this.scale}px`;
      background.style.height = `${newSize * this.scale}px`;

      this.canvas.style.transform = `scale(${this.scale},${this.scale})`;
      this.mainCanvas.style.transform = `scale(${this.scale},${this.scale})`;

      const canvasSize = document.querySelector('.size');
      canvasSize.innerHTML = `[${newSize}x${newSize}] `;

      Frames.getFrame();
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

  drawPixel(x, y, color, mouseDown = true, secondColor) {
    const chooseColor = (x0, y0) => ((x0 + y0) % 2 === 0 ? color : secondColor);
    const points = {
      1: [[0, 0]],
      2: [[-1, -1], [0, -1], [-1, 0], [0, 0]],
      3: [[-1, -1], [0, -1], [-1, 0], [0, 0], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]],
      4: [[-1, -1], [0, -1], [-1, 0], [0, 0], [1, -1], [1, 0], [1, 1], [0, 1],
        [-1, 1], [-2, 1], [-2, 0], [-2, -1], [-2, -2], [-1, -2], [0, -2], [1, -2]],
    };

    points[this.pixelSize].forEach((delta) => {
      const [deltaX, deltaY] = delta;
      const [x1, y1] = [x + deltaX, y + deltaY];
      if (this.currentTool === 'eraser' && mouseDown) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.clearRect(x1, y1, 1, 1);
      } else {
        this.ctx.fillStyle = this.currentTool === 'dithering' ? chooseColor(x1, y1) : color;
        this.ctx.fillRect(x1, y1, 1, 1);
      }
    });
  }

  transferImage() {
    const { width } = this.canvas;
    const { height } = this.canvas;

    this.context.drawImage(this.canvas, 0, 0, width, height, 0, 0, width, height);
    this.ctx.clearRect(0, 0, width, height);
  }

  start() {
    this.setTool();
    this.setPixelWidth();
    this.setColors();
    this.resize();
    this.showCursorCoords();
  }
}
