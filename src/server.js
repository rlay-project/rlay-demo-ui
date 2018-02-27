var path = require('path');
var express = require('express');

var app = express(); // better instead
// app.use('/media', express.static(__dirname + '/media'));
app.use(express.static(path.join(__dirname, '../build')));

app.listen(3000);
