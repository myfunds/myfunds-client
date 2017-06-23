import React from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
// import infoAddon from '@kadira/react-storybook-addon-info';

addDecorator((story) => (
  <div style={{ padding: 20 }}>
    {story()}
  </div>
));

function loadStories() {
  require('../src/ui/components/LineItem/LineItem.story.js');
}

configure(loadStories, module);
