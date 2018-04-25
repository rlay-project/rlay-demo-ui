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

const ann_comment_organization = ann_wikipedia.then(() =>
  new Annotation({
    cachedCid: 'z4mSmMHPUE7UBNQxsff9AMPNL2wzfTE1Z5NuDumaais7LdT1be6',
    property: 'zW1fiG75n55P1ix184atgmWHu6FhgKzQqtdiA1wQcnPhPSL',
    value: 'A group of people working towards a common goal.',
  })
    .store(contract)
    .then(() =>
      console.log(
        'Stored annotation label: <A group of people working towards a common goal.>',
      ),
    ),
);

const ann_comment_company = ann_comment_organization.then(() =>
  new Annotation({
    cachedCid: 'z4mSmMHZnr3XLZ9RJfcDWhTWzvP9YrpuxyVowUtLFjk9noEFq5w',
    property: 'zW1fiG75n55P1ix184atgmWHu6FhgKzQqtdiA1wQcnPhPSL',
    value: 'A group of people who work together professionaly.',
  })
    .store(contract)
    .then(() =>
      console.log(
        'Stored annotation label: <A group of people who work together professionaly.>',
      ),
    ),
);

const ann_comment_university = ann_comment_company.then(() =>
  new Annotation({
    cachedCid: 'z4mSmMHWd2G2vVJQ6uN7V8uX2wjXCvHN2iSXJngU1amVkqCXv3o',
    property: 'zW1fiG75n55P1ix184atgmWHu6FhgKzQqtdiA1wQcnPhPSL',
    value: 'Institution of higher eduction.',
  })
    .store(contract)
    .then(() =>
      console.log('Stored annotation label: <Institution of higher eduction.>'),
    ),
);

const class_organization = ann_comment_university.then(() =>
  new Klass({
    cachedCid: 'z4mtJt9fBRkH2MzY8Hjpw1fkeZeukJ5YbgJoHFpbLfF23SJRKiP',
    annotations: [
      'z4mSmMHNfcHxm7GjmrVZi8KRosUXr7qKdjHGWMqgTKJxN5s3aZR',
      'z4mSmMHPUE7UBNQxsff9AMPNL2wzfTE1Z5NuDumaais7LdT1be6',
    ],
  })
    .store(contract)
    .then(() => console.log('Stored class: <Organization>')),
);

const class_company = Promise.all([ann_company, class_organization]).then(() =>
  new Klass({
    cachedCid: 'z4mtJt9jFA6GDKaCTNUwrcz84Dh3RXVhktJutkQ7MQHyPYDVGcs',
    annotations: [
      'z4mSmMHRyExN3BMXCz7PLzX7jiH45MDVvPAiecjTaGhPzNnFHuc',
      'z4mSmMHZnr3XLZ9RJfcDWhTWzvP9YrpuxyVowUtLFjk9noEFq5w',
    ],
    sub_class_of_class: ['z4mtJt9fBRkH2MzY8Hjpw1fkeZeukJ5YbgJoHFpbLfF23SJRKiP'],
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
    cachedCid: 'z4mtJt9cU1RkrdzjK9GRsh6Nrx9ZeZ5J4JZzAomThhiy7RsdBSY',
    annotations: [
      'z4mSmMHWKC5G8vF3bi2ErCpUr9jiTyVFkdPnkmwaKQ3LrkNCtWT',
      'z4mSmMHWd2G2vVJQ6uN7V8uX2wjXCvHN2iSXJngU1amVkqCXv3o',
    ],
    sub_class_of_class: ['z4mtJt9fBRkH2MzY8Hjpw1fkeZeukJ5YbgJoHFpbLfF23SJRKiP'],
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
    class_assertions: ['z4mtJt9fBRkH2MzY8Hjpw1fkeZeukJ5YbgJoHFpbLfF23SJRKiP'],
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
      'z4mtJt9fBRkH2MzY8Hjpw1fkeZeukJ5YbgJoHFpbLfF23SJRKiP',
    ],
  }).store(contract),
);

const ind_wikipedia_university_pro = ind_wikipedia_organization_con.then(() =>
  new Individual({
    annotations: ['z4mSmMHecpvSPjqZ1Us3RHEoxPSK5duEQHhELyvuTQ3kUjLsBxz'],
    class_assertions: ['z4mtJt9cU1RkrdzjK9GRsh6Nrx9ZeZ5J4JZzAomThhiy7RsdBSY'],
  }).store(contract),
);

const ind_wikipedia_university_con = ind_wikipedia_university_pro.then(() =>
  new Individual({
    annotations: ['z4mSmMHecpvSPjqZ1Us3RHEoxPSK5duEQHhELyvuTQ3kUjLsBxz'],
    negative_class_assertions: [
      'z4mtJt9cU1RkrdzjK9GRsh6Nrx9ZeZ5J4JZzAomThhiy7RsdBSY',
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
