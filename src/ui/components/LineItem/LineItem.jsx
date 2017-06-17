import React, { Component } from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
// import EditTransaction from '../edit-transaction/edit-transaction.jsx';

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

const ListItem = glamorous.div({
  padding: '12px 12px',
  boxShadow: '0px 2px 6px -1px grey',
  margin: '0 0 4px',
  borderRadius: '3px',
  backgroundColor: '#fff',
  position: 'relative',
});

const ListItemTitle = glamorous.div({
  fontSize: '14px',
  '& i': {
    margin: '0 6px 0 12px',
  }
});
const ListItemSubTitle = glamorous.div({
  fontSize: '12px',
  padding: '12px 0px 0px',
  '& i': {
    margin: '0 6px 0 0',
  }
});
const ListItemFocusText = glamorous.div({
  fontSize: '18px',
  textAlign: 'right',
  whiteSpace: 'nowrap',
  '& i': {
    margin: '0 6px 0 12px',
  }
});
const ListItemEditButton = glamorous.div({
  display: 'block',
  margin: '6px 0',
  textAlign: 'center',
  background: 'orange',
  boxShadow: '0px 2px 3px -1px grey',

  width: '48px',
  height: '48px',
  borderRadius: '24px',
  lineHeight: '48px',
  fontSize: '30px',
});
const ListItemDeleteButton = glamorous.div({
  display: 'block',
  margin: '6px 0',
  textAlign: 'center',
  background: '#f64848',
  boxShadow: '0px 2px 3px -1px grey',

  width: '48px',
  height: '48px',
  borderRadius: '24px',
  lineHeight: '48px',
  fontSize: '30px',
});
const ListItemCloseButton = glamorous.div({
  display: 'block',
  margin: '6px 0',
  textAlign: 'center',
  background: '#b5b5b5',
  boxShadow: '0px 2px 3px -1px grey',

  width: '48px',
  height: '48px',
  borderRadius: '24px',
  lineHeight: '48px',
  fontSize: '30px',
});

class LineItem extends Component {
  constructor(props) {
    super(props);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleShowOptions = this.toggleShowOptions.bind(this);
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
      // financialAccounts,
      // categories,
      // doc,
      // isLoading,
      // transactionUpdate,
      // text,
      // refetch,
    } = this.props;
    return (
      <ListItem onClick={this.toggleShowOptions}>
        <TransactionRow>
          <TransactionColumn>
            <ListItemTitle>
              {!titleIcon ?
                null :
                <i className={`fa fa-${titleIcon}`} />
              }
              {title}
            </ListItemTitle>
            <ListItemSubTitle>
              {!subtitleIcon ?
                null :
                <i className={`fa fa-${subtitleIcon}`} />
              }
              {subtitle}
            </ListItemSubTitle>
          </TransactionColumn>
          <TransactionColumn>
            <ListItemFocusText>
              {!focusTextIcon ?
                null :
                <i className={`fa fa-${focusTextIcon}`} />
              }
              {focusText}
            </ListItemFocusText>
          </TransactionColumn>
        </TransactionRow>
        {this.state.showOptions &&
          <LineOptions>
            <ListItemDeleteButton
              onClick={onDelete}
            >
              { this.state.edit ? null : <i className="fa fa-trash" aria-hidden="true" /> }
            </ListItemDeleteButton>
            <ListItemEditButton
              onClick={this.toggleEdit}
            >
              { this.state.edit ? <i className="fa fa-times" aria-hidden="true" /> : <i className="fa fa-edit" aria-hidden="true" /> }
            </ListItemEditButton>
            <ListItemCloseButton
              onClick={this.toggleShowOptions}
            >
              { this.state.edit ? null : <i className="fa fa-times" aria-hidden="true" /> }
            </ListItemCloseButton>
          </LineOptions>
        }
        {/* <EditTransaction
          _id={doc._id}
          financialAccounts={financialAccounts || []}
          categories={categories || []}
          isLoading={false}
          doc={doc}
          open={this.state.edit}
          refetch={refetch}
        /> */}
      </ListItem>
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
  // financialAccounts: PropTypes.array.isRequired,
  // categories: PropTypes.array.isRequired,
  // doc: PropTypes.object.isRequired,
  // isLoading: PropTypes.bool.isRequired,
  // transactionUpdate: PropTypes.func.isRequired,
  // text: PropTypes.string,
  // refetch: PropTypes.func.isRequired,
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
