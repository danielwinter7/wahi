/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    sass   = require('gulp-sass');

gulp.task('sass', function() {
  return gulp.src('assets/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/'));
});

/* updated watch task to include sass */
gulp.task('watch', function() {
  gulp.watch('assets/sass/**/*.scss', ['sass']);
});