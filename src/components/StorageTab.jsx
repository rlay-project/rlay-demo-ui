// @flow
import React, { Fragment } from 'react';
import { Button } from 'reactstrap';

import AnnotationPropertyList from './AnnotationPropertyList.jsx';
import RelatedAggregationsContainer, {
  type RelatedAggregations,
} from './RelatedAggregations.jsx';
import { AnnotationList } from './AnnotationList.jsx';
import { ClassList } from './ClassList.jsx';
import { IndividualList } from './IndividualList.jsx';
import { AddAnnotationContainer } from './AddAnnotationModal.jsx';
import { AddClassContainer } from './AddClassModal.jsx';
import { AddIndividualContainer } from './AddIndividualModal.jsx';
import TokenBalance from './TokenBalance.jsx';
import { Annotation, Class as Klass, Individual } from '../classes';

import type { BlockchainAnnotation } from '../classes';
import type { AnnotationPropertyHash, IndividualCid } from '../types';

type StorageTabProps = {
  onTriggerClearStorage: () => void,
  ontologyAnnotationProperties: Array<{
    hash: AnnotationPropertyHash,
    value: string,
  }>,
  onSubmitAnnotation: Annotation => void,
  onSubmitClass: Klass => void,
  onSubmitIndividual: Individual => void,
  onUploadAnnotation: Annotation => void,
  onUploadClass: Klass => void,
  onUploadIndividual: Individual => void,
  ontologyAnnotations: Array<BlockchainAnnotation>,
  ontologyClasses: Array<Klass>,
  ontologyIndividuals: Array<Individual>,
  tokenAccount: any,
  onSetAllowance: number => void,
  onAddWeight: (IndividualCid, number) => void,
  propositionGroups: Array<RelatedAggregations>,
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

  renderStatementsBlock = () => {
    const { web3 } = window; // eslint-disable-line

    return (
      <Fragment>
        <h4>Propositions</h4>
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <IndividualList
            individuals={this.props.ontologyIndividuals}
            onUploadIndividual={this.props.onUploadIndividual}
          />
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <AddIndividualContainer
              ontologyAnnotations={this.props.ontologyAnnotations}
              ontologyClasses={this.props.ontologyClasses}
              onSubmit={this.props.onSubmitIndividual}
            />
          </div>
        </div>
      </Fragment>
    );
  };

  renderAggregationResults = () => {
    const { web3 } = window; // eslint-disable-line

    return (
      <Fragment>
        <h4>Aggregation results:</h4>
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          {this.props.propositionGroups.map(propositionGroup => (
            <div className="border" style={{ padding: '20px' }}>
              <RelatedAggregationsContainer
                {...propositionGroup}
                onAddWeight={this.props.onAddWeight}
              />
            </div>
          ))}
        </div>
      </Fragment>
    );
  };

  renderTokenAccount = () => (
    <TokenBalance
      account={this.props.tokenAccount}
      onSetAllowance={this.props.onSetAllowance}
    />
  );

  render() {
    const containerStyle = {
      marginTop: '80px',
      marginLeft: '80px',
      marginRight: '80px',
    };
    return (
      <div>
        <Button
          id="clear-storage-button"
          style={{ display: 'none' }}
          onClick={this.handleClearStoragClick}
        >
          Clear storage
        </Button>
        <div style={containerStyle}>{this.renderTokenAccount()}</div>
        <div style={containerStyle}>{this.renderAggregationResults()}</div>
        <div style={containerStyle}>{this.renderStatementsBlock()}</div>
        <div style={containerStyle}>{this.renderClassesBlock()}</div>
        <div style={containerStyle}>{this.renderAnnotationBlock()}</div>
        <div style={containerStyle}>
          {this.renderAnnotationPropertiesBlock()}
        </div>
      </div>
    );
  }
}
