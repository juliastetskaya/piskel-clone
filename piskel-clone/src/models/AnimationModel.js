import AnimationView from '../views/AnimationView';

export default class AnimationModel {
  start() {
    const animation = new AnimationView();
    animation.render();
  }
}
