// @flow
import React, { Fragment } from 'react';
import { Button } from 'reactstrap';

import { annotationStore } from '../config'; // TODO: provide via props
import AnnotationPropertyList from './AnnotationPropertyList.jsx';
import {
  AnnotationList,
  withBlockchainAnnotations,
} from './AnnotationList.jsx';
import { AddAnnotationContainer } from './AddAnnotationModal.jsx';
import { AddClassContainer } from './AddClassModal.jsx';
import { Annotation, Class as Klass } from '../classes';

import type { AnnotationPropertyHash } from '../types';

type StorageTabProps = {
  onTriggerClearStorage: () => void,
  ontologyAnnotationProperties: Array<{
    hash: AnnotationPropertyHash,
    value: string,
  }>,
  ontologyAnnotations: Array<Annotation>,
  ontologyClasses: Array<Klass>,
  onSubmitAnnotation: Annotation => void,
  onSubmitClass: Klass => void,
};

export default class StorageTab extends React.Component<StorageTabProps> {
  static defaultProps = {
    onTriggerClearStorage: () => {},
    ontologyAnnotationProperties: [],
    ontologyAnnotations: [],
    onSubmitAnnotation: () => {},
  };

  handleClearStoragClick = () => {
    this.props.onTriggerClearStorage();
  };

  renderAnnotationPropertiesBlock = () => {
    const { web3 } = window; // eslint-disable-line
    return (
      <Fragment>
        <h4>AnnotationProperties</h4>
        <AnnotationPropertyList
          annotationProperties={this.props.ontologyAnnotationProperties}
        />
      </Fragment>
    );
  };

  renderAnnotationBlock = () => {
    const { web3 } = window;
    const BlockchainAnnotationList = withBlockchainAnnotations(
      AnnotationList,
      annotationStore,
    );

    return (
      <Fragment>
        <h4>Annotations</h4>
        <BlockchainAnnotationList
          annotations={this.props.ontologyAnnotations}
          web3={web3}
        />
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <AddAnnotationContainer
            ontologyAnnotationProperties={
              this.props.ontologyAnnotationProperties
            }
            onSubmit={this.props.onSubmitAnnotation}
          />
        </div>
      </Fragment>
    );
  };

  renderClassesBlock = () => {
    const { web3 } = window; // eslint-disable-line
    return (
      <Fragment>
        <h4>Classes</h4>
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <AddClassContainer
            ontologyAnnotations={this.props.ontologyAnnotations}
            ontologyClasses={this.props.ontologyClasses}
            onSubmit={this.props.onSubmitClass}
          />
        </div>
      </Fragment>
    );
  };

  render() {
    return (
      <div>
        <Button id="clear-storage-button" onClick={this.handleClearStoragClick}>
          Clear storage
        </Button>
        <div style={{ marginLeft: '80px', marginRight: '80px' }} />
        {this.renderAnnotationPropertiesBlock()}
        <div
          style={{ marginTop: '80px', marginLeft: '80px', marginRight: '80px' }}
        >
          {this.renderAnnotationBlock()}
        </div>
        <div
          style={{ marginTop: '80px', marginLeft: '80px', marginRight: '80px' }}
        >
          {this.renderClassesBlock()}
        </div>
      </div>
    );
  }
}
