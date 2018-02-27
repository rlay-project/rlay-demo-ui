const toRsClass = (klass) => {
  return {
    label: klass.id,
    parents: (klass.parents || []),
  };
}

const nodeFromClass = (klass, truthTables) => {
  return {
    id: klass.id,
    label: {
      id: klass.id,
      tt: truthTables[klass.id],
    },
    position: klass.graphPosition,
  };
};

const edgesFromClass = (klass) => {
  return (klass.parents || []).map(parentKlass => ({
    source: parentKlass,
    target: klass.id,
  }));
}

const canQuery = (bayModule, klasses, individuals, queryIndividual) => {
  const otherIndividuals = individuals.filter(n => n.label !== queryIndividual.label);

  const rsClasses = klasses.map(toRsClass);
  return bayModule.can_query(rsClasses, otherIndividuals, queryIndividual);
}

const query = (bayModule, klasses, individuals, queryIndividual) => {
  const otherIndividuals = individuals.filter(n => n.label !== queryIndividual.label);

  const rsClasses = klasses.map(toRsClass);
  return bayModule.query(rsClasses, otherIndividuals, queryIndividual);
}

const printProbability = (probability) => {
  return `${(probability * 100).toFixed(2)} %`;
}

module.exports = {
  canQuery,
  edgesFromClass,
  nodeFromClass,
  printProbability,
  query,
  toRsClass,
};
