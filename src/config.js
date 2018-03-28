const annotationStoreAbi = require('./contracts/AnnotationStore.json');

module.exports = {
  storageKey: 'knowledge_base',

  annotationStore: {
    abi: annotationStoreAbi,
    address: '0xf0cd575450fc03b90eead03d65e79741a19665e4',
  },
};
