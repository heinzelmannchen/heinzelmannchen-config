var Config = require('./lib/config');

module.exports = Config({
    rc: require('rc'),
    q: require('q'),
    underscore: require('underscore'),
    fs: require('fs'),
    path: require('path'),
    findup: require('findup')
}).load('heinzel');
