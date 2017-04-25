import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link, withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import AuthService from '../../utils/AuthService.js';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.signOut = this.signOut.bind(this);
  }

  componentWillMount() {
    // if (this.props.auth.loggedIn() && !this.props.user.id && this.props.history[0] !== '/profile') this.props.history.push('/profile');
  }

  signOut(event) {
    event.preventDefault();
    // destroys the session data
    this.props.auth.logout();
    // TODO: clear the data from apollo
    // redirects to login page
    this.props.history.push('/');
  }

  renderHeader() {
    // TODO: move to prop
    const isLoggedIn = this.props.auth.loggedIn();
    return (
      <nav
        className="navbar navbar-fixed-top navbar-light bg-faded"
        style={{ marginBottom: '10px' }}
      >
        <div id="exCollapsingNavbar2">
          <Link to="/" className="navbar-brand" style={{ width: '30px' }}>
            <i className="fa fa-home fa-lg" aria-hidden="true" />
          </Link>
          {isLoggedIn ? (
            <ul className="nav navbar-nav">
              <li className={`nav-item ${this.props.title === 'Dashboard' ? 'active' : ''}`}>
                <Link to={'/dashboard'} className="nav-link">
                  <i className="fa fa-tachometer fa-lg" aria-hidden="true" />
                </Link>
              </li>
              <li
                className={`nav-item ${this.props.title === 'Financial Accounts' ? 'active' : ''}`}
              >
                <Link to={'/accounts'} className="nav-link">
                  <i className="fa fa-university fa-lg" aria-hidden="true" />
                </Link>
              </li>
              <li className={`nav-item ${this.props.title === 'Budgets' ? 'active' : ''}`}>
                <Link to={'/categories'} className="nav-link">
                  <i className="fa fa-list fa-lg" aria-hidden="true" />
                </Link>
              </li>
              <li className={`nav-item ${this.props.title === 'Profile' ? 'active' : ''}`}>
                <Link to={'/profile'} className="nav-link">
                  <i className="fa fa-user fa-lg" aria-hidden="true" />
                </Link>
              </li>
              <li id="sign-out" className="nav-item">
                <button className="nav-link" href="#" onClick={this.signOut}>
                  <i className="fa fa-sign-out fa-lg" aria-hidden="true" />
                </button>
              </li>

            </ul>
          ) : null}
          {isLoggedIn ? null : (
            <ul className="nav navbar-nav">
              <li
                id="sign-in"
                className={`nav-item ${this.props.title === 'Sign In' ? 'active' : ''}`}
              >
                <Link to="/sign-in" className="nav-link">
                  <i className="fa fa-sign-in fa-lg" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    );
  }

  render() {
    return (
      <div style={{ padding: '20px 20px 20px 20px' }}>
        {this.renderHeader()}
        {/* This is padding for the fixed header */}
        <div className="container">
          <ReactCSSTransitionGroup
            component="div"
            transitionName={{
              enter: 'animated',
              enterActive: 'fadeInLeft',
              leave: 'animated',
              leaveActive: 'fadeOutRight',
              appear: 'animated',
              appearActive: 'fadeInLeft',
            }}
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
          >
            {React.cloneElement(this.props.children, {
              // key: this.props.location.pathname,
              auth: this.props.auth,
            })}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.object.isRequired,
  ]),
  title: PropTypes.string.isRequired,
  auth: PropTypes.instanceOf(AuthService).isRequired,
  user: PropTypes.object.isRequired,
};

App.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const userQuery = gql`
  query getUser($auth0UserId:String){
    allUsers(filter:{
      auth0UserId:$auth0UserId
    }){
      id
    }
  }
`;

export default withRouter(graphql(userQuery, {
  options(props) {
    return {
      forceFetch: true,
      variables: {
        auth0UserId: props.auth.getProfile().user_id,
      },
    };
  },
  props: ({ ownProps, data: { loading, getUser, refetch } }) => ({
    ownProps,
    isLoading: loading,
    user: getUser || {},
    refetch,
  })
})(App));
