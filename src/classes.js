// @flow
import abiDecoder from 'abi-decoder';
import { uniq, maxBy, groupBy } from 'lodash-es';

import {
  solidityBytesToB58,
  b58ToSolidityBytes,
  callEthersFunction,
} from './helpers';
import type {
  AnnotationCid,
  AnnotationPropertyHash,
  BayModule,
  ClassCid,
  IndividualCid,
} from './types';
import type { EthersContract } from './OntologyStore.js';

export type BlockchainCheckedExt = {
  isAvailable: boolean,
};

type AnnotationData = {
  property: AnnotationPropertyHash,
  value: string,
  cachedCid?: ?AnnotationCid,
};

const encodeOptionalArrayArg = (items: any) => items.map(b58ToSolidityBytes);

const clone = function clone() {
  const cloned = Object.assign({}, this);
  Object.setPrototypeOf(cloned, this.constructor.prototype);

  return (cloned: any);
};

class Annotation {
  property: AnnotationPropertyHash;
  value: string;
  cachedCid: ?AnnotationCid;

  isAvailable: boolean;

  clone: () => Annotation;

  constructor(data: AnnotationData) {
    this.clone = clone;

    this.property = data.property;
    this.value = data.value;
    this.cachedCid = data.cachedCid;
  }

  static retrieve(ctr: any, annCidBytes: String): Promise<?Annotation> {
    const ethCid = annCidBytes;
    const b58Cid = solidityBytesToB58(ethCid);

    return ctr
      .retrieveAnnotation(ethCid)
      .then(res => Annotation.parseFromRetrieve(res, b58Cid));
  }

  static parseFromRetrieve(
    retrieveRes: Array<any>,
    b58Cid: ?AnnotationCid,
  ): Annotation {
    const [ethPropertyHash, value] = retrieveRes;

    const annotation = new Annotation({
      property: solidityBytesToB58(ethPropertyHash),
      value,
    });
    annotation.cachedCid = b58Cid;

    return annotation;
  }

  static getAllStored(ctr: any, web3: any): Promise<Array<AnnotationCid>> {
    return new Promise((resolve, reject) => {
      web3.eth
        .filter({
          address: ctr.address,
          fromBlock: 1,
          toBlock: 'latest',
        })
        .get((err, result) => {
          if (err) {
            reject(err);
            return;
          }

          abiDecoder.addABI(ctr.abi);
          const decoded = abiDecoder.decodeLogs(result);
          const annCids = decoded
            .filter(n => n.name === 'AnnotationStored')
            .map(n => n.events[0].value);

          resolve(annCids);
        });
    });
  }

  isStored(ctr: any): Promise<boolean> {
    const b58Cid = this.cid();
    const ethCid = b58ToSolidityBytes(b58Cid);

    return ctr.isStoredAnnotation.call(ethCid);
  }

  store(ctr: any): Promise<void> {
    const argProperty = b58ToSolidityBytes(this.property);

    return callEthersFunction(ctr, 'storeAnnotation', [
      argProperty,
      this.value,
    ]);
  }

  hash(bayModule?: BayModule): AnnotationCid {
    if (this.cachedCid) {
      return this.cachedCid;
    }
    if (!bayModule) {
      throw new Error('Can not hash Annotation without bayModule');
    }

    const rsValue = {
      property: this.property,
      value: this.value,
    };
    this.cachedCid = bayModule.hash_annotation(rsValue);
    return this.cachedCid;
  }

  cid(bayModule?: BayModule): AnnotationCid {
    return this.hash(bayModule);
  }

  readableProperty(): ?string {
    switch (this.property) {
      case 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2':
        return 'label';
      case 'zW1fiG75n55P1ix184atgmWHu6FhgKzQqtdiA1wQcnPhPSL':
        return 'comment';
      default:
        return null;
    }
  }

  isLabel(): boolean {
    return this.property === 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2';
  }

  isComment(): boolean {
    return this.property === 'zW1fiG75n55P1ix184atgmWHu6FhgKzQqtdiA1wQcnPhPSL';
  }

  get label(): string {
    const hash = this.hash();
    const readableProperty = this.readableProperty();
    const propertyPart = readableProperty ? `${readableProperty}: ` : '';
    return `${propertyPart}"${this.value}" (${(hash: any)})`;
  }
}

