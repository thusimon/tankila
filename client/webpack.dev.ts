import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import path from 'path';
import dotenv, {DotenvParseOutput} from 'dotenv';
import webpack from 'webpack';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const env = dotenv.config({
  path: path.join(__dirname, '../.env')
});
const envParsed: DotenvParseOutput = env.parsed!;

export default merge<Configuration>(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(s(a|c)ss)$/,
        use: ['style-loader','css-loader', 'sass-loader'],
      }
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './static'),
    },
    hot: true
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
      PORT: envParsed.PORT
    })
  ]
});
