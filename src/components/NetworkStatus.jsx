// @flow
import React from 'react';
import truffleContract from 'truffle-contract';

import config from '../config.js'; // TODO: provide via props

type NetworkStatusProps = {
  web3: Object,
};

type NetworkStatusState = {
  network: ?number,
  contractDeployed: Object,
};

export default class NetworkStatus extends React.Component<NetworkStatusProps, NetworkStatusState> {
  state = {
    network: null,
    contractDeployed: {},
  }

  componentDidMount() {
    const { web3 } = this.props;
    web3.version.getNetwork((err, network) => {
      this.setState({ network });

      const contractConfig = config.annotationStore;
      const provider = web3.currentProvider; // eslint-disable-line

      const StorageContract = truffleContract(contractConfig.abi);
      const contractAddress = contractConfig.address;
      StorageContract.setProvider(provider);
      const contract = StorageContract.at(contractAddress);

      contract
        .then(() => {
          this.setState({
            contractDeployed: {
              ...this.state.contractDeployed,
              storage: true,
            },
          });
        })
        .catch(() => {
          this.setState({
            contractDeployed: {
              ...this.state.contractDeployed,
              storage: false,
            },
          });
        });
    });
  }

  renderNetworkName() {
    switch (this.state.network) {
      case '1':
        return 'Mainnet';
      case '2':
        return 'Morden';
      case '3':
        return 'Ropsten';
      case '4':
        return 'Rinkeby';
      case '42':
        return 'Kovan';
      default:
        return 'Unknown';
    }
  }

  render() {
    return (
      <div>
        <div>
          Network: {this.renderNetworkName()}
        </div>
        <div>
          Storage Contract: {this.state.contractDeployed.storage ? '✓' : '✗'}
        </div>
      </div>
    );
  }
}
