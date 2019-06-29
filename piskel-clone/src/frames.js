import FramesView from './views/FramesView';

export default class Frames {
  constructor() {
    this.framesView = new FramesView();
    this.mainCanvas = document.querySelector('.canvas__main');
    this.context = this.mainCanvas.getContext('2d');
    this.dragSrcEl = null;
    this.startSpeed = 12;
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

    frameList.addEventListener('dragstart', this.dragStartHandler);
    frameList.addEventListener('dragenter', this.dragEnterHandle);
    frameList.addEventListener('dragover', this.dragOverHandle);
    frameList.addEventListener('dragleave', this.dragLeaveHandle);
    frameList.addEventListener('drop', this.dropHandle);
    frameList.addEventListener('dragend', this.dragEndHandle.bind(this));
  }

  startAnimation() {
    const animation = document.querySelector('.animation__field');
    const ctx = animation.getContext('2d');
    const labelAnimation = document.querySelector('.speed__fps');
    let count = 0;
    let timer;

    labelAnimation.innerHTML = `${this.startSpeed} FRS`;
    const { width, height } = animation;

    const start = () => {
      if (this.startSpeed > 0) {
        const frames = [...document.querySelector('.frames__list').children];
        ctx.clearRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = false;
        const image = frames[count % frames.length].firstChild;
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
        count += 1;
      }
    };

    timer = setInterval(() => start(), 1000 / Number(this.startSpeed));

    const inputRange = document.querySelector('.speed__range');
    inputRange.addEventListener('input', () => {
      this.startSpeed = inputRange.value;
      clearInterval(timer);
      timer = setInterval(() => start(), 1000 / Number(this.startSpeed));

      labelAnimation.innerHTML = `${this.startSpeed} FRS`;
    });
  }

  dragStartHandler(event) {
    const { target } = event;
    target.style.opacity = '0.4';

    this.dragSrcEl = target;

    const e = event;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', window.getComputedStyle(target).order);
  }

  dragOverHandle(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    const e = event;
    e.dataTransfer.dropEffect = 'move';

    return false;
  }

  dragEnterHandle(event) {
    const { target } = event;
    if (target.tagName.toLowerCase() === 'canvas') {
      target.closest('.frames__item').classList.add('over');
    }
  }

  dragLeaveHandle(event) {
    const { target } = event;
    if (target.tagName.toLowerCase() === 'canvas') {
      target.closest('.frames__item').classList.remove('over');
    }
  }

  dropHandle(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    const { target } = event;
    const element = target.closest('.frames__item');

    if (this.dragSrcEl !== element) {
      this.dragSrcEl.style.order = element.style.order;
      element.style.order = event.dataTransfer.getData('text/html').slice(66);
    }

    return false;
  }

  dragEndHandle(event) {
    const over = document.querySelector('.over');
    if (over) {
      over.classList.remove('over');
    }

    const { target } = event;
    target.style.opacity = '';

    this.framesView.updateFramesNumbers();
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
    const { order } = frame.style;
    document.querySelector('.frames__list').removeChild(frame);

    const frames = document.querySelector('.frames__list');

    [...frames.children].forEach((child) => {
      if (child.style.order > order) {
        const fr = child;
        fr.style.order -= 1;
      }
    });

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
    this.startAnimation();
  }
}
