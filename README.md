Brygga is a set of opinionated Gulp tasks for building web sites and applications. Brygga aims to support future standards and syntaxes in todays browsers.

# Using

In your project install Brygga and Gulp:

```
npm install --save-dev gulp brygga
```

In your `gulpfile.js` use `require` to expose the Gulp tasks that Brygga define:

```
var brygga = require('brygga');
```

Running `gulp` without any tasks will output all of the available tasks. The most used tasks are `dev` and `build` that start a development server and build all of the assets.

# Default structure

```
build/ - where all of the built assets end up
src/ - the source files
  css/ - CSS files
    main.css - the default CSS file
```

A lot of things in Brygga can be configured via the `brygga` object. You can change the build folder and source folder using these config properties:

```
brygga.config.shared.dest = 'build';
brygga.config.shared.src = 'src';
```

# CSS

Brygga uses [PostCSS](https://github.com/postcss/postcss) with plugins for [inlining imports](https://github.com/postcss/postcss-import), [nesting](https://github.com/postcss/postcss-nested) and [future CSS syntax](https://github.com/cssnext/postcss-cssnext).
