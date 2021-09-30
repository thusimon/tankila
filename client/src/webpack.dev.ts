import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import path from 'path';


interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

export default merge<Configuration>(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, './static'),
    },
    hot: true,
  }
});
