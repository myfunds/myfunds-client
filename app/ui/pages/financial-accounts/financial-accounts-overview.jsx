import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TransactionsByParent from '../transactions/transactions-section.jsx';
import Tile from '../../components/Tile';
import Loader from '../../components/loader/loader.jsx';

class FinancialAccountOverview extends Component {
  renderCardAndDrawer() {
    return (
      <Tile>
        <h2>{this.props.financialAccount.name}</h2>
        <h4>{this.props.financialAccount.currentBalance.toFixed(2)}</h4>
      </Tile>
    );
  }

  render() {
    return this.props.isLoading || !this.props.financialAccount.id ? (<Loader />) : (
      <div>
        {this.renderCardAndDrawer()}
        <TransactionsByParent
          refetch={this.props.refetch}
          transactions={
            this.props.financialAccount
            .positiveTransactions
            .concat(this.props.financialAccount.negativeTransactions)}
        />
      </div>
    );
  }
}

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
        financialAccountId: props.match.params.financialAccountId,
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
    financialAccountId: ownProps.match.params.financialAccountId,
    refetch,
  }),
})(FinancialAccountOverview);

export default FinancialAccountOverviewWithData;

function prepareFiancialAccount(financialAccount) {
  return !financialAccount ? null : {
    ...financialAccount,
    currentBalance: financialAccount.openingBalance + getCurrentBalance(financialAccount),
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
