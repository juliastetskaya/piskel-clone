import createElement from '../../lib';
import image from '../../images/piskel_logo.png';

export default class PiskelView {
  constructor(name) {
    this.name = name;
  }

  createLogoLink() {
    const logo = createElement('img', 'logo');
    logo.setAttribute('src', image);

    const logoLink = createElement('a', 'logo__link', logo);
    logoLink.setAttribute('href', '/');

    return logoLink;
  }

  createNavigation() {
    const buttonCreate = createElement('a', 'button__nav button_create-sprite', 'Create Sprite');
    buttonCreate.setAttribute('href', '#');

    const buttonSignIn = createElement('a', 'button__nav button_sign-in', 'Sign in');
    buttonSignIn.setAttribute('href', '#');

    return createElement('nav', 'main-nav', buttonCreate, buttonSignIn);
  }

  render() {
    const logoLink = this.createLogoLink();
    const piskelName = createElement('span', 'piskel-name', this.name);
    const navigation = this.createNavigation();

    const header = createElement('header', 'main-header', logoLink, piskelName, navigation);
    const main = createElement('main', 'main');

    const wrapper = createElement('div', 'main__wrapper', header, main);

    document.body.append(wrapper);
  }
}
