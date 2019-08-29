import Render from './views/render';
import App from './main';
import Frames from './frames';
import Hotkeys from './hotkeys';
import GoogleAuth from '../auth/googleAuth';

const render = new Render();
render.start();

const app = new App();
app.start();

const frames = new Frames();
frames.start();

const hotkeys = new Hotkeys();
hotkeys.start();

const googleAuth = new GoogleAuth();
googleAuth.start();
