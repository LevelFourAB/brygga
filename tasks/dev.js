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
	if(typeof handler === 'string') {
		handler = servestatic(handler);
	}

	return function(req, res, next) {
		if(req.originalUrl.indexOf(path) === 0) {
			req.url = req.originalUrl.substring(path.length);
			if(req.url.length === 0) req.url = '/';
			handler(req, res, function() {
				req.url = req.originalUrl;
				next();
			});
			return true;
		}

		return false;
	};
}

function makeAlias(path, target, routes) {
	return function(req, res, next) {
		if(req.url.indexOf(path) === 0) {
			var c = req.url;
			req.originalUrl = target + req.originalUrl.substring(path.length);
			for(var i=0; i<routes.length; i++) {
				if(routes[i](req, res, next)) return true;
			}
			return false;
		}

		return false;
	};
}

function getRoutes() {
	var routes = [];
	var allHandlers = [];
	Object.keys(config.serve.routes).forEach(function(path) {
		var handler = makeRoute(path, config.serve.routes[path]);
		routes.push(handler);
		allHandlers.push(handler);
	});
	Object.keys(config.serve.alias).forEach(function(path) {
		allHandlers.push(makeAlias(path, config.serve.alias[path], routes));
	});
	return allHandlers;
}

utils.task('dev', [ 'watch' ], function() {
	var routes = getRoutes();

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

utils.task('dev:proxy', [ 'watch' ], function() {
	var url = process.env.PROXY_URL || config.serve.proxy;

	if(! url) throw "Unable to proxy, not proxy url has been set. Use brygga.config.serve.proxy or environment variable PROXY_URL";

	var routes = getRoutes();
	browsersync({
		proxy: {
			target: url,

			middleware: function(req, res, next) {
				for(var i=0; i<routes.length; i++) {
					if(routes[i](req, res, next)) return;
				}

				next();
			}
		}
	});
});
