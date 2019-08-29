import ToolsView from './ToolsView';
import CanvasView from './CanvasView';
import PiskelView from './PiskelView';
import FramesView from './FramesView';
import AnimationView from './AnimationView';

export default class Render {
  constructor() {
    this.toolsView = new ToolsView();
    this.canvasView = new CanvasView();
    this.piskelView = new PiskelView('New Piskel');
    this.framesView = new FramesView();
    this.animationView = new AnimationView();
  }

  start() {
    this.piskelView.render();
    this.toolsView.render();
    this.framesView.render();
    this.canvasView.render();
    this.animationView.render();
  }
}
