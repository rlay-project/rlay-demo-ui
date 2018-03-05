import React from 'react';
import { isNumber } from 'lodash-es';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

import { canQuery, query, printProbability, hashAsJson } from './helpers';

export default class PropositionList extends React.Component {
  render() {
    const {
      bayModule,
      onDeleteProposition,
      ontologyClasses,
      ontologyIndividuals,
    } = this.props;

    return (
      <ul className="list-group">
        <PropositionListHeader />
        { ontologyIndividuals.map(proposition =>
          <PropositionListItem
            {...this.props}
            bayModule={bayModule}
            proposition={proposition}
            onDeleteProposition={onDeleteProposition}
          />
        )}
      </ul>
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
          Justification Score
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
    const propositionHash = hashAsJson(proposition);

    return (
      <li className="list-group-item" style={itemStyle} title={`<spread://${propositionHash}>`}>
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
