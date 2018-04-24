import Viz from 'viz.js';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import ErrorBoundary from 'react-error-boundary';
import Web3 from 'web3';
import { Web3Provider } from 'react-web3';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import OntologyStore from './OntologyStore';
import PropositionLedger from './PropositionLedger';
import NetworkCPT from './components/NetworkCPT.jsx';
import NetworkMarginals from './components/NetworkMarginals.jsx';
import PropositionTab from './components/PropositionTab.jsx';
import StorageTab from './components/StorageTab.jsx';
import TruthTable from './components/TruthTable.jsx';
import ConfirmTransactionModal from './components/ConfirmTransactionModal.jsx';
import {
  exampleAnnotationProperties,
  exampleAnnotations,
  // exampleClasses,
  exampleIndividuals,
} from './example_data';
import {
  storageKey,
  annotationStore as ontologyStoreConfig,
  tokenContract,
  propositionLedgerContract,
  getEnvironmentConfig,
} from './config';
import { Annotation, Proposition } from './classes';

const VizGraph = ({ graphString }) => {
  const graphDot = graphString;
  const image = Viz(graphDot, { format: 'svg' });

  return <span dangerouslySetInnerHTML={{ __html: image }} />;
};

Rust.bay_web.then(module => {
  const graphDot = module.print_graph();
  const graphMoralDot = module.print_moral_graph();
  const graphMaxCliquesDot = module.print_max_cliques();
  const graphJoinTreeDot = module.print_join_tree();

  const truthTable = module.truth_table();
  const annotationPropertyLabel = module.annotation_property_label();

  const main = (
    <span>
      <span style={{ display: 'inline-block' }}>
        <h2>Original Graph</h2>
        <VizGraph graphString={graphDot} />
      </span>
      <span style={{ display: 'inline-block' }}>
        <h2>Moral Graph</h2>
        <VizGraph graphString={graphMoralDot} />
      </span>
      <span style={{ display: 'inline-block' }}>
        <h2>Join Tree</h2>
        <p dangerouslySetInnerHTML={{ __html: graphJoinTreeDot }} />
      </span>
      <TruthTable tt={truthTable} />
      {graphMaxCliquesDot.map(clique => <VizGraph graphString={clique} />)}
      <span>
        {'Hash for AnnotationProperty <rdfs:label>'}
        {annotationPropertyLabel}
      </span>
    </span>
  );

  ReactDOM.render(main, window.document.getElementById('react'));
});

class RootStore {
  calculateHash = null;

  constructor(calculateHash) {
    this.calculateHash = calculateHash;

    const ontologyStore = new OntologyStore(window.web3, ontologyStoreConfig);
    ontologyStore.fetchNetworkAnnotations();
    ontologyStore.fetchNetworkClasses();
    ontologyStore.fetchNetworkIndividuals();
    this.ontologyStore = ontologyStore;

    const propositionLedger = new PropositionLedger(
      window.web3,
      propositionLedgerContract,
      tokenContract,
    );
    propositionLedger.updateTokenAccount();
    propositionLedger.fetchNetworkPropositions();
    this.propositionLedger = propositionLedger;
  }

  @computed
  get annotations() {
    const annotations = this.ontologyStore.listableAnnotations.map(
      this.calculateHash,
    );
    return annotations;
  }

  @computed
  get classes() {
    const classes = this.ontologyStore.listableClasses.map(this.calculateHash);
    classes.forEach(item => item.enrichWithAnnotations(this.annotations));
    return classes;
  }

  @computed
  get individuals() {
    const individuals = this.ontologyStore.listableIndividuals.map(
      this.calculateHash,
    );
    individuals.forEach(item => item.enrichWithAnnotations(this.annotations));
    individuals.forEach(item => item.enrichWithClasses(this.classes));
    return individuals;
  }

