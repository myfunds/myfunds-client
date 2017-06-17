import React, { Component } from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Week from './week.jsx';
import DayNames from './dayNames.jsx';


const borderColour = '#CCC';
const secondaryColour = '#2875C7';
const spacing = '10px';
const iconWidth = '40px';
const headerHeight = '40px';

const CalendarContainer = glamorous.div({
  position: 'fixed',
  top: '0',
  bottom: '0',
  right: '0',
  left: '0',
  background: 'rgba(14, 40, 68, 0.61)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: '1s',
  zIndex: '9001',

  '&.showCal': {
      opacity: '1',
  },
  '&.hideCal': {
      opacity: '0',
      display: 'none',
  },
});

const CalendarDiv = glamorous.div({
  display: 'block',
  boxSizing: 'border-box',
  background: 'white',
  width: '100%',
  maxWidth: '300px',
  border: `solid 1px ${borderColour}`,
});

const CalendarHeader = glamorous.div({
  float: 'left',
  width: '100%',
  background: `${secondaryColour}`,
  height: `${headerHeight}`,
  color: 'white',

  '>*': {
      height:`${headerHeight}`,
      lineHeight:`${headerHeight} !important`,
      display: 'inline-block',
      verticalAlign: 'middle',
  },

  '>i': {
      float: 'left',
      width: `${iconWidth}`,
      fontSize: '1.125em',
      fontWeight: 'bold',
      position: 'relative',
      boxSizing: 'border-box',
      padding: `0 ${spacing}`,
      cursor: 'pointer',
  },

  '>i.fa-angle-left': {
      textAlign: 'left',
  },

  '>i.fa-angle-right': {
      textAlign:'right',
      marginLeft:`${iconWidth*-1}`,
  },

  '>span': {
      float:'left',
      width:'100%',
      fontWeight:'bold',
      textTransform:'uppercase',
      boxSizing:'border-box',
      paddingLeft:`${iconWidth+spacing}`,
      marginLeft:`${iconWidth*-1}`,
      textAlign:'center',
      paddingRight:`${iconWidth}`,
      color:'inherit',
  },
});

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
      <CalendarContainer
        className={`calendar-container ${this.props.shouldShow ? 'showCal' : 'hideCal'}`}
        style={this.props.isAbsolute ? { position: 'absolute' } : {}}
      >
        <CalendarDiv className="animated fadeInDown calendar">
          <CalendarHeader className="header">
            <i className="fa fa-angle-left" onClick={this.previous} />
            {this.renderMonthLabel()}
            <i className="fa fa-angle-right" onClick={this.next} />
          </CalendarHeader>
          <DayNames />
          {this.renderWeeks()}
        </CalendarDiv>
      </CalendarContainer>
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
