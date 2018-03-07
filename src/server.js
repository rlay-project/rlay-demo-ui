const path = require('path');
const express = require('express');

const app = express(); // better instead
// app.use('/media', express.static(__dirname + '/media'));
app.use(express.static(path.join(__dirname, '../build')));

app.listen(3000);
