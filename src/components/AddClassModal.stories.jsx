import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { AddClassForm, AddClassContainer } from './AddClassModal.jsx';
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

storiesOf('AddClassForm', module).add('default', () => {
  const WrappedAddClassForm = withBayModuleOntology(
    AddClassForm,
    Rust.rlay_ontology_stdweb,
  );

  return (
    <div style={{ margin: '40px' }}>
      <WrappedAddClassForm
        ontologyAnnotations={ontologyAnnotationsEx1}
        ontologyClasses={ontologyClassesEx1}
        onClassChange={action('class-change')}
      />
    </div>
  );
});

storiesOf('AddClassContainer', module).add('default', () => {
  const WrappedAddClassForm = withBayModuleOntology(
    AddClassContainer,
    Rust.rlay_ontology_stdweb,
  );

  return (
    <div style={{ margin: '40px' }}>
      <WrappedAddClassForm
        ontologyAnnotations={ontologyAnnotationsEx1}
        ontologyClasses={ontologyClassesEx1}
        onSubmit={action('submit')}
      />
    </div>
  );
});
