const annotationStoreAbi = require('./contracts/AnnotationStore.json');

module.exports = {
  storageKey: 'knowledge_base',

  annotationStore: {
    abi: annotationStoreAbi,
    address: '0x3d0f07fd208a8ccb6bfb7e268fbcd3b64af647ed',
  },
};
