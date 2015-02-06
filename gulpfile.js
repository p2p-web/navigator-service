var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
  gulp.src(['./src/env-check.js', './src/service-desktop.js', './src/service-mobile.js'])
    .pipe(concat('service.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['scripts']);