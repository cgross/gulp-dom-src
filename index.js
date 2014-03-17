var vinylFs = require('vinyl-fs');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');

module.exports = function(config){

    var html = fs.readFileSync(path.join(process.cwd(),config.file),'utf8');
    var $ = cheerio.load(html);

    var files = $(config.selector).map(function(i,elem){
        return $(elem).attr(config.attribute);
    }).toArray().filter(function(item){
        return (item !== undefined && item.substring(0,4) !== 'http' && item.substring(0,2) !== '//');
    }).map(function(item){
        var cwd = config.cwd ? config.cwd : path.dirname(config.file);
        return path.join(cwd,item);
    });

    return vinylFs.src(files,config.options || {});
};