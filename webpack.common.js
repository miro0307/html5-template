const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const SRC_DIR = path.resolve(process.cwd(), 'src');

const extractSass = new ExtractTextPlugin({
  filename: "css/[name].[hash:6].css",
  disable: process.env.NODE_ENV === "development"
});

const config = {
  entry: {
    index: './src/scripts/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '',
    filename: 'js/[name].[hash:6].js',
    chunkFilename: '[name].bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          publicPath: "../",
          filename: "css/[name].[hash:6].css",
          fallback: "style-loader",
          use: {
            loader: "css-loader",
            options: {
              minimize: true
            }
          }
        })
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          query: {
            outputPath: './images/',
            limit: 8192,
            name: '[name].[hash:6].[ext]'
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader"
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          publicPath: "../",
          filename: "css/[name].[hash:6].css",
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: true
              }
            }, {
              loader: "sass-loader",
              options: {
                minimize: true
              }
            }, {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: 'postcss.config.js'
                }
              }
            }]
        })
      }
    ]
  },
  plugins: [
    extractSass,
  ]
};

// 自动添加全部html
const entryHtml = glob.sync(path.resolve(SRC_DIR) + '/*.html');
entryHtml.forEach(function(item) {
  let filename = item.substring(item.lastIndexOf('\/') + 1, item.lastIndexOf('.'));
  let htmlConfig = new HtmlWebpackPlugin({
    filename: filename + '.html',
    template: 'src/'+ filename +'.html',
    minify:{
      removeComments: true,
      collapseWhitespace: true
    },
    chunks: ['lib/common', filename]
  });

  config.plugins.push(htmlConfig);
});

module.exports = config;