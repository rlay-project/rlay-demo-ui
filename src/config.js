import queryString from 'query-string';

const ontologyStorageContract = require('./contracts/OntologyStorage.json');
const tokenContract = require('./contracts/RlayToken.json');
const propositionLedgerContract = require('./contracts/PropositionLedger.json');

const getEnvironmentConfig = () => {
  const params = queryString.parse(window.location.hash);
  const privateKey = params.pk;

  const useInternalWeb3 = !!privateKey;

  return {
    privateKey,
    useInternalWeb3,
  };
};

module.exports = {
  storageKey: 'knowledge_base',

  annotationStore: {
    abi: ontologyStorageContract,
    // address: '0xf0cd575450fc03b90eead03d65e79741a19665e4', // local
    address: '0x07a1a34b6f59489c60e49dfdc723f7eccc5a8616',
  },
  tokenContract: {
    abi: tokenContract,
    // address: '0x10ef71366ad76d6bddddc66677c38e137aa564db', // local
    address: '0x352d4c6c94d5166a5a55164d0c6cbcb8fea0d54a',
  },
  propositionLedgerContract: {
    abi: propositionLedgerContract,
    // address: '0xe90f43a68756d880f2dc83e0ae1bf51d31726d36', // local
    address: '0x993ba8bb15efd9aff4eba5e21406f350ef3677e8',
  },

  getEnvironmentConfig,
};
