import Viz from 'viz.js';
import React from 'react';
import ReactDOM from 'react-dom';
import JsonGraph, { Node as JsonGraphNode } from 'react-json-graph';
import classNames from 'classnames';
import ErrorBoundary from 'react-error-boundary';
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Form,
  FormGroup,
  FormFeedback,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import NetworkCPT from './NetworkCPT.jsx';
import NetworkMarginals from './NetworkMarginals.jsx';
import PropositionTab from './PropositionTab.jsx';
import StorageTab from './StorageTab.jsx';
import TruthTable from './TruthTable.jsx';
import { toRsClass } from './helpers';
import { exampleClasses, exampleIndividuals } from './example_data';
import { storageKey } from './config';

class Graph extends React.Component {
  render() {
    const graphDot = this.props.graphString;
    const image = Viz(graphDot, { format: 'svg' });

    return (
      <span dangerouslySetInnerHTML={{ __html: image }} />
    );
  }
}

Rust.bay_web.then((module) => {
  const graph_dot = module.print_graph();
  const graph_moral_dot = module.print_moral_graph();
  const graph_max_cliques_dot = module.print_max_cliques();
  const graph_join_tree_dot = module.print_join_tree();

  const truth_table = module.truth_table();
  const truth_tables = module.truth_tables();

  const main = (
    <span>
      <span style={{ display: 'inline-block' }}>
        <h2>Original Graph</h2>
        <Graph graphString={graph_dot} />
      </span>
      <span style={{ display: 'inline-block' }}>
        <h2>Moral Graph</h2>
        <Graph graphString={graph_moral_dot} />
      </span>
      <span style={{ display: 'inline-block' }}>
        <h2>Join Tree</h2>
        <p dangerouslySetInnerHTML={{ __html: graph_join_tree_dot }} />
      </span>
      <TruthTable tt={truth_table} />
      { graph_max_cliques_dot.map(clique => (
        <Graph graphString={clique} />
    )) }
    </span>
  );

  ReactDOM.render(main, document.getElementById('react'));
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
      const raw_data = window.localStorage.getItem(storageKey);
      if (!raw_data) {
        return;
      }
      const data = JSON.parse(raw_data);

      this.setState({
        ontologyClasses: data.classes,
        ontologyIndividuals: data.propositions,
      });
    } catch (err) {

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
    this.setState({
      ontologyIndividuals: this.state.ontologyIndividuals.filter(n => n.label !== proposition.label),
    }, () => this.updateStorage());
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
        { /*
        <li className="nav-item">
          <a
            className={classNames({ 'nav-link': true,  active: (activeTab === 'network_marginals') })}
            onClick={() => this.setState({ activeTab: 'network_marginals' })}
          >
            Network (Probabilities)
          </a>
        </li>
        */ }
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
    return (
      <ErrorBoundary>
        <StorageTab
          onTriggerReload={this.reloadStorage}
        />
      </ErrorBoundary>
    );
  }

  render() {
    return (
      <div>
        { this.renderNav() }
        { this.renderTabContainer() }
      </div>
    );
  }
}

Rust.bay_web.then((module) => {
  const main = (
    <Page bayModule={module} />
  );

  ReactDOM.render(main, document.getElementById('react-graph'));
});
