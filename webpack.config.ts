/* eslint-disable import/no-extraneous-dependencies */
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

const jsRegex = /\.(js|ts)x?$/;

const config: webpack.Configuration = {
 cache: true,
 experiments: {
  asset: true,
 },
 module: {
  rules: [
   { parser: { requireEnsure: false } },
   {
    test: jsRegex,
    exclude: /node_modules/,
    use: {
     loader: 'babel-loader',
     options: {
      cacheCompression: false,
      cacheDirectory: true,
     },
    },
   },
   {
    test: /\.css$/,
    use: [
     {
      loader: 'css-loader',
      options: { importLoaders: 1 },
     },
    ],
    sideEffects: true,
   },
   {
    test: /\.(jpe?g|png|gif)$/,
    type: 'asset',
   },
   {
    test: /\.svg$/,
    use: [{ loader: '@svgr/webpack' }],
   },
   {
    exclude: [jsRegex, /\.html$/, /\.json$/],
    use: [
     {
      loader: 'file-loader',
      options: {
       name: 'static/media/[name].[hash:8].[ext]',
      },
     },
    ],
   },
  ],
  strictExportPresence: true,
 },
 output: {
  path: path.resolve(__dirname, 'build'),
 },
 // @ts-ignore
 plugins: [
  new CleanWebpackPlugin(),
  new CopyPlugin({
   patterns: [
    {
     from: 'public',
     globOptions: {
      ignore: ['**/index.html'],
     },
    },
   ],
  }),
 ].filter(Boolean),
 resolve: {
  alias: {
   'react-native': 'react-native-web',
  },
  extensions: ['.ts', '.tsx', '.json', '.js', '.jsx'],
  modules: ['node_modules', path.resolve(__dirname, 'src')],
 },
};

export default config;
