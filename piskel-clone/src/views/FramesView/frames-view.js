import createElement from '../../lib';

export default class FramesView {
  updateFramesNumbers() {
    const frameList = document.querySelector('.frames__list');
    const frames = [...frameList.children];
    frames.forEach((frame) => {
      const number = frame.querySelector('.number');
      number.innerHTML = frame.style.order;
    });
    const buttonDelete = frameList.firstChild.querySelector('.button__delete');
    const buttonMove = frameList.firstChild.querySelector('.button__move');
    buttonDelete.style.display = frames.length === 1 ? 'none' : '';
    buttonMove.style.display = frames.length === 1 ? 'none' : '';
  }

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
        const number = button === 'button__number' ? createElement('span', 'number') : '';
        return createElement('button', `button ${button}`, buttonTip, number);
      }
      return createElement('button', `button ${button}`);
    });
    buttonElements.forEach(button => button.setAttribute('type', 'button'));

    return buttonElements;
  }

  createFrame() {
    const buttons = this.createFrameButtons();

    const frameCanvas = createElement('canvas', 'frame__canvas');
    frameCanvas.width = 128;
    frameCanvas.height = 128;

    const activeFrame = document.querySelector('.frame--active');
    if (activeFrame) {
      activeFrame.classList.remove('frame--active');
    }

    const frameList = document.querySelector('.frames__list');
    const order = frameList.children.length + 1;

    const frame = createElement('li', 'frames__item frame--active', frameCanvas, ...buttons);
    frame.setAttribute('draggable', 'true');
    frame.style.order = order;
    frameList.append(frame);

    this.updateFramesNumbers();

    return frame;
  }

  createButtonNewFrame() {
    const buttonNewFrame = createElement('button', 'frames__button', 'Add new frame');
    buttonNewFrame.setAttribute('type', 'button');

    const buttonIcon = createElement('div', 'button__icon');
    return createElement('div', 'button__wrapper', buttonNewFrame, buttonIcon);
  }

  render() {
    const framesList = createElement('ul', 'frames__list');
    const buttonNewFrame = this.createButtonNewFrame();

    const section = createElement('section', 'frames', framesList, buttonNewFrame);

    document.querySelector('.main').append(section);
    this.createFrame();
  }
}
