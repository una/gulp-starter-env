var path = require('path'),
  gutil = require('gulp-util'),
  CleanCSS  = require('clean-css'),
  through2 = require('through2'),
  BufferStreams = require('bufferstreams'),
  cache = require('memory-cache');

function objectIsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function minify(options, file, buffer, done) {
  var rawContents = String(buffer);
  var cached;
  if (options.cache &&
      (cached = cache.get(file.path)) &&
      cached.raw === rawContents &&
      objectIsEqual(cached.options, options)) {

      // cache hit
      done(cached.minified);

  } else {
    // cache miss or cache not enabled
    new CleanCSS(options).minify(rawContents, function (errors, css) {

      if (options.cache) {
        cache.put(file.path, {
          raw: rawContents,
          minified: css,
          options: options
        });
      }

      done(errors, css);
    });
  }
}

// File level transform function
function minifyCSSTransform(opt, file) {

  // Return a callback function handling the buffered content
  return function(err, buf, cb) {

    // Handle any error
    if(err) cb(gutil.PluginError('minify-css', err));

    // Use the buffered content
    minify(opt, file, buf, function (errors, data) {
      // Bring it back to streams
      cb(null, new Buffer(data.styles));
    });
  };
}

// Plugin function
function minifyCSSGulp(opt){
  if (!opt) opt = {};

  function modifyContents(file, enc, done){
    if(file.isNull()) {
      done(null, file);
      return;
    }

    if(file.isStream()) {
      file.contents = file.contents.pipe(new BufferStreams(minifyCSSTransform(opt, file)))
      .on('error', this.emit.bind(this, 'error'));
      done(null, file);
      return;
    }

    // Image URLs are rebased with the assumption that they are relative to the
    // CSS file they appear in (unless "relativeTo" option is explicitly set by
    // caller)
    var relativeToTmp = opt.relativeTo;
    opt.relativeTo = relativeToTmp || path.resolve(path.dirname(file.path));

    try {
      minify(opt, file, file.contents, function (errors, newContents) {

        // Restore original "relativeTo" value
        opt.relativeTo = relativeToTmp;
        file.contents = new Buffer(newContents.styles);

        done(errors ? errors[0] : null, file);
      });

    } catch (err) {
      this.emit('error', new gutil.PluginError('minify-css', err, { fileName: file.path } ));
      return done(null, file);
    }
  }

  return through2.obj(modifyContents);
}

// Export the file level transform function for other plugins usage
minifyCSSGulp.fileTransform = minifyCSSTransform;

// Export the plugin main function
module.exports = minifyCSSGulp;
