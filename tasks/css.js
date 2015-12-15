var utils = require('../utils');
var config = require('../config');

var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var filter = require('gulp-filter');
var browsersync = require('browser-sync');

module.exports = [
    {
        task: 'css',
        description: 'Build CSS'
    }
];

var processors = [
    require('postcss-import')(),
    require('postcss-nested')(),
    require('postcss-cssnext')({
        browsers: config.shared.browsers
    })
];

utils.task('css', function() {
    return utils.srcFor('css')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(utils.destFor('css'))
        .pipe(filter([ '*.css' ]))
        .pipe(browsersync.reload({ stream: true }));
});
