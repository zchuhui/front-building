const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");    // 独立输出，这里用于独立输出css
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');           // 简洁打包，只打包用到的代码

// 用于独立导出css
const extractLess = new ExtractTextPlugin({
  filename: "../styles/[name].css",
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  // 入口
  entry: {
    index: './src/scripts/index.js',
    vendor:['react','react-dom']        // 打包公共的库，然后独立引用
  },
  // 输出
  output: {
    path: path.resolve(__dirname, 'build/scripts'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        // js 模块
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/scripts')
        ],
        loader: 'babel-loader'
      },
      {
        // css 模块
        test: /\.less$/,
        use: extractLess.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "less-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      }
    ]
  },
  plugins: [
      extractLess,                                   // 输出css文件
      new webpack.optimize.CommonsChunkPlugin({      // 独立打包体量比较大的公共库，比如jquery/react等，不用每次都打包到文件，runtime是webpack产生的方法
        name: ["vendor","runtime"],
      }),
      new UglifyJSPlugin(),                          // 精简打包
  ],
}
