var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'build/js')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['transform-class-properties', '@babel/plugin-proposal-object-rest-spread'],
          }
        }
      },
      {
        test: /\.wasm$/,
        use: {
          loader: 'wasm-loader',
        }
      }
    ]
  },
  plugins: [
      new CopyWebpackPlugin([
          { from: 'public', to: '../' }
      ]),
      new CopyWebpackPlugin([
          { from: 'vendor/bay/target/wasm32-unknown-unknown/release/bay_web.wasm', to: '../' }
      ]),
  ]
}
