import PiskelModel from './models/PiskelModel';
import ToolsController from './controllers/ToolsController';
import FramesModel from './models/FramesModel';
import CanvasModel from './models/CanvasModel';
import AnimationModel from './models/AnimationModel';

const piskel = new PiskelModel();
const tools = new ToolsController();
const frames = new FramesModel();
const canvas = new CanvasModel();
const animation = new AnimationModel();

piskel.start();
tools.start();
frames.start();
canvas.start();
animation.start();
