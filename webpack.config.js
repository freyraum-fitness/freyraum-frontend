'use strict';
process.env.NODE_ENV = 'production';
const base = require('./webpack.base.config.js');
const webpack = require('webpack');

module.exports = base.merge({
  plugins: [
    new webpack.DefinePlugin({
      __API__: "'/api'",
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
});
