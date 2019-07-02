
export default class GoogleAuth {
  constructor() {
    this.state = {
      userName: null,
      userImage: null,
    };
  }

  setData(state) {
    document.querySelector('.sign-in').style.display = 'none';
    document.querySelector('.signIn').style.display = 'none';
    document.querySelector('.login').style.display = 'flex';
    document.querySelector('.logout').style.display = 'block';

    document.querySelector('.img-login').src = state.userImage;
    document.querySelector('.user-name').innerHTML = state.userName;

    localStorage.setItem('state', JSON.stringify(state));
  }

  start() {
    const signIn = async () => {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();

      const profile = googleUser.getBasicProfile();

      this.state.userName = profile.getName();
      this.state.userImage = profile.getImageUrl();

      this.setData(this.state);
    };

    const signOut = async () => {
      const auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut();

      document.querySelector('.sign-in').style.display = 'flex';
      document.querySelector('.signIn').style.display = 'block';
      document.querySelector('.login').style.display = 'none';
      document.querySelector('.logout').style.display = 'none';

      this.state.userName = null;
      this.state.userImage = null;

      localStorage.clear();
    };

    const local = JSON.parse(localStorage.getItem('state'));
    if (local) this.setData(local);

    document.querySelector('.signIn').addEventListener('click', signIn.bind(this));
    document.querySelector('.logout').addEventListener('click', signOut.bind(this));
  }
}
