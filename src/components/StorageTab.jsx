// @flow
import React, { Fragment } from 'react';
import { Button } from 'reactstrap';

import AnnotationPropertyList from './AnnotationPropertyList.jsx';
import { AnnotationList } from './AnnotationList.jsx';
import { ClassList } from './ClassList.jsx';
import { AddAnnotationContainer } from './AddAnnotationModal.jsx';
import { AddClassContainer } from './AddClassModal.jsx';
import { Annotation, Class as Klass } from '../classes';

import type { BlockchainAnnotation } from '../classes';
import type { AnnotationPropertyHash } from '../types';

type StorageTabProps = {
  onTriggerClearStorage: () => void,
  ontologyAnnotationProperties: Array<{
    hash: AnnotationPropertyHash,
    value: string,
  }>,
  onSubmitAnnotation: Annotation => void,
  onSubmitClass: Klass => void,
  onUploadAnnotation: Annotation => void,
  onUploadClass: Klass => void,
  ontologyAnnotations: Array<BlockchainAnnotation>,
  ontologyClasses: Array<Klass>,
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
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <AnnotationPropertyList
            annotationProperties={this.props.ontologyAnnotationProperties}
          />
        </div>
      </Fragment>
    );
  };

  renderAnnotationBlock = () => (
    <Fragment>
      <h4>Annotations</h4>
      <AnnotationList
        annotations={this.props.ontologyAnnotations}
        onUploadAnnotation={this.props.onUploadAnnotation}
      />
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <AddAnnotationContainer
          ontologyAnnotationProperties={this.props.ontologyAnnotationProperties}
          onSubmit={this.props.onSubmitAnnotation}
        />
      </div>
    </Fragment>
  );

  renderClassesBlock = () => {
    const { web3 } = window; // eslint-disable-line

    return (
      <Fragment>
        <h4>Classes</h4>
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <ClassList
            classes={this.props.ontologyClasses}
            onUploadClass={this.props.onUploadClass}
          />
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <AddClassContainer
              ontologyAnnotations={this.props.ontologyAnnotations}
              ontologyClasses={this.props.ontologyClasses}
              onSubmit={this.props.onSubmitClass}
            />
          </div>
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
        <div style={{ marginLeft: '80px', marginRight: '80px' }}>
          {this.renderAnnotationPropertiesBlock()}
        </div>
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
