// @flow
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Fragment } from 'react';

import ClassAggregation from './ClassAggregation.jsx';
import { Annotation, Individual as Assertion } from '../classes';
import { type IndividualCid } from '../types';

type PropositionEnhancement = {
  amount: number,
};

export type RelatedAggregations = {
  groups: {
    class_assertions: Array<Array<Assertion & PropositionEnhancement>>,
  },
  subject: Annotation,
};

type RelatedAggregationsProps = RelatedAggregations & {
  onAddWeight: (IndividualCid, number) => void,
};

type RelatedAggregationsState = {
  focusedGroup: ?IndividualCid,
};

export default class RelatedAggregationsContainer extends React.Component<
  RelatedAggregationsProps,
  RelatedAggregationsState,
> {
  state = {
    focusedGroup: null,
  };

  handleGroupExpand = (group: Array<Assertion>) => {
    const focusedGroup =
      group[0].cid() === this.state.focusedGroup ? null : group[0].cid();
    this.setState({
      focusedGroup,
    });
  };

  renderClassAggregation(group: any) {
    const assertion = group.find(n => n.class_assertions.length > 0);
    const negativeAssertion = group.find(
      n => n.negative_class_assertions.length > 0,
    );

    return (
      <li
        key={group[0].cid()}
        className="list-group-item"
        onClick={() => this.handleGroupExpand(group)}
        style={{
          maxHeight: '400px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ClassAggregation
          assertion={assertion}
          negativeAssertion={negativeAssertion}
          minimal={!(group[0].cid() === this.state.focusedGroup)}
          onAddWeight={this.props.onAddWeight}
        />
      </li>
    );
  }

  render() {
    return (
      <Fragment>
        <h6 style={{ textAlign: 'center' }}>
          Statements about an individual named <b>{this.props.subject.value}</b>
        </h6>
        <h5>Classes:</h5>
        <ul className="list-group">
          {this.props.groups.class_assertions.map((group: any) =>
            this.renderClassAggregation(group),
          )}
        </ul>
      </Fragment>
    );
  }
}
