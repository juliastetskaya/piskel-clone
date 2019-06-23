import createElement from '../../lib';

export default class FramesView {
  createFrameButtons() {
    const buttonTips = {
      button__delete: 'Delete this frame',
      button__copy: 'Duplicate this frame',
      button__number: 'Toggle for preview',
    };

    const buttons = ['button__delete', 'button__copy', 'button__move', 'button__number'];
    const buttonElements = buttons.map((button) => {
      if (buttonTips[button]) {
        const buttonTip = createElement('span', 'button__tip', `${buttonTips[button]}`);
        return createElement('button', `button ${button}`, buttonTip);
      }
      return createElement('button', `button ${button}`);
    });
    buttonElements.forEach(button => button.setAttribute('type', 'button'));

    return buttonElements;
  }

  createFrame() {
    const buttons = this.createFrameButtons();

    const frameCanvas = createElement('canvas', 'frame__canvas');
    frameCanvas.width = 96;
    frameCanvas.height = 96;

    return createElement('li', 'frames__item frame--active', frameCanvas, ...buttons);
  }

  render() {
    const frame = this.createFrame();
    const framesList = createElement('ul', 'frames__list', frame);
    const section = createElement('section', 'frames', framesList);

    document.querySelector('.main').append(section);
  }
}
