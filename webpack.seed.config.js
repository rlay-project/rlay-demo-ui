var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  entry: './src/seed.js',
  output: {
    filename: 'seed.js',
    path: path.resolve(__dirname, 'build/'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.wasm$/,
        use: {
          loader: 'wasm-loader',
        },
      },
    ],
  },
  plugins: [],
};
