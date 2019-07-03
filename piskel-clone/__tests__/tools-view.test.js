import ToolsView from '../src/views/ToolsView/tools-view';
import toolsList from './__fixtures__/tools-list';
import toolsListResult from './__fixtures__/tools-list__result';
import toolsListNoClass from './__fixtures__/tools-list-without-class';
import toolsListResultNoClass from './__fixtures__/tools-list__result-without-class';

describe('constructor', () => {
  it('Should create an instance of class', () => {
    const toolsView = new ToolsView();
    expect(toolsView.penSizes).toEqual([1, 2, 3, 4]);
  });
});

describe('addClassActiveTool', () => {
  it('Should add class active--tool to element', () => {
    document.body.innerHTML = toolsList;
    const element = document.querySelector('.eraser-tool');
    ToolsView.addClassActiveTool(element);
    const expected = toolsListResult;
    expect(document.body.innerHTML).toEqual(expected);
  });
  it('Should add class active--tool to element without class before', () => {
    document.body.innerHTML = toolsListNoClass;
    const element = document.querySelector('.lighten');
    ToolsView.addClassActiveTool(element);
    const expected = toolsListResultNoClass;
    expect(document.body.innerHTML).toEqual(expected);
  });
});
