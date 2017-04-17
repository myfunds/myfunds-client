import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Loader from '../loader/loader.jsx';

class AddFinancialAccount extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.state = {
      open: false,
    };
  }
  getTypeDropDown(key) {
    return (
      <select
        key={key}
        ref={(ref) => { this[key] = ref; }}
        className="form-control c-select"
      >
        <option key="chooseOne" value=""> Choose one... </option>
        <option key="cash" value="cash"> Cash </option>
        <option key="debt" value="debt"> Debt </option>
      </select>
    );
  }
  toggleOpen() {
    this.setState({
      open: !this.state.open,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    const name = this.name.value;
    const openingBalance = this.openingBalance.value ? parseFloat(this.openingBalance.value) : 0;
    const type = this.type.value;
    if (!type || !name || !openingBalance) {
      console.warn('THIS FAILED, PLEASE SELECT VALUES');
      return;
    }
    this.props.financialAccountInsert({
      name,
      openingBalance,
      type,
    }).then(() => {
      this.name.value = '';
      this.openingBalance.value = '';
      return this.props.refetch();
    }).catch((error) => {
      console.warn('there was an error sending the Mutation', error);
    });
  }
  render() {
    return this.props.isLoading ? <Loader /> : (
      <div>
        <h3
          onClick={this.toggleOpen}
          className={this.props.text ? 'pull-right' : 'text-xs-center'}
        >
          <i
            className={`fa fa-plus-circle ${this.props.text ? '' : 'fa-2x'} rotate ${this.state.open ? 'over' : 'out'}`}
            aria-hidden="true"
          />
        </h3>
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
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      ref={(ref) => { this.name = ref; }}
                      placeholder="Description"
                    />
                  </fieldset>
                </div>
                <div className="col-xs-6">
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      ref={(ref) => { this.openingBalance = ref; }}
                      placeholder="Amount"
                    />
                  </fieldset>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <fieldset className="form-group">
                    {this.getTypeDropDown('type')}
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
      </div>
    );
  }
}

AddFinancialAccount.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  financialAccountInsert: PropTypes.func.isRequired,
  text: PropTypes.string,
  refetch: PropTypes.func.isRequired,
};

AddFinancialAccount.defaultProps = {
  text: '',
};

const mAddFinancialAccount = gql`
  mutation mAddFinancialAccount(
    $name: String!,
    $type:String!,
    $openingBalance:Float!
  ){
    createFinancialAccount(
      name: $name,
      type: $type,
      openingBalance: $openingBalance
    ) {
      id
    }
  }
`;

const AddFinancialAccountWithData = graphql(mAddFinancialAccount, {
  props: ({ mutate }) => ({
    financialAccountInsert: ({
      name,
      type,
      openingBalance,
    }) => mutate({ variables: {
      name,
      type,
      openingBalance,
    } }),
  }),
})(AddFinancialAccount);

export default AddFinancialAccountWithData;
