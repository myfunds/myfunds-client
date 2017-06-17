import React from 'react';
import glamorous from 'glamorous';

const borderColour = '#CCC';
const secondaryColour = '#2875C7';
export const Day = glamorous.span({

  float: 'left',
  width: `${100/7}%`,

  boxSizing: 'border-box',

  borderLeft: `solid 1px ${borderColour}`,
  fontSize: '0.75em',
  textAlign: 'center',

  height: '30px',
  lineHeight: '30px !important',
  display: 'inline-block',
  verticalAlign: 'middle',

  background: 'white',
  cursor: 'pointer',
  color: 'black',

  '&: first-child': {
    borderLeft: 'none',
  },

  '&.today': {
    background: '#E3F2FF',
  },

  '&.different-month': {
    color: '#C0C0C0',
  },

  '&.selected': {
    background: `${secondaryColour}`,
    color: 'white',
  },

});

export default function DayNames() {
  return (
    <div className="week names">
      <Day>Sun</Day>
      <Day>Mon</Day>
      <Day>Tue</Day>
      <Day>Wed</Day>
      <Day>Thu</Day>
      <Day>Fri</Day>
      <Day>Sat</Day>
    </div>
  );
}
