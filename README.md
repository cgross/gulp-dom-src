# gulp-dom-src [![Build Status](https://travis-ci.org/cgross/gulp-dom-src.png)](https://travis-ci.org/cgross/gulp-dom-src)

> Create a gulp stream from script, link, or any set of tags in an HTML file.

## Example

```js
var gulp = require('gulp');
var domSrc = require('gulp-dom-src');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
	domSrc({ file: 'index.html', selector: 'script', attribute: 'src' })
        .pipe(concat('app.full.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});
```

## API

### domSrc(config)


#### config.file

Type: `String`

The name of the HTML file to read the tags from.


#### config.selector

Type: `String`

Any valid CSS selector.


#### config.attribute

Type: `String`

The name of the attribute that contains the file path.  Typically `src` for `script` tags and `href` for `link`s.


#### config.options

Type: `Object`
Default: `{}`

Options passed through to the underlying `vinyl-fs`.  Can include options like `read` and `buffer`.

End-to-End Concatenation and Minification
-------------

Combine gulp-dom-src with [gulp-cheerio](https://github.com/KenPowers/gulp-cheerio) for a full concat & min workflow.

```js
var gulp = require('gulp');
var domSrc = require('gulp-dom-src');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var cheerio = require('gulp-cheerio');

gulp.task('css', function() {
    return domSrc({file:'index.html',selector:'link',attribute:'href'})
    	.pipe(concat('app.full.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/'));
});

gulp.task('js', function() {
    return domSrc({file:'index.html',selector:'script',attribute:'src'})
        .pipe(concat('app.full.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('indexHtml', function() {
    return gulp.src('index.html')
        .pipe(cheerio(function ($) {
            $('script').remove();
            $('link').remove();
            $('body').append('<script src="app.full.min.js"></script>');
            $('head').append('<link rel="stylesheet" href="app.full.min.css">');
        }))
        .pipe(gulp.dest('dist/'));
});
```

Release History
-------------
* 3/08/2014 - v0.1.0 - Initial release.
