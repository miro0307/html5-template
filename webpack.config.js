const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const SRC_DIR = path.resolve(process.cwd(), 'src');

// production or development
const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === 'development';
const IS_PRO = NODE_ENV === 'production';

const extractSass = new ExtractTextPlugin({
  filename: "css/[name].[hash:6].css",
  disable: IS_DEV
});

const config = {
  entry: {
    index: './src/scripts/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '',
    filename: IS_DEV ? 'js/[name].js' : 'js/[name].[chunkhash:6].js',
    chunkFilename: IS_DEV ? 'js/[name].chunk.js' : 'js/[name].[chunkhash:8].chunk.js'
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
          use: "css-loader"
        })
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 8192,
          name: IS_DEV ? './images/[name].[ext]' : './images/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            attrs: [':src',':data-src']
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(sass|scss)$/,
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
              sourceMap: IS_PRO,
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

// 开发环境
if( IS_DEV ){
  config.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  );
  config.devServer = {
    contentBase: path.join(__dirname, 'build'),
    watchContentBase: true,
    port: 8081,
    inline: true
  };
}

// 生产环境
if( IS_PRO ){
  config.plugins.push(
    new CleanWebpackPlugin(['build']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'lib/common',
    }),
    new UglifyJSPlugin({
      cache: true,
      sourceMap: false,
      compress: process.env.NODE_ENV === 'production'
    }),
    new ManifestPlugin()
  );
}

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