var path = require('path');
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

describe('src (default) mode', function () {
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
});

describe('duplex mode', function () {
    it('should process html piped into it', function(done) {

        var onEnd = function(){
            buffered.length.should.equal(3);
            should.exist(buffered[0].stat);
            buffered[0].path.should.equal(path.resolve('test/fixture/one.js'));
            buffered[1].path.should.equal(path.resolve('test/fixture/two.js'));
            buffered[2].path.should.equal(path.resolve('test/fixture/three.js'));
            done();
        };

        var stream = vfs.src('test/fixture/fixture.html')
            .pipe(domSrc.duplex({
                selector:'script',
                attribute:'src'
            }));

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

        var stream = vfs.src('test/fixture/subdir/subdir.html')
            .pipe(domSrc.duplex({
                selector:'script',
                attribute:'src',
                cwd: 'test/fixture'
            }));

        var buffered = [];
        var bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
        stream.pipe(bufferStream);
    });

    it('should still work when finding nothing in html', function(done) {

        var onEnd = function(){
            buffered.length.should.equal(0);
            done();
        };

        var stream = vfs.src('test/fixture/fixture.html')
            .pipe(domSrc.duplex({
                selector:'script',
                attribute:'wont-find-this-attribute'
            }));

        var buffered = [];
        var bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
        stream.pipe(bufferStream);
    });

    it('should handle multiple incoming html files', function(done) {

        var onEnd = function(){
            buffered.length.should.equal(3);
            should.exist(buffered[0].stat);
            buffered[0].path.should.equal(path.resolve('test/fixture/one.js'));
            buffered[1].path.should.equal(path.resolve('test/fixture/two.js'));
            buffered[2].path.should.equal(path.resolve('test/fixture/three.js'));
            done();
        };

        var stream = vfs.src('test/fixture/template{1,2}.html')
            .pipe(domSrc.duplex({
                selector:'script',
                attribute:'src'
            }));

        var buffered = [];
        var bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
        stream.pipe(bufferStream);
    });

    it('should emit an error when a referenced file is not found', function(done) {

        var onEnd = function(){
            done(new Error('onEnd should not have been called'));
        };

        var stream = vfs.src('test/fixture/bad-script-tag.html')
            .pipe(domSrc.duplex({
                selector:'script',
                attribute:'src'
            }));

        var buffered = [];
        var bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);

        stream.on('error', function(err) {
            done();
        }).pipe(bufferStream);
    });
});