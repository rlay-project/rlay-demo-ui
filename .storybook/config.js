/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure } from '@storybook/react';

const req = require.context('../src/components', true, /\.stories\.jsx?$/)

function loadStories() {
  require('../stories');
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