export type BlockchainAnnotation = Annotation & BlockchainCheckedExt;

type ClassData = {
  annotations?: Array<AnnotationCid>,
  sub_class_of_class?: Array<ClassCid>,
  cachedCid?: ?ClassCid,
};

class Klass {
  annotations: Array<AnnotationCid>;
  sub_class_of_class: Array<ClassCid>; // eslint-disable-line camelcase
  cachedCid: ?ClassCid;

  enrichedAnnotations: ?Array<Annotation>;

  clone: () => Klass;
  isAvailable: boolean;

  constructor(data?: ClassData = {}) {
    this.clone = clone;

    this.annotations = data.annotations || [];
    this.sub_class_of_class = data.sub_class_of_class || [];
    this.cachedCid = data.cachedCid;
  }

  static retrieve(ctr: EthersContract, itemCidBytes: String): Promise<?Klass> {
    /* eslint-disable camelcase */
    const ethCid = itemCidBytes;
    const b58Cid = solidityBytesToB58(ethCid);

    return (ctr: any)
      .retrieveClass(ethCid)
      .then(res => Klass.parseFromRetrieve(res, b58Cid));
  }

  static parseFromRetrieve(retrieveRes: Array<any>, b58Cid: ?ClassCid): Klass {
    let [annotations, sub_class_of_class] = retrieveRes;
    annotations = annotations.map(solidityBytesToB58);
    sub_class_of_class = sub_class_of_class.map(solidityBytesToB58);

    const item = new Klass({
      annotations,
      sub_class_of_class,
    });
    item.cachedCid = b58Cid;

    return item;
  }

  static getAllStored(ctr: any, web3: any): Promise<Array<ClassCid>> {
    return new Promise((resolve, reject) => {
      web3.eth
        .filter({
          address: ctr.address,
          fromBlock: 1,
          toBlock: 'latest',
        })
        .get((err, result) => {
          if (err) {
            reject(err);
            return;
          }

          abiDecoder.addABI(ctr.abi);
          const decoded = abiDecoder.decodeLogs(result);
          const itemCids = decoded
            .filter(n => n.name === 'ClassStored')
            .map(n => n.events[0].value);

          resolve(itemCids);
        });
    });
  }

  isStored(ctr: any): Promise<boolean> {
    const b58Cid = this.cid();
    const ethCid = b58ToSolidityBytes(b58Cid);

    return ctr.isStoredClass.call(ethCid);
  }

  store(ctr: any): Promise<any> {
    const argAnnotations = encodeOptionalArrayArg(this.annotations);
    const argSubClassOfClass = encodeOptionalArrayArg(this.sub_class_of_class);

    return callEthersFunction(ctr, 'storeClass', [
      argAnnotations,
      argSubClassOfClass,
    ]);
  }

  hash(bayModule?: BayModule): ClassCid {
    if (this.cachedCid) {
      return this.cachedCid;
    }
    if (!bayModule) {
      throw new Error('Can not hash Class without bayModule');
    }

    const rsValue = {
      annotations: this.annotations,
      sub_class_of_class: this.sub_class_of_class,
    };
    this.cachedCid = bayModule.hash_class(rsValue);
    return this.cachedCid;
  }

  cid(bayModule?: BayModule): ClassCid {
    return this.hash(bayModule);
  }

  enrichWithAnnotations(ontologyAnnotations: Array<Annotation>) {
    const containedAnnotations = ontologyAnnotations.filter(n =>
      this.annotations.includes(n.cid()),
    );

    this.enrichedAnnotations = containedAnnotations;
  }

  get annotationLabel(): ?string {
    if (!this.enrichedAnnotations) {
      return null;
    }

    const primaryLabelAnnotation = this.enrichedAnnotations.find(n =>
      n.isLabel(),
    );
    if (!primaryLabelAnnotation) {
      return null;
    }
    return primaryLabelAnnotation.value;
  }

  get annotationComment(): ?string {
    if (!this.enrichedAnnotations) {
      return null;
    }

    const primaryCommentAnnotation = this.enrichedAnnotations.find(n =>
      n.isComment(),
    );
    if (!primaryCommentAnnotation) {
      return null;
    }
    return primaryCommentAnnotation.value;
  }

