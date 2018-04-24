// @flow
import React from 'react';
import { Button } from 'reactstrap';

import { Individual } from '../classes';
import { type IndividualCid } from '../types';

type PropositionEnhancement = {
  amount: number,
};

export type Assertion = Individual & PropositionEnhancement;

type ClassAggregationProps = {
  assertion: Assertion,
  negativeAssertion: Assertion,
  minimal: boolean,
  onAddWeight: (IndividualCid, number) => void,
};

const displayed = isDisplayed => ({
  display: !isDisplayed ? 'none' : 'initial',
});

export default class ClassAggregation extends React.Component<
  ClassAggregationProps,
> {
  winningSide = () =>
    this.props.assertion.amount <= this.props.negativeAssertion.amount;

  percentage = (negative: boolean) => {
    const amountA = this.props.assertion.amount;
    const amountB = this.props.negativeAssertion.amount;
    const total = amountA + amountB;

    let percentage = amountA / total;
    if (negative) {
      percentage = 1 - percentage;
    }

    return (percentage * 100).toFixed(2);
  };

  total = () => {
    const amountA = this.props.assertion.amount;
    const amountB = this.props.negativeAssertion.amount;
    return amountA + amountB;
  };

  renderAssertion = (assertion: Assertion, negative: boolean) => {
    const { minimal } = this.props;
    const notPart = negative ? 'not ' : '';
    const plaintext = `is ${notPart} a ${assertion.classLabel || ''}`;

    const plaintextStyle = {};
    const containerStyle = {
      display: 'inline-block',
      textAlign: 'center',
      opacity: '',
    };
    if (negative === this.winningSide()) {
      plaintextStyle.fontWeight = 'bold';
    } else {
      containerStyle.opacity = '0.6';
    }

    return (
      <span style={containerStyle}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={plaintextStyle}>{plaintext}</span>
          <span style={displayed(minimal)}>
            <span style={{ marginLeft: '10px' }}>({this.total()} RLAY)</span>
          </span>
        </div>
        <div>
          (<code>{(assertion.cid(): any)}</code>)
        </div>
        <div style={displayed(!minimal)}>
          <div style={{ fontSize: '11pt' }}>
            {this.percentage(negative)}%{' '}
            <span style={{ fontStyle: 'italic' }}>
              (= {assertion.amount} RLAY)
            </span>
          </div>
          <div style={{ marginTop: '6px' }}>
            <Button
              onClick={e => {
                this.props.onAddWeight(assertion.cid(), 1);
                e.stopPropagation();
              }}
            >
              add weight
            </Button>
          </div>
        </div>
      </span>
    );
  };

  render() {
    const { assertion, negativeAssertion, minimal } = this.props;

    const winningSide = this.winningSide();
    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
    };

    return (
      <div style={containerStyle}>
        <div style={displayed(!minimal || winningSide === false)}>
          {this.renderAssertion(assertion, false)}
        </div>
        <div style={displayed(!minimal)}>
          <span style={{ marginLeft: '10px', marginRight: '10px' }}>vs.</span>
        </div>
        <div style={displayed(!minimal || winningSide === true)}>
          {this.renderAssertion(negativeAssertion, true)}
        </div>
      </div>
    );
  }
}
