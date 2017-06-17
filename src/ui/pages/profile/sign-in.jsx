import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Auth0Lock from 'auth0-lock';
import { withRouter } from 'react-router-dom';
import glamorous from 'glamorous';
import Tile from '../../components/Tile';

let config = {};
if (process.env.NODE_ENV === 'production') {
  config = require('../../../config/prod.js').default;
} else {
  config = require('../../../config/dev.js').default;
}

const SignInButton = glamorous.button({
  color: 'buttontext',
  backgroundColor: 'forestgreen',
  boxSizing: 'border-box',
  padding: '12px',
  borderWidth: '0',
  borderStyle: 'none',
  borderColor: '#fff',
  borderImage: 'none',
  boxShadow: '0px 18px 20px -13px rgba(0, 0, 0, 0.5)',
  // boxShadow: '0px 5px 4px -1px rgba(0, 0, 0, 0.5)',

  width: '100%',
  borderRadius: '6px',
});

const SignInPage = glamorous.div({
});

class LoginAuth0 extends Component {


  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    // TODO: maybe make these props that get passed in from higher up in the app
    this._lock = new Auth0Lock(config.clientId, config.domain);
  }

  componentDidMount() {
    this._lock.on('authenticated', (authResult) => {
      window.localStorage.setItem('auth0IdToken', authResult.idToken);
      this.props.history.replace('/profile');

      this._lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          console.warn('Error loading the Profile', error);
        } else {
          this.setProfile(profile);
        }
      });
    });
  }

  setProfile(profile) {
    // Saves profile data to local storage
    window.localStorage.setItem('profile', JSON.stringify(profile));
    // Triggers profile_updated event to update the UI
    // this.emit('profile_updated', profile);
  }

  getProfile() {
    // Retrieves the profile data from local storage
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }

  _showLogin = () => {
    this._lock.show();
  }

  render() {
    return (
      <SignInPage>
        <Tile>
          <SignInButton onClick={this._showLogin} type="button" id="sign-in-button">
            <i className="fa fa-sign-in fa-4x" aria-hidden="true" />
          </SignInButton>
        </Tile>
        <Tile>
          <h4>Code hosted on <a href="https://github.com" rel="noopener noreferrer" target="_blank">Github</a></h4>
          <h4>App code served from <a href="https://netlify.com" rel="noopener noreferrer" target="_blank">Netlify</a></h4>
          <h4>Backend provided by <a href="https://graph.cool" rel="noopener noreferrer" target="_blank">Graph.cool</a></h4>
          <h4>Authentication provided by <a href="https://auth0.com/" rel="noopener noreferrer" target="_blank">Auth0</a></h4>
        </Tile>
      </SignInPage>
    );
  }
}

const SignIn = (props) => (
  <LoginAuth0
    clientId={config.clientId}
    history={props.history}
  />
);

export default withRouter(SignIn);


SignIn.propTypes = {
  history: PropTypes.object.isRequired,
};

SignIn.contextTypes = {
  router: PropTypes.object.isRequired,
};
