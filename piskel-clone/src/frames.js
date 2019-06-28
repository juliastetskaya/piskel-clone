import FramesView from './views/FramesView';

export default class Frames {
  constructor() {
    this.framesView = new FramesView();
    this.mainCanvas = document.querySelector('.canvas__main');
    this.context = this.mainCanvas.getContext('2d');
  }

  trackNewFrame() {
    const buttonNewFrame = document.querySelector('.frames__button');
    buttonNewFrame.addEventListener('click', () => {
      const frame = this.framesView.createFrame();
      this.trackMenuFrame(frame);

      this.context.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
    });
  }

  trackMenuFrame(frame = document) {
    const buttonCopy = frame.querySelector('.button__copy');
    buttonCopy.addEventListener('click', this.copyFrame.bind(this));

    const buttonDelete = frame.querySelector('.button__delete');
    buttonDelete.addEventListener('click', this.deleteFrame.bind(this));
  }

  trackFrameList() {
    const frameList = document.querySelector('.frames__list');
    frameList.addEventListener('click', this.changeActiveFrame.bind(this));
  }

  static getFrame() {
    const activeFrame = document.querySelector('.frame--active').firstChild;
    const ctx = activeFrame.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const image = document.querySelector('.canvas__main');

    const { width, height } = image;
    const activeWidth = activeFrame.width;
    const activeHeight = activeFrame.height;
    ctx.clearRect(0, 0, activeWidth, activeHeight);
    ctx.drawImage(image, 0, 0, width, height, 0, 0, activeWidth, activeHeight);
  }

  copyFrame(event) {
    const frame = this.framesView.createFrame();
    this.trackMenuFrame(frame);

    const sourceCanvas = event.target.parentNode.firstChild;
    const destinationCanvas = frame.firstChild;
    const ctx = destinationCanvas.getContext('2d');

    ctx.drawImage(sourceCanvas, 0, 0);
  }

  deleteFrame(event) {
    const frame = event.target.closest('.frames__item');
    document.querySelector('.frames__list').removeChild(frame);

    const frames = document.querySelector('.frames__list');

    if (frame.classList.contains('frame--active')) {
      frames.lastChild.classList.add('frame--active');
    }

    this.framesView.updateFramesNumbers();
    this.setFrame();
  }

  setFrame() {
    const sourseFrame = document.querySelector('.frame--active').firstChild;

    const { width, height } = this.mainCanvas;
    const frameWidth = sourseFrame.width;
    const frameHeight = sourseFrame.height;

    this.context.clearRect(0, 0, width, height);
    this.context.imageSmoothingEnabled = false;

    this.context.drawImage(sourseFrame, 0, 0, frameWidth, frameHeight, 0, 0, width, height);
  }

  changeActiveFrame(event) {
    if (event.target.tagName.toLowerCase() === 'canvas') {
      const activeFrame = document.querySelector('.frame--active');
      activeFrame.classList.remove('frame--active');
      event.target.parentNode.classList.add('frame--active');
      this.setFrame();
    }
  }

  start() {
    this.trackNewFrame();
    this.trackMenuFrame();
    this.trackFrameList();
  }
}
