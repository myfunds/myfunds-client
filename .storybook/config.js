import React from 'react';
import { configure, setAddon, addDecorator } from '@kadira/storybook';
// import infoAddon from '@kadira/react-storybook-addon-info';

addDecorator((story) => (
  <div style={{ padding: 20 }}>
    {story()}
  </div>
));

function loadStories() {
  require(`../app/ui/components/LineItem/LineItem.story.js`);
}

configure(loadStories, module);
