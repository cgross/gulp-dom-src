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

Any valid CSS selector.  You can use complex selectors to allow flexible include/exclude logic for your tags.  For example, use a selector such as `script[data-concat!="false"]` and put `data-concat="false"` on any script tags you wish to exclude from a concat/minification stream.


#### config.attribute

Type: `String`

The name of the attribute that contains the file path.  Typically `src` for `script` tags and `href` for `link`s.

#### config.cwd

Type: `String` (Optional)

The directory where the paths in your tags are relative to.  By default, the files references in your script or link tags are assumed to be relative to the HTML file they're read from.

#### config.options

Type: `Object` (Optional)
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
* 3/17/2014 - v0.1.1 - Added `cwd` option.
* 3/08/2014 - v0.1.0 - Initial release.
