// @flow
/* eslint-disable react/no-unused-state */
import React from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { stateLink } from '../ValueLink';

import { Individual } from '../classes';
import { type IndividualCid } from '../types';

type PropositionEnhancement = {
  totalWeight: {
    toString: () => String,
  },
  isAggregatedValue: boolean,
};

export type Assertion = Individual & PropositionEnhancement;

type ClassAggregationProps = {
  assertion: Assertion,
  negativeAssertion: Assertion,
  minimal: boolean,
  onAddWeight: (IndividualCid, number) => void,
};

type ClassAggregationState = {
  valueAmountTrue: any,
  valueAmountFalse: any,
};

const displayed = isDisplayed => ({
  display: !isDisplayed ? 'none' : 'initial',
});

export default class ClassAggregation extends React.Component<
  ClassAggregationProps,
  ClassAggregationState,
> {
  constructor(props: ClassAggregationProps) {
    super(props);

    this.amountLinks = ({}: any);
    this.amountLinks[true] = stateLink.call(this, 'valueAmountTrue'); // eslint-disable-line
    this.amountLinks[false] = stateLink.call(this, 'valueAmountFalse'); // eslint-disable-line
  }

  state = {
    valueAmountTrue: '',
    valueAmountFalse: '',
  };

  amountLinks: any;

  winningSide = () => this.props.negativeAssertion.isAggregatedValue;

  percentage = (negative: boolean) => {
    const amountA = this.props.assertion.totalWeight;
    const amountB = this.props.negativeAssertion.totalWeight;
    const total = new window.web3.BigNumber(0).plus(amountA).plus(amountB);

    let percentage = new window.web3.BigNumber(amountA).dividedBy(total);
    if (negative) {
      percentage = 1 - percentage;
    }

    return (percentage * 100).toFixed(2);
  };

  total = () => {
    const amountA = this.props.assertion.totalWeight;
    const amountB = this.props.negativeAssertion.totalWeight;
    const total = new window.web3.BigNumber(0).plus(amountA).plus(amountB);
    return total;
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
            <span style={{ marginLeft: '10px' }}>
              ({this.total().toString()} RLAY)
            </span>
          </span>
        </div>
        <div>
          (<code>{(assertion.cid(): any)}</code>)
        </div>
        <div style={displayed(!minimal)}>
          <div style={{ fontSize: '11pt' }}>
            {this.percentage(negative)}%{' '}
            <span style={{ fontStyle: 'italic' }}>
              (= {assertion.totalWeight.toString()} RLAY)
            </span>
          </div>
          <div style={{ marginTop: '6px' }}>
            <InputGroup onClick={e => e.stopPropagation()}>
              <Input
                {...this.amountLinks[negative].props}
                placeholder="Amount"
                type="number"
                step="1"
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>RLAY</InputGroupText>
                <Button
                  onClick={e => {
                    this.props.onAddWeight(
                      assertion.cid(),
                      this.amountLinks[negative].value,
                    );
                    e.stopPropagation();
                  }}
                >
                  add weight
                </Button>
              </InputGroupAddon>
            </InputGroup>
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
