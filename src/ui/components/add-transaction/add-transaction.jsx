import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Loader from '../loader/loader.jsx';
import Calendar from '../react-calendar/calendar.jsx';

import Button from '../Button';
import Input from '../Input';
import Select from '../Select';

// import './rotateIcon.css'; // TODO: this needs to imported into the scss?????? why wasn't????

class AddTransaction extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.setShowDate = this.setShowDate.bind(this);
    this.setTransactionDate = this.setTransactionDate.bind(this);
    this.positiveParentId = this.positiveParentId.bind(this);
    this.negativeParentId = this.negativeParentId.bind(this);
    this.amount = this.amount.bind(this);
    this.description = this.description.bind(this);
    this.state = {
      open: this.props.isOpen,
      transactionDate: moment.utc(),
      transactionDateShow: false,
      positiveParentId: '',
      negativeParentId: '',
      amount: 0,
      description: '',
    };
  }
  setShowDate() {
    // TODO: make the date not an Input field
    document.activeElement.blur();
    const updateState = {};
    updateState.transactionDateShow = true;
    this.setState(updateState);
  }
  setTransactionDate(date) {
    const updateState = {};
    updateState.transactionDate = date;
    updateState.transactionDateShow = false;
    this.setState(updateState);
  }

  getParentsDropDown(key) {
    const categories = this.props.categories;
    const financialAccounts = this.props.financialAccounts;
    return (
      <Select
        key={key}
        onChange={this[key]}
        defaultValue={null}
        className="form-control c-select"
      >
        {key === 'positiveParentId'
          ?
            <option key="chooseOnePos" value=""> Money went to </option>
          :
            <option key="chooseOneNeg" value=""> Money left </option>
        }
        {categories.map(category => (
          <option key={category.id} value={`category|${category.id}`}> {category.name} </option>
        ))}
        {financialAccounts.map(financialAccount => (
          <option key={financialAccount.id} value={`financialAccount|${financialAccount.id}`}>
            {financialAccount.name}
          </option>
        ))}
      </Select>
    );
  }
  positiveParentId({ target }) {
    this.setState(() => ({
      positiveParentId: target.value,
    }));
  }
  negativeParentId({ target }) {
    this.setState(() => ({
      negativeParentId: target.value,
    }));
  }
  amount({ target }) {
    this.setState(() => ({
      amount: target.value,
    }));
  }
  description({ target }) {
    this.setState(() => ({
      description: target.value,
    }));
  }
  toggleOpen() {
    this.setState({
      open: !this.state.open,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    const description = this.state.description;
    const amount = this.state.amount ? parseFloat(this.state.amount) : 0;
    const positiveParentId = this.state.positiveParentId;
    const negativeParentId = this.state.negativeParentId;
    const transactionDate = this.state.transactionDate.toISOString();

    const positiveCategoryId = this.state.positiveParentId.includes('category|') ? this.state.positiveParentId.split('category|')[1] : undefined;
    const positiveFinancialAccountId = this.state.positiveParentId.includes('financialAccount|') ? this.state.positiveParentId.split('financialAccount|')[1] : undefined;
    const negativeCategoryId = this.state.negativeParentId.includes('category|') ? this.state.negativeParentId.split('category|')[1] : undefined;
    const negativeFinancialAccountId = this.state.negativeParentId.includes('financialAccount|') ? this.state.negativeParentId.split('financialAccount|')[1] : undefined;
    if (!negativeParentId || !positiveParentId || !description || !amount || !transactionDate) {
      console.warn('THIS FAILED, PLEASE SELECT VALUES');
      return;
    }
    this.props.createTransaction({
      description,
      amount,
      positiveCategoryId,
      positiveFinancialAccountId,
      negativeCategoryId,
      negativeFinancialAccountId,
      transactionDate,
    }).then(() => {
      this.setState(() => ({
        description: '',
        amount: '',
      }));
      return this.props.refetch();
    }).catch((error) => {
      console.warn('there was an error sending the Mutation', error);
    });
  }
  render() {
    return this.props.isLoading ? <Loader /> : (
      <div>
        {
          this.props.noIcon ? null : <h3
            onClick={this.toggleOpen}
            className={this.props.text ? 'pull-right' : 'text-xs-center'}
          >
            <i
              className={`fa fa-plus-circle ${this.props.text ? '' : 'fa-2x'} rotate ${this.state.open ? 'over' : 'out'}`}
              aria-hidden="true"
            />
          </h3>
        }

        {!this.props.text ? null :
        <h3 onClick={this.toggleOpen} className="text-xs-center">
          {this.props.text}
        </h3>
        }
        <div className={`formContainer ${this.state.open ? 'grow' : 'shrink'}`}>
          <ReactCSSTransitionGroup
            component="div"
            transitionName={{
              enter: 'animated',
              enterActive: 'fadeInDown',
              leave: 'animated',
              leaveActive: 'fadeOutUp',
              appear: 'animated',
              appearActive: 'fadeInDown',
            }}
            transitionEnterTimeout={750}
            transitionLeaveTimeout={750}
          >
            {!this.state.open ? null :
            <form className="new-budget" onSubmit={this.handleSubmit} >
              <div className="row">
                <div className="col-xs-6">
                  <Input
                    className="form-control"
                    type="text"
                    onChange={this.description}
                    value={this.state.description}
                    placeholder="Description"
                  />
                </div>
                <div className="col-xs-6">
                  <Input
                    className="form-control"
                    type="text"
                    onChange={this.amount}
                    value={this.state.amount}
                    placeholder="Amount"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  {/* <label htmlFor='transactionDate'> Date </label> */}
                  <Input
                    className="form-control"
                    type="text"
                    name="transactionDate"
                    ref={(ref) => { this.transactionDate = ref; }}
                    onFocus={this.setShowDate}
                    value={this.state.transactionDate.format('ddd D MMM YYYY')}
                  />
                  <Calendar
                    shouldShow={this.state.transactionDateShow}
                    selected={this.state.transactionDate}
                    getSelectedDate={this.setTransactionDate}
                  />
                </div>
                <div className="col-xs-6">
                  {this.getParentsDropDown('positiveParentId')}
                </div>
                <div className="col-xs-6">
                  {this.getParentsDropDown('negativeParentId')}
                </div>

              </div>
              <div className="row">
                <div className="col-xs-12">
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            </form>
            }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

AddTransaction.propTypes = {
  financialAccounts: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  createTransaction: PropTypes.func.isRequired,
  text: PropTypes.string,
  isOpen: PropTypes.bool,
  noIcon: PropTypes.bool,
  refetch: PropTypes.func.isRequired,
};

AddTransaction.defaultProps = {
  text: '',
  isOpen: false,
  noIcon: false,
};

const mAddTransaction = gql`
mutation mAddTransaction(
  $description: String!,
  $transactionDate: DateTime!,
  $positiveCategoryId:ID,
  $positiveFinancialAccountId:ID,
  $negativeCategoryId:ID,
  $negativeFinancialAccountId:ID,
  $amount:Float!
){
  createTransaction(
    description: $description,
    transactionDate: $transactionDate,
    positiveCategoryId: $positiveCategoryId,
    positiveFinancialAccountId: $positiveFinancialAccountId,
    negativeCategoryId: $negativeCategoryId,
    negativeFinancialAccountId: $negativeFinancialAccountId,
    amount: $amount
  ) {
    id
  }
}
`;

const AddTransactionWithData = graphql(mAddTransaction, {
  props: ({ mutate }) => ({
    createTransaction: ({
      description,
      transactionDate,
      positiveCategoryId,
      positiveFinancialAccountId,
      negativeCategoryId,
      negativeFinancialAccountId,
      amount,
    }) => mutate({ variables: {
      description,
      transactionDate,
      positiveCategoryId,
      positiveFinancialAccountId,
      negativeCategoryId,
      negativeFinancialAccountId,
      amount,
    } }),
  }),
})(AddTransaction);

export default AddTransactionWithData;
