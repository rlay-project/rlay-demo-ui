import React from 'react';

import { canQuery, query } from './helpers';
import AddPropositionModal from './AddPropositionModal.jsx';

export default class PropositionTab extends React.Component {
  static defaultProps = {
    ontologyClasses: [],
    ontologyIndividuals: [],

    onAddProposition: () => {},
  }

  state = {
    addIndividualModalOpen: false,
  }

  render() {
    const {
      bayModule,
      ontologyIndividuals,
      ontologyClasses,
      onAddProposition,
    } = this.props;

    const containerStyle = {
      maxWidth: '800px',
      margin: '20px',
      marginLeft: 'auto',
      marginRight: 'auto',
    };
    const containerHeader = {
      display: 'flex',
      justifyContent: 'end',
      marginBottom: '10px',
    };

    const toggleModal = () => {
      this.setState({
        addIndividualModalOpen: !this.state.addIndividualModalOpen,
      });
    };

    return (
      <div style={containerStyle}>
        <span style={containerHeader}>
          <button type="button" className="btn btn-success" onClick={toggleModal}>+</button>
        </span>
        <ul className="list-group">
          { ontologyIndividuals.map(proposition =>
            <PropositionListItem {...this.props} proposition={proposition} />
          )}
        </ul>
        <AddPropositionModal
          isOpen={this.state.addIndividualModalOpen}
          ontologyClasses={ontologyClasses}
          onChangeOpen={(open) => this.setState({ addIndividualModalOpen: open })}
          onSubmit={onAddProposition}
        />
      </div>
    );
  }
}

class PropositionListItem extends React.Component {
  render() {
    const {
      bayModule,
      ontologyIndividuals,
      ontologyClasses,
      proposition,
    } = this.props;

    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-between',
    };
    const pillStyle = {
      marginLeft: '5px',
      marginRight: '5px',
    };

    const canQueryRes = canQuery(bayModule, ontologyClasses, ontologyIndividuals, proposition);
    let queryRes;
    let queryResTrue;
    if (canQueryRes) {
      queryRes = query(bayModule, ontologyClasses, ontologyIndividuals, proposition)
      queryResTrue = Object.values(queryRes).filter((n) => n["key"][0].value === true)[0].value;
    }

    return (
      <li className="list-group-item" style={itemStyle}>
        {proposition.label}
        <span>
          {proposition.class_memberships.map(klass => (
            <span className="badge badge-pill badge-info" style={pillStyle}>{klass}</span>
          ))}
        </span>
        <span>
          { console.log(queryResTrue) || queryResTrue ?
            queryResTrue.toString()
           : null }
        </span>
      </li>
    );
  }
}
