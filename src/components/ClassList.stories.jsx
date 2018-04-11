import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Web3Provider } from 'react-web3';

import { Class as Klass } from '../classes';
import { ClassList, withBlockchainAnnotations } from './ClassList.jsx';
import config from '../config.js';

storiesOf('ClassList', module)
  .add('empty', () => {
    const classes = [];
    return (
      <div style={{ margin: '40px' }}>
        <ClassList classes={classes} />
      </div>
    );
  })
  .add('one item', () => {
    const classes = [
      new Klass({
        cachedCid: 'z4mSmMHWVAgzSf4k7BRbJv7p5BWMEjUdw1WftgC74in2LUqnCPq',
        annotations: [
          'z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR',
          'z4mSmMHXtZo9eoaefvMm6pGgtAAuQE7QGMevnDATnnWrupEbvms',
        ],
        sub_class_of_class: [],
      }),
    ];
    return (
      <div style={{ margin: '40px' }}>
        <ClassList classes={classes} />
      </div>
    );
  })
  .add('two items', () => {
    const classes = [
      new Klass({
        cachedCid: 'z4mSmMHWVAgzSf4k7BRbJv7p5BWMEjUdw1WftgC74in2LUqnCPq',
        annotations: [
          'z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR',
          'z4mSmMHXtZo9eoaefvMm6pGgtAAuQE7QGMevnDATnnWrupEbvms',
        ],
        sub_class_of_class: [],
      }),
      new Klass({
        cachedCid: 'z4mSmMHazykqhBzBRmVLpL4Q1rwCiB8Db65Mq8iTZpVkU4jbhSg',
        annotations: ['z4mSmMHXtZo9eoaefvMm6pGgtAAuQE7QGMevnDATnnWrupEbvms'],
        sub_class_of_class: [],
      }),
      new Klass({
        cachedCid: 'z4mSmMHV19MDZ2y1VJf3GXoLZy3wFJbLapsu23gcjKfSLWwGUYA',
        annotations: ['z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR'],
        sub_class_of_class: [
          'z4mSmMHWVAgzSf4k7BRbJv7p5BWMEjUdw1WftgC74in2LUqnCPq',
          'z4mSmMHazykqhBzBRmVLpL4Q1rwCiB8Db65Mq8iTZpVkU4jbhSg',
        ],
      }),
    ];
    return (
      <div style={{ margin: '40px' }}>
        <ClassList classes={classes} />
      </div>
    );
  });
