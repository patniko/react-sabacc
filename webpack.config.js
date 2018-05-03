var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'source-map', // 'eval'
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index.tsx' // './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, include: path.join(__dirname, 'src'), exclude: /node_modules/, loader: 'awesome-typescript-loader' },
      { test: /\.jsx?$/, include: path.join(__dirname, 'src'), exclude: /node_modules/, loader: 'babel-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
    ]
  }
};