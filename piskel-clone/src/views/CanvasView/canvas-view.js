import createElement from '../../lib';

export default class CanvasView {
  constructor() {
    this.scale = 20;
    this.width = 32;
    this.height = 32;
  }

  static addClassCursor(tool) {
    const canvas = document.querySelector('.canvas__wrapper');
    canvas.classList = 'canvas__wrapper';
    canvas.classList.add(`cursor-${tool}`);
  }

  createCanvas(width, height, className) {
    const canvas = createElement('canvas', className);
    canvas.width = width;
    canvas.height = height;

    return canvas;
  }

  render() {
    const canvas = this.createCanvas(this.width, this.height, 'canvas__main');
    const canvasDrawing = this.createCanvas(this.width, this.height, 'canvas__drawing');
    canvas.style.transform = `scale(${this.scale},${this.scale})`;
    canvasDrawing.style.transform = `scale(${this.scale},${this.scale})`;

    const background = createElement('div', 'canvas__background');
    background.style.width = `${this.width * this.scale}px`;
    background.style.height = `${this.height * this.scale}px`;

    const container = createElement('div', 'canvas__container', background, canvas, canvasDrawing);
    const wrapper = createElement('div', 'canvas__wrapper cursor-pen', container);
    const section = createElement('section', 'canvas', wrapper);

    document.querySelector('.main').append(section);
  }
}
