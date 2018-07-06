/* eslint-disable */
const path = require('path');
const express = require('express');

const app = express(); // better instead
// app.use('/media', express.static(__dirname + '/media'));
app.use(express.static(path.join(__dirname, '../build')));

console.log('Demo page (Metamask or similar) http://localhost:3000');
// prettier-ignore
console.log(
  'Demo page (built-in wallet #1): http://localhost:3000/#pk=0x1c1a965a9fb6beb254bafa72588797b0268f43783cffbfa41659f47ae77a3529');
// prettier-ignore
console.log(
  'Demo page (built-in wallet #2): http://localhost:3000/#pk=0x38094128816c1c416b15ee1b6b2ea443a044c99a1d47fd3dedfd9b169dac9b41');
app.listen(3000);
