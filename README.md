# front-building

前端环境构建

## 初始化项目

新建目录 `front-building`,然后进入该目录，并执行命令：

```bash
npm init
```

然后根据自己的需要，填写信息，填写完后将生成 `package.js` 文件，项目初始化完成。

## [gulp](https://www.gulpjs.com.cn/) 自动化构建工具的使用

### 1. 安装

```bash
npm install --save-dev gulp
```

### 2. 使用

在项目目录添加gulpfile.js文件：

```bash
const gulp = require('gulp')
const gulpLess = require('gulp-less')                        // less to css
const del = require('del')                                   // 清除
const autoprefixer = require('gulp-autoprefixer')            //浏览器前缀自动生成
const cleanCSS = require('gulp-clean-css')                   //压缩css


// 建立任务clean，清空build目录
gulp.task('clean',()=>{
  del.sync('build');
})

// 建立任务less,用于把less编译成css
gulp.task('less',()=>{
  gulp.src('src/styles/**/*.less')
    .pipe(gulpLess())
    .pipe(autoprefixer({                            // 生成css浏览器前缀
      browsers: ['last 5 versions','Firefox > 20'],
      cascade: false
    }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('build'));
})

// 执行任务less
gulp.task('default',['clean', 'less'],()=>{
  console.log("done!");
});

// watch监视，改动则自动执行
gulp.task('watch',()=>{
  var watcher = gulp.watch('src/**/*', ['default']);
  watcher.on('change', (event)=>{
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
})

```

### 3. 执行

首先在 package.js 添加执行命令：

```bash
"scripts": {
    "gulp": "gulp",
    "gulp-watch":"gulp watch"
  },
```

```bash
# 执行一次构建
npm run gulp

# 执行监视，改动则自动构建
npm run gulp-watch
```

## [babel](https://babeljs.cn/) 使用

`gulp` 是构建工具，针对于全局的编译，如`less`、`sass`等等。而`babel`是针对于 `js` 的，如使用`es6`,`es7`等。

当然，在`gulp`里面也可以添加`babel`进行使用。

### 1.安装

```bash
npm install --save-dev babel-cli babel-preset-env
```

### 2.使用

在根目录添加`.babelrc `文件：

```bash
{
  "presets": ["env"]
}
```

在`package.js`添加执行命令：

```bash
# 编译 babel src/scripts 到 build/src/scripts 里面
"babel": "babel src/scripts -d build/src/scripts",
```

这个时候，就可以在`src/scripts`里面写任何es6/es7语法，然后执行 `npm run babel` 即可编译到`build/src/scripts`里面

## [webpack](https://doc.webpack-china.org/), 打包工具使用

前面介绍的`gulp`跟`babel`两种工具，一种是自动化流程的构建，一种是 js 解析器。那么现在的 webpack ，就是最后一步，把整个开发文件打包使用的工具。

虽然gulp构建后也可以打包，不过gulp是比较落后的工具，地位不断被 grunt 侵蚀，而webpack不一样，它基本处于统治地位。

下面是webpack的使用步骤：

### 1.安装

```bash
npm i --save-dev webpack
```

并在 package.json 添加执行命令：

```bash
  "scripts": {
    "webpack": "webpack",
  },
```

### 2.配置

在根目录添加 webpack.config.js 文件：

```bash
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

```

### 3.使用

```bash
npm run webpack
```

这时候，即可看到打包输出的文件，这时候在页面引用即可。

