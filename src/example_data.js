/* eslint-disable quote-props */
const exampleAnnotations = {
  z4mSmEjD3mFCWmSuyySRggEnDdF31F6XQBAXLEKM5UAq4qhSfhB: {
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'Organization',
  },
  z4mSmEj9EdaR5X1DgVq77zB1jSmYHH8AdLfC1GkhiaXXUcQG7eZ: {
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'Company',
  },
  z4mSmEj8YnpBJGDHshn4oHqhgNv9YL7nCrPn81W8y22dnK7UDdv: {
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'ForProfit',
  },
  z4mSmEjK3bS6F4dnzVJ8tK87Wntjx34RaA43WQPUh2vFeG1wjve: {
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'NotForProfit',
  },
  z4mSmEjHSGC5ye4uLE8TmoswuQas6MpmUEsAJtznDPubfyAchv4: {
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'GovernmentAgency',
  },
  z4mSmEjNARTJpNgHm5ck2qyAF2c59FoRMGS4Shwy8aqjohgHXd8: {
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'University',
  },
};

const exampleClassesMap = {
  z4mtJmbX3Y18tnuQKSgzQoxwopiiFjt9ELwwxjFrjaw3igqR2iR: {
    // id: 'Organization',
    label: 'z4mSmEjD3mFCWmSuyySRggEnDdF31F6XQBAXLEKM5UAq4qhSfhB',
    parents: [],
  },
  z4mtJmbYDwcJbfqiJtn7ZkUTPmMP5PqJoARmVjDrGxXiao1a5vP: {
    // id: 'Company',
    label: 'z4mSmEj9EdaR5X1DgVq77zB1jSmYHH8AdLfC1GkhiaXXUcQG7eZ',
    parents: ['z4mtJmbX3Y18tnuQKSgzQoxwopiiFjt9ELwwxjFrjaw3igqR2iR'],
  },
  z4mtJmbLbFnvhrcSpsm5Unjwi9RR9U628aeSsevxNVzWXsvLnPo: {
    // id: 'ForProfit',
    label: 'z4mSmEj8YnpBJGDHshn4oHqhgNv9YL7nCrPn81W8y22dnK7UDdv',
    parents: ['z4mtJmbYDwcJbfqiJtn7ZkUTPmMP5PqJoARmVjDrGxXiao1a5vP'],
  },
  z4mtJmbMbGSCkZBrj3MCehaPKaU7i1cvGF3LXBwYyxZxr9K6eCg: {
    // id: 'NotForProfit',
    label: 'z4mSmEjK3bS6F4dnzVJ8tK87Wntjx34RaA43WQPUh2vFeG1wjve',
    parents: ['z4mtJmbYDwcJbfqiJtn7ZkUTPmMP5PqJoARmVjDrGxXiao1a5vP'],
  },
  z4mtJmbK3EfZVor99LdiG6FE1fQWVENdwQi3sUEQ75Q5wtfqXKE: {
    // id: 'GovernmentAgency',
    label: 'z4mSmEjHSGC5ye4uLE8TmoswuQas6MpmUEsAJtznDPubfyAchv4',
    parents: ['z4mtJmbX3Y18tnuQKSgzQoxwopiiFjt9ELwwxjFrjaw3igqR2iR'],
  },
  z4mtJmbMLekcsPmE9ZLncbxZArhNdorzn3MfGGsbC6PFFUzdw7V: {
    // id: 'University',
    label: 'z4mSmEjNARTJpNgHm5ck2qyAF2c59FoRMGS4Shwy8aqjohgHXd8',
    parents: ['z4mtJmbX3Y18tnuQKSgzQoxwopiiFjt9ELwwxjFrjaw3igqR2iR'],
  },
};

const exampleClasses = [
  {
    // id: 'Organization',
    label: 'z4mSmEjD3mFCWmSuyySRggEnDdF31F6XQBAXLEKM5UAq4qhSfhB',
    parents: [],
    graphPosition: { x: 500, y: 100 },
  },
  {
    // id: 'Company',
    label: 'z4mSmEj9EdaR5X1DgVq77zB1jSmYHH8AdLfC1GkhiaXXUcQG7eZ',
    parents: ['z4mtJmbX3Y18tnuQKSgzQoxwopiiFjt9ELwwxjFrjaw3igqR2iR'],
    graphPosition: { x: 100, y: 500 },
  },
  {
    // id: 'ForProfit',
    label: 'z4mSmEj8YnpBJGDHshn4oHqhgNv9YL7nCrPn81W8y22dnK7UDdv',
    parents: ['z4mtJmbYDwcJbfqiJtn7ZkUTPmMP5PqJoARmVjDrGxXiao1a5vP'],
    graphPosition: { x: 100, y: 1000 },
  },
  {
    // id: 'NotForProfit',
    label: 'z4mSmEjK3bS6F4dnzVJ8tK87Wntjx34RaA43WQPUh2vFeG1wjve',
    parents: ['z4mtJmbYDwcJbfqiJtn7ZkUTPmMP5PqJoARmVjDrGxXiao1a5vP'],
    graphPosition: { x: 500, y: 1000 },
  },
  {
    // id: 'GovernmentAgency',
    label: 'z4mSmEjHSGC5ye4uLE8TmoswuQas6MpmUEsAJtznDPubfyAchv4',
    parents: ['z4mtJmbX3Y18tnuQKSgzQoxwopiiFjt9ELwwxjFrjaw3igqR2iR'],
    graphPosition: { x: 1000, y: 500 },
  },
  {
    // id: 'University',
    label: 'z4mSmEjNARTJpNgHm5ck2qyAF2c59FoRMGS4Shwy8aqjohgHXd8',
    parents: ['z4mtJmbX3Y18tnuQKSgzQoxwopiiFjt9ELwwxjFrjaw3igqR2iR'],
    graphPosition: { x: 500, y: 500 },
  },
];

const exampleIndividuals = [
  {
    label: 'Airweb',
    class_memberships: ['Organization', 'Company', 'ForProfit'],
  },
  {
    label: 'Daimler AG',
    class_memberships: ['Organization', 'Company', 'ForProfit'],
  },
  {
    label: 'BlablaCar',
    class_memberships: ['Organization', 'Company', 'ForProfit'],
  },
  {
    label: 'Aalto University',
    class_memberships: ['Organization', 'University'],
  },
  {
    label: 'Cambridge University',
    class_memberships: ['Organization', 'University'],
  },
];

const exampleAnnotationProperties = [
  {
    hash: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'http://www.w3.org/2000/01/rdf-schema#label',
  },
  {
    hash: 'zW1fiG75n55P1ix184atgmWHu6FhgKzQqtdiA1wQcnPhPSL',
    value: 'http://www.w3.org/2000/01/rdf-schema#comment',
  },
];

module.exports = {
  exampleAnnotationProperties,
  exampleAnnotations,
  exampleClasses,
  exampleClassesMap,
  exampleIndividuals,
};
