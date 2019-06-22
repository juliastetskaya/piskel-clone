import createElement from '../../lib';
import image from '../../images/piskel_logo.png';

export default class PiskelView {
  constructor(name) {
    this.name = name;
  }

  render() {
    const logo = createElement('img', 'logo');
    logo.setAttribute('src', image);

    const logoLink = createElement('a', 'logo-link', logo);
    logoLink.setAttribute('href', '/');

    const piskelName = createElement('span', 'piskel-name', this.name);

    const buttonCreate = createElement('a', 'button button_create-sprite', 'Create Sprite');
    buttonCreate.setAttribute('href', '#');

    const buttonSignIn = createElement('a', 'button button_sign-in', 'Sign in');
    buttonSignIn.setAttribute('href', '#');


    const navigation = createElement('nav', 'main-nav', buttonCreate, buttonSignIn);

    const header = createElement('header', 'main-header', logoLink, piskelName, navigation);


    const main = createElement('main');

    const wrapper = createElement('div', 'main-wrapper');

    wrapper.append(header, main);

    document.body.append(wrapper);
  }
}
