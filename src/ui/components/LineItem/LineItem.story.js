import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import LineItem from '../LineItem';


storiesOf('Line and Item', module)
  .add('simple basic usage',
    () => (
      <LineItem
        title={'test'}
        titleIcon={'usd'}
        subtitle={'sub test'}
        subtitleIcon={'usd'}
        focusText={'focus test'}
        focusTextIcon={'usd'}
        onEdit={() => {
          if (confirm('Press OK to Edit. This can be undone.') === true) {
            console.warn('Edit happened');
          }
        }}
        onDelete={() => {
          if (confirm('Press OK to Delete. This cannot be undone.') === true) {
            console.warn('Delete happened');
          }
        }}
      />
    )
  );
