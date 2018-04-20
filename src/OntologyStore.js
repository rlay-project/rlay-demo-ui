// @flow
import { action, observable, computed, configure } from 'mobx';
import truffleContract from 'truffle-contract';
import ethers from 'ethers';
import { b58ToSolidityBytes } from './helpers';

import {
  Annotation,
  Class as Klass,
  Individual,
  type BlockchainAnnotation,
  type BlockchainClass,
  type BlockchainIndividual,
} from './classes';

import type {
  AnnotationCid,
  ClassCid,
  IndividualCid,
  ContractConfig,
} from './types';

configure(({ enforceActions: true }: any));

export opaque type EthersContract = any;

export default class OntologyStore {
  web3: any;
  contractConfig: ContractConfig;

  @observable annotations: Array<Annotation> = [];
  @observable annotationExists: Map<AnnotationCid, boolean> = new Map();
  @observable classes: Array<Klass> = [];
  @observable classExists: Map<ClassCid, boolean> = new Map();
  @observable individuals: Array<Individual> = [];
  @observable individualExists: Map<IndividualCid, boolean> = new Map();

  constructor(web3: any, contractConfig: ContractConfig) {
    this.web3 = web3;
    this.contractConfig = contractConfig;
  }

  buildStorageContract() {
    const { web3, contractConfig } = this;
    const provider = web3.currentProvider; // eslint-disable-line

    const StorageContract = truffleContract(contractConfig.abi);
    StorageContract.defaults({
      from: web3.eth.accounts[0],
    });
    StorageContract.setProvider(provider);

    return StorageContract;
  }

  storageContract() {
    const { contractConfig } = this;

    const StorageContract = this.buildStorageContract();
    const contractAddress = contractConfig.address;
    const contract = StorageContract.at(contractAddress);

    return contract;
  }

  storageContractEthers(): EthersContract {
    const { abi, address } = this.contractConfig;
    const StorageContract = truffleContract(abi);
    const provider = new ethers.providers.Web3Provider(
      this.web3.currentProvider,
    );
    const contract = new ethers.Contract(
      address,
      StorageContract.abi,
      provider,
    );

    return contract;
  }

  //
  // Annotation
  //

  @computed
  get listableAnnotations(): Array<BlockchainAnnotation> {
    const checkedAnnotations = this.annotations.map(ann => {
      const checkedAnn = ann.clone();
      checkedAnn.isAvailable =
        this.annotationExists.get(checkedAnn.cid()) || false;
      return checkedAnn;
    });
    return checkedAnnotations;
  }

  @action.bound
  fetchNetworkAnnotations() {
    const { web3 } = this;
    const contract = this.storageContract();

    contract.then(
      action('contractFound', ctr => {
        Annotation.getAllStored(ctr, web3).then(
          action('getAllStoredAnnotationsSuccess', annCids => {
            annCids.forEach(annCid =>
              this.fetchNetworkAnnotation(ctr, (annCid: any)),
            );
          }),
        );

        this.annotations.forEach(ann => {
          this.updateAnnotationStored(ctr, ann);
        });
      }),
    );
  }

  @action.bound
  fetchNetworkAnnotation(ctr: any, annCidBytes: String) {
    Annotation.retrieve(ctr, annCidBytes).then(
      action('retrieveAnnotationSuccess', annotation => {
        // avoid duplicates
        if (!this.annotations.find(n => n.cachedCid === annotation.cid())) {
          this.annotations.push(annotation);
        }
        this.annotationExists.set(annotation.cid(), true);
      }),
    );
  }

  @action.bound
  updateAnnotationStored(ctr: any, ann: Annotation) {
    ann.isStored(ctr).then(
      action('isStoredAnnotationSuccess', exists => {
        this.annotationExists.set(ann.cid(), exists);
      }),
    );
  }

