import createElement from '../../lib';

export default class AnimationView {
  createAnimationCanvas() {
    const canvas = createElement('canvas', 'animation__field');
    canvas.width = 200;
    canvas.height = 200;

    return createElement('div', 'animation__wrapper', canvas);
  }

  createSpeedPanel() {
    const speedRange = createElement('input', 'speed__range');
    speedRange.setAttribute('type', 'range');
    speedRange.setAttribute('name', 'speed');
    speedRange.setAttribute('value', '12');
    speedRange.setAttribute('min', '0');
    speedRange.setAttribute('max', '24');

    const fps = createElement('span', 'speed__fps');

    return createElement('div', 'speed__wrapper', fps, speedRange);
  }

  createSizePanel() {
    const text = createElement('p', 'size-field__text', 'Resize canvas');
    const buttons = [32, 64, 128].map((size) => {
      const element = createElement('button', 'resize-button', `${size}x${size}`);
      element.setAttribute('data-canvas-size', `${size}`);

      return element;
    });
    const wrapper = createElement('div', 'size-field__buttons', ...buttons);
    return createElement('div', 'size-field', text, wrapper);
  }

  render() {
    const animation = this.createAnimationCanvas();
    const speedPanel = this.createSpeedPanel();
    const sizePanel = this.createSizePanel();
    const section = createElement('section', 'animation', animation, speedPanel, sizePanel);

    document.querySelector('.main').append(section);
  }
}
