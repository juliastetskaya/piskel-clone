import PiskelModel from './models/PiskelModel';
import ToolsModel from './models/ToolsModel';
import FramesModel from './models/FramesModel';
import CanvasModel from './models/CanvasModel';

const piskel = new PiskelModel();
const tools = new ToolsModel();
const frames = new FramesModel();
const canvas = new CanvasModel();

piskel.start();
tools.start();
frames.start();
canvas.start();
