import React from 'react';
import JsonGraph, {Node as JsonGraphNode} from 'react-json-graph';

import TruthTable from './TruthTable.jsx';
import {
  nodeFromClass,
  edgesFromClass,
  toRsClass,
} from './helpers';

export default class NetworkCPT extends React.Component {
  render() {
    const { bayModule, ontologyClasses, ontologyIndividuals } = this.props;

    let rsClasses = ontologyClasses.map(toRsClass);
    let truth_tables = bayModule.js_build_domain_probabilities(rsClasses, ontologyIndividuals);

    const concat = (x,y) => x.concat(y);
    const nodes = ontologyClasses.map(klass => nodeFromClass(klass, truth_tables));
    const edges = ontologyClasses.map(klass => edgesFromClass(klass)).reduce(concat, []);

    return (
      <JsonGraph
        width={1200}
        height={2000}
        json={{
            nodes,
            edges,
        }}
        Node={BayesianNode}
        isVertical={true}
        isDirected={true}
        scale={0.5}
        onChange={(newGraphJSON) => console.log(newGraphJSON)}
      />
    );
  }
}

class BayesianNode extends JsonGraphNode {
  renderContainer({isDragging, content}) {
    const containerClass = 'node__container_Ef9';
    const containerDraggingClass = 'node__container_dragging_yes_3SG';
    const className = `${containerClass} ${isDragging ? containerDraggingClass : ''}`;

    const containerStyle = {
      padding: '10px',
    };

    return (
        <div style={containerStyle} className={className}>
            { Boolean(content) && this.renderContent(content) }
        </div>
    );
  }

  renderContent(content) {
    return (
      <div>
        <h3>{content.id}</h3>
        <TruthTable tt={content.tt} />
      </div>
    );
  }
}