  get label(): string {
    const labelPart = this.annotationLabel
      ? this.annotationLabel.toString()
      : '';
    const commentPart = this.annotationComment
      ? ` - "${this.annotationComment}"`
      : '';
    return `${labelPart}${commentPart} (${(this.hash(): any)})`;
  }
}

export type BlockchainClass = Klass & BlockchainCheckedExt;

type IndividualData = {
  annotations?: Array<AnnotationCid>,
  class_assertions?: Array<ClassCid>,
  negative_class_assertions?: Array<ClassCid>,
  cachedCid?: ?IndividualCid,
};

class Individual {
  annotations: Array<AnnotationCid>;
  class_assertions: Array<ClassCid>;
  negative_class_assertions: Array<ClassCid>;
  cachedCid: ?IndividualCid;

  enrichedAnnotations: ?Array<Annotation>;
  enrichedClassAssertions: ?Array<Klass>;
  enrichedNegativeClassAssertions: ?Array<Klass>;

  clone: () => Individual;
  isAvailable: boolean;

  constructor(data?: IndividualData = {}) {
    this.clone = clone;

    this.annotations = data.annotations || [];
    this.class_assertions = data.class_assertions || [];
    this.negative_class_assertions = data.negative_class_assertions || [];
    this.cachedCid = data.cachedCid;
  }

  static retrieve(
    ctr: EthersContract,
    itemCidBytes: String,
  ): Promise<?Individual> {
    /* eslint-disable camelcase */
    const ethCid = itemCidBytes;
    const b58Cid = solidityBytesToB58(ethCid);

    return (ctr: any)
      .retrieveIndividual(ethCid)
      .then(res => Individual.parseFromRetrieve(res, b58Cid));
  }

  static parseFromRetrieve(
    retrieveRes: Array<any>,
    b58Cid: ?IndividualCid,
  ): Individual {
    let [
      annotations,
      class_assertions,
      negative_class_assertions,
    ] = retrieveRes;
    annotations = annotations.map(solidityBytesToB58);
    class_assertions = class_assertions.map(solidityBytesToB58);
    negative_class_assertions = negative_class_assertions.map(
      solidityBytesToB58,
    );

    const item = new Individual({
      annotations,
      class_assertions,
      negative_class_assertions,
    });
    item.cachedCid = b58Cid;

    return item;
  }

  static getAllStored(ctr: any, web3: any): Promise<Array<IndividualCid>> {
    return new Promise((resolve, reject) => {
      web3.eth
        .filter({
          address: ctr.address,
          fromBlock: 1,
          toBlock: 'latest',
        })
        .get((err, result) => {
          if (err) {
            reject(err);
            return;
          }

          abiDecoder.addABI(ctr.abi);
          const decoded = abiDecoder.decodeLogs(result);
          const itemCids = decoded
            .filter(n => n.name === 'IndividualStored')
            .map(n => n.events[0].value);

          resolve(itemCids);
        });
    });
  }

  isStored(ctr: any): Promise<boolean> {
    const b58Cid = this.cid();
    const ethCid = b58ToSolidityBytes(b58Cid);

    return ctr.isStoredIndividual.call(ethCid);
  }

  store(ctr: any): Promise<void> {
    const argAnnotations = encodeOptionalArrayArg(this.annotations);
    const argClassAssertions = encodeOptionalArrayArg(this.class_assertions);
    const argNegativeClassAssertions = encodeOptionalArrayArg(
      this.negative_class_assertions,
    );

    return callEthersFunction(ctr, 'storeIndividual', [
      argAnnotations,
      argClassAssertions,
      argNegativeClassAssertions,
    ]);
  }

  hash(bayModule?: BayModule): IndividualCid {
    if (this.cachedCid) {
      return this.cachedCid;
    }
    if (!bayModule) {
      throw new Error('Can not hash Individual without bayModule');
    }

    const rsValue = {
      annotations: this.annotations,
      class_assertions: this.class_assertions,
      negative_class_assertions: this.negative_class_assertions,
    };
    this.cachedCid = bayModule.hash_individual(rsValue);
    return this.cachedCid;
  }

  cid(bayModule?: BayModule): IndividualCid {
    return this.hash(bayModule);
  }

  enrichWithAnnotations(ontologyAnnotations: Array<Annotation>) {
    const containedAnnotations = ontologyAnnotations.filter(n =>
      this.annotations.includes(n.cid()),
    );

    this.enrichedAnnotations = containedAnnotations;
  }

