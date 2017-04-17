import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TransactionsByParent from '../transactions/transactions-section.jsx';
import CardAndDraw from '../../components/card-drawer/card-drawer.jsx';
import Loader from '../../components/loader/loader.jsx';

class FinancialAccountOverview extends Component {
  renderCardAndDrawer() {
    const params = {
      title: this.props.financialAccount.name,
      titleIcon: this.props.financialAccount.type,
      subtitle: this.props.financialAccount.type,
      subtitleIcon: 'money',
      focusText: this.props.financialAccount.currentBalance.toFixed(2),
      focusTextIcon: 'usd',
      collectionType: 'FinancialAccounts',
      doc: this.props.financialAccount,
      urlHandle: `/accounts/${this.props.financialAccount._id}`,
    };
    return <CardAndDraw key={this.props.financialAccount._id} {...params} />;
  }

  render() {
    return (
      <div className="page">
        <div className="container">
          {
            this.props.isLoading || !this.props.financialAccount.id ? (<Loader />) : (
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
            )
          }
        </div>
      </div>
    );
  }
}

FinancialAccountOverview.propTypes = {
  financialAccount: React.PropTypes.object.isRequired,
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
        financialAccountId: props.params.financialAccountId,
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
    financialAccountId: ownProps.params.financialAccountId,
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
