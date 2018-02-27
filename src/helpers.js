const toRsClass = (klass) => {
  return {
    label: klass.id,
    parents: (klass.parents || []),
  };
}

const canQuery = (bayModule, klasses, individuals, queryIndividual) => {
  // TODO: remove queryIndividual from individuals
  const otherIndividuals = individuals;

  const rsClasses = klasses.map(toRsClass);
  return bayModule.can_query(rsClasses, otherIndividuals, queryIndividual);
}

const query = (bayModule, klasses, individuals, queryIndividual) => {
  // TODO: remove queryIndividual from individuals
  const otherIndividuals = individuals.filter(n => n.label !== queryIndividual.label);

  const rsClasses = klasses.map(toRsClass);
  return bayModule.query(rsClasses, otherIndividuals, queryIndividual);
}

module.exports = {
  canQuery,
  query,
  toRsClass,
};
