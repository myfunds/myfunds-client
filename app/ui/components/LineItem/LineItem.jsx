import React, { Component } from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import EditTransaction from '../edit-transaction/edit-transaction.jsx';
import './LineItem.scss';

const TransactionRow = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
const TransactionColumn = glamorous.div({
  // padding: '6px'
});
const LineOptions = glamorous.div({
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  display: 'flex',
  justifyContent: 'space-around',
  background: 'rgba(0, 0, 0, 0.85)',
});

class LineItem extends Component {
  constructor(props) {
    super(props);
    this.toggleEdit = ::this.toggleEdit;
    this.toggleShowOptions = ::this.toggleShowOptions;
    this.state = {
      edit: false,
      showOptions: false,
    };
  }

  toggleEdit() {
    this.setState({
      edit: !this.state.edit,
    });
  }
  toggleShowOptions() {
    this.setState({
      showOptions: !this.state.showOptions,
    });
  }
  render() {
    const {
      // onEdit,
      onDelete,
      titleIcon,
      title,
      subtitleIcon,
      subtitle,
      focusTextIcon,
      focusText,

      // id,
      financialAccounts,
      categories,
      doc,
      // isLoading,
      // transactionUpdate,
      // text,
      refetch,
    } = this.props;
    return (
      <div onClick={this.toggleShowOptions} className="list-item animated fadeInLeft">
        <TransactionRow>
          <TransactionColumn>
            <div className="list-item__title">
              {!titleIcon ?
                null :
                <i className={`fa fa-${titleIcon}`} />
              }
              {title}
            </div>
            <div className="list-item__subtitle text-muted">
              {!subtitleIcon ?
                null :
                <i className={`fa fa-${subtitleIcon}`} />
              }
              {subtitle}
            </div>
          </TransactionColumn>
          <TransactionColumn>
            <div className="list-item__focus-text" >
              {!focusTextIcon ?
                null :
                <i className={`fa fa-${focusTextIcon}`} />
              }
              {focusText}
            </div>
          </TransactionColumn>
        </TransactionRow>
        {this.state.showOptions &&
          <LineOptions>
            <div
              className="list-item__delete-button"
              onClick={onDelete}
            >
              { this.state.edit ? null : <i className="fa fa-trash" aria-hidden="true" /> }
            </div>
            <div
              className="list-item__edit-button"
              onClick={this.toggleEdit}
            >
              { this.state.edit ? <i className="fa fa-times" aria-hidden="true" /> : <i className="fa fa-edit" aria-hidden="true" /> }
            </div>
            <div
              className="list-item__close-button"
              onClick={this.toggleShowOptions}
            >
              { this.state.edit ? null : <i className="fa fa-times" aria-hidden="true" /> }
            </div>
          </LineOptions>
        }
        <EditTransaction
          _id={doc._id}
          financialAccounts={financialAccounts || []}
          categories={categories || []}
          isLoading={false}
          doc={doc}
          open={this.state.edit}
          refetch={refetch}
        />
      </div>
    );
  }
}

LineItem.propTypes = {
  // onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  title: PropTypes.string.isRequired,
  titleIcon: PropTypes.string,
  subtitle: PropTypes.string.isRequired,
  subtitleIcon: PropTypes.string,
  focusText: PropTypes.string.isRequired,
  focusTextIcon: PropTypes.string,

  // id: PropTypes.string.isRequired,
  financialAccounts: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  doc: PropTypes.object.isRequired,
  // isLoading: PropTypes.bool.isRequired,
  // transactionUpdate: PropTypes.func.isRequired,
  // text: PropTypes.string,
  refetch: PropTypes.func.isRequired,
};

LineItem.defaultProps = {
  onDelete: () => {
    console.warn('No delete function provided');
  },
  onEdit: () => {
    console.warn('No edit function provided');
  },
  titleIcon: null,
  subtitleIcon: null,
  focusTextIcon: null,
};

export default LineItem;
