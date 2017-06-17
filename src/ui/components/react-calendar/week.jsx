import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import { Day } from './dayNames';

const borderColour = '#CCC';
const secondaryColour = '#2875C7';

const WeekDiv = glamorous.div({
  float: 'left',
  width: '100%',
  borderTop: `solid 1px ${borderColour}`,

  '&:first-child': {
    borderTop: 'none',
  },

  '&.names>span': {
    color: `${secondaryColour}`,
    fontWeight: 'bold',
  },
});


const Week = (props) => {
  const days = [];
  let date = props.date;
  const month = props.month;

  for (let i = 0; i < 7; i++) {
    const day = {
      name: date.format('dd').substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), 'day'),
      date,
    };
    days.push(
      <Day
        key={day.date.toString()}
        className={`day${day.isToday ? ' today' : ''}${day.isCurrentMonth ? '' : ' different-month'}${day.date.isSame(props.selected) ? ' selected' : ''}`}
        onClick={props.select.bind(null, day.date)}
      >
        {day.number}
      </Day>
    );
    date = date.clone();
    date.add(1, 'd');
  }
  return (
    <WeekDiv key={days[0].toString()}>
      {days}
    </WeekDiv>
  );
};

Week.propTypes = {
  date: PropTypes.object.isRequired,
  month: PropTypes.object.isRequired,
  selected: PropTypes.object.isRequired,
  select: PropTypes.object.isRequired,
};

export default Week;
