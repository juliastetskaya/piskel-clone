import createElement from '../../lib';

export default class ToolsView {
  constructor() {
    this.penSizes = [1, 2, 3, 4];
    this.tools = ['Pen tool', 'Paint bucket tool', 'Eraser tool', 'Stroke tool', 'Rectangle tool', 'Circle tool', 'Move tool', 'Color picker'];
    this.shortcuts = ['P', 'B', 'E', 'L', 'R', 'C', 'M', 'O'];
  }

  static addClassActiveTool(element) {
    const activeTool = document.querySelector('.active--tool');
    if (activeTool) activeTool.classList.remove('active--tool');

    element.classList.add('active--tool');
  }

  static addClassActiveSize(element) {
    const activeSize = document.querySelector('.active--size');
    if (activeSize) activeSize.classList.remove('active--size');

    element.classList.add('active--size');
  }

  createPenSizeList() {
    const penSizes = this.penSizes.map((item, index) => {
      const classList = `pen-size__item${index === 0 ? ' active--size' : ''}`;
      const element = createElement('li', classList);
      element.setAttribute('data-size', item);

      return element;
    });
    const penSizeTip = createElement('div', 'pen-size__tip', 'Pen size from 1 to 4 pixels');
    return createElement('ul', 'pen-size__list', ...penSizes, penSizeTip);
  }

  createToolsList() {
    const tools = this.tools.map((item, index) => {
      const shortcut = createElement('span', 'tools__shortcut', `(${this.shortcuts[index]})`);
      const toolTip = createElement('div', 'tools__tip', `${item} `, shortcut);
      const classList = `tools__item ${item.toLowerCase().split(' ').join('-')}${!index ? ' active--tool' : ''}`;
      return createElement('li', classList, toolTip);
    });

    return createElement('ul', 'tools__list', ...tools);
  }

  createPalette() {
    const colors = ['first-color', 'second-color'].map((item, index) => {
      const input = createElement('input', `${item}__input`);
      input.setAttribute('type', 'color');
      input.setAttribute('value', `${index === 0 ? '#000000' : '#ffffff'}`);

      const wrapper = createElement('div', 'input__wrapper', input);

      const tip = `${index === 0 ? 'Primary - left mouse button' : 'Secondary - right mouse button'} - ${input.value}`;
      const colorTip = createElement('span', 'color__tip', tip);
      return createElement('div', `palette__item ${item}`, wrapper, colorTip);
    });

    const shortcut = createElement('span', 'swap-colors__shortcut', '(X)');
    const swapColorsTip = createElement('span', 'swap-colors__tip', 'Swap colors ', shortcut);
    const swapColors = createElement('div', 'swap-colors', swapColorsTip);

    return createElement('div', 'palette', ...colors, swapColors);
  }

  render() {
    const penSizeList = this.createPenSizeList();
    const toolsList = this.createToolsList();
    const palette = this.createPalette();

    const wrapper = createElement('div', 'tools__wrapper', penSizeList, toolsList, palette);
    const section = createElement('section', 'tools', wrapper);

    document.querySelector('.main').append(section);
  }
}
