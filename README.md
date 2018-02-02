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