  @action.bound
  uploadAnnotation(item: Annotation) {
    const contract = this.storageContract();

    contract.then(ctr => {
      item
        .store(ctr)
        .then(() => {
          this.fetchNetworkAnnotation(
            ctr,
            (b58ToSolidityBytes(item.cid()): any),
          );
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  @action.bound
  createLocalAnnotation(item: Annotation) {
    if (!this.annotationExists.get(item.cid())) {
      this.annotations.push(item);
    }
  }

  //
  // Class
  //
  @computed
  get listableClasses(): Array<BlockchainClass> {
    const checkItems = this.classes.map(ann => {
      const checkedItem = ann.clone();
      checkedItem.isAvailable =
        this.classExists.get(checkedItem.cid()) || false;
      return checkedItem;
    });
    return checkItems;
  }

  @action.bound
  fetchNetworkClasses() {
    const { web3 } = this;
    const contract = this.storageContract();
    const ethersContract = this.storageContractEthers();

    contract.then(
      action('contractFound', ctr => {
        Klass.getAllStored(ctr, web3).then(
          action('getAllStoredClassesSuccess', itemCids => {
            itemCids.forEach(itemCid =>
              this.fetchNetworkClass(ethersContract, (itemCid: any)),
            );
          }),
        );

        this.classes.forEach(item => {
          this.updateClassStored(ctr, item);
        });
      }),
    );
  }

  @action.bound
  fetchNetworkClass(ctr: EthersContract, itemCidBytes: String) {
    Klass.retrieve(ctr, itemCidBytes).then(
      action('retrieveClassSuccess', item => {
        // avoid duplicates
        if (!this.classes.find(n => n.cachedCid === item.cid())) {
          this.classes.push(item);
        }
        this.classExists.set(item.cid(), true);
      }),
    );
  }

  @action.bound
  updateClassStored(ctr: any, item: Klass) {
    item.isStored(ctr).then(
      action('isStoredClassSuccess', exists => {
        this.classExists.set(item.cid(), exists);
      }),
    );
  }

  @action.bound
  uploadClass(item: Klass) {
    const contract = this.storageContract();
    const ethersContract = this.storageContractEthers();

    contract.then(ctr => {
      item
        .store(ctr)
        .then(() => {
          this.fetchNetworkClass(
            ethersContract,
            (b58ToSolidityBytes(item.cid()): any),
          );
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  @action.bound
  createLocalClass(item: Klass) {
    if (!this.classExists.get(item.cid())) {
      this.classes.push(item);
    }
  }

  //
  // Individual
  //
  @computed
  get listableIndividuals(): Array<BlockchainIndividual> {
    const checkItems = this.individuals.map(item => {
      const checkedItem = item.clone();
      checkedItem.isAvailable =
        this.individualExists.get(checkedItem.cid()) || false;
      return checkedItem;
    });
    return checkItems;
  }

  @action.bound
  fetchNetworkIndividuals() {
    const { web3 } = this;
    const contract = this.storageContract();
    const ethersContract = this.storageContractEthers();

    contract.then(
      action('contractFound', ctr => {
        Individual.getAllStored(ctr, web3).then(
          action('getAllStoredIndividualsSuccess', itemCids => {
            itemCids.forEach(itemCid =>
              this.fetchNetworkIndividual(ethersContract, (itemCid: any)),
            );
          }),
        );

        this.individuals.forEach(item => {
          this.updateIndividualStored(ctr, item);
        });
      }),
    );
  }

  @action.bound
  fetchNetworkIndividual(ctr: EthersContract, itemCidBytes: String) {
    Individual.retrieve(ctr, itemCidBytes).then(
      action('retrieveIndividualSuccess', item => {
        // avoid duplicates
        if (!this.individuals.find(n => n.cachedCid === item.cid())) {
          this.individuals.push(item);
        }
        this.individualExists.set(item.cid(), true);
      }),
    );
  }

  @action.bound
  updateIndividualStored(ctr: any, item: Individual) {
    item.isStored(ctr).then(
      action('isStoredIndividualSuccess', exists => {
        this.individualExists.set(item.cid(), exists);
      }),
    );
  }

  @action.bound
  uploadIndividual(item: Individual) {
    const contract = this.storageContract();
    const ethersContract = this.storageContractEthers();

    contract.then(ctr => {
      item
        .store(ctr)
        .then(() => {
          this.fetchNetworkIndividual(
            ethersContract,
            (b58ToSolidityBytes(item.cid()): any),
          );
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  @action.bound
  createLocalIndividual(item: Individual) {
    if (!this.individualExists.get(item.cid())) {
      this.individuals.push(item);
    }
  }
}
