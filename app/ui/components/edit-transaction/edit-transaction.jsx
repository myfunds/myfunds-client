import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Loader from '../loader/loader.jsx';
import Calendar from '../react-calendar/calendar.jsx';

// import './rotateIcon.css'; // TODO: this needs to imported into the scss?????? why wasn't????

class EditTransaction extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setShowDate = this.setShowDate.bind(this);
    this.setTransactionDate = this.setTransactionDate.bind(this);
    this.state = {
      transactionDate: moment.utc(props.doc.transactionDate) || moment.utc(),
      transactionDateShow: false,
    };
  }

  setShowDate() {
    // TODO: make the date not an input field
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
    const defaultValue = (
      this.props.doc[`${key}Category`] &&
      `category|${this.props.doc[`${key}Category`].id}`
    ) || (
      this.props.doc[`${key}FinancialAccount`] &&
      `financialAccount|${this.props.doc[`${key}FinancialAccount`].id}`
    );
    return (
      <select
        key={key}
        ref={(ref) => { this[`${key}ParentId`] = ref; }}
        defaultValue={defaultValue}
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
      </select>
    );
  }
  handleSubmit(event) {
    event.preventDefault();
    const id = this.props.doc.id;
    const description = this.description.value;
    const amount = this.amount.value ? parseFloat(this.amount.value) : 0;
    const positiveParentId = this.positiveParentId.value;
    const negativeParentId = this.negativeParentId.value;
    const transactionDate = moment(this.transactionDate.value, 'ddd D MMM YYYY').toISOString();

    const positiveCategoryId = this.positiveParentId.value.includes('category|') ? this.positiveParentId.value.split('category|')[1] : undefined;
    const positiveFinancialAccountId = this.positiveParentId.value.includes('financialAccount|') ? this.positiveParentId.value.split('financialAccount|')[1] : undefined;
    const negativeCategoryId = this.negativeParentId.value.includes('category|') ? this.negativeParentId.value.split('category|')[1] : undefined;
    const negativeFinancialAccountId = this.negativeParentId.value.includes('financialAccount|') ? this.negativeParentId.value.split('financialAccount|')[1] : undefined;
    if (!id || !negativeParentId || !positiveParentId || !description || !amount) {
      console.warn('THIS FAILED, PLEASE SELECT VALUES');
      return;
    }
    this.props.updateTransaction({
      id,
      description,
      transactionDate,
      positiveCategoryId,
      positiveFinancialAccountId,
      negativeCategoryId,
      negativeFinancialAccountId,
      amount,
    })
    .then(() => this.props.refetch())
    .catch((error) => {
      console.warn('there was an error sending the Mutation', error);
    });
  }
  render() {
    return this.props.isLoading ? <Loader /> : (
      <div
        style={{
          overflow: 'hidden',
          transition: 'all 1s',
          height: this.props.open ? '210px' : '0',
        }}
      >
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
          {!this.props.open ? null :
          <form className="new-budget" onSubmit={this.handleSubmit} >
            <div className="row">
              <div className="col-xs-6">
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    ref={(ref) => { this.description = ref; }}
                    placeholder="Description"
                    defaultValue={this.props.doc.description}
                  />
                </fieldset>
              </div>
              <div className="col-xs-6">
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    ref={(ref) => { this.amount = ref; }}
                    placeholder="Amount"
                    defaultValue={this.props.doc.amount}
                  />
                </fieldset>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <fieldset className="form-group">
                  {this.getParentsDropDown('positive')}
                </fieldset>
              </div>
              <div className="col-xs-6">
                <fieldset className="form-group">
                  {this.getParentsDropDown('negative')}
                </fieldset>
              </div>
              <div className="col-xs-12">
                <fieldset className="form-group">
                  {/* <label htmlFor='transactionDate'> Date </label> */}
                  <input
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
                    isAbsolute
                  />
                </fieldset>
              </div>
            </div>

            <fieldset className="form-group">
              <button className="btn btn-success form-control" type="submit">Submit</button>
            </fieldset>
          </form>
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

EditTransaction.propTypes = {
  id: PropTypes.string.isRequired,
  financialAccounts: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  doc: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  updateTransaction: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

EditTransaction.defaultProps = {
  open: false,
};

const mEditTransaction = gql`
mutation mEditTransaction(
  $id: ID!,
  $description: String!,
  $transactionDate: DateTime!,
  $positiveCategoryId:ID,
  $positiveFinancialAccountId:ID,
  $negativeCategoryId:ID,
  $negativeFinancialAccountId:ID,
  $amount:Float!
){
  updateTransaction(
    id: $id,
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

const EditTransactionWithData = graphql(mEditTransaction, {
  props: ({ mutate }) => ({
    updateTransaction: ({
      id,
      description,
      transactionDate,
      positiveCategoryId,
      positiveFinancialAccountId,
      negativeCategoryId,
      negativeFinancialAccountId,
      amount,
    }) => mutate({ variables: {
      id,
      description,
      transactionDate,
      positiveCategoryId,
      positiveFinancialAccountId,
      negativeCategoryId,
      negativeFinancialAccountId,
      amount,
    } }),
  }),
})(EditTransaction);

export default EditTransactionWithData;
