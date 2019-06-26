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

    const wrapper = createElement('div', 'canvas__wrapper cursor-pen', canvas);
    const section = createElement('section', 'canvas', wrapper);

    document.querySelector('.main').append(section);
  }
}
