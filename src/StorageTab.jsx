import React from 'react';
import {
  Button,
} from 'reactstrap';

import { storageKey } from './config';

export default class StorageTab extends React.Component {
  static defaultProps = {
    onTriggerReload: () => {},
  }

  handleClearStoragClick = () => {
    window.localStorage.removeItem(storageKey);
    this.props.onTriggerReload();
  }

  render() {
    return (
      <Button onClick={this.handleClearStoragClick}>Clear storage</Button>
    );
  }
}
