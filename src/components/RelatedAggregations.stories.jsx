import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { observable } from 'mobx';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';

import { sumBy, sortBy, reverse } from 'lodash-es';

import RelatedAggregations from './RelatedAggregations.jsx';

const stories = storiesOf('RelatedAggregations', module);

stories.addDecorator(withKnobs);

stories.add('default', () => {
  const assertion = {
    cid: 'z4nKrR1thL7qbK5YPkYVHenvAtSczT73a8CoSjsthTCKLZSSUWn',
    label: 'Organization',
    amount: 10,
  };
  const negativeAssertion = {
    cid: 'z4nKrR1rhB4V73k6V3FhV7AgkMUvrrtmFJ48i3AotuPCVjTJbvj',
    label: 'Organization',
    amount: 3,
  };

  const assertion2 = {
    cid: 'z4nKrR1thL7qbKFake1vAtbeeeSczT73a8CoSjsthTCKLZSSUWn',
    label: 'Company',
    amount: 20,
  };
  const negativeAssertion2 = {
    cid: 'z4nKrR1rhB4V73k6V3Fake3kMbUvrrtmFJ48i3AotuPCVjTJbvj',
    label: 'Company',
    amount: 1,
  };

  const subject = {
    cid: 'z4nKrR1rhB4V73k6V3FPlaceholder4afef8i3AotuPCVjTJbvj',
    label: 'Amnesty International',
  };

  const groups = {
    class_assertions: [
      [assertion, negativeAssertion],
      [assertion2, negativeAssertion2],
    ],
  };

  const groupTotal = group => sumBy(group, 'total');
  groups.class_assertions = reverse(
    sortBy(groups.class_assertions, [group => groupTotal(group)]),
  );

  return (
    <div style={{ margin: '40px' }}>
      <RelatedAggregations groups={groups} subject={subject} />
    </div>
  );
});
