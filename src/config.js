const ontologyStorageContract = require('./contracts/OntologyStorage.json');
const tokenContract = require('./contracts/SpreadToken.json');
const propositionLedgerContract = require('./contracts/PropositionLedger.json');

module.exports = {
  storageKey: 'knowledge_base',

  annotationStore: {
    abi: ontologyStorageContract,
    address: '0xf0cd575450fc03b90eead03d65e79741a19665e4',
  },
  tokenContract: {
    abi: tokenContract,
    address: '0x10ef71366ad76d6bddddc66677c38e137aa564db',
  },
  propositionLedgerContract: {
    abi: propositionLedgerContract,
    address: '0xe90f43a68756d880f2dc83e0ae1bf51d31726d36',
  },
};
