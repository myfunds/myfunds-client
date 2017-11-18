import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import FinancialHelpers from '../../../utils/helpers/financial-hepers.js';
import Tile from '../../components/Tile';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Loader from '../../components/loader/loader.jsx';
import CategoriesOverview from './categories-overview.jsx';

class CategoriesSection extends Component {
  constructor(props) {
    super(props);

    this.renderOptions = this.renderOptions.bind(this);
    this.setCategoryId = this.setCategoryId.bind(this);
    this.setRangeLastMonth = this.setRangeLastMonth.bind(this);
    this.setRangeThisMonth = this.setRangeThisMonth.bind(this);
    this.setRangePreviousMonth = this.setRangePreviousMonth.bind(this);

    this.state = {
      categoryId: props.categories && props.categories[0] && props.categories[0].id,
      startDate: moment().startOf('month').subtract(0, 'month').toISOString(),
      endDate: moment().endOf('month').subtract(0, 'month').toISOString(),
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState(() => ({
      categoryId: nextProps.categories && nextProps.categories[0] && nextProps.categories[0].id
    }));
  }
  setCategoryId({ target }) {
    console.log('CHAGIN CATEGORY: ', target.value);
    this.setState(() => ({ categoryId: target.value }));
  }
  setRangeLastMonth() {
    console.log('THIS MONTH');
    this.setState(() => ({
      startDate: moment().startOf('month').subtract(1, 'month').toISOString(),
      endDate: moment().endOf('month').subtract(1, 'month').toISOString(),
    }));
  }
  setRangeThisMonth() {
    console.log('THIS MONTH');
    this.setState(() => ({
      startDate: moment().startOf('month').subtract(0, 'month').toISOString(),
      endDate: moment().endOf('month').subtract(0, 'month').toISOString(),
    }));
  }
  setRangePreviousMonth() {
    console.log('PREVIOUS MONTH');
    this.setState(() => ({
      startDate: moment(this.state.startDate).startOf('month').subtract(1, 'month').toISOString(),
      endDate: moment(this.state.endDate).endOf('month').subtract(1, 'month').toISOString(),
    }));
  }
  renderOptions() {
    return this.props.categories.map((category) => (
      <option key={category.id} value={category.id}>{category.name}</option>
    ));
  }

  render() {
    return this.props.isLoading ? (<Loader />) : (
      <div>
        <Tile>
          <Select
            ref={(categorySelector) => { this.categorySelector = categorySelector; }}
            onChange={this.setCategoryId}
          >
            {this.renderOptions()}
          </Select>
          <Button onClick={this.setRangeLastMonth}>Last Month</Button>
          <Button onClick={this.setRangeThisMonth}>This Month</Button>
          <Button onClick={this.setRangePreviousMonth}>Previous Month</Button>
        </Tile>
        <CategoriesOverview
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          categoryId={this.state.categoryId}
        />
      </div>
    );
  }
}
CategoriesSection.propTypes = {
  categories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const qCategoriesForBudget = gql`
query qDashboard(
  $auth0UserId: String!,
){
  allCategories(
    filter: {
      user: {
        auth0UserId: $auth0UserId
      }
    }
  ){
    id
    name
  }
}
`;

function getProfile() {
  // Retrieves the profile data from local storage
  const profile = localStorage.getItem('profile');
  return profile ? JSON.parse(localStorage.profile) : {};
}

const CategoriesForBudget = graphql(qCategoriesForBudget, {

  options(props) {
    const auth0UserId = getProfile().user_id;
    return {
      variables: {
        auth0UserId,
      },
    };
  },

  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  props: ({ ownProps, data: { loading, allCategories, refetch } }) => ({
    ownProps,
    isLoading: loading,
    categories: allCategories || [],
    refetch,
  }),
})(CategoriesSection);

export default CategoriesForBudget;
