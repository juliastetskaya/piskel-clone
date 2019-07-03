import { createElement } from '../../lib';
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
    const buttonCreate = createElement('a', 'button__nav create-sprite', 'Create Sprite');
    buttonCreate.setAttribute('href', '#');

    const buttonSignIn = createElement('div', 'button__nav sign-in', 'Sign in');

    const userImage = createElement('img', 'img-login');
    const userName = createElement('span', 'user-name');
    const buttonLogIn = createElement('div', 'button__nav login', userImage, userName);

    const buttonLogOut = createElement('div', 'button__nav logout', 'Logout');

    return createElement('nav', 'main-nav', buttonCreate, buttonSignIn, buttonLogIn, buttonLogOut);
  }

  setScripts() {
    const platform = createElement('script');
    platform.setAttribute('src', 'https://apis.google.com/js/platform.js');
    platform.setAttribute('async', '');
    platform.setAttribute('defer', '');

    const clientID = createElement('meta');
    clientID.setAttribute('name', 'google-signin-client_id');
    clientID.setAttribute('content', '650755710272-0c48fmokj47v815den93354ud4mfj4om.apps.googleusercontent.com');

    const singIn = createElement('div', 'g-signin2 signIn');
    singIn.setAttribute('data-onsuccess', 'onSignIn');
    document.querySelector('.main-nav').append(singIn);

    return [platform, clientID];
  }

  render() {
    const logoLink = this.createLogoLink();
    const piskelName = createElement('span', 'piskel-name', this.name);
    const navigation = this.createNavigation();

    const header = createElement('header', 'main-header', logoLink, piskelName, navigation);
    const main = createElement('main', 'main');

    const wrapper = createElement('div', 'main__wrapper', header, main);
    document.body.append(wrapper);

    const scripts = this.setScripts();
    document.head.append(...scripts);
  }
}
