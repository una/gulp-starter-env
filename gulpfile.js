var gulp    = require('gulp'),
    sass    = require('gulp-sass'),
    rename  = require('gulp-rename'),
    cssmin  = require('gulp-minify-css'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify'),
    jshint  = require('gulp-jshint'),
    csslint = require('gulp-csslint'),
    prefix  = require('gulp-autoprefixer'),
    size    = require('gulp-size');

gulp.task('scss', function() {
  return gulp.src('scss/main.scss')
    .pipe(sass())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(prefix())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cssmin())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('csslint', function() {
  gulp.src('css/main.css')
    .pipe(csslint({
      'compatible-vendor-prefixes': false,
      'box-sizing': false,
      'important': false,
      'known-properties': false
    }))
    .pipe(csslint.reporter());
});

gulp.task('js', function() {
  gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(concat('j.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('jshint', function() {
  gulp.src('dist/js/j.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.watch('scss/*.scss', ['scss', 'csslint']);
  gulp.watch('js/*.js', ['jshint', 'js']);
});

gulp.task('default', ['scss', 'csslint', 'js', 'jshint', 'watch']);
