import Viz from 'viz.js';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import ErrorBoundary from 'react-error-boundary';
import { Web3Provider } from 'react-web3';

import NetworkCPT from './NetworkCPT.jsx';
import NetworkMarginals from './NetworkMarginals.jsx';
import PropositionTab from './PropositionTab.jsx';
import StorageTab from './StorageTab.jsx';
import TruthTable from './TruthTable.jsx';
import { exampleAnnotations, exampleClasses, exampleIndividuals } from './example_data';
import { storageKey } from './config';
import { Annotation } from './classes';

const VizGraph = ({ graphString }) => {
  const graphDot = graphString;
  const image = Viz(graphDot, { format: 'svg' });

  return (
    <span dangerouslySetInnerHTML={{ __html: image }} />
  );
};

Rust.bay_web.then((module) => {
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
      { graphMaxCliquesDot.map(clique => (
        <VizGraph graphString={clique} />
    )) }
      <span>
        {'Hash for AnnotationProperty <rdfs:label>'}
        { annotationPropertyLabel }
      </span>
    </span>
  );

  ReactDOM.render(main, window.document.getElementById('react'));
});


class Page extends React.Component {
  state = {
    activeTab: 'propositions',
    ontologyClasses: exampleClasses,
    ontologyIndividuals: exampleIndividuals,
  }

  componentDidMount() {
    this.reloadStorage();
  }

  reloadStorage = () => {
    try {
      const rawData = window.localStorage.getItem(storageKey);
      if (!rawData) {
        return;
      }
      const data = JSON.parse(rawData);

      this.setState({
        ontologyClasses: data.classes,
        ontologyIndividuals: data.propositions,
      });
    } catch (err) {
      console.error(err); // eslint-disable-line
    }
  }

  updateStorage = () => {
    const data = {
      classes: this.state.ontologyClasses,
      propositions: this.state.ontologyIndividuals,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }

  handleAddProposition = (proposition) => {
    this.setState({
      ontologyIndividuals: [].concat(this.state.ontologyIndividuals, proposition),
    }, () => this.updateStorage());
  }

  handleDeleteProposition = (proposition) => {
    const ontologyIndividuals = this.state.ontologyIndividuals
      .filter(n => n.label !== proposition.label);
    this.setState({ ontologyIndividuals }, () => this.updateStorage());
  }

  renderNav() {
    const { activeTab } = this.state;

    return (
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={classNames({ 'nav-link': true, active: (activeTab === 'network_cpt') })}
            onClick={() => this.setState({ activeTab: 'network_cpt' })}
          >
            Network (CPTs)
          </a>
        </li>
        <li className="nav-item">
          <a
            className={classNames({ 'nav-link': true, active: (activeTab === 'propositions') })}
            onClick={() => this.setState({ activeTab: 'propositions' })}
          >
            Propositions
          </a>
        </li>
        <li className="nav-item">
          <a
            className={classNames({ 'nav-link': true, active: (activeTab === 'storage') })}
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
    const clearStorage = () => {
      window.localStorage.removeItem(storageKey);
      this.reloadStorage();
    };
    return (
      <ErrorBoundary>
        <StorageTab
          onTriggerReload={clearStorage}
        />
      </ErrorBoundary>
    );
  }

  render() {
    return (
      <Web3Provider>
        <div>
          { this.renderNav() }
          { this.renderTabContainer() }
        </div>
      </Web3Provider>
    );
  }
}

Rust.bay_web.then((module) => {
  const main = (
    <Page bayModule={module} />
  );

  Object.keys(exampleAnnotations).forEach((storedHash) => {
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
