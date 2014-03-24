var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.Should(),
    mockFs = require('mock-fs'),
    sinon = require('sinon'),
    config = require('../lib/config');

describe('lib/config', function() {
    describe('#', function() {
        it('should be a function', function() {
            config.should.be.a('function');
        });
        it('should call the injected function', function() {
            var spy = sinon.spy();
            config(spy);
            return spy.should.have.been.called;
        });
        it('should set a appname and the defaults for the configfile name', function() {
            var spy = sinon.spy();
            config(spy);
            return spy.should.have.been.calledWithMatch('heinzel', {
            });
        });
        it('should be possible to overwrite the appname and the defaults', function() {
            var spy = sinon.spy();
            config(spy, 'anton', 10);
            return spy.should.have.been.calledWithMatch('anton', 10);
        });
    });
});
