import PiskelView from '../views/PiskelView';
import { createElement } from '../lib';

export default class Landing {
  createDescription() {
    const link = createElement('a', 'piskel', 'Piskelapp');
    link.href = 'https://www.piskelapp.com';
    link.target = '_blank';

    const title = createElement('h1', 'description__title', 'Piskel Clone is a clone of the free online editor ', link);

    const text = createElement('p', 'description__text', 'Create an animation online in your browser and then save the result to a computer.');

    const button = createElement('a', 'description__link', 'Create Sprite');
    button.href = './app.html';
    button.target = '_blank';

    return createElement('div', 'description__wrapper', title, text, button);
  }

  createScreenShot() {
    const screenshot = createElement('div', 'screenshot');
    return createElement('div', 'screenshot__wrapper', screenshot);
  }

  createSectionTools() {
    const header = createElement('p', 'tools__title', 'Available tools');

    const tools = ['Pen tool', 'Paint bucket tool', 'Paint all pixels of the same color', 'Eraser tool', 'Stroke tool', 'Rectangle tool', 'Circle tool', 'Move tool', 'Lighten', 'Dithering tool', 'Color picker'].map((tool) => {
      const image = createElement('div', `tool__image ${tool.toLowerCase().split(' ').join('-')}`);
      const toolName = createElement('p', 'tool__name', tool);
      return createElement('li', 'tool__item', image, toolName);
    });

    const toolsList = createElement('ul', 'tools__list', ...tools);

    const toolsWrapper = createElement('div', 'tools__wrapper', header, toolsList);

    const text = createElement('p', 'examples__text', 'Examples');

    const images = [1, 2, 3].map(item => createElement('li', `example__item example-${item}`));

    const imagesList = createElement('ul', 'examples__list', ...images);

    const examplesWrapper = createElement('div', 'examples__wrapper', text, imagesList);

    return createElement('section', 'tools', toolsWrapper, examplesWrapper);
  }

  start() {
    const piskelView = new PiskelView('Welcome!');
    piskelView.render();

    const title = this.createDescription();
    const screenshot = this.createScreenShot();

    const description = createElement('section', 'description', title, screenshot);
    const tools = this.createSectionTools();

    document.querySelector('.main').append(description, tools);
  }
}
