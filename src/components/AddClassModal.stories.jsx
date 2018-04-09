import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { AddClassForm, AddClassContainer } from './AddClassModal.jsx';
import { Annotation, Class } from '../classes';

const withBayModuleAnnotations = (WrappedComponent, bayModulePromise) => {
  return class extends React.Component {
    state = {
      loaded: false,
    };

    componentDidMount() {
      bayModulePromise.then(bayModule => {
        const ontologyAnnotations = this.props.ontologyAnnotations.map(
          n => new Annotation(n),
        );
        ontologyAnnotations.forEach(n => n.hash(bayModule));
        const ontologyClasses = this.props.ontologyClasses.map(
          n => new Class(n),
        );
        ontologyClasses.forEach(n => console.log('n', n) || n.hash(bayModule));

        this.setState({
          loaded: true,
          ontologyAnnotations,
          ontologyClasses,
        });
      });
    }

    render() {
      return this.state.loaded ? (
        <WrappedComponent
          {...this.props}
          ontologyAnnotations={this.state.ontologyAnnotations}
          ontologyClasses={this.state.ontologyClasses}
        />
      ) : (
        'Loading...'
      );
    }
  };
};

storiesOf('AddClassForm', module).add('default', () => {
  const ontologyAnnotations = [
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
  const ontologyClasses = [
    new Class({
      annotations: ['z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR'],
    }),
  ];
  const WrappedAddClassForm = withBayModuleAnnotations(
    AddClassForm,
    Rust.bay_web,
  );

  return (
    <div style={{ margin: '40px' }}>
      <WrappedAddClassForm
        ontologyAnnotations={ontologyAnnotations}
        ontologyClasses={ontologyClasses}
        onClassChange={action('class-change')}
      />
    </div>
  );
});
