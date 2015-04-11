var vinylFs = require('vinyl-fs');
var cheerio = require('cheerio');
var through = require('through2');
var vinylFile = require('vinyl-file');
var async = require('async');
var extend = require('extend');
var fs = require('fs');
var path = require('path');

module.exports = domSrc;

function domSrc(config){
    var html = fs.readFileSync(path.join(process.cwd(),config.file),'utf8');
    var files = findFilenames(html, config);

    return vinylFs.src(files,config.options || {});
}

function findFilenames(html, config) {
    var $ = cheerio.load(html);

    return $(config.selector).map(function(i,elem){
        return $(elem).attr(config.attribute);
    }).toArray().filter(function(item){
        return (item !== undefined && item.substring(0,4) !== 'http' && item.substring(0,2) !== '//');
    }).map(function(item){
        var cwd = config.cwd ? config.cwd : path.dirname(config.file);
        return path.join(cwd,item);
    });
}

domSrc.duplex = function(config) {
    return through.obj(findAndReadFiles);

    function findAndReadFiles(htmlFile, encoding, throughCallback) {
        // copy config and set config.file to current html file
        // so cwd is resolved correctly when scanning html for filenames
        var configCopy = extend({}, config);
        configCopy.file = htmlFile.path;

        var html = htmlFile.contents.toString();
        var filenames = findFilenames(html, configCopy);

        if (filenames.length == 0) {
            return throughCallback();
        }

        var throughStream = this;
        async.eachSeries(filenames, function(filename, eachCallback) {
            vinylFile.read(filename, function(err, file) {
                if (err) return eachCallback(err);

                throughStream.push(file);
                eachCallback();
            });
        }, function(err) {
            throughCallback(err);
        });
    }
};