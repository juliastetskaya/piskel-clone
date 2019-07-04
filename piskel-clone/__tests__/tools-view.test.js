import ToolsView from '../src/views/ToolsView/tools-view';
import { dataWithClass, dataWithoutClass } from './__fixtures__/toolsView/active-tool';
import { resultWithClass, resultWithoutClass } from './__fixtures__/toolsView/active-tool__result';
import { dataActiveSizeWithClass, dataActiveSizeWithoutClass } from './__fixtures__/toolsView/active-size';
import { resultActiveSizeWithClass, resultActiveSizeWithoutClass } from './__fixtures__/toolsView/active-size__result';
import penSizeList from './__fixtures__/toolsView/pen-size-list';
import toolsList from './__fixtures__/toolsView/tools-list';
import palette from './__fixtures__/toolsView/palette';
import sectionTools from './__fixtures__/toolsView/tools';

const toolsView = new ToolsView();

describe('constructor', () => {
  it('Should create an instance of class', () => {
    expect(toolsView.penSizes).toEqual([1, 2, 3, 4]);
  });
});

describe('addClassActiveTool', () => {
  it('Should add class active--tool to element', () => {
    document.body.innerHTML = dataWithClass;
    const element = document.querySelector('.eraser-tool');
    ToolsView.addClassActiveTool(element);
    const expected = resultWithClass;
    expect(document.body.innerHTML).toEqual(expected);
  });
  it('Should add class active--tool to element without class before', () => {
    document.body.innerHTML = dataWithoutClass;
    const element = document.querySelector('.lighten');
    ToolsView.addClassActiveTool(element);
    const expected = resultWithoutClass;
    expect(document.body.innerHTML).toEqual(expected);
  });
});

describe('addClassActiveSize', () => {
  it('Should add class active--size to element', () => {
    document.body.innerHTML = dataActiveSizeWithClass;
    const element = document.querySelector('[data-size="4"]');
    ToolsView.addClassActiveSize(element);
    const expected = resultActiveSizeWithClass;
    expect(document.body.innerHTML).toEqual(expected);
  });
  it('Should add class active--tool to element without class before', () => {
    document.body.innerHTML = dataActiveSizeWithoutClass;
    const element = document.querySelector('[data-size="2"]');
    ToolsView.addClassActiveSize(element);
    const expected = resultActiveSizeWithoutClass;
    expect(document.body.innerHTML).toEqual(expected);
  });
});

describe('createPenSizeList', () => {
  it('Should create pen size list', () => {
    const result = toolsView.createPenSizeList();
    expect(result.outerHTML).toEqual(penSizeList);
  });
});

describe('createToolsList', () => {
  it('Should create tools list', () => {
    const result = toolsView.createToolsList();
    expect(result.outerHTML).toEqual(toolsList);
  });
});

describe('createPalette', () => {
  it('Should create palette panel', () => {
    const result = toolsView.createPalette();
    expect(result.outerHTML).toEqual(palette);
  });
});

describe('render', () => {
  it('Should render section tools', () => {
    document.body.innerHTML = '<main class="main"></main>';
    toolsView.render();
    expect(document.body.innerHTML).toEqual(sectionTools);
  });
});
