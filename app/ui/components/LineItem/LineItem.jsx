import React, { Component, PropTypes } from 'react';
import EditTransaction from '../edit-transaction/edit-transaction.jsx';
import './LineItem.scss';

class LineItem extends Component {
  constructor(props) {
    super(props);
    this.toggleEdit = ::this.toggleEdit;
    this.state = {
      edit: false,
    };
  }

  toggleEdit() {
    this.setState({
      edit: !this.state.edit,
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
      <div className="list-item animated fadeInLeft">
        <div className="row">
          <div className="col-xs-5">

            <div className="list-item__title">
              {!titleIcon ?
                null :
                <i className={`fa fa-${titleIcon}`} />
              }
              {title}
            </div>
          </div>
          <div className="col-xs-5">
            <div className="list-item__subtitle text-muted">
              {!subtitleIcon ?
                null :
                <i className={`fa fa-${subtitleIcon}`} />
              }
              {subtitle}
            </div>
            <div className="list-item__focus-text" >
              {!focusTextIcon ?
                null :
                <i className={`fa fa-${focusTextIcon}`} />
              }
              {focusText}
            </div>
          </div>
          <div className="col-xs-2">
            <div
              className="list-item__edit-button"
              onClick={this.toggleEdit}
            >
              { this.state.edit ? <i className="fa fa-times" aria-hidden="true" /> : <i className="fa fa-edit" aria-hidden="true" /> }
            </div>
            <div
              className="list-item__delete-button"
              onClick={onDelete}
            >
              { this.state.edit ? null : <i className="fa fa-trash" aria-hidden="true" /> }
            </div>
          </div>
        </div>
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
