import FramesView from './views/FramesView';

export default class Frames {
  constructor() {
    this.framesView = new FramesView();
  }

  trackNewFrame() {
    const buttonNewFrame = document.querySelector('.frames__button');
    buttonNewFrame.addEventListener('click', () => {
      const frame = this.framesView.createFrame();
      this.trackMenuFrame(frame);
    });
  }

  trackMenuFrame(frame = document) {
    const buttonCopy = frame.querySelector('.button__copy');
    buttonCopy.addEventListener('click', this.copyFrame.bind(this));
  }

  copyFrame(event) {
    const frame = this.framesView.createFrame();
    this.trackMenuFrame(frame);

    const sourceCanvas = event.target.parentNode.firstChild;
    const destinationCanvas = frame.firstChild;
    const ctx = destinationCanvas.getContext('2d');

    // this.copyMainCanvas();

    ctx.drawImage(sourceCanvas, 0, 0);
    // this.setFrame();
  }

  start() {
    this.trackNewFrame();
    this.trackMenuFrame();
  }
}
