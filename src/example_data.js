const exampleClasses = [
  {
    id: 'Organization',
    parents: [],
    graphPosition: {x: 500, y: 100},
  },
  {
    id: 'Company',
    parents: ['Organization'],
    graphPosition: {x: 100, y: 500},
  },
  {
    id: 'ForProfit',
    parents: ['Company'],
    graphPosition: {x: 100, y: 1000},
  },
  {
    id: 'NotForProfit',
    parents: ['Company'],
    graphPosition: {x: 500, y: 1000},
  },
  {
    id: 'GovernmentAgency',
    parents: ['Organization'],
    graphPosition: {x: 1000, y: 500},
  },
  {
    id: 'University',
    parents: ['Organization'],
    graphPosition: {x: 500, y: 500},
  },
]

const exampleIndividuals = [
  {
    label: 'Airweb',
    class_memberships: ["Organization", "Company", "ForProfit"],
  },
  {
    label: 'Daimler AG',
    class_memberships: ["Organization", "Company", "ForProfit"],
  },
  {
    label: 'BlablaCar',
    class_memberships: ["Organization", "Company", "ForProfit"],
  },
  {
    label: 'Aalto University',
    class_memberships: ["Organization", "University"],
  },
  {
    label: 'Cambridge University',
    class_memberships: ["Organization", "University"],
  },
];

module.exports = {
  exampleClasses,
  exampleIndividuals,
};
