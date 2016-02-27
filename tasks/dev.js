var utils = require('../utils');
var config = require('../config');
var browsersync = require('browser-sync');
var servestatic = require('serve-static');

module.exports = [
	{
		task: 'dev',
		description: 'Start a server and watch for changes'
	}
];

function makeRoute(path, handler) {
	console.log(typeof handler);

	if(typeof handler === 'string') {
		handler = servestatic(handler);
	}

	return function(req, res, next) {
		if(req.originalUrl.indexOf(path) === 0) {
			req.url = req.originalUrl.substring(path.length);
			if(req.url.length === 0) req.url = '/';
			handler(req, res, next);
			return true;
		}

		return false;
	};
}

utils.task('dev', [ 'watch' ], function() {
	var routes = [];
	Object.keys(config.serve.routes).forEach(function(path) {
		routes.push(makeRoute(path, config.serve.routes[path]));
	});

	browsersync({
		server: {
			baseDir: config.shared.dest,

			index: 'index.html',

			middleware: function(req, res, next) {
				for(var i=0; i<routes.length; i++) {
					if(routes[i](req, res, next)) return;
				}

				next();
			}
		}
	});
});
