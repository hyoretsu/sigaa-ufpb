/* eslint-disable import/no-extraneous-dependencies */
import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { CustomizeRule, mergeWithRules } from 'webpack-merge';

import appPackageJson from './package.json';
import webpackSharedConfig from './webpack.config';

interface IDevtoolTemplateInfo {
 absoluteResourcePath: string;
 allLoaders: string;
 hash: string;
 id: string;
 loaders: string;
 resource: string;
 resourcePath: string;
 namespace: string;
}

interface IWebpackConfig extends webpack.Configuration {
 devServer: WebpackDevServer.Configuration;
}

const mergingRules = {
 module: {
  rules: {
   test: CustomizeRule.Match,
   use: {
    loader: CustomizeRule.Match,
    options: CustomizeRule.Replace,
   },
  },
 },
};

const config: IWebpackConfig = {
 mode: 'development',
 devServer: {
  hot: true,
  open: true,
  port: 3000,
 },
 devtool: 'eval-source-map',
 output: {
  assetModuleFilename: 'static/media/[name][ext]',
  filename: 'static/js/[name].bundle.js',
  chunkFilename: 'static/js/[name].chunk.js',
  publicPath: '',
  devtoolModuleFilenameTemplate: (info: IDevtoolTemplateInfo) =>
   path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  globalObject: 'this',
 },
 optimization: {
  minimize: false,
  minimizer: [],
  splitChunks: {
   chunks: 'all',
   name: false,
  },
  runtimeChunk: true,
 },
 resolve: {
  // @ts-ignore
  plugins: [new ModuleScopePlugin(path.resolve(__dirname, 'src'), [appPackageJson])].filter(Boolean),
 },
 resolveLoader: {
  plugins: [],
 },
 module: {
  strictExportPresence: true,
  rules: [
   {
    parser: { requireEnsure: false },
   },
   {
    test: /\.(j|t)sx?$/,
    exclude: /node_modules/,
    use: {
     loader: 'babel-loader',
     options: {
      cacheDirectory: true,
     },
    },
   },
   {
    test: /\.css$/,
    use: ['style-loader'],
   },
  ],
 },
 plugins: [
  // new WatchMissingNodeModulesPlugin(path.resolve(__dirname, 'node_modules')),
  new HtmlWebpackPlugin({
   inject: true,
   template: path.resolve(__dirname, 'public', 'index.html'),
  }),
  new ESLintPlugin({
   cache: true,
   cacheLocation: path.resolve(__dirname, 'node_modules', '.cache/.eslintcache'),
   context: path.resolve(__dirname, 'src'),
   cwd: __dirname,
   extensions: ['js', 'jsx', 'ts', 'tsx'],
   formatter: require.resolve('react-dev-utils/eslintFormatter'),
   resolvePluginsRelativeTo: __dirname,
  }),
 ].filter(Boolean),
 performance: false,
};

Object.defineProperty(RegExp.prototype, 'toJSON', {
 value: RegExp.prototype.toString,
});
console.log(JSON.stringify(mergeWithRules(mergingRules)(webpackSharedConfig, config)));

export default mergeWithRules(mergingRules)(webpackSharedConfig, config);
