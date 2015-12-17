var utils = require('./utils');

var fs = require('fs');
var path = require('path');
var globby = require('globby');

var cachedDataFiles = {};

/**
 * Load a JSON data file, avoiding reading and parsing the file if it has not
 * changed.
 */
var loadDataFile = function(file, cb) {
	var cached = cachedDataFiles[file];
	fs.stat(file, function(err, stat) {
		if(! stat) return cb(null, null);

		if(! cached || stat.mtime > cached.mtime) {
			if(! cached) {
				cached = cachedDataFiles[file] = {};
			}

			cached.mtime = stat.mtime;
			fs.readFile(file, 'utf8', function(err2, data) {
				if(err2) return cb(err2);

				cached.data = JSON.parse(data);

				cb(null, cached.data);
			});

			return;
		}

		cb(null, cached.data);
	});
};

/**
 * Load all of the data files we have.
 */
module.exports.loadAll = function(obj, cb) {
	if(! obj) {
		obj = {};
	}

	globby(utils.srcGlob('data'))
		.then(function(files) {
			if(files.length === 0) cb(null, obj);

			var count = files.length;
			files.forEach(function(file) {
				loadDataFile(file, function(err, data) {
					if(err) {
						count = -1;
						cb(err);
					}

					obj[path.basename(file, '.json')] = data;

					if(--count === 0) {
						cb(null, obj);
					}
				});
			});
		});
};
