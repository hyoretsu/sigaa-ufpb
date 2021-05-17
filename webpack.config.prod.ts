/* eslint-disable import/no-extraneous-dependencies */
import { gzip } from '@gfx/zopfli';
import CompressionPlugin from 'compression-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
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

const config: webpack.Configuration = {
 mode: 'production',
 bail: true,
 devtool: 'source-map',
 module: {
  rules: [
   {
    test: /\.css$/,
    use: [
     {
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: appPackageJson.homepage },
     },
    ],
   },
  ],
 },
 optimization: {
  splitChunks: {
   cacheGroups: {
    vendors: {
     test: /node_modules\/(.*\/?)(react-icons.*\/).*/,
     name: 'vendors',
     chunks: 'all',
    },
    ui: {
     test: /node_modules\/(.*\/?)(react-icons.*\/).*/,
     name: 'ui',
     chunks: 'all',
    },
   },
  },
  runtimeChunk: {
   name: 'runtime-main',
  },
  // @ts-ignore
  minimizer: [
   new TerserPlugin({
    terserOptions: {
     compress: {
      ecma: 5,
      comparisons: false,
      inline: 2,
     },
     keep_classnames: true,
     keep_fnames: true,
     mangle: {
      safari10: true,
     },
     output: {
      ascii_only: true,
      comments: false,
      ecma: 5,
      shorthand: true,
     },
     parse: {
      ecma: 2017,
     },
     sourceMap: true,
    },
   }),
   new CssMinimizerPlugin(),
  ].filter(Boolean),
 },
 output: {
  assetModuleFilename: 'static/media/[name].[hash:8][ext]',
  chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
  filename: 'static/js/[name].[contenthash:8].js',
  publicPath: appPackageJson.homepage,
  devtoolModuleFilenameTemplate: (info: IDevtoolTemplateInfo) =>
   path.relative(path.resolve(__dirname, 'src'), info.absoluteResourcePath).replace(/\\/g, '/'),
  globalObject: 'this',
 },
 performance: false,
 // @ts-ignore
 plugins: [
  new HtmlWebpackPlugin({
   inject: true,
   template: path.resolve(__dirname, 'public', 'index.html'),
   minify: {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    decodeEntities: true,
    keepClosingSlash: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    processConditionalComments: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    trimCustomFragments: true,
    useShortDoctype: true,
   },
  }),
  new MiniCssExtractPlugin({
   filename: 'static/css/[name].[contenthash:8].css',
   chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  }),
  new WebpackManifestPlugin({
   fileName: 'asset-manifest.json',
   generate: (seed, files, entries) => {
    const manifestFiles = files.reduce((accumulator, file) => {
     // @ts-ignore
     accumulator[file.name] = file.path;

     return accumulator;
    }, seed);
    const entrypointFiles = entries.main.filter(filename => !filename.endsWith('.map'));

    return {
     files: manifestFiles,
     entrypoints: entrypointFiles,
    };
   },
  }),
  new ESLintPlugin({
   cache: true,
   cacheLocation: path.resolve(__dirname, 'node_modules', '.cache/.eslintcache'),
   context: path.resolve(__dirname, 'src'),
   cwd: __dirname,
   extensions: ['ts', 'tsx', 'js', 'jsx'],
   formatter: require.resolve('react-dev-utils/eslintFormatter'),
   resolvePluginsRelativeTo: __dirname,
  }),
  new CompressionPlugin({
   algorithm: gzip,
   filename: '[path][base].gz',
   test: /\.(js|css|html|svg)$/,
  }),
  new CompressionPlugin({
   algorithm: 'brotliCompress',
   compressionOptions: {
    level: 11,
   },
   filename: '[path][base].br',
   test: /\.(js|css|html|svg)$/,
  }),
 ].filter(Boolean),
 resolve: {
  alias: {
   'react-dom$': 'react-dom/profiling',
   'scheduler/tracing': 'scheduler/tracing-profiling',
  },
  plugins: [
   // @ts-ignore
   new ModuleScopePlugin(path.resolve(__dirname, 'src'), [path.resolve(__dirname, 'package.json')]),
  ],
 },
};

Object.defineProperty(RegExp.prototype, 'toJSON', {
 value: RegExp.prototype.toString,
});
console.log(JSON.stringify(mergeWithRules(mergingRules)(webpackSharedConfig, config)));

export default mergeWithRules(mergingRules)(webpackSharedConfig, config);
