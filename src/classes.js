// @flow
import type {
  AnnotationPropertyHash,
  AnnotationCid,
  BayModule,
  ClassCid,
} from './types';

type AnnotationData = {
  property: AnnotationPropertyHash,
  value: string,
};

class Annotation {
  property: AnnotationPropertyHash;
  value: string;
  cachedCid: ?AnnotationCid;

  constructor(data: AnnotationData) {
    this.property = data.property;
    this.value = data.value;
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

  label(): string {
    const hash = this.hash();
    const readableProperty = this.readableProperty();
    const propertyPart = readableProperty ? `${readableProperty}: ` : '';
    return `${(hash: any)} (${propertyPart}${this.value})`;
  }
}

type ClassData = {
  annotations?: Array<AnnotationCid>,
  sub_class_of_class?: Array<ClassCid>,
};

class Class {
  annotations: Array<AnnotationCid>;
  sub_class_of_class: Array<ClassCid>; // eslint-disable-line camelcase
  cachedCid: ?ClassCid;

  constructor(data: ClassData) {
    this.annotations = data.annotations || [];
    this.sub_class_of_class = data.sub_class_of_class || [];
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

  label(): string {
    return (this.hash(): any);
  }
}

module.exports = {
  Annotation,
  Class,
};
