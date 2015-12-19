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
  data/ - data made available to HTML templates
    site.json - shared data available under data object key site
  pages/ - HTML pages
    index.html
```

A lot of things in Brygga can be configured via the `brygga` object. You can change the build folder and source folder using these config properties:

```
brygga.config.shared.dest = 'build';
brygga.config.shared.src = 'src';
```

# Browser support

Every project should set which browsers it targets as this is used in several tasks. Brygga uses [browserslist](https://github.com/ai/browserslist) for this. The default value is set to `last 2 versions`.

```
brygga.config.shared.browsers = [ 'last 2 versions' ];
```

# CSS

Brygga uses [PostCSS](https://github.com/postcss/postcss) with plugins for [inlining imports](https://github.com/postcss/postcss-import), [nesting](https://github.com/postcss/postcss-nested) and [future CSS syntax](https://github.com/cssnext/postcss-cssnext).

Task: `css`
Config:
```js
// CSS is stored in a subfolder for both source and destination
brygga.config.css.root = 'css';
 // Set one or more source files to use
brygga.config.css.src = [ 'main.css' ];
```

# HTML

HTML support is included to allow users of Brygga to build static sites or styleguides. Brygga uses [Nunjucks](https://mozilla.github.io/nunjucks/) for templating and looks for pages under the folder `src/pages`.

Task: `html`
Config:
```js
// HTML is stored in the root
brygga.config.html.root = '';
// Config to look for HTML in the pages folder
brygga.config.html.src = [ 'pages/**/*.html' ];
// Use the entire source folder to include or import templates
brygga.config.html.templates = [ '' ];
```

### Data

Templates support fetching data via JSON files and via front matter. Front matter is useful to set things such as titles and other variables used by templates. Example:

`pages/index.html`:
```
---
title: Test
---
{% extends 'layouts/base.html' %}

{% block content %}
<h1>{{ test }}</h1>
{% endblock %}
```

`layouts/base.html`:
```
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    {% block content %}
    {% endblock %}
</body>
</html>
```

## Data

Brygga will load JSON files in the data folder when rendering templates. The name of the JSON file is mapped on the data object, so a file named `site.json` will have its data available as `site`.

Config:
```js
// Use data as root folder
brygga.config.data.root = 'data';
// Use all JSON files found
brygga.config.data.src = [ '**/*.json' ];
```
