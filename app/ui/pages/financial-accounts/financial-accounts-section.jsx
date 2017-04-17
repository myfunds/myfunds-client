import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import CardAndDraw from '../../components/card-drawer/card-drawer.jsx';
import Loader from '../../components/loader/loader.jsx';
import AddFinancialAccount from '../../components/add-financial-account/add-financial-account.jsx';


class FinancialAccountSection extends Component {
  constructor(props) {
    super(props);

    this.toggleAddNewAccount = this.toggleAddNewAccount.bind(this);

    this.state = {
      addNewAccount: false,
    };
  }
  getParams() {
    const doc = {
      name: '',
      type: '',
      openingBalance: '',
    };
    const docLabels = {
      name: 'What do you want to call the account?',
      type: 'What type of account is it?',
      openingBalance: 'How much money is in it right now?',
    };
    return {
      doc,
      docLabels,
      type: 'FinancialAccounts',
      toggle: this.toggleAddNewAccount.bind(this),
    };
  }
  toggleAddNewAccount() {
    this.setState({
      addNewAccount: !this.state.addNewAccount,
    });
  }
  renderCardAndDrawer() {
    return this.props.financialAccounts.map((financialAccount) => {
      const params = {
        title: financialAccount.name,
        titleIcon: financialAccount.type,
        subtitle: financialAccount.type,
        subtitleIcon: 'money',
        focusText: financialAccount.currentBalance.toFixed(2),
        focusTextIcon: 'usd',
        collectionType: 'FinancialAccounts',
        doc: financialAccount,
        urlHandle: `/accounts/${financialAccount.id}`,
      };
      return <CardAndDraw key={financialAccount.id} {...params} />;
    });
  }
  render() {
    return (
      <div className="page">
        <div className="container">
          {
            this.props.isLoading ? (<Loader />) : (
              <div className="financialAccounts">
                <AddFinancialAccount
                  isLoading={false}
                  categories={[]}
                  financialAccounts={[]}
                  refetch={this.props.refetch}
                  text="Financial Accounts"
                />
                { this.renderCardAndDrawer() }
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

FinancialAccountSection.propTypes = {
  financialAccounts: React.PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};

const qFinancialAccounts = gql`
  query financialAccounts (
    $auth0UserId: String!,
  ) {
    allFinancialAccounts(
      filter: {
        user: {
          auth0UserId: $auth0UserId
        }
      }
    ){
      id
      name
      openingBalance
      type
      negativeTransactions{
        amount
        transactionDate
      }
      positiveTransactions{
        amount
        transactionDate
      }
      user{
        id
      }
    }
  }
`;

function getProfile() {
  // Retrieves the profile data from local storage
  const profile = localStorage.getItem('profile');
  return profile ? JSON.parse(localStorage.profile) : {};
}

const FinacialAccountsSetionWithData = graphql(qFinancialAccounts, {
  options() {
    return {
      variables: {
        auth0UserId: getProfile().user_id,
      },
    };
  },
  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  props: ({ ownProps, data: { loading, allFinancialAccounts, refetch } }) => ({
    ownProps,
    isLoading: loading,
    financialAccounts: prepareFiancialAccounts(allFinancialAccounts) || [],
    refetch,
  }),
})(FinancialAccountSection);

export default FinacialAccountsSetionWithData;

function prepareFiancialAccounts(financialAccounts) {
  return !financialAccounts || financialAccounts.length < 1 ? null :
    financialAccounts.reduce((fas, fa) => ([...fas, {
      ...fa,
      currentBalance: fa.openingBalance + getCurrentBalance(fa),
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
