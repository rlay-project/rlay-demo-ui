import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Web3Provider } from 'react-web3';

import { Individual } from '../classes';
import { IndividualList } from './IndividualList.jsx';
import config from '../config.js';

storiesOf('IndividualList', module)
  .add('empty', () => {
    const individuals = [];
    return (
      <div style={{ margin: '40px' }}>
        <IndividualList individuals={individuals} />
      </div>
    );
  })
  .add('two items', () => {
    const individuals = [
      new Individual({
        cachedCid: 'placeholderCid1',
        annotations: ['z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR'],
        class_assertions: [
          'z4mSmMHWVAgzSf4k7BRbJv7p5BWMEjUdw1WftgC74in2LUqnCPq',
        ],
        negative_class_assertions: [],
      }),
      new Individual({
        cachedCid: 'placeholderCid2',
        annotations: ['z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR'],
        class_assertions: [],
        negative_class_assertions: [
          'z4mSmMHWVAgzSf4k7BRbJv7p5BWMEjUdw1WftgC74in2LUqnCPq',
        ],
      }),
    ];
    return (
      <div style={{ margin: '40px' }}>
        <IndividualList individuals={individuals} />
      </div>
    );
  });
