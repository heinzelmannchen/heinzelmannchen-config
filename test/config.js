var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.Should(),
    mockFs = require('mock-fs'),
    sinon = require('sinon'),
    _ = require('underscore'),
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
            Config(spy, _).load();
            return spy.should.have.been.called;
        });
        it('should set a appname and the defaults for the configfile name', function() {
            Config(spy, _).load();
            return spy.should.have.been.calledWithMatch('heinzel', {});
        });
        it('should be possible to overwrite the appname and the defaults', function() {
            Config(spy, _).load('anton', 10);
            return spy.should.have.been.calledWithMatch('anton', 10);
        });
        it('should return an object', function() {
            Config(sinon.stub().returns({}), _).load().should.be.an('object');
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
            config = Config(stub, _).load();
        });
        it('should have a function get', function() {
            config.should.respondTo('get');
        });
        it('should return the value for the key', function() {
            config.get('key').should.be.eq('value');
        });
        it('should throw an error if the config has no key = "noKey"', function() {
            config.get.bind('noKey').should.throw();
            config.get.bind().should.throw();
        });
        it('should return an array if the property is an array', function() {
            config.get('array').should.be.eql([1, 2, 3]);
        });
        it('should return the value of a property in a sub object', function() {
            config.get('sub.key').should.be.eq('anOtherValue');
            config.get(['sub', 'key']).should.be.eq('anOtherValue');
            config.get.bind(['sub', 'noKey']).should.throw();
        });
    });
    describe('#getLocalConfigPath', function() {
        var stub, config;
        beforeEach(function() {
            stub = sinon.stub().returns('/here/is/my/local/.heinzelrc');
            config = Config(null, _, stub);
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
            config = Config(null, _, null, stub);
        });
        it('should return the path to the global config file', function() {
            config.getGlobalConfigPath().should.be.eq('~/.heinzelrc');
        });
        it('should call findup', function() {
            config.getGlobalConfigPath();
            stub.join.should.have.been.calledWith('~', '.heinzelrc');
        });
    });
});
