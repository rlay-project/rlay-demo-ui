// @flow
import { action, observable, computed, configure } from 'mobx';
import truffleContract from 'truffle-contract';
import { b58ToSolidityBytes } from './helpers';

import { Annotation, type BlockchainAnnotation } from './classes';

import type { AnnotationCid, ContractConfig } from './types';

configure({ enforceActions: true });

export default class OntologyStore {
  web3: any;
  contractConfig: ContractConfig;

  @observable annotations = [];
  @observable annotationExists: Map<AnnotationCid, boolean> = new Map();

  constructor(web3: any, contractConfig: ContractConfig) {
    this.web3 = web3;
    this.contractConfig = contractConfig;
  }

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

  storageContract() {
    const { web3, contractConfig } = this;
    const provider = web3.currentProvider; // eslint-disable-line

    const StorageContract = truffleContract(contractConfig.abi);
    StorageContract.defaults({
      from: web3.eth.accounts[0],
    });
    const contractAddress = contractConfig.address;
    StorageContract.setProvider(provider);
    const contract = StorageContract.at(contractAddress);

    return contract;
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
        this.annotationExists.set(ann.cid(), exists[0] !== '0x');
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
}
