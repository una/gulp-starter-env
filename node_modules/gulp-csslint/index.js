/*jshint node:true */

'use strict';

var gutil = require('gulp-util');
var c = gutil.colors;
var es = require('event-stream');
var fs = require('fs');
var csslint = require('csslint').CSSLint;

var formatOutput = function(report, file, options) {
  if (!report.messages.length) {
    return {
      success: true
    };
  }

  var filePath = (file.path || 'stdin');

  // Handle errors
  var results = report.messages.map(function(err) {
    if (!err) return;
    return { file: filePath, error: err };
  }).filter(function(err) {
    return err;
  });

  var output = {
    errorCount: results.length,
    success: false,
    results: results,
    options: options
  };

  return output;
};

var cssLintPlugin = function(options) {
  if (!options) options = {};

  var ruleset = {};

  // Read CSSLint options from a specified csslintrc file.
  if (typeof options === 'string') {
    // Don't catch readFile errors, let them bubble up
    var externalOptions = fs.readFileSync('./'+options);

    try {
      options = JSON.parse(externalOptions);
    }
    catch(err) {
      throw new Error('Error parsing csslintrc: '+err);
    }
  }

  // Build a list of all available rules
  csslint.getRules().forEach(function(rule) {
    ruleset[rule.id] = 1;
  });

  for (var rule in options) {
    if (!options[rule]) {
      // Remove rules that are turned off
      delete ruleset[rule];
    }
    else {
      ruleset[rule] = options[rule];
    }
  }

  return es.map(function(file, cb) {
    var report = csslint.verify(String(file.contents), ruleset);

    // send status down-stream
    file.csslint = formatOutput(report, file, options);

    cb(null, file);
  });
};

var defaultReporter = function(file) {
  var errorCount = file.csslint.errorCount;
  var plural = errorCount === 1 ? '' : 's';

  gutil.log(c.cyan(errorCount)+' error'+plural+' found in '+c.magenta(file.path));

  file.csslint.results.forEach(function(result) {
    var message = result.error;
    gutil.log(
      c.red('[') +
      (
        typeof message.line !== 'undefined' ?
          c.yellow( 'L' + message.line ) +
          c.red(':') +
          c.yellow( 'C' + message.col )
        :
          c.yellow('GENERAL')
      ) +
      c.red('] ') +
      message.message + ' ' + message.rule.desc + ' (' + message.rule.id + ')');
  });
};

cssLintPlugin.reporter = function(customReporter) {
  var reporter = defaultReporter;

  if (typeof customReporter === 'function') {
    reporter = customReporter;
  }

  if (typeof reporter === 'undefined') {
    throw new Error('Invalid reporter');
  }

  return es.map(function(file, cb) {
    // Only report if CSSLint was ran and errors were found
    if (file.csslint && !file.csslint.success) {
      reporter(file);
    }

    return cb(null, file);
  });
};

cssLintPlugin.failReporter = function(){
  return es.map(function (file, cb) {
    // Nothing to report or no errors
    if (!file.csslint || file.csslint.success) {
      return cb(null, file);
    }

    return cb(new gutil.PluginError('gulp-csslint', 'CSSLint failed for '+file.relative), file);
  });
};

module.exports = cssLintPlugin;
