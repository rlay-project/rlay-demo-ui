// @flow

export opaque type AnnotationPropertyHash = string;
export opaque type AnnotationCid = string;
export opaque type ClassCid = string;
export opaque type IndividualCid = string;

export type OntClass = any;
export type Individual = any;
export type Proposition = any;

export type TruthTables = Object;

export type ContractConfig = {
  abi: any,
  address: string,
};

// TODO: deprecate and move towards RsClass
type RsOntClass = {
  label: AnnotationCid,
  parents: Array<ClassCid>,
};

export type RsClass = {
  annotations: Array<AnnotationCid>,
  sub_class_of_class: Array<ClassCid>,
};

// TODO: deprecate and move towards RsIndividual
type OldRsIndividual = {
  label: string,
  class_memberships: Array<string>,
};

export type RsIndividual = {
  annotations: Array<AnnotationCid>,
  class_assertions: Array<ClassCid>,
  negative_class_assertions: Array<ClassCid>,
};

export type RsAnnotation = {
  property: AnnotationPropertyHash,
  value: string,
};

export type BayModule = {
  annotation_property_label: () => AnnotationPropertyHash,
  hash_annotation: RsAnnotation => AnnotationCid,
  hash_class: RsClass => ClassCid,
  hash_individual: RsIndividual => IndividualCid,
  can_query: (
    Array<RsOntClass>,
    Array<OldRsIndividual>,
    OldRsIndividual,
  ) => boolean,
  query: (
    Array<RsOntClass>,
    Array<OldRsIndividual>,
    OldRsIndividual,
  ) => TruthTables,
};
