var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    pngquant    = require('imagemin-pngquant'),
    deploy      = require('gulp-gh-pages'),
    $           = require('gulp-load-plugins')({
                    rename: {
                      'gulp-minify-html': 'minifyHTML',
                      'gulp-minify-css': 'cssmin'
                    }
                  });

gulp.task('scss', function() {
    var onError = function(err) {
      $.notify.onError({
          title:    "Gulp",
          subtitle: "Failure!",
          message:  "Error: <%= error.message %>",
          sound:    "Beep"
      })(err);
      this.emit('end');
  };

  return gulp.src('scss/main.scss')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.sass())
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe($.autoprefixer())
    .pipe($.rename('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({stream:true}))
    .pipe($.cssmin())
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "dist/"
        }
    });
});

gulp.task('deploy', function () {
    return gulp.src('dist/**/*')
        .pipe(deploy());
});

gulp.task('js', function() {
  gulp.src('js/*.js')
    .pipe($.uglify())
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe($.concat('j.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream:true}));
});

gulp.task('scss-lint', function() {
  gulp.src('scss/**/*.scss')
    .pipe($.cache('scsslint'))
    .pipe($.scsslint());
});

gulp.task('minify-html', function() {
    var opts = {
      comments:true,
      spare:true
    };

  gulp.src('./*.html')
    .pipe($.minifyHTML(opts))
    .pipe(gulp.dest('dist/'))
    .pipe(reload({stream:true}));
});

gulp.task('jshint', function() {
  gulp.src('js/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['scss']);
  gulp.watch('js/*.js', ['jshint', 'js']);
  gulp.watch('./*.html', ['minify-html']);
  gulp.watch('img/*', ['imgmin']);
});

gulp.task('imgmin', function () {
    return gulp.src('img/*')
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('default', ['browser-sync', 'js', 'imgmin', 'minify-html', 'scss', 'watch']);
