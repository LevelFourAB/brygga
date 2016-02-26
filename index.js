var config = require('./config');
var utils = require('./utils');
var data = require('./data');

var gutil = require('gulp-util');


module.exports.config = config;
module.exports.utils = utils;
module.exports.data = data;

utils.gulp = require('gulp');

// Load our own tasks
var tasks = require('require-dir')('./tasks');

// Activate our plugins
var plugins = utils.plugins();

function pad(value, width) {
	if(value.length > width) return value.length + ' ';

	return value + new Array(width - value.length).join(' ');
}

// Define a task for outputting some help info
utils.gulp.task('default', function() {
	var taskList = [];

	// Map the internal tasks
	Object.keys(tasks).forEach(function(key) {
		var task = tasks[key];
		task.forEach(function(t) {
			taskList.push(t);
		});
	});

	// Map tasks of plugins
	plugins.forEach(function(plugin) {
		if(plugin.tasks) {
			plugin.tasks.forEach(function(t) {
				taskList.push(t);
			});
		}
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
