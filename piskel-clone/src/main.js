import ToolsView from './views/ToolsView';
import CanvasView from './views/CanvasView';

export default class App {
  constructor() {
    this.currentTool = '';
    this.pixelWidth = 10;
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
  }

  start() {
    const toolsList = document.querySelector('.tools__list');
    console.log(this.pixelWidth);
    toolsList.addEventListener('click', this.clickToolsHandler.bind(this));

    const canvas = document.querySelector('.canvas__main');
    canvas.addEventListener('click', this.clickCanvasHandler);
  }

  clickToolsHandler({ target }) {
    if (target.tagName === 'LI') {
      console.log(this);
      [this.currentTool] = Object.keys(this.tools).filter(key => this.tools[key] === target);

      ToolsView.addClassActive(target);
      CanvasView.addClassCursor(this.currentTool);
    }
  }

  clickCanvasHandler(e) {
    const handlers = {
      pen: (event, canvas) => this.drawPixel(event, canvas),
    };

    const { target } = e;
    const handler = handlers[this.currentTool];
    console.log(handler);
    handler(e, target);
  }

  drawPixel(event, canvas) {
    console.log(this.pixelWidth);
    const ctx = canvas.getContext('2d');

    const x = event.pageX - canvas.offsetLeft;
    const y = event.pageY - canvas.offsetTop;

    const color = document.querySelector('.first-color__input');
    ctx.fillStyle = color.value;
    ctx.fillRect(Math.floor(x / this.pixelWidth) * this.pixelWidth,
      Math.floor(y / this.pixelWidth) * this.pixelWidth, this.pixelWidth, this.pixelWidth);
  }
}

// const drawPixel = (x, y, eraser) => {
//   const primaryColor = document.querySelector('.primary');
//   context.fillStyle = primaryColor.value;
//   if (eraser === 0) {
//     console.log('without eraser');
//     context.fillRect(Math.ceil(x / this.pixelWidth) * this.pixelWidth,
//       Math.ceil(y / this.pixelWidth) * this.pixelWidth, this.pixelWidth, this.pixelWidth);
//   } else if (eraser === 1) {
//     const activeFrame = document.querySelector('.active-frame');
//     const activeFrameContext = activeFrame.getContext('2d');
//     console.log('eraser');
//     activeFrameContext.clearRect(0, 0, 128, 128);
//     context.clearRect(Math.ceil(x / this.pixelWidth) * this.pixelWidth,
//       Math.ceil(y / this.pixelWidth) * this.pixelWidth, this.pixelWidth, this.pixelWidth);
//   }
// };
