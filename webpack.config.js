const path = require('path');
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
  const { DEV } = env;
  dotenv.config();
  console.log(`[DEV] >>> ${DEV}`);
  if (!['true', 'false'].includes(DEV)) throw '[DEV] must be true or false';

  const mode = DEV ? 'development' : 'production';
  const devtool = DEV ? 'eval-source-map' : 'none';
  const lastCssLoader = DEV ? 'style-loader' : MiniCssExtractPlugin.loader;
  const miniCssExtractPlugin = DEV
    ? new MiniCssExtractPlugin({ filename: 'css/style.css' })
    : '';

  return {
    mode,
    devtool,
    resolve: {
      fallback: { fs: false, path: false },
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@Utils': path.resolve(__dirname, 'src/utils'),
      },
      extensions: ['.js'],
    },
    entry: {
      main: './src/app.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.(sc|c|sa)ss$/,
          use: [lastCssLoader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      miniCssExtractPlugin,
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './index.html'),
      }),
    ],
    devServer: {
      devMiddleware: { publicPath: '/dist' },
      static: {
        directory: path.join(__dirname),
      },
      hot: true,
    },
    output: {
      clean: true,
      path: path.resolve('./dist'),
    },
  };
};
