// @flow
import React from 'react';
import { Button } from 'reactstrap';

import { storageKey, annotationStore } from '../config'; // TODO: provide via props
import AnnotationPropertyList from './AnnotationPropertyList.jsx';
import {
  AnnotationList,
  withBlockchainAnnotations,
} from './AnnotationList.jsx';
import { AddAnnotationContainer } from './AddAnnotationModal.jsx';

import type { AnnotationPropertyHash } from '../types';

type StorageTabProps = {
  onTriggerClearStorage: () => void,
  ontologyAnnotationProperties: Array<{
    hash: AnnotationPropertyHash,
    value: string,
  }>,
  ontologyAnnotations: Array<any>, // TODO
  onSubmitAnnotation: any => void,
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

  render() {
    const { web3 } = window;
    const BlockchainAnnotationList = withBlockchainAnnotations(
      AnnotationList,
      annotationStore,
    );
    return (
      <div>
        <Button id="clear-storage-button" onClick={this.handleClearStoragClick}>
          Clear storage
        </Button>
        <div style={{ marginLeft: '80px', marginRight: '80px' }}>
          <h4>AnnotationProperties</h4>
          <AnnotationPropertyList
            annotationProperties={this.props.ontologyAnnotationProperties}
          />
        </div>
        <div
          style={{ marginTop: '80px', marginLeft: '80px', marginRight: '80px' }}
        >
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
        </div>
      </div>
    );
  }
}
