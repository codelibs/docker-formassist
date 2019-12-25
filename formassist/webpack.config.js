const path = require('path');
const webpack = require("webpack");

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, "src/main.js"),
  output: {
    path: path.join(__dirname, 'output'),
    filename: "fess-form-assist.js"
  },
  plugins: [

  ],
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      /*
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /(node_modules|suggestor.js)/,
        loader: "eslint-loader"
      },
      */
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query:
        {
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "usage",
                corejs: 3
              }
            ]
          ]
        }
      }
    ]
  }
};
