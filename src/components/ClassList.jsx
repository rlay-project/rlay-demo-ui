// @flow
import React, { Fragment } from 'react';
import { Col, Button } from 'reactstrap';
import { isEmpty, isBoolean } from 'lodash-es';

import { Class as Klass, type BlockchainClass } from '../classes';

type ClassListProps = {
  classes: Array<BlockchainClass>,
  onUploadClass: Klass => void,
};

class ClassList extends React.Component<ClassListProps> {
  handleUploadClick = (item: BlockchainClass) => {
    this.props.onUploadClass(item);
  };

  renderItem = (item: BlockchainClass) => {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
        {isBoolean(item.isAvailable) && !item.isAvailable ? (
          <span style={{ position: 'relative', marginLeft: '-80px' }}>
            <Button
              color="primary"
              onClick={() => this.handleUploadClick(item)}
            >
              ⬆
            </Button>
          </span>
        ) : null}
        <Col xs="1">
          {item.isAvailable ? (
            <span
              role="img"
              title="Stored on blockchain"
              aria-label="Stored on blockchain"
            >
              🌐
            </span>
          ) : null}
        </Col>
        <Col>
          <code>{((item.cid(): any): string)}</code>
        </Col>
        <Col>
          {this.renderCollectionAttribute(item, 'Annotations', 'annotations')}
          {this.renderCollectionAttribute(
            item,
            'SubClassOf',
            'sub_class_of_class',
          )}
        </Col>
      </li>
    );
  };

  // eslint-disable-next-line arrow-body-style
  renderCollectionAttribute = (item: Klass, label: string, key: string) => {
    // $FlowFixMe
    return !isEmpty(item[key]) ? (
      <Fragment>
        <span>{label}:</span>
        <br />
        {item[key].map(klass => (
          <Fragment>
            <code>{((klass: any): string)}</code>
            <br />
          </Fragment>
        ))}
      </Fragment>
    ) : null;
  };

  renderPlaceholder() {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-around',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
        No Classes added yet.
      </li>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <ul className="list-group">
        {!isEmpty(classes)
          ? classes.map(this.renderItem)
          : this.renderPlaceholder()}
      </ul>
    );
  }
}

module.exports = {
  ClassList,
};
