import Render from './views/render';
import Tools from './main';
import Frames from './frames';
import Hotkeys from './hotkeys';

const render = new Render();
render.start();

const tools = new Tools();
tools.start();

const frames = new Frames();
frames.start();

const hotkeys = new Hotkeys();
hotkeys.start();
