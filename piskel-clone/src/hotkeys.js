import hotkeys from 'hotkeys-js';

export default class Hotkeys {
  start() {
    hotkeys('p', (event) => {
      event.preventDefault();
      document.querySelector('.pen-tool').click();
    });
    hotkeys('b', (event) => {
      event.preventDefault();
      document.querySelector('.paint-bucket-tool').click();
    });
    hotkeys('a', (event) => {
      event.preventDefault();
      document.querySelector('.paint-all-pixels-of-the-same-color').click();
    });
    hotkeys('e', (event) => {
      event.preventDefault();
      document.querySelector('.eraser-tool').click();
    });
    hotkeys('l', (event) => {
      event.preventDefault();
      document.querySelector('.stroke-tool').click();
    });
    hotkeys('r', (event) => {
      event.preventDefault();
      document.querySelector('.rectangle-tool').click();
    });
    hotkeys('c', (event) => {
      event.preventDefault();
      document.querySelector('.circle-tool').click();
    });
    hotkeys('m', (event) => {
      event.preventDefault();
      document.querySelector('.move-tool').click();
    });
    hotkeys('u', (event) => {
      event.preventDefault();
      document.querySelector('.lighten').click();
    });
    hotkeys('t', (event) => {
      event.preventDefault();
      document.querySelector('.dithering-tool').click();
    });
    hotkeys('o', (event) => {
      event.preventDefault();
      document.querySelector('.color-picker').click();
    });
  }
}
