import ToolsView from '../views/ToolsView';
import CanvasView from '../views/CanvasView';
import PiskelView from '../views/PiskelView';
import FramesView from '../views/FramesView';
import AnimationView from '../views/AnimationView';

export default class Model {
  constructor() {
    this.currentTool = '';
  }

  start() {
    const tools = new ToolsView();
    const canvas = new CanvasView();
    const piskel = new PiskelView('New Piskel');
    const frames = new FramesView();
    const animation = new AnimationView();

    piskel.render();
    tools.render();
    frames.render();
    canvas.render();
    animation.render();
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
      CanvasView.addClassCursor(this.currentTool);
    }
  }
}
