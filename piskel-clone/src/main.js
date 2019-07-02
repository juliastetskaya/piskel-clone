import ToolsView from './views/ToolsView';
import CanvasView from './views/CanvasView';
import Frames from './frames';

export default class App {
  constructor() {
    this.canvas = document.querySelector('.canvas__drawing');
    this.mainCanvas = document.querySelector('.canvas__main');
    this.ctx = this.canvas.getContext('2d');
    this.context = this.mainCanvas.getContext('2d');
    this.currentTool = 'pen';
    this.pixelWidth = 0;
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
      picker: document.querySelector('.color-picker'),
    };
    this.handlers = {
      pen: () => this.draw(),
      bucket: () => this.bucket(),
      colorSwap: () => this.colorSwap(),
      eraser: () => this.draw(),
      stroke: () => this.drawStroke(),
      rectangle: () => this.drawRectangle(),
      circle: () => this.drawCircle(),
      move: () => this.move(),
      lighten: () => this.lighten(),
      picker: () => this.colorPicker(),
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
    this.canvas.addEventListener('mousemove', (event) => {
      cursorCoords.innerHTML = `${event.offsetX}:${event.offsetY}`;
    });
    this.mainCanvas.addEventListener('mousemove', (event) => {
      cursorCoords.innerHTML = `${event.offsetX}:${event.offsetY}`;
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
  }

  setPixelWidth() {
    const penSizeList = document.querySelector('.pen-size__list');
    penSizeList.addEventListener('click', ({ target }) => {
      if (target.tagName !== 'LI') return;
      this.pixelWidth = (this.canvas.width / 32) * Number(target.dataset.size);
      ToolsView.addClassActiveSize(target);
    });
  }

  lighten() {
    let x1;
    let y1;
    let mouseDown = false;


    const light = (x, y, image) => {
      const color = image.data;
      color[0] = color[0] < 255 ? color[0] + 10 : color[0];
      color[1] = color[1] < 255 ? color[1] + 10 : color[1];
      color[2] = color[2] < 255 ? color[2] + 10 : color[2];
      this.context.putImageData(image, x, y);
    };


    const mouseDownHandler = (event) => {
      mouseDown = true;
      [x1, y1] = [event.offsetX, event.offsetY];
      const image = this.context.getImageData(x1, y1, 1, 1);
      light(x1, y1, image);
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

  colorSwap() {
    let x1;
    let y1;

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
      [x1, y1] = [event.offsetX, event.offsetY];
      const { data } = this.context.getImageData(x1, y1, 1, 1);
      colorFill(data, event.which === 1 ? this.firstColor : this.secondColor);
    };

    const mouseUpHandler = () => {
      this.transferImage();
      Frames.getFrame();
    };

    const contextMenuHandler = (event) => {
      event.preventDefault();
    };

    this.addListners([
      mouseDownHandler, contextMenuHandler, null, mouseUpHandler, mouseUpHandler,
    ]);
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

  rgbToHex(arr) {
    const arrHex = arr.map((x) => {
      const num = parseInt(x, 10).toString(16);
      return (num.length === 1) ? `0${num}` : num;
    });
    return `#${arrHex.join('')}`;
  }

  colorPicker() {
    const getColor = (event, right = true) => {
      const arr = [];
      const [x, y] = [event.offsetX, event.offsetY];
      const { data } = this.context.getImageData(x, y, 1, 1);

      for (let i = 0; i < data.length - 1; i += 1) {
        arr.push(data[i]);
      }
      if (right) {
        this.firstColor = this.rgbToHex(arr);
        document.querySelector('.first-color__input').value = this.firstColor;
      } else {
        this.secondColor = this.rgbToHex(arr);
        document.querySelector('.second-color__input').value = this.secondColor;
      }
    };

    this.canvas.style.display = 'none';
    const clickHandler = (event) => {
      getColor(event);
    };

    const contextMenuHandler = (event) => {
      event.preventDefault();
      getColor(event, false);
    };

    this.mainCanvas.addEventListener('click', clickHandler);
    this.mainCanvas.addEventListener('contextmenu', contextMenuHandler);
  }

  bucket() {
    const isMatchStartColor = (x, y, color) => {
      const { data } = this.context.getImageData(x, y, 1, 1);

      return data[0] === color[0] && data[1] === color[1] && data[2] === color[2]
        && data[3] === color[3];
    };

    const fill = (startX, startY, startColor, fillColor) => {
      const color = this.rgbToHex([...startColor].slice(0, -1));
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
      const [x1, y1] = [event.offsetX, event.offsetY];
      const { data } = this.context.getImageData(x1, y1, 1, 1);
      fill(x1, y1, data, event.which === 1 ? this.firstColor : this.secondColor);
    };

    const mouseUpHandler = () => {
      this.transferImage();
      Frames.getFrame();
    };

    const contextMenuHandler = (event) => {
      event.preventDefault();
    };

    this.addListners([
      mouseDownHandler, contextMenuHandler, null, mouseUpHandler, mouseUpHandler,
    ]);
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
    };

    this.addListners([
      mouseDownHandler, contextMenuHandler, mouseMoveHandler, mouseUpHandler, mouseUpHandler,
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

  drawRectangle() {
    let isMouseDown = false;
    let rightKey;
    let x1;
    let x2;
    let y1;
    let y2;

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
      this.ctx.strokeStyle = rightKey ? this.firstColor : this.secondColor;
      this.ctx.lineWidth = this.pixelWidth;
      this.ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
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

  start() {
    this.pixelWidth = this.canvas.width / 32;
    this.setTool();
    this.setPixelWidth();
    this.setColors();
    this.draw();
    this.resize();
    this.showCursorCoords();
  }
}
