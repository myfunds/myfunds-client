import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Loader from '../../components/loader/loader.jsx';
import Tile from '../../components/Tile';
import Select from '../../components/Select';
import FinancialHelpers from '../../../utils/helpers/financial-hepers.js';
import FinancialAccountOverview from './financial-accounts-overview.jsx';

class FinancialAccountSection extends Component {
  constructor(props) {
    super(props);

    this.toggleAddNewAccount = this.toggleAddNewAccount.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.renderFinancialAccount = this.renderFinancialAccount.bind(this);
    this.setFinancialAccountId = this.setFinancialAccountId.bind(this);

    this.state = {
      addNewAccount: false,
      financialAccountId: props.financialAccounts &&
        props.financialAccounts[0] &&
        props.financialAccounts[0].id
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(() => ({
      financialAccountId: nextProps.financialAccounts &&
        nextProps.financialAccounts[0] &&
        nextProps.financialAccounts[0].id
    }));
  }
  setFinancialAccountId({ target }) {
    this.setState(() => ({ financialAccountId: target.value }));
  }
  toggleAddNewAccount() {
    this.setState((state) => ({ addNewAccount: !state.addNewAccount }));
  }
  renderOptions() {
    return this.props.financialAccounts.map((financialAccount) => (
      <option key={financialAccount.id} value={financialAccount.id}>{financialAccount.name}</option>
    ));
  }

  renderFinancialAccount() {
    return this.props.financialAccounts
      .filter((financialAccount) => financialAccount.id === this.state.financialAccountId)
      .map((financialAccount) => {
        const currentBalance = FinancialHelpers.currencyFormatted(
          financialAccount.currentBalance
        );
        return (
          <Tile key={financialAccount.id}>
            <h2 style={{ textAlign: 'center' }}><i className="fa fa-usd" />{currentBalance}</h2>
            <FinancialAccountOverview financialAccountId={financialAccount.id} refetch={this.props.refetch}/>
          </Tile>
        );
      });
  }
  render() {
    return this.props.isLoading ? (<Loader />) : (
      <div>
        <Tile>
          <Select onChange={this.setFinancialAccountId}>
            {this.renderOptions()}
          </Select>
        </Tile>
        {this.renderFinancialAccount()}
      </div>
    );
  }
}

/*

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

*/

FinancialAccountSection.propTypes = {
  financialAccounts: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  // refetch: PropTypes.func.isRequired,
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
