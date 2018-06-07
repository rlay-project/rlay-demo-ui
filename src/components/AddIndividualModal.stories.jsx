import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {
  AddIndividualForm,
  AddIndividualContainer,
} from './AddIndividualModal.jsx';
import { Annotation, Class } from '../classes';
import { withBayModuleOntology } from '../test_helpers';

const ontologyAnnotationsEx1 = [
  new Annotation({
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'Organization',
  }),
  new Annotation({
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'Company',
  }),
  new Annotation({
    property: 'zW1fiG75n55P1ix184atgmWHu6FhgKzQqtdiA1wQcnPhPSL',
    value: 'A legal entity formed from a group of people',
  }),
];
const ontologyClassesEx1 = [
  new Class({
    annotations: ['z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR'],
  }),
];

storiesOf('AddIndividualForm', module).add('default', () => {
  const WrappedAddIndividualForm = withBayModuleOntology(
    AddIndividualForm,
    Rust.rlay_ontology_stdweb,
  );

  return (
    <div style={{ margin: '40px' }}>
      <WrappedAddIndividualForm
        ontologyAnnotations={ontologyAnnotationsEx1}
        ontologyClasses={ontologyClassesEx1}
        onIndividualChange={action('individual-change')}
      />
    </div>
  );
});

storiesOf('AddIndividualContainer', module).add('default', () => {
  const WrappedAddIndividualForm = withBayModuleOntology(
    AddIndividualContainer,
    Rust.rlay_ontology_stdweb,
  );

  return (
    <div style={{ margin: '40px' }}>
      <WrappedAddIndividualForm
        ontologyAnnotations={ontologyAnnotationsEx1}
        ontologyClasses={ontologyClassesEx1}
        onSubmit={action('submit')}
      />
    </div>
  );
});
