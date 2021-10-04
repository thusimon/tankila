import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import path from 'path';

export default merge<Configuration>(common, {
  mode: 'production',
  performance: {
    hints: false
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.[contenthash].js',
    clean: true
  }
});