  @computed
  get propositionGroups() {
    const findLabelAnnotation = (individual, annotations) => {
      let containedAnnotations = individual.annotations.map(cid =>
        annotations.find(item => item.cid() === cid),
      );
      containedAnnotations = containedAnnotations.filter(Boolean);
      return (
        containedAnnotations.find(n => n.isLabel()) || { annotationLabel: '' }
      );
    };

    const enrichIndividualWithProposition = (individual, propositions) => {
      const propositon = propositions.find(
        n => n.individualCid === individual.cid(),
      );

      const item = individual.clone();
      if (propositon) {
        item.amount = propositon.amount;
      } else {
        item.amount = 0;
      }
      return item;
    };

    const enrichGroupWithProposition = (group, propositions) =>
      group.map(subGroup =>
        subGroup.map(individual =>
          enrichIndividualWithProposition(individual, propositions),
        ),
      );

    const groups = Proposition.groupContradicting(this.individuals).map(group =>
      enrichGroupWithProposition(group, this.propositionLedger.propositions),
    );

    const propositionGroups = groups.map(group => ({
      groups: {
        class_assertions: group,
      },
      subject: findLabelAnnotation(group[0][0], this.annotations),
    }));

    return propositionGroups;
  }
}

@observer
class Page extends React.Component {
  constructor(props) {
    super(props);

    const { privateKey, useInternalWeb3 } = getEnvironmentConfig();

    if (useInternalWeb3) {
      console.debug('No injected web3 found; Using own instance');
      window.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545'),
      );
    }

    this.privateKey = privateKey;
    this.useInternalWeb3 = useInternalWeb3;

    const calculateHash = item => {
      const newItem = item.clone();
      newItem.cid(this.props.bayModule);
      return newItem;
    };

