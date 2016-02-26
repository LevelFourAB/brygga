var config = require('../config');
var utils = require('../utils');
var run = require('run-sequence');

module.exports = [
	{
		task: 'build',
		description: 'Build this project'
	}
];

utils.task('build', function(cb) {
	var sequence = config.build.steps.map(function(step) {
		return config.build[step];
	}).filter(function(tasks) {
		return tasks && tasks.length > 0;
	});

	sequence.push(cb);

	run.apply(null, sequence);
});
