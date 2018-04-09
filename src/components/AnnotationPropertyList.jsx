// @flow
import React from 'react';
import { isEmpty } from 'lodash-es';

import type { AnnotationPropertyHash } from '../types';

export type AnnotationProperty = {
  hash: AnnotationPropertyHash,
  value: string,
};

type AnnotationPropertyListProps = {
  annotationProperties: Array<AnnotationProperty>,
};

export default class AnnotationPropertyList extends React.Component<
  AnnotationPropertyListProps,
> {
  renderItem(item: AnnotationProperty) {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-between',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
        <span>
          <code>{((item.hash: any): string)}</code>
        </span>
        <span>{item.value}</span>
      </li>
    );
  }

  renderPlaceholder() {
    const itemStyle = {
      display: 'flex',
      justifyContent: 'space-around',
    };

    return (
      <li className="list-group-item" style={itemStyle}>
        No AnnotationProperty items added yet.
      </li>
    );
  }

  render() {
    const { annotationProperties } = this.props;

    return (
      <ul className="list-group">
        {!isEmpty(annotationProperties)
          ? annotationProperties.map(this.renderItem)
          : this.renderPlaceholder()}
      </ul>
    );
  }
}
