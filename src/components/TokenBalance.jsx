// @flow
import React, { Fragment } from 'react';
import { Button } from 'reactstrap';

type TokenBalanceProps = {
  account: {
    balance?: number,
    allowance?: number,
    tokenSymbol?: string,
  },
  onSetAllowance: number => void,
};

type TokenBalanceState = {
  valueAllowance: number,
};

export default class TokenBalance extends React.Component<
  TokenBalanceProps,
  TokenBalanceState,
> {
  state = {
    valueAllowance: 0,
  };

  handleValueAllowanceChange = (e: any) => {
    this.setState({
      valueAllowance: e.target.value,
    });
  };

  handleClickSet = () => {
    this.props.onSetAllowance(this.state.valueAllowance);
  };

  // tokenSymbol = () => this.props.account.tokenSymbol || '';
  tokenSymbol = () => 'RLAY';

  render() {
    const { valueAllowance } = this.state;

    return (
      <Fragment>
        Balance: {(this.props.account.balance || '').toString()}{' '}
        {this.tokenSymbol()}
        <br />
        Allowance for making Propositions:{' '}
        {(this.props.account.allowance || '').toString()} {this.tokenSymbol()}
        <br />
        <input
          type="number"
          value={valueAllowance}
          onChange={this.handleValueAllowanceChange}
        />
        <Button onClick={this.handleClickSet}>Set</Button>
      </Fragment>
    );
  }
}
