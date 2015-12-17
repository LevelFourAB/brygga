var utils = require('../utils');
var config = require('../config');
var browsersync = require('browser-sync');

module.exports = [
	{
		task: 'dev',
		description: 'Start a server and watch for changes'
	}
];

utils.task('dev', [ 'watch' ], function() {
	browsersync({
		server: {
			baseDir: config.shared.dest,

			index: 'index.html'
		}
	});
});
