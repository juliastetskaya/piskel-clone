import PiskelModel from './models/PiskelModel';
import ToolsModel from './models/ToolsModel';

const piskel = new PiskelModel();
const tools = new ToolsModel();

piskel.start();
tools.start();
