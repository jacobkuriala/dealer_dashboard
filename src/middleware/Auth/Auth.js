import auth0 from 'auth0-js';
import { AUTH_CONFIG, EngineAPIUrl } from './auth0-variables';
import history from '../../history';
import {Auth0Lock} from "auth0-lock";

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    // redirectUri: AUTH_CONFIG.callbackUrl,
    audience: EngineAPIUrl,
      responseType: AUTH_CONFIG.responseType,
    // responseType: 'code',
    scope: AUTH_CONFIG.exampleScope
  });

  userProfile;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.loggedin = this.isAuthenticated();
    this.lock = this._InitializeLock();
  }

  login() {
    this.auth0.authorize();
    this.loggedin = this.isAuthenticated();
  }

  handleAuthentication() {
    console.log('called handleAuthentication');
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.push('/');
      } else if (err) {
        history.push('/');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult) {
    console.log('called setSession');
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    console.log(authResult);
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.loggedin = this.isAuthenticated();
    // navigate to the home route
    history.replace('/dashboard');
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  }

  getProfile(cb) {
    let accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.userProfile = null;
    this.loggedin = this.isAuthenticated();
    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  _InitializeLock(){
    let lock = new Auth0Lock(
      AUTH_CONFIG.clientId,
      AUTH_CONFIG.domain,{
        theme:{
          logo: 'https://www.drivemotors.com/assets/logos/drive_logo_march_14.svg'
        },
        allowSignUp: false,
        allowedConnections: ['Username-Password-Authentication'],
        auth: {
          responseType: AUTH_CONFIG.responseType,
          redirectUrl: AUTH_CONFIG.callbackUrl,
          params: {
            scope: AUTH_CONFIG.exampleScope
          },
          audience: EngineAPIUrl
        }
      }
    );
    lock.on("authenticated", function(authResult) {
      // Use the token in authResult to getUserInfo() and save it to localStorage
      console.log('called locked.on');
      console.log(this);
      this.getUserInfo(authResult.accessToken, function(error, profile) {
        if (error) {
          // Handle error
          console.log('error');
          console.log(error);
          return;
        }

          history.replace('/');
        // console.log(authResult);
        // console.log('authResult');
        // console.log('profile');
        // console.log(profile);
        // localStorage.setItem('accessToken', authResult.accessToken);
        // localStorage.setItem('profile', JSON.stringify(profile));

        // const auth = new Auth();
        // auth.setSession(authResult);
        // console.log(auth.isAuthenticated());
      });
    });

    return lock;
  }
}
