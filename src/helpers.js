import {
  difference,
  flatMap,
  uniq,
} from 'lodash-es';
import multihash from 'multihashes';
import { sha3_256 } from 'js-sha3'; // eslint-disable-line

const toRsClass = klass => ({
  label: klass.id || klass.label,
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

  const inferredKlasses = proposition.class_memberships
    |> (_ => flatMap(_, klass => inferredClasses(ontologyClasses, klass)))
    |> uniq
    |> (_ => difference(_, proposition.class_memberships));
  proposition.inferred_class_memberships = inferredKlasses;

  return proposition;
};

// / Fold the inferred fields of a proposition into its non-inferred equivalents
const compactProposition = (proposition) => {
  const compactPropo = Object.assign({}, proposition);

  compactPropo.class_memberships = [].concat(
    compactPropo.class_memberships,
    compactPropo.inferred_class_memberships,
  );
  delete (compactPropo.inferred_class_memberships);

  return compactPropo;
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
  const propositionHash = hashAsJson(plainProposition);
  const proposition = enrichPropositionInference(plainProposition, ontologyClasses);

  const asserted = [];
  const assertedRdf = [];
  if (proposition.label !== '') {
    asserted.push(`There is a entity named ${proposition.label}. (The name does not have any influence on the reasoning.)`);
    assertedRdf.push({
      subject: `spread://${propositionHash}`,
      predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#label',
      object: `"${proposition.label}"^^en`,
    });
  }
  proposition.class_memberships.forEach((klass) => {
    asserted.push(`${proposition.label} is a ${klass}`);
    assertedRdf.push({
      subject: `spread://${propositionHash}`,
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
    asserted_rdf: assertedRdf,
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
