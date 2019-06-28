import FramesView from './views/FramesView';

export default class Frames {
  constructor() {
    this.framesView = new FramesView();
  }

  trackNewFrame() {
    const buttonNewFrame = document.querySelector('.frames__button');
    console.log(this);
    buttonNewFrame.addEventListener('click', this.framesView.addNewFrame.bind(this.framesView));
  }

  start() {
    this.trackNewFrame();
  }
}
