import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import _ from 'lodash';
import FinancialHelpers from '../../../utils/helpers/financial-hepers.js';
import Loader from '../../components/loader/loader.jsx';

import AddTransaction from '../../components/add-transaction/add-transaction.jsx';

import LineItem from '../../components/LineItem';

class TransactionsSection extends Component {
  constructor(props) {
    super(props);

    this.toggleAddNewTransaction = this.toggleAddNewTransaction.bind(this);

    this.state = {
      transactionDate: moment.utc(),
      addNewTransaction: false,
      paymentMethod: 'null',
      financialAccount: 'null',
    };
  }
  getParams() {
    const doc = {
      transactionDate: moment(),
      description: '',
      amount: '',
      positiveParentId: null,
      negativeParentId: null,
    };
    const docLabels = {
      transactionDate: 'Date of Transaction',
      description: 'Description',
      amount: 'How Much Money',
      positiveParentId: 'Where did the money go?',
      negativeParentId: 'Where did the money come from?',
    };
    return {
      doc,
      docLabels,
      type: 'Transactions',
      toggle: this.toggleAddNewTransaction.bind(this),
      refetch: this.props.refetch,
    };
  }
  getParentName(_id) {
    const financialAccount = _.find(this.props.financialAccounts, { _id });
    return (financialAccount && financialAccount.name) || _id;
  }
  toggleAddNewTransaction() {
    this.setState({
      addNewTransaction: !this.state.addNewTransaction,
    });
  }
  renderLineItem() {
    return this.props.transactions.sort((a, b) => {
      if (a.transactionDate > b.transactionDate) return -1;
      if (a.transactionDate < b.transactionDate) return 1;
      return 0;
    }).map((transaction) => {
      const digitDate = moment.utc(new Date(transaction.transactionDate)
        .toISOString())
        .format('MM/DD/YY');
      const description = transaction.description;
      const otherParentName = (transaction.negativeCategory
                                && transaction.negativeCategory.id !== this.props.parentId
                                && transaction.negativeCategory.name) ||
                              (transaction.negativeFinancialAccount
                                && transaction.negativeFinancialAccount.id !== this.props.parentId
                                && transaction.negativeFinancialAccount.name) ||
                              (transaction.positiveCategory
                                && transaction.positiveCategory.id !== this.props.parentId
                                && transaction.positiveCategory.name) ||
                              (transaction.positiveFinancialAccount
                                && transaction.positiveFinancialAccount.id !== this.props.parentId
                                && transaction.positiveFinancialAccount.name);
      const sign = (transaction.negativeCategory
                      && transaction.negativeCategory.id === this.props.parentId
                      && '-') ||
                    (transaction.negativeFinancialAccount
                      && transaction.negativeFinancialAccount.id === this.props.parentId
                      && '-') ||
                    (transaction.positiveCategory
                      && transaction.positiveCategory.id === this.props.parentId
                      && '') ||
                    (transaction.positiveFinancialAccount
                      && transaction.positiveFinancialAccount.id === this.props.parentId
                      && '');
      const params = {
        title: `${description} (${otherParentName}) `,
        titleIcon: undefined,
        subtitle: `${digitDate} `,
        subtitleIcon: 'calendar',
        focusText: `${sign}${FinancialHelpers.currencyFormatted(transaction.amount)}`,
        focusTextIcon: 'usd',
        collectionType: 'Transactions',
        doc: transaction,
        refetch: this.props.refetch,
        urlHandle: undefined,
        financialAccounts: this.props.financialAccounts,
        categories: this.props.categories,

        id: transaction.id,
        isLoading: false,
      };
      return <LineItem key={transaction.id} {...params} />;
    });
  }
  render() {
    // TODO: Recently added transactions / modified
    return this.props.isLoading ? (<Loader />) : (
      <div>
        <AddTransaction
          isLoading={false}
          categories={this.props.categories}
          financialAccounts={this.props.financialAccounts}
          refetch={this.props.refetch}
          text="Transactions"
        />
        {this.renderLineItem()}
      </div>
    );
  }
}

TransactionsSection.propTypes = {
  transactions: PropTypes.array.isRequired,
  parentId: PropTypes.string.isRequired,
  financialAccounts: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};

const qTransactionByParent = gql`
  query qTransactionByParent{
    allFinancialAccounts{
      id
      name
    }
    allCategories{
      id
      name
    }
  }
`;

const TransactionsByParent = graphql(qTransactionByParent, {
  props: ({
    ownProps,
    data,
  }) => ({
    ownProps,
    isLoading: data.loading,
    financialAccounts: data.allFinancialAccounts || [],
    categories: data.allCategories || [],
    refetch: data.refetch,
  })
})(TransactionsSection);

export default TransactionsByParent;
