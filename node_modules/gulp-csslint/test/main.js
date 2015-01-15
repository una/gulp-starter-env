var cssLintPlugin = require('../');
var should = require('should');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
require('mocha');

var getFile = function(filePath) {
  filePath = 'test/'+filePath;
  return new gutil.File({
    path: filePath,
    cwd: 'test/',
    base: path.dirname(filePath),
    contents: fs.readFileSync(filePath)
  });
};

describe('gulp-csslint', function() {
  describe('cssLintPlugin()', function() {
    it('should pass file through', function(done) {
      var a = 0;

      var file = getFile('fixtures/validCSS.css');

      var stream = cssLintPlugin();
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);
        newFile.path.should.equal('test/fixtures/validCSS.css');
        newFile.relative.should.equal('validCSS.css');
        ++a;
      });

      stream.once('end', function() {
        a.should.equal(1);
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should send success status', function(done) {
      var a = 0;

      var file = getFile('fixtures/validCSS.css');

      var stream = cssLintPlugin();
      stream.on('data', function(newFile) {
        ++a;
        should.exist(newFile.csslint.success);
        newFile.csslint.success.should.equal(true);
        should.not.exist(newFile.csslint.results);
        should.not.exist(newFile.csslint.opt);
      });
      stream.once('end', function() {
        a.should.equal(1);
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should send failure status', function(done) {
      var a = 0;

      var file = getFile('fixtures/duplicateProperties.css');

      var stream = cssLintPlugin();
      stream.on('data', function(newFile) {
        ++a;
        should.exist(newFile.csslint.success);
        newFile.csslint.success.should.equal(false);
        should.exist(newFile.csslint.results);
      });
      stream.once('end', function() {
        a.should.equal(1);
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should lint two files', function(done) {
      var a = 0;

      var file1 = getFile('fixtures/duplicateProperties.css');
      var file2 = getFile('fixtures/missingPrefixes.css');

      var stream = cssLintPlugin();
      stream.on('data', function(newFile) {
        ++a;
      });

      stream.once('end', function() {
        a.should.equal(2);
        done();
      });

      stream.write(file1);
      stream.write(file2);
      stream.end();
    });

    it('should support options', function(done) {
      var a = 0;

      var file = getFile('fixtures/missingPrefixes.css');

      var stream = cssLintPlugin({
        'vendor-prefix': false
      });
      stream.on('data', function(newFile) {
        ++a;
        should.exist(newFile.csslint.success);
        newFile.csslint.success.should.equal(true);
        should.not.exist(newFile.csslint.results);
        should.not.exist(newFile.csslint.opt);
      });
      stream.once('end', function() {
        a.should.equal(1);
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should support csslintrc', function(done) {
      var a = 0;

      var file = getFile('fixtures/missingPrefixes.css');

      var stream = cssLintPlugin('test/csslintrc.json');
      stream.on('data', function(newFile) {
        ++a;
        should.exist(newFile.csslint.success);
        newFile.csslint.success.should.equal(true);
        should.not.exist(newFile.csslint.results);
        should.not.exist(newFile.csslint.opt);
      });
      stream.once('end', function() {
        a.should.equal(1);
        done();
      });

      stream.write(file);
      stream.end();
    });
  });
});
