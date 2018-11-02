const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-html-minifier');

gulp.task('build', function () {
  return buildNjk()
});
gulp.task('build:watch', function () {
  buildNjk();
  gulp.watch(['templates/**/*.njk'], gulp.series('build'));
});

function buildNjk() {
  return gulp.src('templates/pages/**/*.+(html|njk)')
    .pipe(nunjucksRender({
      path: ['templates/partials'],
      ext: '.html'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./'));
}
