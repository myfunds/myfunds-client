import React, { PropTypes } from 'react';

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
      <span
        key={day.date.toString()}
        className={`day${day.isToday ? ' today' : ''}${day.isCurrentMonth ? '' : ' different-month'}${day.date.isSame(props.selected) ? ' selected' : ''}`}
        onClick={props.select.bind(null, day.date)}
      >
        {day.number}
      </span>
    );
    date = date.clone();
    date.add(1, 'd');
  }
  return (
    <div className="week" key={days[0].toString()}>
      {days}
    </div>
  );
};

Week.propTypes = {
  date: PropTypes.object.isRequired,
  month: PropTypes.object.isRequired,
  selected: PropTypes.object.isRequired,
  select: PropTypes.object.isRequired,
};

export default Week;
