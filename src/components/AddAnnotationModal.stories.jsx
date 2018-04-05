import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { AddAnnotationForm, AddAnnotationContainer } from './AddAnnotationModal.jsx';

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
