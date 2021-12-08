import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import path from 'path';
import webpack from 'webpack';
import dotenv from 'dotenv';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const env = dotenv.config({
  path: path.join(__dirname, '../.env')
});
const envParsed = env.parsed;

export default merge<Configuration>(common, {
  mode: 'production',
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.(s(a|c)ss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.[contenthash].js',
    clean: true
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      PORT: envParsed ? envParsed.PORT : '3000'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    })
  ]
});
