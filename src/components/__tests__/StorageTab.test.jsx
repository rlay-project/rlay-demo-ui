import React from 'react';
import { shallow, mount, render } from 'enzyme';

import StorageTab from '../StorageTab.jsx';

test('click on "Clear Storage" button triggers callback', () => {
  const mockClearStorage = jest.fn();
  const wrapper = shallow(
    <StorageTab onTriggerClearStorage={mockClearStorage} />,
  );
  wrapper.find('#clear-storage-button').simulate('click');
  expect(mockClearStorage.mock.calls.length).toBe(1);
});