  enrichWithClasses(ontologyClasses: Array<Klass>) {
    this.enrichedClassAssertions = ontologyClasses.filter(n =>
      this.class_assertions.includes(n.cid()),
    );
    this.enrichedNegativeClassAssertions = ontologyClasses.filter(n =>
      this.negative_class_assertions.includes(n.cid()),
    );
  }

  get annotationLabel(): ?string {
    if (!this.enrichedAnnotations) {
      return null;
    }

    const primaryLabelAnnotation = this.enrichedAnnotations.find(n =>
      n.isLabel(),
    );
    if (!primaryLabelAnnotation) {
      return null;
    }
    return primaryLabelAnnotation.value;
  }

  get classLabel(): ?string {
    if (!this.enrichedClassAssertions) {
      return null;
    }
    if (!this.enrichedNegativeClassAssertions) {
      return null;
    }
    const negativeAssertion = this.enrichedNegativeClassAssertions.find(
      n => n.cid() === this.negative_class_assertions[0],
    );
    // $FlowFixMe
    const positiveAssertion = this.enrichedClassAssertions.find(
      n => n.cid() === this.class_assertions[0],
    );

    const assertion = positiveAssertion || negativeAssertion;
    if (!assertion) {
      return null;
    }
    return assertion.annotationLabel;
  }

  get label(): string {
    return (this.hash(): any);
  }
}

export type BlockchainIndividual = Individual & BlockchainCheckedExt;

type PropositionData = {
  individualCid: IndividualCid,
  amount: number,
};

class Proposition {
  individualCid: IndividualCid;
  amount: number;

  cachedAnnotationLabel: ?string;

  constructor(data: PropositionData) {
    this.individualCid = data.individualCid;
    this.amount = data.amount;
  }

  static getAllStored(ctr: any, web3: any): Promise<Array<Proposition>> {
    return new Promise((resolve, reject) => {
      web3.eth
        .filter({
          address: ctr.address,
          fromBlock: 1,
          toBlock: 'latest',
        })
        .get((err, result) => {
          if (err) {
            reject(err);
            return;
          }

          abiDecoder.addABI(ctr.abi);
          const decoded = abiDecoder.decodeLogs(result);
          const propositionData = decoded
            .filter(n => n.name === 'PropositionWeightNewTotal')
            .map(n => ({
              individualCid: solidityBytesToB58(n.events[0].value),
              amount: parseInt(n.events[1].value, 10),
            }));

          const cids = uniq(propositionData.map(n => n.individualCid));
          const lastestPropositions = cids.map(cid =>
            maxBy(
              propositionData.filter(n => n.individualCid === cid),
              'amount',
            ),
          );
          const propositions = lastestPropositions.map(
            data => new Proposition(data),
          );

          resolve(propositions);
        });
    });
  }

  static groupContradicting(
    statements: Array<Individual>,
  ): Array<Array<Array<Individual>>> {
    // filter out groups where only one of the opposing statements is present
    const filterFullGroups = groups =>
      groups
        .map(subjectGroup =>
          subjectGroup.filter(
            contradictionGroup => contradictionGroup.length === 2,
          ),
        )
        .filter(subjectGroup => subjectGroup.length !== 0);

    const subjectGroups = Object.values(groupBy(statements, 'annotations'));
    let groups = subjectGroups.map(
      subjectGroup =>
        (Object.values(
          groupBy(
            subjectGroup,
            item =>
              item.class_assertions[0] || item.negative_class_assertions[0],
          ),
        ): any),
    );
    groups = filterFullGroups(groups);

    return groups;
  }

  static submit(ctr: any, web3: any, cid: any, amount: any): Promise<void> {
    // using web3 instead of ethers.js because ethers.js had a strange bug when estimating gas???
    return ctr.submitProposition(b58ToSolidityBytes(cid), amount);
  }

  enrichWithLabel(ontologyIndividuals: Array<Individual>) {
    if (this.cachedAnnotationLabel) {
      return;
    }

    const individual = ontologyIndividuals.find(
      n => n.cid() === this.individualCid,
    );
    if (individual) {
      this.cachedAnnotationLabel = individual.annotationLabel;
    }
  }
}

module.exports = {
  Annotation,
  Class: Klass,
  Klass,
  Individual,

  Proposition,
};
