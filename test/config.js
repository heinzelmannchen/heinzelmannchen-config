var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.Should(),
    mockFs = require('mock-fs'),
    sinon = require('sinon'),
    _ = require('underscore'),
    path = require('path'),
    q = require('q'),
    Config = require('../lib/config');


describe('lib/config', function() {

    describe('#', function() {
        var spy;
        beforeEach(function() {
            spy = sinon.spy();
        });
        it('should be a function', function() {
            Config.should.be.a('function');
        });
        it('should call the injected function', function() {
            Config({
                rc: spy,
                underscore: _
            }).load();
            return spy.should.have.been.called;
        });
        it('should set a appname and the defaults for the configfile name', function() {
            Config({
                rc: spy,
                underscore: _
            }).load();
            return spy.should.have.been.calledWithMatch('heinzel', {});
        });
        it('should be possible to overwrite the appname and the defaults', function() {
            Config({
                rc: spy,
                underscore: _
            }).load('anton', 10);
            return spy.should.have.been.calledWithMatch('anton', 10);
        });
        it('should return an object', function() {
            Config({
                rc: sinon.stub().returns({}),
                underscore: _
            }).load().should.be.an('object');
        });
    });

    describe('#get', function() {
        var stub, config;
        beforeEach(function() {
            stub = sinon.stub().returns({
                key: 'value',
                array: [1, 2, 3],
                sub: {
                    key: 'anOtherValue'
                }
            });
            config = Config({
                rc: stub,
                underscore: _
            }).load();
        });
        it('should have a function get', function() {
            config.should.respondTo('get');
        });
        it('should return the value for the key', function() {
            config.get('key').should.be.eq('value');
        });
        it('should throw an error if the config has no key = "noKey"', function() {
            config.get.bind('noKey').should.
            throw ();
            config.get.bind().should.
            throw ();
        });
        it('should return an array if the property is an array', function() {
            config.get('array').should.be.eql([1, 2, 3]);
        });
        it('should return the value of a property in a sub object', function() {
            config.get('sub.key').should.be.eq('anOtherValue');
            config.get(['sub', 'key']).should.be.eq('anOtherValue');
            config.get.bind(['sub', 'noKey']).should.
            throw ();
        });
    });

    describe('#getLocalConfigPath', function() {
        var stub, config;
        beforeEach(function() {
            stub = sinon.stub().returns('/here/is/my/local/.heinzelrc');
            config = Config({
                findup: stub
            });
        });
        it('should return the path to the local config file', function() {
            config.getLocalConfigPath().should.be.eq('/here/is/my/local/.heinzelrc');
        });
        it('should call findup', function() {
            config.getLocalConfigPath();
            stub.should.have.been.calledWith('.', '.heinzelrc');
        });
    });

    describe('#getRootConfigPath', function() {
        var stub, config;
        beforeEach(function() {
            stub = {
                join: sinon.stub().returns('~/.heinzelrc')
            };
            config = Config({
                path: stub
            });
        });
        it('should return the path to the global config file', function() {
            config.getGlobalConfigPath().should.be.eq('~/.heinzelrc');
        });
        it('should call findup', function() {
            config.getGlobalConfigPath();
            stub.join.should.have.been.calledWith('~', '.heinzelrc');
        });
    });

    describe('#set', function() {
        var config;
        beforeEach(function() {
            config = Config({
                underscore: _
            });
        });
        it('should have a function set', function() {
            config.should.respondTo('set');
        });
        it('should set the value of a given key', function() {
            config.set({}, 'heinzel', 'Anton').should.be.eql({
                heinzel: 'Anton'
            });
            config.set({
                heinzel: 'Berti'
            }, 'heinzel', 'Anton').should.be.eql({
                heinzel: 'Anton'
            });
        });
        it('should not affect other properties', function() {
            config.set({
                leaveMeAlone: 'Berti'
            }, 'heinzel', 'Anton').should.be.eql({
                leaveMeAlone: 'Berti',
                heinzel: 'Anton'
            });
        });
        it('should set properties in sub objects', function() {
            config.set({
                leaveMeAlone: 'Berti',
                heinzel: {
                }
            }, 'heinzel.name', 'Anton').should.be.eql({
                leaveMeAlone: 'Berti',
                heinzel: {
                    name: 'Anton'
                }
            });
        });
        it('should create sub objects if they dont exist', function() {
            config.set({
                leaveMeAlone: 'Berti'
            }, 'heinzel.name', 'Anton').should.be.eql({
                leaveMeAlone: 'Berti',
                heinzel: {
                    name: 'Anton'
                }
            });
        });
    });

    describe('#saveLocal', function() {
        var fsStub, config;
        beforeEach(function() {
            fsStub = {
                readFile: sinon.stub().returns({ }),
                writeFile: sinon.spy()
            };
            config = Config({
                q: q,
                underscore: _,
                fs: fsStub,
                findup: sinon.stub().returns('/local/.heinzelrc')
            });
        });
        it('should save a property in the local config', function() {
            return config.saveLocal('heinzel', 'anton').should.be.resolve;
        });
    });

    describe('#saveGlobal', function() {
        var fsStub, config;
        beforeEach(function() {
            fsStub = {
                readFile: sinon.stub().returns({ }),
                writeFile: sinon.spy()
            };
            config = Config({
                path: path,
                q: q,
                underscore: _,
                fs: fsStub,
                findup: sinon.stub().returns('/local/.heinzelrc')
            });
        });
        it('should save a property in the global config', function() {
            return config.saveGlobal('heinzel', 'anton').should.be.resolve;
        });
    });
});
