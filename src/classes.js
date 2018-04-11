// @flow
import abiDecoder from 'abi-decoder';

import { solidityBytesToB58, b58ToSolidityBytes } from './helpers';
import type {
  AnnotationPropertyHash,
  AnnotationCid,
  BayModule,
  ClassCid,
} from './types';

type AnnotationData = {
  property: AnnotationPropertyHash,
  value: string,
  cachedCid?: ?AnnotationCid,
};

class Annotation {
  property: AnnotationPropertyHash;
  value: string;
  cachedCid: ?AnnotationCid;

  constructor(data: AnnotationData) {
    this.property = data.property;
    this.value = data.value;
    this.cachedCid = data.cachedCid;
  }

  static retrieve(ctr: any, annCidBytes: String): Promise<?Annotation> {
    const ethCid = annCidBytes;
    const b58Cid = solidityBytesToB58(ethCid);

    return ctr.retrieveAnnotation.call(ethCid).then(res => {
      const [ethPropertyHash, value] = res;

      const annotation = new Annotation({
        property: solidityBytesToB58(ethPropertyHash),
        value,
      });
      annotation.cachedCid = b58Cid;

      return annotation;
    });
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

    return ctr.retrieveAnnotation.call(ethCid);
  }

  store(ctr: any): Promise<void> {
    const argProperty = b58ToSolidityBytes(this.property);

    return ctr.storeAnnotation(argProperty, this.value);
  }

  clone() {
    const clone = Object.assign({}, this);
    Object.setPrototypeOf(clone, this.constructor.prototype);

    return clone;
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

  get label(): string {
    const hash = this.hash();
    const readableProperty = this.readableProperty();
    const propertyPart = readableProperty ? `${readableProperty}: ` : '';
    return `${(hash: any)} (${propertyPart}${this.value})`;
  }
}

type ClassData = {
  annotations?: Array<AnnotationCid>,
  sub_class_of_class?: Array<ClassCid>,
  cachedCid?: ?ClassCid,
};

class Class {
  annotations: Array<AnnotationCid>;
  sub_class_of_class: Array<ClassCid>; // eslint-disable-line camelcase
  cachedCid: ?ClassCid;

  constructor(data?: ClassData = {}) {
    this.annotations = data.annotations || [];
    this.sub_class_of_class = data.sub_class_of_class || [];
    this.cachedCid = data.cachedCid;
  }

  clone() {
    const clone = Object.assign({}, this);
    Object.setPrototypeOf(clone, this.constructor.prototype);

    return clone;
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

  get label(): string {
    return (this.hash(): any);
  }
}

module.exports = {
  Annotation,
  Class,
};
