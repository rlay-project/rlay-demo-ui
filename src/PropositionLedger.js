// @flow
import { action, observable, configure } from 'mobx';
import truffleContract from 'truffle-contract';

import type { ContractConfig } from './types';

configure({ enforceActions: true });

export default class PropositionLedger {
  web3: any;
  propositionLedgerConfig: ContractConfig;
  tokenConfig: ContractConfig;

  @observable tokenAccount = {};

  constructor(
    web3: any,
    propositionLedgerConfig: ContractConfig,
    tokenConfig: ContractConfig,
  ) {
    this.web3 = web3;
    this.propositionLedgerConfig = propositionLedgerConfig;
    this.tokenConfig = tokenConfig;
  }

  propositionLedgerContract() {
    const { web3, propositionLedgerConfig } = this;
    const provider = web3.currentProvider; // eslint-disable-line

    const Contract = truffleContract(propositionLedgerConfig.abi);
    Contract.defaults({
      from: web3.eth.accounts[0],
    });
    const contractAddress = propositionLedgerConfig.address;
    Contract.setProvider(provider);
    const contract = Contract.at(contractAddress);

    return contract;
  }

  tokenContract() {
    const { web3, tokenConfig } = this;
    const provider = web3.currentProvider; // eslint-disable-line

    const Contract = truffleContract(tokenConfig.abi);
    Contract.defaults({
      from: web3.eth.accounts[0],
    });
    const contractAddress = tokenConfig.address;
    Contract.setProvider(provider);
    const contract = Contract.at(contractAddress);

    return contract;
  }

  @action.bound
  updateTokenAccount() {
    Promise.all([this.tokenContract(), this.propositionLedgerContract()]).then(
      ([tokenContract, propositionLedgerContract]) => {
        tokenContract.balanceOf
          .call(this.web3.eth.accounts[0])
          .then(balance => {
            this.tokenAccount.balance = balance;
          });

        tokenContract.allowance
          .call(this.web3.eth.accounts[0], propositionLedgerContract.address)
          .then(allowance => {
            this.tokenAccount.allowance = allowance;
          });

        tokenContract.symbol.call().then(symbol => {
          this.tokenAccount.tokenSymbol = symbol;
        });
      },
    );
  }

  @action.bound
  setAllowance(allowance: number) {
    Promise.all([this.tokenContract(), this.propositionLedgerContract()]).then(
      ([tokenContract, propositionLedgerContract]) => {
        tokenContract
          .approve(propositionLedgerContract.address, allowance)
          .then(() => {
            this.updateTokenAccount();
          });
      },
    );
  }
}
