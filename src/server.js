/* eslint-disable */
const path = require('path');
const express = require('express');

const app = express(); // better instead
// app.use('/media', express.static(__dirname + '/media'));
app.use(express.static(path.join(__dirname, '../build')));

console.log('Demo page (Metamask or similar) http://localhost:3000');
// prettier-ignore
console.log(
  'Demo page (built-in wallet): http://localhost:3000/#pk=0x1c1a965a9fb6beb254bafa72588797b0268f43783cffbfa41659f47ae77a3529'
);
app.listen(3000);
