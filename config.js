/**
 * Shared configuration for all of the tasks. Plugins may push things onto
 * this configuration and users of the tasks can override most things in
 * here.
 */

module.exports = {
    /**
     * Shared items, such as the source and destination folders and the
     * browsers that should be supported.
     */
    shared: {
        src: 'src',

        dest: 'build',

        browsers: [ 'last 2 versions' ]
    },

    build: {

    },

    css: {
        root: 'css',

        src: [ 'main.css' ]
    },

    watch: {
        types: [ 'css' ]
    }
};
