// @flow

export opaque type AnnotationPropertyHash = string;
export opaque type AnnotationCid = string;

type FnHashAnnotationInput = {
  property: AnnotationPropertyHash,
  value: string,
}

export type BayModule = {
  hash_annotation: (FnHashAnnotationInput) => AnnotationCid,
  annotation_property_label: () => AnnotationPropertyHash,
};
