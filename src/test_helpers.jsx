import React from 'react';
import { Annotation, Class } from './classes';

const withBayModuleOntology = (WrappedComponent, bayModulePromise) =>
  class extends React.Component {
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
        ontologyClasses.forEach(n => n.hash(bayModule));

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

module.exports = {
  withBayModuleOntology,
};
