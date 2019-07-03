import GIF from 'gif.js.optimized';
import UPNG from 'upng-js';
import FramesView from './views/FramesView';

export default class Frames {
  constructor() {
    this.framesView = new FramesView();
    this.mainCanvas = document.querySelector('.canvas__main');
    this.context = this.mainCanvas.getContext('2d');
    this.dragSrcEl = null;
    this.speed = 12;
  }

  showFrameNumber() {
    const frameNumber = document.querySelector('.frame-number');
    const frameList = document.querySelector('.frames__list');
    const activeFrame = document.querySelector('.frame--active');

    frameNumber.innerHTML = `${activeFrame.style.order}/${frameList.children.length}`;
  }

  trackNewFrame() {
    const buttonNewFrame = document.querySelector('.frames__button');
    buttonNewFrame.addEventListener('click', () => {
      const frame = this.framesView.createFrame();
      this.trackMenuFrame(frame);
      this.showFrameNumber();

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

    labelAnimation.innerHTML = `${this.speed} FRS`;
    const { width, height } = animation;

    const start = () => {
      if (this.speed > 0) {
        const frames = [...document.querySelector('.frames__list').children];
        ctx.clearRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = false;
        const image = frames[count % frames.length].firstChild;
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
        count += 1;
      }
    };

    timer = setInterval(() => start(), 1000 / Number(this.speed));

    const inputRange = document.querySelector('.speed__range');
    inputRange.addEventListener('input', () => {
      this.speed = inputRange.value;
      clearInterval(timer);
      timer = setInterval(() => start(), 1000 / Number(this.speed));

      labelAnimation.innerHTML = `${this.speed} FRS`;
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

  exportFile() {
    const exportGIF = () => {
      const frames = document.querySelectorAll('.frame__canvas');
      const speed = document.querySelector('.speed__range');
      const buttonGif = document.querySelector('.button-gif');
      const buttonWrapper = document.querySelector('.buttons__wrapper');
      const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: './gif.worker.js',
        repeat: 0,
        width: frames[0].width,
        height: frames[0].height,
        background: frames[0].style.background,
      });

      frames.forEach(frame => gif.addFrame(frame, { delay: 1000 / speed.value }));

      gif.on('finished', (blob) => {
        buttonWrapper.style.display = 'flex';
        buttonGif.href = URL.createObjectURL(blob);
      });

      gif.render();

      buttonWrapper.addEventListener('click', () => {
        buttonWrapper.style.display = 'none';
      });
    };

    const exportAPNG = () => {
      const frames = [...document.querySelectorAll('.frame__canvas')];
      const speed = document.querySelector('.speed__range');
      const buttonAPNG = document.querySelector('.button-apng');
      const arr = frames.map((frame) => {
        const ctx = frame.getContext('2d');
        const image = ctx.getImageData(0, 0, frame.width, frame.height);
        return image.data.buffer;
      });

      const { width, height } = frames[0];
      const l = arr.length;

      const data = UPNG.encode(arr, width, height, 0, new Array(l).fill(1000 / speed.value));
      const blob = new Blob([data], { type: 'image/apng' });

      buttonAPNG.href = URL.createObjectURL(blob);
    };

    document.querySelector('.save-button').addEventListener('click', exportGIF);
    document.querySelector('.save-button').addEventListener('click', exportAPNG);
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
    this.showFrameNumber();

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
    this.showFrameNumber();
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
      this.showFrameNumber();
    }
  }

  start() {
    this.trackNewFrame();
    this.trackMenuFrame();
    this.trackFrameList();
    this.startAnimation();
    this.exportFile();
  }
}
