import Render from './views/render';
import App from './main';
import Frames from './frames';

const render = new Render();
render.start();

const app = new App();
app.start();

const frames = new Frames();
frames.start();
