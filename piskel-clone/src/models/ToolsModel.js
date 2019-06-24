import ToolsView from '../views/ToolsView';

export default class ToolsModel {
  constructor() {
    this.currentTool = '';
  }

  start() {
    const toolsView = new ToolsView();
    toolsView.render();
  }

  clickToolsHandler({ target }) {
    const tools = {
      pen: document.querySelector('.pen-tool'),
      bucket: document.querySelector('.paint-bucket-tool'),
      eraser: document.querySelector('.eraser-tool'),
      stroke: document.querySelector('.stroke-tool'),
      rectangle: document.querySelector('.rectangle-tool'),
      circle: document.querySelector('.circle-tool'),
      move: document.querySelector('.move-tool'),
      picker: document.querySelector('.color-picker'),
    };

    if (target.tagName === 'LI') {
      [this.currentTool] = Object.keys(tools).filter(key => tools[key] === target);
      ToolsView.addClassActive(target);
    }
  }
}
