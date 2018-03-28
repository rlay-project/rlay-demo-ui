// @flow
import React from 'react';
import { isEmpty } from 'lodash-es';
import truffleContract from 'truffle-contract';
import multibase from 'multibase';

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
};

class AnnotationList extends React.Component<AnnotationListProps> {
  renderItem(item: CheckedAnnotation) {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-between',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
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
      // $FlowFixMe
      const provider = web3.currentProvider; // eslint-disable-line

      const StorageContract = truffleContract(contractConfig.abi);
      const contractAddress = contractConfig.address;
      StorageContract.setProvider(provider);
      const contract = StorageContract.at(contractAddress);

      contract.then((ctr) => {
        this.props.annotations.forEach((ann) => {
          const b58Cid = ann.cid;
          const bytesCid = multibase.decode(b58Cid);
          const ethCid = `0x${multibase.encode('base16', bytesCid).toString().substring(1)}`;

          ctr.retrieveAnnotation.call(ethCid).then((exists) => {
            this.setState({
              annotationExists: {
                ...this.state.annotationExists,
                [b58Cid]: (exists[0] !== '0x'),
              },
            });
          });
        });
      });
    }

    render() {
      const checkedAnnotations = this.props.annotations.map(ann => ({
        ...ann,
        isAvailable: this.state.annotationExists[ann.cid],
      }));

      return <WrappedComponent {...this.props} annotations={checkedAnnotations} />;
    }
  };
};

module.exports = {
  AnnotationList,
  withBlockchainAnnotations,
};
