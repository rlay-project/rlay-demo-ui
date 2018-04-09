// @flow
import React from 'react';
import multibase from 'multibase';
import truffleContract from 'truffle-contract';
import { Button } from 'reactstrap';
import { isEmpty } from 'lodash-es';
import abiDecoder from 'abi-decoder';

import type { ComponentType } from 'react';
import type { RsAnnotation, AnnotationCid, ContractConfig } from '../types';

type Annotation = RsAnnotation & {
  cid: AnnotationCid,
};

type CheckedAnnotation = Annotation & BlockchainAnnotation;

type BlockchainAnnotation = {
  isAvailable: boolean,
};

type AnnotationListProps = {
  annotations: Array<CheckedAnnotation>,
  onSubmitProposition: Annotation => void,
};

const b58ToSolidityBytes = b58 => {
  const bytesCid = multibase.decode(b58);
  return `0x${multibase
    .encode('base16', bytesCid)
    .toString()
    .substring(1)}`;
};

const solidityBytesToB58 = solidityBytes => {
  const bytes = solidityBytes.substring(2);
  const decoded = multibase.decode(`f${bytes}`);
  return multibase.encode('base58btc', decoded).toString();
};

class AnnotationList extends React.Component<AnnotationListProps> {
  handleUploadClick = (item: CheckedAnnotation) => {
    this.props.onSubmitProposition(item);
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
            <span title="Stored on blockchain">🌐</span>
          ) : null}
        </span>
        <span>
          <code>{((item.cid: any): string)}</code>
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
        web3.eth
          .filter({
            address: contractAddress,
            fromBlock: 1,
            toBlock: 'latest',
          })
          .get((err, result) => {
            abiDecoder.addABI(contract.abi);
            const decoded = abiDecoder.decodeLogs(result);
            const annCids = decoded
              .filter(n => n.name === 'AnnotationStored')
              .map(n => n.events[0].value);

            annCids.forEach(annCid => this.retrieveAnnotation(ctr, annCid));
          });

        this.props.annotations.forEach(ann => {
          this.updateAnnotation(ctr, ann);
        });
      });
    }

    retrieveAnnotation = (ctr: any, annCidBytes: String) => {
      const ethCid = annCidBytes;
      const b58Cid = solidityBytesToB58(ethCid);

      ctr.retrieveAnnotation.call(ethCid).then(res => {
        const [ethPropertyHash, value] = res;

        const annotation = {
          cid: b58Cid,
          property: solidityBytesToB58(ethPropertyHash),
          value,
        };
        this.setState({
          networkAnnotations: [...this.state.networkAnnotations, annotation],
          annotationExists: {
            ...this.state.annotationExists,
            // $FlowFixMe
            [b58Cid]: true,
          },
        });
      });
    };

    updateAnnotation = (ctr: any, ann: Annotation) => {
      const b58Cid = ann.cid;
      const ethCid = b58ToSolidityBytes(b58Cid);

      ctr.retrieveAnnotation.call(ethCid).then(exists => {
        this.setState({
          annotationExists: {
            ...this.state.annotationExists,
            // $FlowFixMe
            [b58Cid]: exists[0] !== '0x',
          },
        });
      });
    };

    handleSubmitProposition = (item: Annotation) => {
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
        const argProperty = b58ToSolidityBytes(item.property);

        ctr
          .storeAnnotation(argProperty, item.value)
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
      const checkedAnnotations = annotations.map(ann => ({
        ...ann,
        isAvailable: this.state.annotationExists[ann.cid],
      }));

      return (
        <WrappedComponent
          {...this.props}
          annotations={checkedAnnotations}
          onSubmitProposition={this.handleSubmitProposition}
        />
      );
    }
  };
};

module.exports = {
  AnnotationList,
  withBlockchainAnnotations,
};
