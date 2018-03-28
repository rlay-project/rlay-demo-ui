// @flow

export opaque type AnnotationPropertyHash = string;
export opaque type AnnotationCid = string;
export opaque type ClassCid = string;

export type OntClass = any;
export type Individual = any;
export type Proposition = any;

export type TruthTables = Object;

export type ContractConfig = {
  abi: any,
  address: string,
};

type RsOntClass = {
  label: AnnotationCid,
  parents: Array<ClassCid>,
};

type RsIndividual = {
  label: string,
  class_memberships: Array<string>,
}

export type RsAnnotation = {
  property: AnnotationPropertyHash,
  value: string,
}

export type BayModule = {
  annotation_property_label: () => AnnotationPropertyHash,
  hash_annotation: (RsAnnotation) => AnnotationCid,
  can_query: (Array<RsOntClass>, Array<RsIndividual>, RsIndividual) => boolean,
  query: (Array<RsOntClass>, Array<RsIndividual>, RsIndividual) => TruthTables,
};
