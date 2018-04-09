import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Web3Provider } from 'react-web3';

import NetworkStatus from './NetworkStatus.jsx';

storiesOf('NetworkStatus', module).add('default', () => {
  return (
    <div style={{ margin: '40px' }}>
      <Web3Provider>
        <NetworkStatus web3={window.web3} />
      </Web3Provider>
    </div>
  );
});
