import Model from '../models/Model';

export default class ToolsController {
  start() {
    const model = new Model();
    model.start();

    const toolsList = document.querySelector('.tools__list');
    toolsList.addEventListener('click', model.clickToolsHandler);
  }
}
