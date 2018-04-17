const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = env => {
  if (!env) {
    env = {}//没参数时，赋值，避免undefined.
  }
  let plugins=[
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({template: './app/views/index.html'}),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ];
  if(env.production){
    plugins.push(
	  //给webpack修改node的全局变量
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new ExtractTextPlugin("style.css", {ignoreOrder: true})
    )
  }
  return {
    entry: {
      app: './app/js/main.js'
    },
    devServer: {
      contentBase: './dist',//静态文件的输出路径
      hot: true,
      compress: true,//整个服务开启gzip压缩
      port: 9000,
      clientLogLevel: "none",
      quiet: true
    },
    module: {
      loaders: [
        {
          test: /\.html$/,
          loader: 'html-loader'
        }, {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            cssModules: {
              localIdentName: '[path][name]---[local]---[hash:base64:5]',
              camelCase: true
            },
            extractCSS: true,
            loaders: env.production?{
              css: ExtractTextPlugin.extract({use: 'css-loader!px2rem-loader?remUnit=40&remPrecision=8', fallback: 'vue-style-loader'}),
              scss: ExtractTextPlugin.extract({use: 'css-loader!px2rem-loader?remUnit=40&remPrecision=8!sass-loader', fallback: 'vue-style-loader'})
            }:{
              css: 'vue-style-loader!css-loader!px2rem-loader?remUnit=40&remPrecision=8',
              scss: 'vue-style-loader!css-loader!px2rem-loader?remUnit=40&remPrecision=8!sass-loader'
            }
          }
        }, {
          test: /\.scss$/,
          loader: 'style-loader!css-loader!sass-loader'//webpack支持对一个文件多个loader的串行解析，解析顺序为从右到左
        }
      ]
    },
    resolve: {
      extensions: [
        '.js', '.vue', '.json'
      ],
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    plugins,
    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, 'dist')//node提供的path对象,resolve表示相对路径，__dirname表示当前路径
    }
  }
};
