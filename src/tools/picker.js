import { rgbToHex } from '../lib';

export default function () {
  const getColor = (event, right = true) => {
    const arr = [];
    const [x, y] = [event.offsetX, event.offsetY];
    const { data } = this.context.getImageData(x, y, 1, 1);

    for (let i = 0; i < data.length - 1; i += 1) {
      arr.push(data[i]);
    }
    if (right) {
      this.firstColor = rgbToHex(arr);
      document.querySelector('.first-color__input').value = this.firstColor;
    } else {
      this.secondColor = rgbToHex(arr);
      document.querySelector('.second-color__input').value = this.secondColor;
    }
  };

  this.canvas.style.display = 'none';
  const clickHandler = (event) => {
    getColor(event);
  };

  const contextMenuHandler = (event) => {
    event.preventDefault();
    getColor(event, false);
  };

  this.mainCanvas.addEventListener('click', clickHandler);
  this.mainCanvas.addEventListener('contextmenu', contextMenuHandler);
}
