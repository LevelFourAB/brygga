var config = require('./config');
var utils = require('./utils');

var gutil = require('gulp-util');


module.exports.config = config;
module.exports.utils = utils;

utils.gulp = require('gulp');

var tasks = require('require-dir')('./tasks');

function pad(value, width) {
    if(value.length > width) return value.length + ' ';

    return value + new Array(width - value.length).join(' ');
}

// Define a task for outputting some help info
utils.gulp.task('default', function() {
    var taskList = [];
    Object.keys(tasks).forEach(function(key) {
        var task = tasks[key];
        task.forEach(function(t) {
            taskList.push(t);
        });
    });

    taskList.sort(function(a, b) {
        if(a.task < b.task) {
            return -1;
        } else if(a.task > b.task) {
            return 1;
        }

        return 0;
    });

    gutil.log(gutil.colors.red('At least one task is required.'));
    gutil.log('');
    gutil.log('Available tasks:');
    gutil.log('');

    taskList.forEach(function(task) {
        gutil.log(gutil.colors.bold(pad(task.task, 10)), task.description);
    });

    gutil.log('');
});
