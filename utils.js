var config = require('./config');

var fs = require('fs');
var path = require('path');
var merge = require('merge');

var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

var browsersync = require('browser-sync');

module.exports.gulp = null;

/**
 * Define a new Gulp task.
 */
module.exports.task = function() {
	return this.gulp.task.apply(this.gulp, arguments);
};

/**
 * Map a set of file globs onto a common root.
 */
module.exports.mapFiles = function(paths, root) {
	if(! Array.isArray(paths)) {
		paths = [ paths ];
	}

	return paths.map(function(lp) {
		if(lp[0] === '!') {
			// This is a negating filter
			return '!' + path.join(root, lp.substring(1));
		}

		return path.join(root, lp);
	});
};

/**
 * Take a stream and change so that any errors are shown in a notification.
 */
module.exports.noErrors = function(stream, title) {
	return stream.pipe(plumber({
		errorHandler: notify.onError({
			title: title || 'Build failed',
			message: '<%= error.message %>'
		})
	}));
};

/**
 * Get the glob to use for finding files for the given type and sub key.
 */
module.exports.glob = function(type, key, base) {
	var root = (base || config.shared.src);
	var localConfig = config[type];

	if(! localConfig) throw 'No configuration for ' + type + ', check your configuration';
	if(! localConfig[key]) throw 'No files defined for ' + type + ' and value ' + key + ', check your configuration';

	var srcDir = path.join(root, localConfig.root || '');

	return this.mapFiles(localConfig[key], srcDir);
};

/**
 * Get the source directory for the given type by looking it up in the
 * configuration.
 */
module.exports.srcDir = function(type, base) {
	var root = (base || config.shared.src);
	var localConfig = config[type];

	if(! localConfig) throw 'No configuration for ' + type + ', check your configuration';

	return path.join(root, localConfig.dir);
};

/**
 * Get the glob to use for finding the source files for the given type.
 */
module.exports.srcGlob = function(type, base) {
	var root = (base || config.shared.src);
	var localConfig = config[type];

	if(! localConfig) throw 'No configuration for ' + type + ', check your configuration';
	if(! localConfig.src) throw 'No source files defined for ' + type + ', check your configuration';

	var srcDir = path.join(root, localConfig.root || '');

	return this.mapFiles(localConfig.src, srcDir);
};

/**
 * Start a stream via gulp.src looking up the source via a configuration value.
 */
module.exports.srcFor = function(type, opts, base) {
	return this.noErrors(
		this.gulp.src(this.srcGlob(type, base), opts)
	);
};

/**
 * Get the destination directory for the given type.
 */
module.exports.destDir = function(type, base) {
	var root = (base || config.shared.src);
	var localConfig = config[type];

	if(! localConfig) throw 'No configuration for ' + type + ', check your configuration';

	var local = typeof localConfig.dest !== 'undefined' ? localConfig.dest : localConfig.root;
	return path.join(config.shared.dest, local);
};

/**
 * Get the Gulp destination for the given type.
 */
module.exports.destFor = function(type, base) {
	return this.gulp.dest(this.destDir(type, base));
};


/**
 * Get the glob to use for files that should be watched for the given type.
 */
module.exports.watchGlob = function(type, base) {
	var root = (base || config.shared.src);
	var localConfig = config[type];

	if(! localConfig) throw 'No configuration for ' + type + ', check your configuration';
	if(! localConfig.src) throw 'No source files defined for ' + type + ', check your configuration';

	var srcDir = path.join(root, localConfig.root || '');

	return this.mapFiles(localConfig.watch || localConfig.src, srcDir);
};

/**
 * Utility that can be used in pipes to reload the brower of the user.
 */
module.exports.reloadBrowser = function() {
	return browsersync.reload({ stream: true });
};

/**
 * Find and return all plugins to Brygga that can be found.
 */
module.exports.plugins = function() {
	if(this._plugins) return this._plugins;

	// Loop through any file and folder in node_modules of the current dir
	this._plugins = fs.readdirSync('node_modules')
		.map(function(m) {
			var root = path.join(process.cwd(), 'node_modules', m);
			var file = path.join(root, 'package.json');
			if(! fs.existsSync(file)) return;

			var pkg = require(file);
			if(! pkg.keywords || pkg.keywords.indexOf('brygga-plugin') === -1) return;

			var plugin = require(root);
			plugin.name = m;

			if(plugin.config) {
				// Merge configurations
				merge.recursive(config, plugin.config);

				// Do updates of configs for watch and build
				Object.keys(plugin.config).forEach(function(k) {
					var subConfig = plugin.config[k];
					if(subConfig.watch) {
						config.watch.types.push(k);
					}

					if(subConfig.buildStep) {
						config.build[subConfig.buildStep].push(k);
					}
				});
			}

			return plugin;
		})
		.filter(function(m) {
			return !! m;
		});

	return this._plugins;
};
