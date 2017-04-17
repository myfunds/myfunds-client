import React, { PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import Loader from '../../components/loader/loader.jsx';
import AddTransaction from '../../components/add-transaction/add-transaction.jsx';
import MonthsSpending from '../../components/months-spending/months-spending.jsx';
// import NetWorth from '../../components/net-worth/net-worth.jsx';

function Dashboard(props) {
  return (
    <div className="page">
      <div className="container">
        {
          props.isLoading ? (<Loader />) : (<div>
            <MonthsSpending
              categories={props.categories}
            />
            <AddTransaction
              isOpen
              noIcon
              isLoading={false}
              categories={props.categories}
              financialAccounts={props.financialAccounts}
              refetch={props.refetch}
            />
            {/* <NetWorth
              financialAccounts={props.financialAccounts}
            /> */}
          </div>)
        }
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  financialAccounts: React.PropTypes.array.isRequired,
  categories: React.PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};

const qDashboard = gql`
query qDashboard(
  $date: DateTime!,
  $auth0UserId: String!,
){
  allFinancialAccounts(
    filter: {
      user: {
        auth0UserId: $auth0UserId
      }
    }
  ){
    id
    name
    type
    openingBalance
    positiveTransactions{
      id
      amount
      transactionDate
    }
    negativeTransactions{
      id
      amount
      transactionDate
    }
  }
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
        transactionDate_gt: $date
      }
    ){
      id
      amount
      transactionDate
    }
    negativeTransactions(
      filter:{
        transactionDate_gt: $date
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

const DashboardWithData = graphql(qDashboard, {
  options() {
    const date = moment().subtract(1, 'months').toISOString();
    const auth0UserId = getProfile().user_id;
    return {
      variables: {
        date,
        auth0UserId,
      },
    };
  },
  props: ({ ownProps, data: { loading, allFinancialAccounts, allCategories, refetch } }) => ({
    ownProps,
    isLoading: loading,
    financialAccounts: prepareFiancialAccounts(allFinancialAccounts) || [],
    categories: prepareFiancialAccounts(allCategories) || [],
    refetch,
  }),
})(Dashboard);

export default DashboardWithData;

function prepareFiancialAccounts(financialAccounts) {
  return !financialAccounts || financialAccounts.length < 1 ? null :
    financialAccounts.reduce((fas, fa) => ([...fas, {
      ...fa,
      currentBalance: getCurrentBalance(fa),
    }]), []);
}

function getCurrentBalance({ type = 'categroy', openingBalance = 0, positiveTransactions, negativeTransactions }) {
  if (type === 'debt') {
    return openingBalance +
           negativeTransactions.reduce((total, t) => total + t.amount, 0) -
           positiveTransactions.reduce((total, t) => total + t.amount, 0);
  }
  return openingBalance +
         positiveTransactions.reduce((total, t) => total + t.amount, 0) -
         negativeTransactions.reduce((total, t) => total + t.amount, 0);
}
