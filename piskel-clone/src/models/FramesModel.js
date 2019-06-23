import FramesView from '../views/FramesView';

export default class FramesModel {
  start() {
    const frames = new FramesView('1');
    frames.render();
  }
}
