import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Web3Provider } from 'react-web3';

import AnnotationPropertyList from '../src/AnnotationPropertyList.jsx';
import NetworkStatus from '../src/NetworkStatus.jsx';
import StorageTab from '../src/StorageTab.jsx';
import Welcome from './Welcome';
import { AddAnnotationForm, AddAnnotationContainer } from '../src/AddAnnotationModal.jsx';
import { AnnotationList, withBlockchainAnnotations } from '../src/AnnotationList.jsx';

import config from '../src/config.js';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Tabs/StorageTab', module)
  .add('default', () => (<StorageTab onTriggerClearStorage={action('clear-storage-triggered')}/>));

storiesOf('AnnotationPropertyList', module)
  .add('empty', () => {
    const annotations = [];
    return (
      <div style={{ margin: '40px' }}>
        <AnnotationPropertyList annotations={annotations}/>
      </div>
    );
  })
  .add('two items', () => {
    const annotationProperties = [
      {
        hash: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
        value: 'http://www.w3.org/2000/01/rdf-schema#label',
      },
      {
        hash: 'zW1fiG75n55P1ix184atgmWHu6FhgKzQqtdiA1wQcnPhPSL',
        value: 'http://www.w3.org/2000/01/rdf-schema#comment',
      },
    ];
    return (
      <div style={{ margin: '40px' }}>
        <AnnotationPropertyList annotationProperties={annotationProperties}/>
      </div>
    );
  });

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
            <WrappedComponent annotations={annotations} />
          </Web3Provider>
        </div>
    );
  });

storiesOf('NetworkStatus', module)
  .add('default', () => {
    return (
      <div style={{ margin: '40px' }}>
        <Web3Provider>
          <NetworkStatus web3={window.web3} />
        </Web3Provider>
      </div>
    );
  });

storiesOf('AddAnnotationForm', module)
  .add('default', () => {
    const annotationProperties = [
      {
        hash: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
        value: 'http://www.w3.org/2000/01/rdf-schema#label',
      },
      {
        hash: 'zW1fiG75n55P1ix184atgmWHu6FhgKzQqtdiA1wQcnPhPSL',
        value: 'http://www.w3.org/2000/01/rdf-schema#comment',
      },
    ];

    return (
      <div style={{ margin: '40px' }}>
        <AddAnnotationForm
          ontologyAnnotationProperties={annotationProperties}
          onAnnotationChange={action('annotation-change')}
        />
      </div>
    );
  });

storiesOf('AddAnnotationContainer', module)
  .add('default', () => {
    const annotationProperties = [
      {
        hash: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
        value: 'http://www.w3.org/2000/01/rdf-schema#label',
      },
      {
        hash: 'zW1fiG75n55P1ix184atgmWHu6FhgKzQqtdiA1wQcnPhPSL',
        value: 'http://www.w3.org/2000/01/rdf-schema#comment',
      },
    ];

    return (
      <div style={{ margin: '40px' }}>
        <AddAnnotationContainer
          ontologyAnnotationProperties={annotationProperties}
          onSubmit={action('submit')}
        />
      </div>
    );
  });
