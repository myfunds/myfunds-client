import React from 'react';
import { css } from 'glamor';
import glamorous from 'glamorous';

const Spinner = glamorous.div({
  margin: '100px auto',
  width: '50px',
  height: '40px',
  textAlign: 'center',
  fontSize: '10px',
});

const bounce = css.keyframes({
  '0%, 40%, 100%': { transform: 'scaleY(0.4)' },
  '20%': { transform: 'scaleY(1.0)' }
});

const rectStyles = {
  backgroundColor: '#333',
  height: '100%',
  width: '6px',
  display: 'inline-block',
  animation: `${bounce} 1.2s infinite ease-in-out`,
};

const Rect1 = glamorous.div({
  ...rectStyles
});
const Rect2 = glamorous.div({
  ...rectStyles,
  animationDelay: '-1.1s',
});
const Rect3 = glamorous.div({
  ...rectStyles,
  animationDelay: '-1.0s',
});
const Rect4 = glamorous.div({
  ...rectStyles,
  animationDelay: '-0.9s',
});
const Rect5 = glamorous.div({
  ...rectStyles,
  animationDelay: '-0.8s',
});

export default function Loader() {
  return (
    <Spinner>
      <Rect1 />
      <Rect2 />
      <Rect3 />
      <Rect4 />
      <Rect5 />
    </Spinner>
  );
}
