import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  Bar,
  Line,
} from 'recharts';

import FinancialHelpers from '../../../utils/helpers/financial-hepers.js';
import Loader from '../../components/loader/loader.jsx';

class CategoriesOverview extends Component {
  renderGraph(category) {
    let average = 0;
    let rollingTotal = 0;
    const data = this.props.budgets.map((budget, index) => {
      const budgetCategory = budget.categories.find(c => c.name === category);
      const month = budget.month;
      const balance = budgetCategory.currentBalance >= 0 ?
        FinancialHelpers.getConvertToAmount(budgetCategory.currentBalance) :
        FinancialHelpers.getConvertToAmount(-(budgetCategory.currentBalance));
      rollingTotal += FinancialHelpers.getConvertToAmount(balance);
      average = FinancialHelpers.getConvertToAmount(
        rollingTotal / (index + 1)
      );
      const goal = FinancialHelpers.getConvertToAmount(budgetCategory.max);
      const values = {
        month,
        balance,
        average,
        goal,
      };
      return values;
    });
    // balances.unshift(['Month', 'Spent', 'Average', 'Goal']);
    return (
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart
          width={600}
          height={400}
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar dataKey="balance" barSize={20} fill="#413ea0" />
          <Area type="monotone" dataKey="goal" fill="#8884d8" stroke="#8884d8" />
          <Line type="monotone" dataKey="average" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
  render() {
    return (
      <div className="page">
        <div className="container">
          {
            this.props.isLoading ? (<Loader />) : (
              <div>
                {
                  this.props.groups.map(g => (
                    <div key={g}>
                      <h4 className="text-xs-center">
                        {g.toUpperCase()}
                      </h4>
                      {this.renderGraph(g)}
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

CategoriesOverview.propTypes = {
  groups: React.PropTypes.array.isRequired,
  budgets: React.PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const qBudgets = gql`
query qBudgets {
  budgets: getAllBudgets {
    route
    name
    month
    year
    startDate
    endDate
    userId
    categories{
      name
      max
      currentBalance
      userId
    }
  }
}
`;

const CategoriesOverviewAllBudgets = graphql(qBudgets, {
  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  props: ({ ownProps, data: { loading, budgets, refetch } }) => ({
    ownProps,
    isLoading: loading,
    budgets: budgets || [],
    groups: (
      budgets &&
      budgets[0] &&
      budgets[0].categories &&
      budgets[0].categories.map(c => c.name)
    ) || [],
    year: ownProps.params.year,
    month: ownProps.params.month,
    refetch,
  }),
})(CategoriesOverview);

export default CategoriesOverviewAllBudgets;
