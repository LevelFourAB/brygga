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
		steps: [ 'prepare', 'assets', 'cssjs', 'pages' ],

		assets: [],

		cssjs: [ 'css' ],

		pages: []
	},

	/**
	 * External data.
	 */
	data: {
		root: 'data',

		src: [ '**/*.json' ]
	},

	/**
	 * CSS defaults. Use main.css as default and look in the css root folder.
	 */
	css: {
		root: 'css',

		src: [ 'main.css' ],

		watch: [ '**/*.css' ]
	},

	watch: {
		types: [ 'css' ]
	},

	serve: {
		routes: {},
		alias: {}
	}
};
