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
  console.info("done!");
});

// watch监视，改动则自动执行构建
gulp.task('watch',()=>{
  var watcher = gulp.watch('src/**/*', ['default']);
  watcher.on('change', (event)=>{
    console.info('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
})
