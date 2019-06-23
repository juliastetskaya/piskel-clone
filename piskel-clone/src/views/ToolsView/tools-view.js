import createElement from '../../lib';

export default class ToolsView {
  constructor() {
    this.penSizes = [1, 2, 3, 4];
    this.tools = ['Pen tool', 'Paint bucket tool', 'Eraser tool', 'Stroke tool', 'Rectangle tool', 'Circle tool', 'Move tool', 'Color picker'];
    this.shortcuts = ['P', 'B', 'E', 'L', 'R', 'C', 'M', 'O'];
  }

  render() {
    const penSizes = this.penSizes.map(item => createElement('li', `pen-size__item pen-size-${item}`));
    const penSizeList = createElement('ul', 'pen-size__list', ...penSizes);

    const tools = this.tools.map((item, index) => {
      const shortcut = createElement('span', 'tools__shortcut', `(${this.shortcuts[index]})`);
      const toolTip = createElement('div', 'tools__tip', `${item} `, shortcut);
      const tool = createElement('li', `tools__item ${item.toLowerCase().split(' ').join('-')}`, toolTip);

      return tool;
    });
    const toolsList = createElement('ul', 'tools__list', ...tools);

    const wrapper = createElement('div', 'tools__wrapper', penSizeList, toolsList);
    const section = createElement('section', 'tools', wrapper);

    document.querySelector('.main').append(section);
  }
}
