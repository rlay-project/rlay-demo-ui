import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { observable } from 'mobx';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';

import ClassAggregation from './ClassAggregation.jsx';

const stories = storiesOf('ClassAggregation', module);

stories.addDecorator(withKnobs);

stories
  .add('default', () => {
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

    return (
      <div style={{ margin: '40px' }}>
        <ClassAggregation
          assertion={assertion}
          negativeAssertion={negativeAssertion}
        />
      </div>
    );
  })
  .add('minimal', () => {
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

    return (
      <div style={{ margin: '40px' }}>
        <ClassAggregation
          assertion={assertion}
          negativeAssertion={negativeAssertion}
          minimal
        />
      </div>
    );
  })
  .add('minimal toggle', () => {
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

    const minimal = boolean('Minimal', true);

    return (
      <div style={{ margin: '40px' }}>
        <ClassAggregation
          assertion={assertion}
          negativeAssertion={negativeAssertion}
          minimal={minimal}
        />
      </div>
    );
  });
