import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
} from 'recharts';

export function getCategoryIcon(name) {
  let icon = '';
  switch (name) {
    case 'auto':
      icon = '&#xf1b9;';
      break;
    case 'entertainment':
      icon = '&#xf26c;';
      break;
    case 'food':
      icon = '&#xf0f5';
      break;
    case 'home':
      icon = '&#xf015;';
      break;
    case 'income':
      icon = '&#xf0d6;';
      break;
    case 'interest':
      icon = '&#xf09d;';
      break;
    case 'medical':
      icon = '&#xf0fa;';
      break;
    case 'personal':
      icon = '&#xf007;';
      break;
    case 'travel':
      icon = '&#xf072;';
      break;
    case 'utilities':
      icon = '&#xf021;';
      break;
    default:
      icon = 'name';
  }
  return icon;
}
function CustomizedAxisTick({ x = 0, y = 0, payload }) {
  return (
    <g
      transform={`translate(${x},${y})`}
    >
      <text
        x={0}
        y={0}
        dx={10}
        dy={20}
        textAnchor="end"
        fill="#666"
        style={{
          fontSize: 20,
          fontFamily: 'FontAwesome',
        }}
        dangerouslySetInnerHTML={{ __html: getCategoryIcon(payload.value) }}
      />
    </g>
  );
}
CustomizedAxisTick.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  payload: PropTypes.string.isRequired,
};
function getFill(overSpent, percentSpent) {
  if (overSpent) return '#858585';
  if (percentSpent > 74) return '#FFDD30';
  return '#30dd50';
}
export default class MonthsSpending extends Component {
  render() {
    // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const data = this.props.categories.map(({
      name,
      max,
      currentBalance,
    }) => {
      const posBalance = Math.abs(currentBalance);
      const parsedMax = parseInt(max, 10);
      const hasMoneyLeft = posBalance < parsedMax;
      let percentSpent = 0;
      let percentNotSpent = 0;
      let overSpent = false;
      if (name.length > 9) {
        // name = name.substr(0,4) + '...';
      }
      if (hasMoneyLeft) {
        percentSpent = Math.ceil((posBalance / parsedMax) * 100);
        percentNotSpent = Math.ceil(((parsedMax - posBalance) / parsedMax) * 100);
      } else {
        overSpent = true;
        percentSpent = Math.ceil((parsedMax / posBalance) * 100);
        percentNotSpent = Math.ceil(((posBalance - parsedMax) / posBalance) * 100);
      }
      const values = {
        name,
        percentSpent,
        percentNotSpent,
        overSpent,
      };
      return values;
    });
    return (
      <div className="row">
        <div className="col-xs-12">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 5, left: 5, bottom: 5 }}

            >
              <XAxis
                dataKey="name"
                height={70}
                tick={<CustomizedAxisTick />}
                interval={0}
              />
              <Tooltip
                active
              />
              <Bar dataKey="percentNotSpent" stackId="a" >
                {
                  data.map((entry) =>
                    <Cell
                      key={entry.name}
                      fill={entry.overSpent ? '#da2b2b' : '#d2d2d2'}
                    />)
                }
              </Bar>
              <Bar dataKey="percentSpent" stackId="a" >
                {data.map(({ name, overSpent, percentSpent }) => (
                  <Cell
                    key={name}
                    fill={getFill(overSpent, percentSpent)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
MonthsSpending.propTypes = {
  categories: PropTypes.array.isRequired,
};
