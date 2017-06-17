import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { NavLink, withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import glamorous from 'glamorous';

import AuthService from '../../utils/AuthService.js';

const AppContianer = glamorous.div({
  fontFamily: '"Roboto", sans-serif',
});
const HeaderContainer = glamorous.div({
  marginBottom: '10px',
  position: 'fixed',
  top: '0',
  right: '0',
  left: '0',
  height: '48px',
  padding: '0 24px',
  backgroundColor: '#fff',
  display: 'flex',
  justifyContent: 'flex',
  alignItems: 'center',
  boxShadow: '0px 18px 20px -13px rgba(0, 0, 0, 0.5)',
  zIndex: '9000',
  '& a': {
    color: 'red',
  },
  '& a.active': {
    color: 'green',
  },
});

const NavContainer = glamorous.nav({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  flex: '1 0 auto',
});

const PageContainer = glamorous.div({
  position: 'absolute',
  top: '48px',
  left: '0',
  right: '0',
  bottom: '0',
  padding: '12px',
  backgroundColor: '#e6e6e6',
});


class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.signOut = this.signOut.bind(this);
  }

  componentWillMount() {
    // if (this.props.auth.loggedIn() && !this.props.user.id &&
    // this.props.history[0] !== '/profile') this.props.history.push('/profile');
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
      <HeaderContainer>
        <NavLink activeClassName="active" to="/" className="navbar-brand" style={{ width: '30px' }}>
          <i className="fa fa-home fa-lg" aria-hidden="true" />
        </NavLink>
        {isLoggedIn ? (
          <NavContainer>
            <NavLink activeClassName="active" to={'/dashboard'} className="nav-link">
              <i className="fa fa-tachometer fa-lg" aria-hidden="true" />
            </NavLink>
            <NavLink activeClassName="active" to={'/accounts'} className="nav-link">
              <i className="fa fa-university fa-lg" aria-hidden="true" />
            </NavLink>
            <NavLink activeClassName="active" to={'/categories'} className="nav-link">
              <i className="fa fa-list fa-lg" aria-hidden="true" />
            </NavLink>
            <NavLink activeClassName="active" to={'/profile'} className="nav-link">
              <i className="fa fa-user fa-lg" aria-hidden="true" />
            </NavLink>
            <button className="nav-link" href="#" onClick={this.signOut}>
              <i className="fa fa-sign-out fa-lg" aria-hidden="true" />
            </button>
          </NavContainer>
        ) : null}
        {isLoggedIn ? null : (
          <NavContainer>
            <NavLink activeClassName="active" to="/" className="nav-link">
              <i className="fa fa-sign-in fa-lg" aria-hidden="true" />
            </NavLink>
          </NavContainer>
        )}
      </HeaderContainer>
    );
  }

  render() {
    return (
      <AppContianer>
        {this.renderHeader()}
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
          <PageContainer>
            {React.cloneElement(this.props.children, {
              // key: this.props.location.pathname,
              auth: this.props.auth,
              user: this.props.user
            })}
          </PageContainer>
        </ReactCSSTransitionGroup>
      </AppContianer>
    );
  }
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.object.isRequired,
  ]).isRequired,
  // title: PropTypes.string.isRequired,
  auth: PropTypes.instanceOf(AuthService).isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

App.contextTypes = {
  router: PropTypes.object.isRequired,
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
