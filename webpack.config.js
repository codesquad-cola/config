const path = require('path');
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
  const { NODE_ENV } = env;
  console.log(`[NODE_ENV] >>> ${NODE_ENV}`);
  if (!['production', 'development'].includes(NODE_ENV))
    throw '[NODE_ENV] must be production or development';

  dotenv.config();

  const DEV = NODE_ENV === 'development';
  const mode = DEV ? 'development' : 'production';
  const devtool = DEV ? 'eval-source-map' : false;
  const lastCssLoader = DEV ? 'style-loader' : MiniCssExtractPlugin.loader;
  const miniCssExtractPlugin = DEV
    ? { apply: () => {} }
    : new MiniCssExtractPlugin({ filename: 'css/style.css' });

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