    this.store = new RootStore(calculateHash);
  }

  state = {
    activeTab: 'storage',
    // ontologyClasses: exampleClasses,
    ontologyIndividuals: exampleIndividuals,
    ontologyAnnotationProperties: exampleAnnotationProperties,
    ontologyClasses: [],
  };

  reloadStorage = () => {
    try {
      const rawData = window.localStorage.getItem(storageKey);
      if (!rawData) {
        return;
      }
      const data = JSON.parse(rawData);

      this.setState({
        // ontologyClasses: data.classes,
        ontologyIndividuals: data.propositions,
      });
    } catch (err) {
      console.error(err); // eslint-disable-line
    }
  };

  updateStorage = () => {
    const data = {
      classes: this.state.ontologyClasses,
      propositions: this.state.ontologyIndividuals,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(data));
  };

  handleAddProposition = proposition => {
    this.setState(
      {
        ontologyIndividuals: [].concat(
          this.state.ontologyIndividuals,
          proposition,
        ),
      },
      () => this.updateStorage(),
    );
  };

  handleDeleteProposition = proposition => {
    const ontologyIndividuals = this.state.ontologyIndividuals.filter(
      n => n.label !== proposition.label,
    );
    this.setState({ ontologyIndividuals }, () => this.updateStorage());
  };

  renderNav() {
    const { activeTab } = this.state;

    return (
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={classNames({
              'nav-link': true,
              active: activeTab === 'network_cpt',
            })}
            onClick={() => this.setState({ activeTab: 'network_cpt' })}
          >
            Network (CPTs)
          </a>
        </li>
        <li className="nav-item">
          <a
            className={classNames({
              'nav-link': true,
              active: activeTab === 'propositions',
            })}
            onClick={() => this.setState({ activeTab: 'propositions' })}
          >
            Propositions
          </a>
        </li>
        <li className="nav-item">
          <a
            className={classNames({
              'nav-link': true,
              active: activeTab === 'storage',
            })}
            onClick={() => this.setState({ activeTab: 'storage' })}
          >
            Storage
          </a>
        </li>
      </ul>
    );
  }

  renderTabContainer() {
    const { activeTab } = this.state;
    if (activeTab === 'network_cpt') {
      return this.renderTabNetworkCPT();
    } else if (activeTab === 'network_marginals') {
      return this.renderTabNetworkMarginals();
    } else if (activeTab === 'propositions') {
      return this.renderTabPropositions();
    } else if (activeTab === 'storage') {
      return this.renderTabStorage();
    }
    return null;
  }

  renderTabNetworkCPT() {
    const { bayModule } = this.props;
    const { ontologyIndividuals, ontologyClasses } = this.state;

    return (
      <ErrorBoundary>
        <NetworkCPT
          bayModule={bayModule}
          ontologyClasses={ontologyClasses}
          ontologyIndividuals={ontologyIndividuals}
        />
      </ErrorBoundary>
    );
  }

  renderTabNetworkMarginals() {
    const { bayModule } = this.props;
    const { ontologyIndividuals, ontologyClasses } = this.state;

    return (
      <ErrorBoundary>
        <NetworkMarginals
          bayModule={bayModule}
          ontologyClasses={ontologyClasses}
          ontologyIndividuals={ontologyIndividuals}
        />
      </ErrorBoundary>
    );
  }

  renderTabPropositions() {
    const { bayModule } = this.props;
    const { ontologyIndividuals, ontologyClasses } = this.state;

    return (
      <ErrorBoundary>
        <PropositionTab
          bayModule={bayModule}
          ontologyClasses={ontologyClasses}
          ontologyIndividuals={ontologyIndividuals}
          onAddProposition={this.handleAddProposition}
          onDeleteProposition={this.handleDeleteProposition}
        />
      </ErrorBoundary>
    );
  }

  renderTabStorage() {
    const { ontologyAnnotationProperties } = this.state;
    const { ontologyStore, propositionLedger } = this.store;

    const clearStorage = () => {
      window.localStorage.removeItem(storageKey);
      this.reloadStorage();
    };

    const calculateHash = item => {
      const newItem = item.clone();
      newItem.cid(this.props.bayModule);
      return newItem;
    };

    const handleSubmitAnnotation = item =>
      ontologyStore.createLocalAnnotation(calculateHash(item));
    const handleSubmitClass = item =>
      ontologyStore.createLocalClass(calculateHash(item));
    const handleSubmitIndividual = item =>
      ontologyStore.createLocalIndividual(calculateHash(item));

    const handleSignerCreate = signer => {
      ontologyStore.setSigner(signer);
      propositionLedger.setSigner(signer);
    };

    return (
      <ErrorBoundary>
        <ConfirmTransactionModal
          onSignerCreate={handleSignerCreate}
          privateKey={this.privateKey}
        />
        <StorageTab
          onSubmitAnnotation={handleSubmitAnnotation}
          onSubmitClass={handleSubmitClass}
          onSubmitIndividual={handleSubmitIndividual}
          onTriggerReload={clearStorage}
          onUploadAnnotation={ontologyStore.uploadAnnotation}
          onUploadClass={ontologyStore.uploadClass}
          onUploadIndividual={ontologyStore.uploadIndividual}
          ontologyAnnotationProperties={ontologyAnnotationProperties}
          ontologyAnnotations={this.store.annotations}
          ontologyClasses={this.store.classes}
          ontologyIndividuals={this.store.individuals}
          tokenAccount={propositionLedger.tokenAccount}
          propositionGroups={this.store.propositionGroups}
          onSetAllowance={propositionLedger.setAllowance}
          onAddWeight={propositionLedger.addWeight}
        />
      </ErrorBoundary>
    );
  }

  render() {
    let app = (
      <div>
        {this.renderNav()}
        {this.renderTabContainer()}
      </div>
    );

    if (!this.useInternalWeb3) {
      app = <Web3Provider>{app}</Web3Provider>;
    }

    return app;
  }
}

Rust.bay_web.then(module => {
  const main = <Page bayModule={module} />;

  Object.keys(exampleAnnotations).forEach(storedHash => {
    const val = new Annotation(exampleAnnotations[storedHash]);
    const calculatedHash = val.hash(module);
    console.log('ANN', storedHash, calculatedHash, val.value);
  });
  // exampleClasses.forEach((klass) => {
  // console.log('klass', klass);
  // const annotationPropertyLabel = module.annotation_property_label();
  // const annotationLabel = {
  // property: annotationPropertyLabel,
  // value: klass.label,
  // };
  // const hashedAnnotation = module.hash_annotation(annotationLabel);
  // console.log('annotation', annotationLabel, hashedAnnotation);

  // const hash = module.hash_class(toRsClass(klass));
  // console.log('klasshash', klass, hash);
  // });

  ReactDOM.render(main, window.document.getElementById('react-graph'));
});
