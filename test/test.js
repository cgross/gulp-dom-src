var path = require('path');
var fs = require('fs');
var should = require('should');
var domSrc = require('../index');
var vfs = require('vinyl-fs');
var through = require('through2');

var dataWrap = function(fn) {
    return function(data, enc, cb) {
        fn(data);
        cb();
    };
};

it('should read the script tags src into the stream', function (done) {

    var onEnd = function(){
        buffered.length.should.equal(3);
        should.exist(buffered[0].stat);
        buffered[0].path.should.equal(path.resolve('test/fixture/one.js'));
        buffered[1].path.should.equal(path.resolve('test/fixture/two.js'));
        buffered[2].path.should.equal(path.resolve('test/fixture/three.js'));
        done();
    };

    var stream = domSrc({file:'test/fixture/fixture.html',selector:'script',attribute:'src'});

    var buffered = [];
    var bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);

});

it('should use the cwd property correctly.', function (done) {

    var onEnd = function(){
        buffered.length.should.equal(1);
        should.exist(buffered[0].stat);
        buffered[0].path.should.equal(path.resolve('test/fixture/one.js'));
        done();
    };

    var stream = domSrc({file:'test/fixture/subdir/subdir.html',selector:'script',attribute:'src',cwd:'test/fixture'});

    var buffered = [];
    var bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);

});

