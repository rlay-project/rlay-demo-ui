// @flow
import ethers from 'ethers';
import React, { Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

type ConfirmTransactionModalProps = {
  onSignerCreate: any => void,
  privateKey: ?string,
};
type ConfirmTransactionModalState = {
  modalOpen: boolean,
  transaction: ?any,
  resolve: ?any,
  reject: ?any,
};

export default class ConfirmTransactionModal extends React.Component<
  ConfirmTransactionModalProps,
  ConfirmTransactionModalState,
> {
  constructor(props: ConfirmTransactionModalProps) {
    super(props);

    const that = this;
    const CustomSigner = function CustomSigner(privateKey) {
      const provider = new ethers.providers.JsonRpcProvider();

      const wallet = new ethers.Wallet(privateKey);

      const getAddress = function getAddress() {
        return new Promise(resolve => {
          const { address } = wallet;
          resolve(address);
        });
      };

      const sign = function(transaction) {
        return new Promise((resolve, reject) => {
          that.setState({
            modalOpen: true,
            transaction,
            resolve,
            reject,
          });
        });
      };

      const estimateGas = trx => provider.estimateGas(trx);

      return {
        wallet,
        sign,
        getAddress,
        provider,
        estimateGas,
      };
    };

    const { privateKey } = props;
    if (privateKey) {
      const signer = CustomSigner(privateKey);
      this.props.onSignerCreate(signer);
      this.signer = signer;
    }
  }

  state = {
    modalOpen: false,
    transaction: null,
    resolve: null,
    reject: null,
  };

  signer: ?any;

  handleRejectClick = () => {
    const { reject } = this.state;
    if (!reject) {
      return;
    }

    reject(new Error('Rejected by user'));
    this.setState({
      modalOpen: false,
      transaction: null,
      resolve: null,
      reject: null,
    });
  };

  handleConfirmClick = () => {
    const { resolve, transaction } = this.state;
    if (!transaction || !this.signer || !resolve) {
      return;
    }
    resolve(this.signer.wallet.sign(transaction));
    this.setState({
      modalOpen: false,
      transaction: null,
      resolve: null,
      reject: null,
    });
  };

  render() {
    const { transaction } = this.state;
    let body = null;
    if (transaction && this.signer) {
      body = (
        <Fragment>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>From:</b>
            <span>
              {ethers.utils.getAddress(this.signer.wallet.address).substring(2)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>To:</b>
            {ethers.utils.getAddress(transaction.to).substring(2)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>Gas Limit:</b>
            {transaction.gasLimit.toString()} Units
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>Gas Price:</b>
            {transaction.gasPrice.div(1000000000).toString()} GWEI
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>Max Total:</b>
            {ethers.utils.formatEther(
              transaction.gasPrice.mul(transaction.gasLimit),
            )}{' '}
            ETH
          </div>
        </Fragment>
      );
    }

    return (
      <Modal isOpen={this.state.modalOpen} centered>
        <ModalHeader>Confirm Transaction</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.handleRejectClick}>
            Reject
          </Button>
          <Button color="success" onClick={this.handleConfirmClick}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
