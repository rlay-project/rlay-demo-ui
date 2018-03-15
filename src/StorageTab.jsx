import React from 'react';
import {
  Button,
} from 'reactstrap';

import { storageKey } from './config';

export default class StorageTab extends React.Component {
  static defaultProps = {
    onTriggerClearStorage: () => {},
  }

  handleClearStoragClick = () => {
    this.props.onTriggerClearStorage();
  }

  render() {
    return (
      <Button
        id="clear-storage-button"
        onClick={this.handleClearStoragClick}
      >
        Clear storage
      </Button>
    );
  }
}
