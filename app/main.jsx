/* eslint no-param-reassign: 0 */
import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

import { ApolloProvider } from 'react-apollo';
// import ReactGA from 'react-ga';

// webpack alias
import config from 'config';

import AuthService from './utils/AuthService';
import App from './ui/layouts/layout.jsx';
import { SignIn, ProfileWithData } from './ui/pages/profile';
import FinancialAccountSection from './ui/pages/financial-accounts/financial-accounts-section.jsx';
import FinancialAccountOverview from './ui/pages/financial-accounts/financial-accounts-overview.jsx';
import CategoriesForBudget from './ui/pages/categories/categories-section.jsx';
import Dashboard from './ui/pages/dashboard/dashboard.jsx';

import './main.scss';

const auth = new AuthService(config.clientId, config.domain);

const networkInterface = createNetworkInterface({ uri: config.graphqlUrl });

// use the auth0IdToken in localStorage for authorized requests
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }

    // get the authentication token from local storage if it exists
    if (localStorage.getItem('auth0IdToken')) {
      req.options.headers.authorization = `Bearer ${localStorage.getItem('auth0IdToken')}`;
    }
    next();
  },
}]);

const client = new ApolloClient({ networkInterface });

// function logPageView() {
//   ReactGA.set({ page: window.location.pathname });
//   ReactGA.pageview(window.location.pathname);
// }


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest} render={props => (
    auth.loggedIn() ? (
      <Component auth={auth} {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/',
          state: { from: props.location }
        }}
      />
    ))}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.object.isRequired,
  rest: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
};

if (typeof document !== 'undefined' && typeof client !== 'undefined') {
  // ReactGA.initialize('UA-87715799-1');

  render((
    <ApolloProvider client={client}>
      <Router>
        <App auth={auth} title="My Funds">
          <Switch>
            <Route exact path="/" component={SignIn} auth={auth} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/profile" component={ProfileWithData} />
            <PrivateRoute path="/accounts/:financialAccountId" component={FinancialAccountOverview} />
            <PrivateRoute path="/accounts" component={FinancialAccountSection} />
            <PrivateRoute path="/categories" component={CategoriesForBudget} />
          </Switch>
        </App>
      </Router>
    </ApolloProvider>
  ), document.getElementById('app'));
}
