import {
  difference,
  flatMap,
  uniq,
} from 'lodash-es';
import multihash from 'multihashes';
import { sha3_256 } from 'js-sha3';

const toRsClass = klass => ({
  label: klass.id,
  parents: (klass.parents || []),
});

const nodeFromClass = (klass, truthTables) => ({
  id: klass.id,
  label: {
    id: klass.id,
    tt: truthTables[klass.id],
  },
  position: klass.graphPosition,
});

const edgesFromClass = klass => (klass.parents || []).map(parentKlass => ({
  source: parentKlass,
  target: klass.id,
}));

const canQuery = (bayModule, klasses, individuals, queryIndividual) => {
  const otherIndividuals = individuals.filter(n => n.label !== queryIndividual.label);

  const rsClasses = klasses.map(toRsClass);
  return bayModule.can_query(rsClasses, otherIndividuals, queryIndividual);
};

const query = (bayModule, klasses, individuals, queryIndividual) => {
  const otherIndividuals = individuals.filter(n => n.label !== queryIndividual.label);

  const rsClasses = klasses.map(toRsClass);
  return bayModule.query(rsClasses, otherIndividuals, queryIndividual);
};

const printProbability = probability => `${(probability * 100).toFixed(2)} %`;

// / Return all classes that can be inferred from the ontology for a single class
const inferredClasses = (ontologyClasses, concreteClass) => {
  const parentClasses = (ontClass) => {
    let classes = [ontClass.id];
    if (ontClass.parents === []) {
      return uniq(classes);
    }
    ontClass.parents.forEach((parent) => {
      const parentOntClass = ontologyClasses.find(n => n.id === parent);
      const pClasses = parentClasses(parentOntClass);
      classes = [].concat(classes, pClasses);
    });
    return uniq(classes);
  };

  const concreteOntClass = ontologyClasses.find(n => n.id === concreteClass);
  return parentClasses(concreteOntClass);
};

// / Enrich a proposition with information that can be inferred via the ontology
const enrichPropositionInference = (plainProposition, ontologyClasses) => {
  const proposition = Object.assign({}, plainProposition);
  let inferredKlasses = uniq(flatMap(proposition.class_memberships, klass => inferredClasses(ontologyClasses, klass)));
  inferredKlasses = difference(inferredKlasses, proposition.class_memberships);
  proposition.inferred_class_memberships = inferredKlasses;

  return proposition;
};

// / Fold the inferred fields of a proposition into its non-inferred equivalents
const compactProposition = (proposition) => {
  const compactProposition = Object.assign({}, proposition);

  compactProposition.class_memberships = [].concat(
    compactProposition.class_memberships,
    compactProposition.inferred_class_memberships,
  );
  delete (compactProposition.inferred_class_memberships);

  return compactProposition;
};

const hashAsJson = (obj) => {
  const buf = Buffer.from(sha3_256(JSON.stringify(obj)), 'hex');
  const hash = multihash.toB58String(multihash.encode(buf, 'sha3-256'));

  return hash;
};

// / Give a plaintext explanation of a proposition
const explainProposition = (plainProposition, ontologyClasses) => {
  if (!plainProposition) {
    return null;
  }
  // TODO: replace with real hash function from Rust core
  const proposition_hash = hashAsJson(plainProposition);
  const proposition = enrichPropositionInference(plainProposition, ontologyClasses);

  const asserted = [];
  const asserted_rdf = [];
  if (proposition.label !== '') {
    asserted.push(`There is a entity named ${proposition.label}. (The name does not have any influence on the reasoning.)`);
    asserted_rdf.push({
      subject: `spread://${proposition_hash}`,
      predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#label',
      object: `"${proposition.label}"^^en`,
    });
  }
  proposition.class_memberships.forEach((klass) => {
    asserted.push(`${proposition.label} is a ${klass}`);
    asserted_rdf.push({
      subject: `spread://${proposition_hash}`,
      predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      object: `spread://${hashAsJson(klass)}`,
    });
  });

  const inferred = [];
  proposition.inferred_class_memberships.forEach((klass) => {
    inferred.push(`${proposition.label} is a ${klass}`);
  });

  return {
    asserted,
    asserted_rdf,
    inferred,
  };
};

module.exports = {
  canQuery,
  compactProposition,
  edgesFromClass,
  enrichPropositionInference,
  explainProposition,
  hashAsJson,
  nodeFromClass,
  printProbability,
  query,
  toRsClass,
};
