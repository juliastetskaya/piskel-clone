import PiskelController from './controllers/PiskelController';
import ToolsController from './controllers/ToolsController';
import CanvasController from './controllers/CanvasController';

const piskel = new PiskelController();
const tools = new ToolsController();
const canvas = new CanvasController();

piskel.start();
tools.start();
canvas.start();
