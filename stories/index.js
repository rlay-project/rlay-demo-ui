import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Web3Provider } from 'react-web3';

import StorageTab from '../src/components/StorageTab.jsx';
import Welcome from './Welcome';

import config from '../src/config.js';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Tabs/StorageTab', module)
  .add('default', () => (<StorageTab onTriggerClearStorage={action('clear-storage-triggered')}/>));
