// src/utils/AuthService.js
import { EventEmitter } from 'events';
import Auth0Lock from 'auth0-lock';
import createHistory from 'history/createBrowserHistory'; // TODO: does this work?
import { isTokenExpired } from './jwtHelper';

let config = {};
if (process.env.NODE_ENV === 'production') {
  config = require('../config/prod.js').default;
} else {
  config = require('../config/dev.js').default;
}

const history = createHistory();

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super();
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: config.redirectUrl,
      }
    });
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this));
    // Add callback for lock `authorization_error` event
    // this.lock.on('authorization_error', this._authorizationError.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  _doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.idToken);
    // navigate to the home route
    history.replace('/profile');
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.warn('Error loading the Profile', error);
      } else {
        this.setProfile(profile);
      }
    });
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !isTokenExpired(token);
  }

  setToken(idToken) {
    // Saves user token to local storage
    localStorage.setItem('auth0IdToken', idToken);
  }

  getToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem('auth0IdToken');
  }

  setProfile(profile) {
    // Saves profile data to local storage
    localStorage.setItem('profile', JSON.stringify(profile));
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile);
  }

  getProfile() {
    // Retrieves the profile data from local storage
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }

  logout() {
    // Clear user token and profile data from local storage
    localStorage.removeItem('auth0IdToken');
    localStorage.removeItem('profile');
  }
}
