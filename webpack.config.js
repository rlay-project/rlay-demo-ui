var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'build/js'),
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
  plugins: [
    new CopyWebpackPlugin([{ from: 'public', to: '../' }]),
    new CopyWebpackPlugin([
      {
        from:
          'vendor/rlay-ontology/target/wasm32-unknown-unknown/release/rlay_ontology_stdweb.wasm',
        to: '../',
      },
    ]),
    new CopyWebpackPlugin([
      {
        from:
          'vendor/rlay-ontology/target/wasm32-unknown-unknown/release/rlay_ontology_stdweb.js',
        to: '../',
      },
    ]),
  ],
};
