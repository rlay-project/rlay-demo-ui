import Viz from 'viz.js';
import React from 'react';
import ReactDOM from 'react-dom';
import JsonGraph, {Node as JsonGraphNode} from 'react-json-graph';
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
import TruthTable from './TruthTable.jsx';
import { toRsClass } from './helpers';

class Graph extends React.Component {
  render() {
    const graphDot = this.props.graphString;
    const image = Viz(graphDot, { format: "svg" });

    return (
      <span dangerouslySetInnerHTML={{__html: image}} />
    )
  }
}

Rust.bay_web.then((module) => {
  let graph_dot = module.print_graph();
  let graph_moral_dot = module.print_moral_graph();
  let graph_max_cliques_dot = module.print_max_cliques();
  let graph_join_tree_dot = module.print_join_tree();

  let truth_table = module.truth_table();
  console.log(truth_table);
  console.log("-------");
  let truth_tables = module.truth_tables();
  console.log(truth_tables);

  let main = (
    <span>
      <span style={{display: 'inline-block'}}>
        <h2>Original Graph</h2>
        <Graph graphString={graph_dot}/>
      </span>
      <span style={{display: 'inline-block'}}>
        <h2>Moral Graph</h2>
        <Graph graphString={graph_moral_dot}/>
      </span>
      <span style={{display: 'inline-block'}}>
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

class Page extends React.Component {
  state = {
    activeTab: 'propositions',
    ontologyClasses: exampleClasses,
    ontologyIndividuals: exampleIndividuals,
  }

  renderNav() {
    const { activeTab } = this.state;

    return (
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={classNames({ 'nav-link': true,  active: (activeTab === 'network_cpt') })}
            onClick={() => this.setState({ activeTab: 'network_cpt' })}
          >
            Network (CPTs)
          </a>
        </li>
        <li className="nav-item">
          <a
            className={classNames({ 'nav-link': true,  active: (activeTab === 'network_marginals') })}
            onClick={() => this.setState({ activeTab: 'network_marginals' })}
          >
            Network (Probabilities)
          </a>
        </li>
        <li className="nav-item">
          <a
            className={classNames({ 'nav-link': true,  active: (activeTab === 'propositions') })}
            onClick={() => this.setState({ activeTab: 'propositions' })}
          >
            Propositions
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

    const handleAddProposition = (proposition) => {
      this.setState({
        ontologyIndividuals: [].concat(this.state.ontologyIndividuals, proposition),
      });
    }

    const handleDeleteProposition = (proposition) => {
      this.setState({
        ontologyIndividuals: this.state.ontologyIndividuals.filter(n => n.label !== proposition.label),
      });
    }

    return (
      <ErrorBoundary>
        <PropositionTab
            bayModule={bayModule}
            ontologyClasses={ontologyClasses}
            ontologyIndividuals={ontologyIndividuals}
            onAddProposition={handleAddProposition}
            onDeleteProposition={handleDeleteProposition}
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
  let main = (
    <Page bayModule={module}/>
  )

  ReactDOM.render(main, document.getElementById('react-graph'));
});
