import createElement from '../../lib';

export default class CanvasView {
  render() {
    const canvas = createElement('canvas', 'canvas__main');
    canvas.width = 500;
    canvas.height = 500;

    const wrapper = createElement('div', 'canvas__wrapper', canvas);
    const section = createElement('section', 'canvas', wrapper);

    document.querySelector('.main').append(section);
  }
}
