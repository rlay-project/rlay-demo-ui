/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable import/first */
import 'babel-polyfill';
// import './polyfills';
import Enzyme, { shallow, render, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new EnzymeAdapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;

const warnBlacklist = [
  '"categoryLabels" is not configured',
  '"whitelistedFacetCategories" is not configured',
  'Warning: Accessing PropTypes via the main React package is deprecated,',
  'Warning: Accessing createClass via the main React package is deprecated,',
];

const originalWarn = console.warn;
console.warn = function (msg) {
  const isInBlackList = warnBlacklist.find(blacklisted => msg.startsWith(blacklisted));
  if (isInBlackList) {
    return;
  }
  originalWarn.apply(this, arguments);
};

// Fail tests on any warning
console.error = (message) => {
  throw new Error(message);
};
