import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Web3Provider } from 'react-web3';

import { AnnotationList, withBlockchainAnnotations } from './AnnotationList.jsx';
import config from '../config.js';

storiesOf('AnnotationList', module)
  .add('empty', () => {
    const annotations = [];
    return (
      <div style={{ margin: '40px' }}>
        <AnnotationList annotations={annotations}/>
      </div>
    );
  })
  .add('one item', () => {
    const annotations = [
      {
        cid: 'z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR',
        property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
        value: 'Organization',
      },
    ];
    return (
      <div style={{ margin: '40px' }}>
        <AnnotationList annotations={annotations}/>
      </div>
    );
  })
  .add('one item (with blockchain)', () => {
    const annotations = [
      {
        cid: 'z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR',
        property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
        value: 'Organization',
      },
    ];
    const contractConfig = config.annotationStore;
    const WrappedComponent = withBlockchainAnnotations(AnnotationList, contractConfig);
    return (
        <div style={{ margin: '80px' }}>
          <Web3Provider>
            <WrappedComponent
              annotations={annotations}
              web3={window.web3}
            />
          </Web3Provider>
        </div>
    );
  });
