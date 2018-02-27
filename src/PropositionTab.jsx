import React from 'react';
import { isNumber } from 'lodash-es';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

import { canQuery, query, printProbability } from './helpers';
import NetworkMarginals from './NetworkMarginals.jsx';
import AddPropositionModal from './AddPropositionModal.jsx';

export default class PropositionTab extends React.Component {
  static defaultProps = {
    ontologyClasses: [],
    ontologyIndividuals: [],

    onAddProposition: () => {},
    onDeleteProposition: () => {},
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
      onDeleteProposition,
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
        <NetworkMarginals {...this.props} height={400} width={800}/>
        <span style={containerHeader}>
          <button type="button" className="btn btn-success" onClick={toggleModal}>+</button>
        </span>
        <ul className="list-group">
          <PropositionListHeader />
          { ontologyIndividuals.map(proposition =>
            <PropositionListItem
              {...this.props}
              proposition={proposition}
              onDeleteProposition={onDeleteProposition}
            />
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

class PropositionListHeader extends React.Component {
  state = {
    probabilityModalOpen: false,
  }

  handleToggle = () => {
    this.setState({ probabilityModalOpen: !this.state.probabilityModalOpen });
  }

  render() {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-between',
    };

    const buttonContainerStyle = {
      marginLeft: '10px',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
        <span>
          Proposition label
        </span>
        <span>
          Classes
        </span>
        <span>
          Probability
          <span style={buttonContainerStyle}>
            <Button color="info" size="sm" onClick={this.handleToggle}>?</Button>
            <Modal isOpen={this.state.probabilityModalOpen} toggle={this.handleToggle} >
              <ModalHeader toggle={this.handleToggle}></ModalHeader>
              <ModalBody>
                <p>
                  This column displays the probability that the given proposition is true.
                </p>
                <p>
                  The probability is calculated using what we know about the world from all the <b>other</b> propositions (so excluding the proposition itself).
                </p>
                <p>
                  One effect of this is, that new propositions might have a probability of 0 if they are completely unsupported, e.g. are the first of their class.
                </p>
              </ModalBody>
            </Modal>
          </span>
        </span>
        <span>
        </span>
      </li>
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
      onDeleteProposition,
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
        <span style={{ width: '200px' }}>
          {proposition.label}
        </span>
        <span style={{ width: '200px' }}>
          {proposition.class_memberships.map(klass => (
            <span className="badge badge-pill badge-info" style={pillStyle}>{klass}</span>
          ))}
        </span>
        <span>
          { isNumber(queryResTrue) ?
            printProbability(queryResTrue)
           : null }
        </span>
        <span>
          <Button color="danger" onClick={() => onDeleteProposition(proposition)}>Delete</Button>
        </span>
      </li>
    );
  }
}
