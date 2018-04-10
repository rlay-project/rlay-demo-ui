// @flow
import React, { type ComponentType } from 'react';
import truffleContract from 'truffle-contract';
import { Button } from 'reactstrap';
import { isEmpty } from 'lodash-es';

import { Annotation } from '../classes';

import type { ContractConfig } from '../types';

type BlockchainAnnotation = {
  isAvailable: boolean,
};

type CheckedAnnotation = Annotation & BlockchainAnnotation;

type AnnotationListProps = {
  annotations: Array<CheckedAnnotation>,
  onSubmitAnnotation: Annotation => void,
};

class AnnotationList extends React.Component<AnnotationListProps> {
  handleUploadClick = (item: CheckedAnnotation) => {
    this.props.onSubmitAnnotation(item);
  };

  renderItem = (item: CheckedAnnotation) => {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
        {!item.isAvailable ? (
          <span style={{ position: 'relative', marginLeft: '-80px' }}>
            <Button
              color="primary"
              onClick={() => this.handleUploadClick(item)}
            >
              ⬆
            </Button>
          </span>
        ) : null}
        <span style={{ minWidth: '20px' }}>
          {item.isAvailable ? (
            <span
              role="img"
              title="Stored on blockchain"
              aria-label="Stored on blockchain"
            >
              🌐
            </span>
          ) : null}
        </span>
        <span>
          <code>{((item.cid(): any): string)}</code>
        </span>
        <span>
          <code>{((item.property: any): string)}</code>
        </span>
        <span>{item.value}</span>
      </li>
    );
  };

  renderPlaceholder() {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-around',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
        No Annotations added yet.
      </li>
    );
  }

  render() {
    const { annotations } = this.props;

    return (
      <ul className="list-group">
        {!isEmpty(annotations)
          ? annotations.map(this.renderItem)
          : this.renderPlaceholder()}
      </ul>
    );
  }
}

const withBlockchainAnnotations = (
  WrappedComponent: ComponentType<any>,
  contractConfig: ContractConfig,
): ComponentType<any> => {
  type WrapperProps = {
    annotations: any, // TODO
    web3: any, // TODO
  };

  type WrapperState = {
    annotationExists: Object,
    networkAnnotations: Array<any>,
  };

  return class extends React.Component<WrapperProps, WrapperState> {
    state = {
      annotationExists: {},
      networkAnnotations: [],
    };

    componentDidMount() {
      const { web3 } = this.props;
      const provider = web3.currentProvider; // eslint-disable-line

      const StorageContract = truffleContract(contractConfig.abi);
      const contractAddress = contractConfig.address;
      StorageContract.setProvider(provider);
      const contract = StorageContract.at(contractAddress);

      contract.then(ctr => {
        Annotation.getAllStored(ctr, web3).then(annCids => {
          annCids.forEach(annCid =>
            this.retrieveAnnotation(ctr, (annCid: any)),
          );
        });

        this.props.annotations.forEach(ann => {
          this.updateAnnotation(ctr, ann);
        });
      });
    }

    retrieveAnnotation = (ctr: any, annCidBytes: String) => {
      Annotation.retrieve(ctr, annCidBytes).then(annotation => {
        this.setState({
          networkAnnotations: [...this.state.networkAnnotations, annotation],
          annotationExists: {
            ...this.state.annotationExists,
            // $FlowFixMe
            [annotation.cid()]: true,
          },
        });
      });
    };

    updateAnnotation = (ctr: any, ann: Annotation) => {
      ann.isStored(ctr).then(exists => {
        this.setState({
          annotationExists: {
            ...this.state.annotationExists,
            // $FlowFixMe
            [ann.cid()]: exists[0] !== '0x',
          },
        });
      });
    };

    handleSubmitAnnotation = (item: Annotation) => {
      const { web3 } = this.props;
      const provider = web3.currentProvider; // eslint-disable-line

      const StorageContract = truffleContract(contractConfig.abi);
      StorageContract.defaults({
        from: web3.eth.accounts[0],
      });
      const contractAddress = contractConfig.address;
      StorageContract.setProvider(provider);
      const contract = StorageContract.at(contractAddress);

      contract.then(ctr => {
        item
          .store(ctr)
          .then(() => {
            this.updateAnnotation(ctr, item);
          })
          .catch(err => {
            console.error(err);
          });
      });
    };

    render() {
      const annotations = [
        ...this.props.annotations,
        ...this.state.networkAnnotations,
      ];
      const checkedAnnotations = annotations.map(ann => {
        const checkedAnn = ann.clone();
        checkedAnn.isAvailable = this.state.annotationExists[checkedAnn.cid()];
        return checkedAnn;
      });

      return (
        <WrappedComponent
          {...this.props}
          annotations={checkedAnnotations}
          onSubmitAnnotation={this.handleSubmitAnnotation}
        />
      );
    }
  };
};

module.exports = {
  AnnotationList,
  withBlockchainAnnotations,
};
