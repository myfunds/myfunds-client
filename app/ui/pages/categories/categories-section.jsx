import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import FinancialHelpers from '../../../utils/helpers/financial-hepers.js';
import Tile from '../../components/Tile';
import Select from '../../components/Select';
import Loader from '../../components/loader/loader.jsx';

class CategoriesSection extends Component {
  constructor(props) {
    super(props);

    this.renderOptions = this.renderOptions.bind(this);
    this.renderCategory = this.renderCategory.bind(this);
    this.setCategoryId = this.setCategoryId.bind(this);

    this.state = {
      categoryId: props.categories && props.categories[0] && props.categories[0].id
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState(() => ({
      categoryId: nextProps.categories && nextProps.categories[0] && nextProps.categories[0].id
    }));
  }
  setCategoryId({ target }) {
    this.setState(() => ({ categoryId: target.value }));
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
  renderOptions() {
    return this.props.categories.map((category) => (
      <option value={category.id}>{category.name}</option>
    ));
  }

  renderCategory() {
    return this.props.categories
      .filter((category) => category.id === this.state.categoryId)
      .map((category) => {
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
          <Tile>
            <h4>{category.name}</h4>
            <h4>{difference}</h4>
            <progress
              className={`progress progress-${color}`}
              value={percent > 100 ? 100 : percent}
              max="100"
            />
          </Tile>
        );
      });
  }
  render() {
    return this.props.isLoading ? (<Loader />) : (
      <div>
        <Tile>
          <Select
            ref={(categorySelector) => { this.categorySelector = categorySelector; }}
            onChange={this.setCategoryId}
          >
            {this.renderOptions()}
          </Select>
        </Tile>
        {this.renderCategory()}
      </div>
    );
  }
}
CategoriesSection.propTypes = {
  categories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  // month: PropTypes.string,
  // year: PropTypes.string,
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
