// @flow
import React from 'react';
import { Col, Button } from 'reactstrap';
import { isEmpty } from 'lodash-es';

import { Annotation, type BlockchainAnnotation } from '../classes';

type AnnotationListProps = {
  annotations: Array<BlockchainAnnotation>,
  onUploadAnnotation: Annotation => void,
};

class AnnotationList extends React.Component<AnnotationListProps> {
  handleUploadClick = (item: BlockchainAnnotation) => {
    this.props.onUploadAnnotation(item);
  };

  renderItem = (item: BlockchainAnnotation) => {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
        {!item.isAvailable ? (
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
          <code>{((item.property: any): string)}</code>
        </Col>
        <Col>{item.value}</Col>
      </li>
    );
  };

  renderPlaceholder() {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-around',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
        No Annotations added yet.
      </li>
    );
  }

  render() {
    const { annotations } = this.props;

    return (
      <ul className="list-group">
        {!isEmpty(annotations)
          ? annotations.map(this.renderItem)
          : this.renderPlaceholder()}
      </ul>
    );
  }
}

module.exports = {
  AnnotationList,
};
