var utils = require('../utils');
var dataUtils = require('../data');

var browsersync = require('browser-sync');
var nunjucks = require('gulp-nunjucks-render');
var data = require('gulp-data');
var gm = require('gray-matter');

module.exports = [
	{
		task: 'html',
		description: 'Generate HTML from sources and templates'
	}
];

var loadData = function(file, cb) {
	var parsed = gm(String(file.contents));
	file.contents = new Buffer(parsed.content);
	dataUtils.loadAll(parsed.data, cb);
};

utils.task('html', function() {
	return utils.srcFor('html')
		.pipe(data(loadData))
		.pipe(nunjucks())
		.pipe(utils.destFor('html'))
		.pipe(browsersync.reload({ stream: true }));
});
