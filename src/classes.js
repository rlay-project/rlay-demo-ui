// @flow
import type { AnnotationPropertyHash, AnnotationCid, BayModule } from './types';

type AnnotationData = {
  property: AnnotationPropertyHash,
  value: string,
};

class Annotation {
  property: AnnotationPropertyHash;
  value: string;

  constructor(data: AnnotationData) {
    this.property = data.property;
    this.value = data.value;
  }

  hash(bayModule: BayModule): AnnotationCid {
    const rsValue = {
      property: this.property,
      value: this.value,
    };
    return bayModule.hash_annotation(rsValue);
  }
}

module.exports = {
  Annotation,
};
