// @flow
import React from 'react';
import multibase from 'multibase';
import truffleContract from 'truffle-contract';
import { Button } from 'reactstrap';
import { isEmpty } from 'lodash-es';

import type { ComponentType } from 'react';
import type { RsAnnotation, AnnotationCid, ContractConfig } from './types';

type Annotation = RsAnnotation & {
  cid: AnnotationCid,
};

type CheckedAnnotation = Annotation & BlockchainAnnotation;

type BlockchainAnnotation = {
  isAvailable: boolean,
};

type AnnotationListProps = {
  annotations: Array<CheckedAnnotation>,
  onSubmitProposition: (Annotation) => void,
};

const b58ToSolidityBytes = (b58) => {
  const bytesCid = multibase.decode(b58);
  return `0x${multibase.encode('base16', bytesCid).toString().substring(1)}`;
};

class AnnotationList extends React.Component<AnnotationListProps> {
  handleUploadClick = (item: CheckedAnnotation) => {
    this.props.onSubmitProposition(item);
  }

  renderItem = (item: CheckedAnnotation) => {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
        {
          !item.isAvailable ? (
            <span style={{ position: 'relative', marginLeft: '-80px' }}>
              <Button color="primary" onClick={() => this.handleUploadClick(item)}>⬆</Button>
            </span>
          ) : null
        }
        <span style={{ minWidth: '20px' }}>
          { item.isAvailable ? '🌐' : null }
        </span>
        <span>
          <code>{ ((item.cid: any): string) }</code>
        </span>
        <span>
          <code>{ ((item.property: any): string) }</code>
        </span>
        <span>
          { item.value }
        </span>
      </li>
    );
  }

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
        {
          !isEmpty(annotations) ?
            annotations.map(this.renderItem)
            : this.renderPlaceholder()
        }
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
  };

  type WrapperState = {
    annotationExists: Object,
  };

  return class extends React.Component<WrapperProps, WrapperState> {
    state = {
      annotationExists: {},
    }

    componentDidMount() {
      const provider = window.web3.currentProvider; // eslint-disable-line

      const StorageContract = truffleContract(contractConfig.abi);
      const contractAddress = contractConfig.address;
      StorageContract.setProvider(provider);
      const contract = StorageContract.at(contractAddress);

      contract.then((ctr) => {
        this.props.annotations.forEach((ann) => {
          this.updateAnnotation(ctr, ann);
        });
      });
    }

    updateAnnotation = (ctr: any, ann: Annotation) => {
      const b58Cid = ann.cid;
      const ethCid = b58ToSolidityBytes(b58Cid);

      ctr.retrieveAnnotation.call(ethCid).then((exists) => {
        this.setState({
          annotationExists: {
            ...this.state.annotationExists,
            // $FlowFixMe
            [b58Cid]: (exists[0] !== '0x'),
          },
        });
      });
    }

    handleSubmitProposition = (item: Annotation) => {
      const { web3 } = window;
      const provider = web3.currentProvider; // eslint-disable-line

      const StorageContract = truffleContract(contractConfig.abi);
      StorageContract.defaults({
        from: web3.eth.accounts[0],
      });
      const contractAddress = contractConfig.address;
      StorageContract.setProvider(provider);
      const contract = StorageContract.at(contractAddress);

      contract.then((ctr) => {
        const argProperty = b58ToSolidityBytes(item.property);

        ctr.storeAnnotation(argProperty, item.value)
          .then(() => {
            this.updateAnnotation(ctr, item);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }

    render() {
      const checkedAnnotations = this.props.annotations.map(ann => ({
        ...ann,
        isAvailable: this.state.annotationExists[ann.cid],
      }));

      return <WrappedComponent
        {...this.props}
        annotations={checkedAnnotations}
        onSubmitProposition={this.handleSubmitProposition}
      />;
    }
  };
};

module.exports = {
  AnnotationList,
  withBlockchainAnnotations,
};
