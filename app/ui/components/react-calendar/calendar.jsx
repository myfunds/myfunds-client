import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Week from './week.jsx';
import DayNames from './dayNames.jsx';

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.select = this.select.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.state = {
      month: this.props.selected.clone(),
      selected: this.props.selected,
    };
  }
  getSelectedDate() {
    return this.state.selected;
  }
  previous() {
    const month = this.state.month;
    month.add(-1, 'M');
    this.setState({ month });
  }
  next() {
    const month = this.state.month;
    month.add(1, 'M');
    this.setState({ month });
  }
  select(date) {
    this.setState({
      selected: date,
    });
    this.props.getSelectedDate(date);
  }
  renderWeeks() {
    const weeks = [];
    let done = false;
    const date = this.state.month.clone().startOf('month').add('w' - 1).day('Sunday');
    let monthIndex = date.month();
    let count = 0;
    while (!done) {
      weeks.push(
        <Week
          key={date.toString()}
          date={date.clone()}
          month={this.state.month}
          select={this.select}
          selected={this.state.selected}
        />
      );
      date.add(1, 'w');
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
    return weeks;
  }
  renderMonthLabel() {
    return (
      <span>
        {this.state.month.format('MMMM, YYYY')}
      </span>
    );
  }
  render() {
    return (
      <div
        className={`calendar-container ${this.props.shouldShow ? 'showCal' : 'hideCal'}`}
        style={this.props.isAbsolute ? { position: 'absolute' } : {}}
      >
        <div className="animated fadeInDown calendar">
          <div className="header">
            <i className="fa fa-angle-left" onClick={this.previous} />
            {this.renderMonthLabel()}
            <i className="fa fa-angle-right" onClick={this.next} />
          </div>
          <DayNames />
          {this.renderWeeks()}
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  shouldShow: PropTypes.bool.isRequired,
  getSelectedDate: PropTypes.func.isRequired,
  selected: PropTypes.object.isRequired,
  isAbsolute: PropTypes.object,
};

Calendar.defaultProps = {
  isAbsolute: false,
};
