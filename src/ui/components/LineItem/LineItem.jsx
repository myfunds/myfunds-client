import React, { Component } from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import EditTransaction from '../edit-transaction/edit-transaction.jsx';

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
  transition: 'min-height 200ms ease',
  zIndex: '1',
  flexWrap: 'wrap',
  alignItems: 'center',
  borderRadius: '3px',
  '& div:last-child': {
    width: '100%',
  }
}, ({edit}) => ({
  minHeight: edit ? '400px' : '0',
}));

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
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      edit: false,
      showOptions: false,
    };
  }

  toggleEdit(e) {
    e.stopPropagation();
    this.setState({
      edit: !this.state.edit,
    });
  }
  toggleShowOptions() {
    if(this.state.edit){
      return;
    }
    this.setState({
      showOptions: !this.state.showOptions,
    });
  }

  handleDelete(){
    this.props.onDelete({
      id: this.props.id
    }).then(() => {
      return this.props.refetch();
    }).catch((error) => {
      console.warn('there was an error sending the Mutation', error);
    });
  }

  render() {
    const {
      // onEdit,
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
          <LineOptions edit={this.state.edit}>
            { this.state.edit ? null : <ListItemDeleteButton
              onClick={this.handleDelete}
            >
              <i className="fa fa-trash" aria-hidden="true" />
            </ListItemDeleteButton> }
            <ListItemEditButton
              onClick={this.toggleEdit}
            >
              { this.state.edit ? <i className="fa fa-times" aria-hidden="true" /> : <i className="fa fa-edit" aria-hidden="true" /> }
            </ListItemEditButton>
            { this.state.edit ? null : <ListItemCloseButton
              onClick={this.toggleShowOptions}
            >
              <i className="fa fa-times" aria-hidden="true" />
            </ListItemCloseButton>}
            <EditTransaction
              isLoading={false}
              isOpen={this.state.edit}
              categories={this.props.categories}
              financialAccounts={this.props.financialAccounts}
              transaction={this.props.transaction}
              refetch={this.props.refetch}
              text="Transactions"
            />
          </LineOptions>
        }
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
  id: PropTypes.string.isRequired,

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

export { LineItem };

const deleteTansaction = gql`
  mutation deleteTansaction($id: ID!){
    deleteTransaction(id: $id){
      id
    }
  }
`;

const LineItemWithData = graphql(deleteTansaction, {
  props: ({ mutate }) => ({
    onDelete: ({
      id,
    }) => mutate({ variables: {
      id,
    } }),
  }),
})(LineItem);

export default LineItemWithData;
