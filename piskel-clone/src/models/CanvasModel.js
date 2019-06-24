import CanvasView from '../views/CanvasView';

export default class CanvasModel {
  start() {
    const canvas = new CanvasView();
    canvas.render();
  }
}
