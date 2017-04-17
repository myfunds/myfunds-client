/* eslint no-param-reassign: 0 */
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

import { ApolloProvider } from 'react-apollo';
import ReactGA from 'react-ga';

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

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

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

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

const routes = (
  <Route path="/" component={App} auth={auth}>
    <IndexRoute component={SignIn} />
    <Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
    <Route path="/profile" component={ProfileWithData} onEnter={requireAuth} />
    <Route path="/accounts" component={FinancialAccountSection} onEnter={requireAuth} />
    <Route path="/accounts/:financialAccountId" component={FinancialAccountOverview} onEnter={requireAuth} />
    <Route path="/categories" component={CategoriesForBudget} onEnter={requireAuth} />
  </Route>
);

if (typeof document !== 'undefined' && typeof client !== 'undefined') {
  // ReactGA.initialize('UA-87715799-1');
  render((
    <ApolloProvider client={client}>
      <Router routes={routes} history={browserHistory} onUpdate={logPageView} />
    </ApolloProvider>
  ), document.getElementById('app'));
}
