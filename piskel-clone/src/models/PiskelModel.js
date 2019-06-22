import PiskelView from '../views/PiskelView';

export default class PiskelModel {
  start() {
    const piskel = new PiskelView('New Piskel');
    piskel.render();
  }
}
