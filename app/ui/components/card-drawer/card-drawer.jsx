import React, { Component, PropTypes } from 'react';
import EditTransaction from '../edit-transaction/edit-transaction.jsx';

import './card-drawer.scss';

export default class CardAndDraw extends Component {
  constructor(props, context) {
    super(props, context);

    this.goToFinanceAccount = this.goToFinanceAccount.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.removeDocument = this.removeDocument.bind(this);

    this.state = {
      editDoc: false,
      openDrawer: false,
    };
  }
  getParams() {
    return {
      doc: this.props.doc,
      type: this.props.collectionType,
      toggle: this.toggleEdit.bind(this),
      refetch: this.props.refetch,
    };
  }
  toggleDrawer(event) {
    if (event && event.preventDefault) event.preventDefault();
    this.setState({
      openDrawer: !this.state.openDrawer,
    });
  }
  toggleEdit(event) {
    if (event && event.preventDefault) event.preventDefault();
    this.setState({
      editDoc: !this.state.editDoc,
    });
  }
  removeDocument(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    console.warn('removeDocument does not work');
  }

  goToFinanceAccount(event) {
    if (!this.props.urlHandle || event.target.className.includes('drawer-handle-js')) return;
    this.context.router.push(this.props.urlHandle);
  }
  render() {
    return (
      <div className="animated fadeInLeft">
        <div
          key={this.props.doc._id}
          onClick={this.goToFinanceAccount}
          className="financial-account-component card"
        >
          { this.props.hideDrawer ? null :
          <input
            checked={this.state.openDrawer}
            type="checkbox"
            id="drawer-toggle"
            name="drawer-toggle"
          />
          }
          { this.props.hideDrawer ? null :
          <label
            className="drawer-handle-js"
            onClick={this.toggleDrawer}
            htmlFor="drawer-toggle"
            id="drawer-toggle-label"
          />
          }
          <div className="" id="page-content">
            <div className="row">
              {!this.props.title ? null :
              <div className="col-xs-12">
                <h6 className="card-title">
                  {!this.props.titleIcon ?
                      null
                      :
                      <i className={`fa fa-${this.props.titleIcon}`} />
                    }
                  {this.props.title}
                </h6>
              </div>
              }
              {!this.props.subtitle ? null :
              <div className="col-xs-12">
                <h6 className="card-subtitle text-muted">
                  {!this.props.subtitleIcon ?
                      null
                      :
                      <i className={`fa fa-${this.props.subtitleIcon}`} />
                    }
                  {this.props.subtitle}
                </h6>
              </div>
              }
              {!this.props.focusText ? null :
              <div className="balance text-xs-right">
                <h4>
                  {!this.props.focusTextIcon ?
                      null
                      :
                      <i className={`fa fa-${this.props.focusTextIcon}`} />
                    }
                  {this.props.focusText}
                </h4>
              </div>
              }
            </div>
          </div>
          { this.props.hideDrawer ? null :
          <div className="drawer-handle-js" id="drawer">
            <div className="row drawer-handle-js">
              <EditTransaction
                _id={this.props.doc._id}
                financialAccounts={this.props.financialAccounts || []}
                categories={this.props.categories || []}
                isLoading={false}
                doc={this.props.doc}
              />
              {/* <div className="col-xs-6 drawer-handle-js">
                  <span
                  className="dropdown-item text-xs-center drawer-handle-js"
                  onClick={this.toggleEdit}
                  >
                  <i className="fa fa-pencil-square-o fa-4x" aria-hidden="true" />
                  </span>
                </div> */}
              <div className="col-xs-6 drawer-handle-js" >
                <span
                  className="dropdown-item text-xs-center drawer-handle-js"
                  onClick={this.removeDocument}
                >
                  <i className="fa fa-trash fa-4x" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    );
  }
}

CardAndDraw.propTypes = {
  title: PropTypes.string.isRequired,
  titleIcon: PropTypes.string,
  subtitle: PropTypes.string.isRequired,
  subtitleIcon: PropTypes.string,
  focusText: PropTypes.string.isRequired,
  focusTextIcon: PropTypes.string,
  collectionType: PropTypes.string.isRequired,
  doc: PropTypes.object.isRequired,
  urlHandle: PropTypes.string,
  hideDrawer: PropTypes.bool,
  refetch: PropTypes.func.isRequired,
  financialAccounts: PropTypes.array,
  categories: PropTypes.array,
};

CardAndDraw.defaultProps = {
  titleIcon: '',
  subtitleIcon: '',
  focusTextIcon: '',
  urlHandle: '',
  hideDrawer: '',
  financialAccounts: [],
  categories: [],
};

CardAndDraw.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
