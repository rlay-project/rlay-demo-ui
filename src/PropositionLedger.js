// @flow
import { action, observable, configure } from 'mobx';
import truffleContract from 'truffle-contract';
import ethers from 'ethers';

import { callEthersFunction } from './helpers';
import { Proposition } from './classes';
import type { ContractConfig } from './types';

configure(({ enforceActions: true }: any));

export default class PropositionLedger {
  web3: any;
  customSigner: ?any;
  propositionLedgerConfig: ContractConfig;
  tokenConfig: ContractConfig;

  @observable tokenAccount = {};
  @observable propositions = [];

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

  propositionLedgerContractEthers() {
    const { abi, address } = this.propositionLedgerConfig;
    const Contract = truffleContract(abi);
    const provider = new ethers.providers.Web3Provider(
      this.web3.currentProvider,
    );
    const contract = new ethers.Contract(
      address,
      Contract.abi,
      this.customSigner || provider.getSigner(),
    );

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

  tokenContractEthers() {
    const { abi, address } = this.tokenConfig;
    const Contract = truffleContract(abi);
    const provider = new ethers.providers.Web3Provider(
      this.web3.currentProvider,
    );
    const contract = new ethers.Contract(
      address,
      Contract.abi,
      this.customSigner || provider.getSigner(),
    );

    return contract;
  }

  @action.bound
  setSigner(signer: any) {
    this.customSigner = signer;
    console.log(signer);
  }

  @action.bound
  updateTokenAccount() {
    const accountAddress = this.customSigner
      ? this.customSigner.wallet.address
      : this.web3.eth.accounts[0];
    Promise.all([this.tokenContract(), this.propositionLedgerContract()]).then(
      ([tokenContract, propositionLedgerContract]) => {
        tokenContract.balanceOf.call(accountAddress).then(balance => {
          this.tokenAccount.balance = balance;
        });

        tokenContract.allowance
          .call(accountAddress, propositionLedgerContract.address)
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
    const tokenContract = this.tokenContractEthers();
    const propositionLedgerContract = this.propositionLedgerContractEthers();
    callEthersFunction(tokenContract, 'approve', [
      propositionLedgerContract.address,
      allowance,
    ]).then(() => {
      this.updateTokenAccount();
    });
  }

  @action.bound
  fetchNetworkPropositions() {
    const { web3 } = this;
    const contract = this.propositionLedgerContract();

    contract.then(
      action('contractFound', ctr => {
        Proposition.getAllStored(ctr, web3).then(
          action('getAllStoredPropositionsSuccess', propositions => {
            (this.propositions: any).replace(propositions);
          }),
        );
      }),
    );
  }

  @action.bound
  addWeight(cid: any, amount: number) {
    const { web3 } = this;
    const contract = this.propositionLedgerContract();

    contract.then(
      action('contractFound', ctr => {
        Proposition.submit(ctr, web3, cid, amount).then(
          action('addWeightSuccess', () => {
            this.fetchNetworkPropositions();
            setTimeout(() => this.fetchNetworkPropositions(), 1000);
          }),
        );
      }),
    )
  }
}
