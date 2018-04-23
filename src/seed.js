/* eslint-disable */
import Web3 from 'web3';
import ethers from 'ethers';
import OntologyStorage from './OntologyStore';
import { annotationStore as ontologyStoreConfig } from './config';
import { Annotation, Class as Klass, Individual } from './classes';
import { b58ToSolidityBytes } from './helpers';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const ontologyStorage = new OntologyStorage(web3, ontologyStoreConfig);
const StorageContract = ontologyStorage.buildStorageContract();
StorageContract.defaults({ gas: 1000000 });

const truffleContract = StorageContract.at(ontologyStoreConfig.address);

const buildEthersContract = address => {
  const abi = StorageContract.abi;
  const privateKey =
    '0x1c1a965a9fb6beb254bafa72588797b0268f43783cffbfa41659f47ae77a3529';
  const provider = new ethers.providers.JsonRpcProvider();
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(address, abi, wallet);

  return contract;
};

const contract = buildEthersContract(ontologyStoreConfig.address);

// Transactions are made in serial so that the transaction nonce is correct
const ann_organization = new Annotation({
  cachedCid: 'z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR',
  property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
  value: 'Organization',
})
  .store(contract)
  .then(() => console.log('Stored annotation label: <Organization>'));

const ann_company = ann_organization.then(() =>
  new Annotation({
    cachedCid: 'z4mSmMHRyExN3BMXCz7PLzX7jiH45MDVvPAiecjTaGhPzNnFHuc',
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'Company',
  })
    .store(contract)
    .then(() => console.log('Stored annotation label: <Company>')),
);

const ann_university = ann_company.then(() =>
  new Annotation({
    cachedCid: 'z4mSmMHWKC5G8vF3bi2ErCpUr9jiTyVFkdPnkmwaKQ3LrkNCtWT',
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'University',
  })
    .store(contract)
    .then(() => console.log('Stored annotation label: <University>')),
);

const ann_wikipedia = ann_university.then(() =>
  new Annotation({
    cachedCid: 'z4mSmMHecpvSPjqZ1Us3RHEoxPSK5duEQHhELyvuTQ3kUjLsBxz',
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: 'Wikipedia',
  })
    .store(contract)
    .then(() => console.log('Stored annotation label: <Wikipedia>')),
);

const class_organization = ann_wikipedia.then(() =>
  new Klass({
    cachedCid: 'z4mtJt9q7bNTx2pg6QVhjx6UzKKA32oHmdaQ4VA8xDb8WTAoiwg',
    annotations: ['z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR'],
  })
    .store(contract)
    .then(() => console.log('Stored class: <Organization>')),
);

const class_company = Promise.all([ann_company, class_organization]).then(() =>
  new Klass({
    cachedCid: 'z4mtJt9fazsfmb9fpZb4PJREvTVJYMyg8RkmoyaJdxtSjDxef5U',
    annotations: ['z4mSmMHRyExN3BMXCz7PLzX7jiH45MDVvPAiecjTaGhPzNnFHuc'],
    sub_class_of_class: ['z4mtJt9q7bNTx2pg6QVhjx6UzKKA32oHmdaQ4VA8xDb8WTAoiwg'],
  })
    .store(contract)
    .then(() => console.log('Stored class: <Company>')),
);
const class_university = Promise.all([
  ann_company,
  class_organization,
  class_company,
]).then(() =>
  new Klass({
    cachedCid: 'z4mtJt9c5dY8sfAMu9NtnjcEmEZyPiKNpoc7kYJp6k7g11PF91t',
    annotations: ['z4mSmMHWKC5G8vF3bi2ErCpUr9jiTyVFkdPnkmwaKQ3LrkNCtWT'],
    sub_class_of_class: ['z4mtJt9q7bNTx2pg6QVhjx6UzKKA32oHmdaQ4VA8xDb8WTAoiwg'],
  })
    .store(contract)
    .then(() => console.log('Stored class: <University>')),
);

const ind_wikipedia_organization_pro = Promise.all([
  ann_wikipedia,
  class_organization,
  class_university,
]).then(() =>
  new Individual({
    annotations: ['z4mSmMHecpvSPjqZ1Us3RHEoxPSK5duEQHhELyvuTQ3kUjLsBxz'],
    class_assertions: ['z4mtJt9q7bNTx2pg6QVhjx6UzKKA32oHmdaQ4VA8xDb8WTAoiwg'],
  }).store(contract),
);

const ind_wikipedia_organization_con = Promise.all([
  ann_wikipedia,
  class_organization,
  ind_wikipedia_organization_pro,
]).then(() =>
  new Individual({
    annotations: ['z4mSmMHecpvSPjqZ1Us3RHEoxPSK5duEQHhELyvuTQ3kUjLsBxz'],
    negative_class_assertions: [
      'z4mtJt9q7bNTx2pg6QVhjx6UzKKA32oHmdaQ4VA8xDb8WTAoiwg',
    ],
  }).store(contract),
);

const repeat = () => {
  const date = new Date().toString();
  const ann_university = new Annotation({
    property: 'zW1aUyiEVULyTsGHRAD1ERdZj8XG3B3PrLZokrZkNCdUKR2',
    value: date,
  })
    .store(contract)
    .then(ann => {
      console.log('Stored annotation label: <', date, '>');

      setTimeout(repeat, 1000);
    });
};
