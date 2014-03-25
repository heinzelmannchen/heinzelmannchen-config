var Config = require('./lib/config'),
    _ = require('underscore'),
    rc = require('rc');

module.exports = Config(rc, _).load('heinzel');
