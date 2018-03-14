// @flow
import React from 'react';
import { isNumber } from 'lodash-es';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

import { canQuery, query, printProbability, hashAsJson } from './helpers';
import type { BayModule } from './types';

type Proposition = any;
type OntClass = any;
type Individual = Proposition;

type PropositionListProps = {
  bayModule: BayModule,
  onDeleteProposition: (Proposition) => void,
  ontologyClasses: Array<OntClass>,
  ontologyIndividuals: Array<Individual>,
};

export default class PropositionList extends React.Component<PropositionListProps> {
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

type PropositionListHeaderProps = {};
type PropositionListHeaderState = {
  probabilityModalOpen: boolean,
};

class PropositionListHeader extends React.Component<PropositionListHeaderProps, PropositionListHeaderState> {
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

type PropositionListItemProps = {
  bayModule: BayModule,
  ontologyIndividuals: any,
  ontologyClasses: any,
  proposition: any,
  onDeleteProposition: (any) => void,
};

class PropositionListItem extends React.Component<PropositionListItemProps> {
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
    console.log('prop', proposition);
    const annotationPropertyLabel = bayModule.annotation_property_label();
    const annotationLabel = {
      property: annotationPropertyLabel,
      value: proposition.label,
    };
    const hashedAnnotation = bayModule.hash_annotation(annotationLabel);
    console.log('annotation', hashedAnnotation);

    let queryRes;
    let queryResTrue;
    if (canQueryRes) {
      queryRes = query(bayModule, ontologyClasses, ontologyIndividuals, proposition);
      // TODO: get rid of typecasts
      queryResTrue = (Object.values(queryRes).filter((n) => (n: any).key[0].value === true)[0]: any).value;
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
