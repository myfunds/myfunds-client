import React, { Component, PropTypes } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import FinancialHelpers from '../../../utils/helpers/financial-hepers.js';

export default class NetWorth extends Component {
  getAmount(type) {
    let amount = 0;
    if (this.props.financialAccounts.length) {
      this.props.financialAccounts.forEach((fa) => {
        amount += fa.type === type ? fa.currentBalance : 0;
      });
    }
    return amount;
  }
  getFormattedAmount(type) {
    const amount = this.getAmount(type);
    return parseFloat(FinancialHelpers.currencyFormatted(amount));
  }
  getNetworth() {
    return FinancialHelpers.currencyFormatted(this.getAmount('cash') - this.getAmount('debt'));
  }
  render() {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const data = [{
      name: 'Cash',
      value: this.getFormattedAmount('cash'),
    }, {
      name: 'Debt',
      value: this.getFormattedAmount('debt'),
    }];
    return (
      <div className="row">
        <div className="col-xs-4">
          <h3>Net Worth</h3>
          <div className="pull-right" style={{ color: COLORS[0] }}>
            <i className="fa fa-usd" aria-hidden="true" /> {data[0].value}
          </div>
          <div className="pull-right" style={{ color: COLORS[1] }}>
            <i className="fa fa-usd" aria-hidden="true" /> -{data[1].value}
          </div>
          <div className="pull-right">
            <i className="fa fa-usd" aria-hidden="true" /> {this.getNetworth()}
          </div>
        </div>
        <div className="col-xs-8">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Pie
                isAnimationActive
                data={data}
                outerRadius={60}
                innerRadius={40}
                fill="#8884d8"
              >
                {
                  data.map((entry, index) =>
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />)
                }
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
NetWorth.propTypes = {
  financialAccounts: PropTypes.array.isRequired,
};
