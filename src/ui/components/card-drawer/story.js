import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import CardAndDrawer from './card-drawer';

const flexTest = {
  marginBottom: '1em',
  padding: '1em',
  minHeight: '1em',
  backgroundColor: '#0069FF',
  color: 'white',
  borderRadius: '2px',
};

const flexTestNested = {
  ...flexTest,
  backgroundColor: 'rgba(0, 105, 255, 0.5)',
  boxShadow: '0px 6px 18px 0px #40408c',
};

const FlexTestDiv = ({ children }) => <div style={flexTest}>{children}</div>;
const FlexTestNestedDiv = ({ children }) => <div style={flexTestNested}>{children}</div>;

storiesOf('Card and Drawer', module)
  .add('simple basic usage',
    () => (
      <CardAndDrawer
        title={'test'}
        titleIcon={'home'}
        subtitle={'sub test'}
        subtitleIcon={'usd'}
        focusText={'focus test'}
        focusTextIcon={null}
        collectionType={'test'}
        doc={'test'}
        urlHandle={'test'}
        hideDrawer={null}
        refetch={'test'}
        financialAccounts={'test'}
        categories={'test'}
      />
    )
  );
