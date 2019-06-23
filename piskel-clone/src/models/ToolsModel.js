import ToolsView from '../views/ToolsView';

export default class ToolsModel {
  start() {
    const tools = new ToolsView();
    tools.render();
  }
}
