/* eslint no-param-reassign: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

import AuthService from './utils/AuthService';
import App from './ui/layouts/layout.jsx';
import { SignIn, ProfileWithData } from './ui/pages/profile';


// import FinancialAccountSection from './ui/pages/financial-accounts/financial-accounts-section.jsx';
// import CategoriesForBudget from './ui/pages/categories/categories-section.jsx';
// import Dashboard from './ui/pages/dashboard/dashboard.jsx';

let config = {};
if (process.env.NODE_ENV === 'production') {
  config = require('./config/prod.js').default;
} else {
  config = require('./config/dev.js').default;
}

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


function asyncComponent(getComponent) {
  return class AsyncComponent extends Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component
          this.setState({ Component })
        })
      }
    }
    render() {
      const { Component } = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return null
    }
  }
}

const Dashboard = asyncComponent(() =>
  import('./ui/pages/dashboard/dashboard.jsx').then(module => module.default)
)
const FinancialAccountSection = asyncComponent(() =>
  import('./ui/pages/financial-accounts/financial-accounts-section.jsx').then(module => module.default)
)
const CategoriesForBudget = asyncComponent(() =>
  import('./ui/pages/categories/categories-section.jsx').then(module => module.default)
)

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
  component: PropTypes.func.isRequired,
  rest: PropTypes.object,
  location: PropTypes.string,
};

PrivateRoute.defaultProps = {
  rest: {},
  location: '/',
};

if (typeof document !== 'undefined' && typeof client !== 'undefined') {
  // ReactGA.initialize('UA-87715799-1');
  console.log('TESTTESTTEST: ', process.env.NODE_ENV);
  render((
    <ApolloProvider client={client}>
      <Router>
        <App auth={auth} title="My Funds">
          <Switch>
            <Route exact path="/" component={SignIn} auth={auth} />
            <PrivateRoute path="/profile" component={ProfileWithData} />

            <PrivateRoute path="/accounts" component={FinancialAccountSection} />
            <PrivateRoute path="/categories" component={CategoriesForBudget} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
          </Switch>
        </App>
      </Router>
    </ApolloProvider>
  ), document.getElementById('root'));
}
