// @flow
import React, { Fragment } from 'react';
import { Col, Button } from 'reactstrap';
import { isEmpty, isBoolean } from 'lodash-es';

import { Individual, type BlockchainIndividual } from '../classes';

type IndividualListProps = {
  individuals: Array<BlockchainIndividual>,
  onUploadIndividual: Individual => void,
};

class IndividualList extends React.Component<IndividualListProps> {
  handleUploadClick = (item: BlockchainIndividual) => {
    this.props.onUploadIndividual(item);
  };

  renderItem = (item: BlockchainIndividual) => {
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
            'Class assertions',
            'class_assertions',
          )}
          {this.renderCollectionAttribute(
            item,
            'Negative class assertions',
            'negative_class_assertions',
          )}
        </Col>
      </li>
    );
  };

  renderCollectionAttribute = (
    item: Individual,
    label: string,
    key: string,
    // eslint-disable-next-line arrow-body-style
  ) => {
    // $FlowFixMe
    return !isEmpty(item[key]) ? (
      <Fragment>
        <span>{label}:</span>
        <br />
        {item[key].map(attribute => (
          <Fragment>
            <code>{((attribute: any): string)}</code>
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
        No Statements added yet.
      </li>
    );
  }

  render() {
    const { individuals } = this.props;

    return (
      <ul className="list-group">
        {!isEmpty(individuals)
          ? individuals.map(this.renderItem)
          : this.renderPlaceholder()}
      </ul>
    );
  }
}

module.exports = {
  IndividualList,
};
