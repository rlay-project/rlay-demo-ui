import React from 'react';
import JsonGraph, {Node as JsonGraphNode} from 'react-json-graph';

import TruthTable from './TruthTable.jsx';
import {
  edgesFromClass,
  nodeFromClass,
  query,
  toRsClass,
  printProbability,
} from './helpers';

export default class NetworkMarginals extends React.Component {
  static defaultProps = {
    width: 1000,
    height: 1000,
  }

  mapNodePosition = (n) => ({
    ...n,
    position: {
      x: n.position.x / 2,
      y: n.position.y / 4,
    },
  })

  addNodeProbability = (n) => {
    const { bayModule, ontologyClasses, ontologyIndividuals } = this.props;

    const probe = {
      label: "Probe",
      class_memberships: [n.label.id],
    };
    const queryRes = query(bayModule, ontologyClasses, ontologyIndividuals, probe)
    const queryResTrue = Object.values(queryRes).filter((n) => n["key"][0].value === true)[0].value;

    return {
      ...n,
      label: {
        ...n.label,
        probability: queryResTrue,
      }
    }
  }

  render() {
    const { bayModule, ontologyClasses, ontologyIndividuals } = this.props;

    let rsClasses = ontologyClasses.map(toRsClass);
    let truth_tables = bayModule.js_build_domain_probabilities(rsClasses, ontologyIndividuals);

    const concat = (x,y) => x.concat(y);
    let nodes = ontologyClasses.map(klass => nodeFromClass(klass, truth_tables));
    nodes = nodes.map(this.mapNodePosition);
    nodes = nodes.map(this.addNodeProbability);
    const edges = ontologyClasses.map(klass => edgesFromClass(klass)).reduce(concat, []);

    return (
      <JsonGraph
        width={this.props.width}
        height={this.props.height}
        json={{
            nodes,
            edges,
        }}
        Node={SmallBayesianNode}
        isVertical={true}
        isDirected={true}
        scale={0.5}
        onChange={(newGraphJSON) => console.log(newGraphJSON)}
      />
    );
  }
}

class SmallBayesianNode extends JsonGraphNode {
  shouldComponentUpdate() {
    return true;
  }

  renderContainer({isDragging, content}) {
    const containerClass = 'node__container_Ef9';
    const containerDraggingClass = 'node__container_dragging_yes_3SG';
    const className = `${containerClass} ${isDragging ? containerDraggingClass : ''}`;

    const containerStyle = {
      padding: '10px',
      paddingLeft: '25px',
      paddingRight: '25px',
    };

    return (
        <div style={containerStyle} className={className}>
            { Boolean(content) && this.renderContent(content) }
        </div>
    );
  }

  renderContent(content) {
    console.log('p', content);
    return (
      <div>
        <b>{content.id} {printProbability(content.probability)}</b>
      </div>
    );
  }
}

