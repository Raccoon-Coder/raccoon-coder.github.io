const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-html-minifier');

gulp.task('build', function () {
  return gulp.src('templates/pages/**/*.+(html|njk)')
    .pipe(nunjucksRender({
      path: ['templates/partials'],
      ext: '.html'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./'))
});
gulp.task('build:watch', function () {
  gulp.watch(['templates/**/*.njk'], gulp.series('build'));
});