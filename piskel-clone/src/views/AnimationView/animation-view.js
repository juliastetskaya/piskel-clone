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
    speedRange.setAttribute('value', '10');
    speedRange.setAttribute('min', '0');
    speedRange.setAttribute('max', '24');

    const fps = createElement('span', 'speed__fps', '10 FPS');

    return createElement('div', 'speed__wrapper', fps, speedRange);
  }

  render() {
    const animation = this.createAnimationCanvas();
    const speedPanel = this.createSpeedPanel();
    const section = createElement('section', 'animation', animation, speedPanel);

    document.querySelector('.main').append(section);
  }
}
