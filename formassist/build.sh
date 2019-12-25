#!/bin/sh

cd `dirname $0`

npm install --save webpack webpack-cli
npm install --save core-js regenerator-runtime
npm install --save @babel/core @babel/preset-env babel-loader
npm install --save json-loader
npm install --save css-loader style-loader sass-loader node-sass extract-text-webpack-plugin
npm install --save jquery
npm install --save handlebars handlebars-loader
npm install --save eslint eslint-loader

node_modules/.bin/webpack
