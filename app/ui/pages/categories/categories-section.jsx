import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import FinancialHelpers from '../../../utils/helpers/financial-hepers.js';
import CardAndDraw from '../../components/card-drawer/card-drawer.jsx';
import Loader from '../../components/loader/loader.jsx';

class CategoriesSection extends Component {
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
  renderCardAndDrawer() {
    return this.props.categories.map((category) => {
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
      const p = (
        <progress
          className={`progress progress-${color}`}
          value={percent > 100 ? 100 : percent}
          max="100"
        />);
      const currentBalance = FinancialHelpers.currencyFormatted(
        category.currentBalance
      );
      const max = FinancialHelpers.currencyFormatted(category.max);
      const params = {
        title: category.name,
        titleIcon: category.name,
        subtitle: `${currentBalance} / ${max}`,
        subtitleIcon: 'usd',
        focusText: p,
        focusTextIcon: undefined,
        collectionType: 'Categories',
        doc: { _id: category.name },
        hideDrawer: true,
        urlHandle: `/categories/${category.id}`,
      };
      return <CardAndDraw key={category.name} {...params} />;
    });
  }
  render() {
    return (
      <div className="page">
        <div className="container">
          {
            this.props.isLoading ? (<Loader />) : (
              <div>
                <h2>{this.props.month} {this.props.year}</h2>
                {this.renderCardAndDrawer()}
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
CategoriesSection.propTypes = {
  categories: React.PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  month: React.PropTypes.string.isRequired,
  year: React.PropTypes.string.isRequired,
};

const qCategoriesForBudget = gql`
query qDashboard(
  $auth0UserId: String!,
  $startDate: DateTime!,
  $endDate: DateTime!,
){
  allCategories(
    filter: {
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
    }
  }
}
`;

function getProfile() {
  // Retrieves the profile data from local storage
  const profile = localStorage.getItem('profile');
  return profile ? JSON.parse(localStorage.profile) : {};
}

const CategoriesForBudget = graphql(qCategoriesForBudget, {

  options() {
    const startDate = moment().startOf('month').subtract(0, 'month').toISOString();
    const endDate = moment().endOf('month').subtract(0, 'month').toISOString();
    const auth0UserId = getProfile().user_id;
    return {
      variables: {
        startDate,
        endDate,
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
})(CategoriesSection);

export default CategoriesForBudget;

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
