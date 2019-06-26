import ToolsView from './views/ToolsView';
import CanvasView from './views/CanvasView';
import PiskelView from './views/PiskelView';
import FramesView from './views/FramesView';
import AnimationView from './views/AnimationView';
import App from './main';

const toolsView = new ToolsView();
const canvasView = new CanvasView();
const piskelView = new PiskelView('New Piskel');
const framesView = new FramesView();
const animationView = new AnimationView();

piskelView.render();
toolsView.render();
framesView.render();
canvasView.render();
animationView.render();

const app = new App();
app.start();
