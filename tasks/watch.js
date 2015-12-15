var utils = require('../utils');
var config = require('../config');
var watch = require('gulp-watch');

module.exports = [
    {
        task: 'watch',
        description: 'Watch and rebuild on changes'
    }
];

utils.task('watch', function() {
    config.watch.types.forEach(function(type) {
        watch(utils.watchGlob(type), function() {
            utils.gulp.start(config[type].watchTarget || type);
        });
    });
});
