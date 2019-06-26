import createElement from '../../lib';

export default class CanvasView {
  static addClassCursor(tool) {
    const canvas = document.querySelector('.canvas__wrapper');
    canvas.classList = 'canvas__wrapper';
    canvas.classList.add(`cursor-${tool}`);
  }

  render() {
    const canvas = createElement('canvas', 'canvas__main');
    canvas.width = 640;
    canvas.height = 640;

    const canvasDrawing = createElement('canvas', 'canvas__drawing');
    canvasDrawing.width = 640;
    canvasDrawing.height = 640;

    const background = createElement('div', 'canvas__background');

    const container = createElement('div', 'canvas__container', background, canvas, canvasDrawing);
    const wrapper = createElement('div', 'canvas__wrapper cursor-pen', container);
    const section = createElement('section', 'canvas', wrapper);

    document.querySelector('.main').append(section);
  }
}
