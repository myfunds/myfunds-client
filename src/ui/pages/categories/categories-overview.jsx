import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import FinancialHelpers from '../../../utils/helpers/financial-hepers.js';
import Tile from '../../components/Tile';
import Select from '../../components/Select';
import Loader from '../../components/loader/loader.jsx';

class CategoriesOverview extends Component {
  constructor(props) {
    super(props);
  }
  getPercentage({
    currentBalance,
    max,
  }) {
    let value = currentBalance !== 0 ?
      Math.floor(
        ((parseFloat(currentBalance) /
        parseFloat(max)) * 100), 0
      ) : 0.001;
    value = currentBalance > 0 && value < 1 ? 1 : value;
    return value;
  }

  render() {
    const category = this.props.categories[0] || {};
    const percent = this.getPercentage({
      currentBalance: category.currentBalance,
      max: category.max,
    });
    let color = 'success';
    if (percent >= 75 && percent < 90) {
      color = 'warning';
    } else if (percent >= 75 && percent >= 90) {
      color = 'danger';
    }
    const difference = FinancialHelpers.currencyFormatted(
      category.max - category.currentBalance
    );
    return (
      <div>
        <Tile>
          <h4>{category.name}</h4>
          <h4>{difference}</h4>
          <progress
            className={`progress progress-${color}`}
            value={percent > 100 ? 100 : percent}
            max="100"
          />
        </Tile>
        <h2>REFUNDS</h2>
        {category.negativeTransactions && category.negativeTransactions.map(transaction => (
          <Tile>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div>{transaction.description}</div>
              <div>{transaction.amount}</div>
            </div>
          </Tile>
        ))}
        <h2>SPENDING</h2>
        {category.positiveTransactions && category.positiveTransactions.map(transaction => (
          <Tile>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div>{transaction.description}</div>
              <div>{transaction.amount}</div>
            </div>
          </Tile>
        ))}
      </div>
   );

  }
}
CategoriesOverview.propTypes = {
  categories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  // month: PropTypes.string,
  // year: PropTypes.string,
};

const qCategoriesForBudget = gql`
query qDashboard(
  $auth0UserId: String!,
  $categoryId: ID!,
  $startDate: DateTime!,
  $endDate: DateTime!,
){
  allCategories(
    filter: {
      id: $categoryId
      user: {
        auth0UserId: $auth0UserId
      }
    }
  ){
    id
    name
    max
    positiveTransactions(
      filter:{
        transactionDate_gte: $startDate,
        transactionDate_lte: $endDate
      }
    ){
      id
      amount
      transactionDate
      description
    }
    negativeTransactions(
      filter:{
        transactionDate_gte: $startDate,
        transactionDate_lte: $endDate
      }
    ){
      id
      amount
      transactionDate
      description
    }
  }
}
`;

function getProfile() {
  // Retrieves the profile data from local storage
  const profile = localStorage.getItem('profile');
  return profile ? JSON.parse(localStorage.profile) : {};
}

const CategoriesOverviewWithData = graphql(qCategoriesForBudget, {

  options(props) {
    const startDate = props.startDate;
    const endDate = props.endDate;
    const categoryId = props.categoryId;
    const auth0UserId = getProfile().user_id;
    return {
      variables: {
        startDate,
        endDate,
        categoryId,
        auth0UserId,
      },
    };
  },

  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  props: ({ ownProps, data: { loading, allCategories, refetch } }) => ({
    ownProps,
    isLoading: loading,
    categories: prepareFiancialAccounts(allCategories) || [],
    refetch,
  }),
})(CategoriesOverview);

export default CategoriesOverviewWithData;

function prepareFiancialAccounts(financialAccounts) {
  return !financialAccounts || financialAccounts.length < 1 ? null :
    financialAccounts.reduce((fas, fa) => ([...fas, {
      ...fa,
      currentBalance: fa.openingBalance ?
        fa.openingBalance + getCurrentBalance(fa) :
        getCurrentBalance(fa),
    }]), []);
}

function getCurrentBalance(financialAccount) {
  if (financialAccount.type === 'debt') {
    return financialAccount.negativeTransactions
             .reduce((total, t) => total + t.amount, 0) -
           financialAccount.positiveTransactions
             .reduce((total, t) => total + t.amount, 0);
  }
  return financialAccount.positiveTransactions
           .reduce((total, t) => total + t.amount, 0) -
         financialAccount.negativeTransactions
           .reduce((total, t) => total + t.amount, 0);
}
