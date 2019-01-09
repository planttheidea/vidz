'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const defaultConfig = require('./webpack.config');

const PORT = 3000;
const ROOT = path.join(__dirname, '..');

module.exports = Object.assign({}, defaultConfig, {
  devServer: {
    compress: true,
    contentBase: './dist',
    host: 'localhost',
    port: PORT
  },

  entry: [path.join(ROOT, 'DEV_ONLY', 'App.js')],

  externals: undefined,

  module: Object.assign({}, defaultConfig.module, {
    rules: defaultConfig.module.rules.map((rule) => {
      if (rule.loader !== 'babel-loader') {
        return rule;
      }

      return Object.assign({}, rule, {
        include: rule.include.concat([path.join(ROOT, 'DEV_ONLY')])
      });
    })
  }),

  output: Object.assign({}, defaultConfig.output, {
    publicPath: `http://localhost:${PORT}/`
  }),

  plugins: defaultConfig.plugins.concat([new HtmlWebpackPlugin()])
});
