import PiskelModel from './models/PiskelModel';
import ToolsModel from './models/ToolsModel';
import FramesModel from './models/FramesModel';

const piskel = new PiskelModel();
const tools = new ToolsModel();
const frames = new FramesModel();

piskel.start();
tools.start();
frames.start();
