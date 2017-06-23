import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TransactionsByParent from '../transactions/transactions-section.jsx';
import Loader from '../../components/loader/loader.jsx';

const FinancialAccountOverview = ({
  isLoading,
  financialAccount,
  refetch,
}) => (isLoading || !financialAccount.id ? (<Loader />) : (
  <TransactionsByParent
    refetch={refetch}
    parentId={financialAccount.id}
    transactions={
      financialAccount
      .positiveTransactions
      .concat(financialAccount.negativeTransactions)}
  />
));

FinancialAccountOverview.propTypes = {
  financialAccount: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};

const qFinancialAccountOverview = gql`
  query qFinancialAccountOverview(
    $financialAccountId: ID!,
  ) {
    FinancialAccount(
      id: $financialAccountId
    ){
      id
      name
      type
      openingBalance
      positiveTransactions{
        id
        amount
        description
        transactionDate
        negativeCategory{
          id
          name
        }
        negativeFinancialAccount{
          id
          name
        }
        positiveCategory{
          id
          name
        }
        positiveFinancialAccount{
          id
          name
        }
      }
      negativeTransactions{
        id
        amount
        description
        transactionDate
        negativeCategory{
          id
          name
        }
        negativeFinancialAccount{
          id
          name
        }
        positiveCategory{
          id
          name
        }
        positiveFinancialAccount{
          id
          name
        }
      }
    }
  }
`;

const FinancialAccountOverviewWithData = graphql(qFinancialAccountOverview, {

  options(props) {
    return {
      variables: {
        financialAccountId: props.financialAccountId,
      },
    };
  },

  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  // props: ({ ownProps, data }) => {
  //   return{
  //     ownProps,
  //     isLoading: data.loading,
  //     financialAccount: {},
  //     financialAccountId: ownProps.params.financialAccountId,
  //   }
  // }
  props: ({ ownProps, data: { loading, FinancialAccount, refetch } }) => ({
    ownProps,
    isLoading: loading,
    financialAccount: prepareFiancialAccount(FinancialAccount) || {},
    financialAccountId: ownProps.financialAccountId,
    refetch: () => {
      refetch && refetch();
      ownProps.refetch && ownProps.refetch();
    },
  }),
})(FinancialAccountOverview);

export default FinancialAccountOverviewWithData;

function prepareFiancialAccount(financialAccount) {
  let currentBalance = financialAccount && financialAccount.openingBalance + getCurrentBalance(financialAccount);
  return !financialAccount ? null : {
    ...financialAccount,
    currentBalance,
  };
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
