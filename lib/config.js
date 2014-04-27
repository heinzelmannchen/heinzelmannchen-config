var pub = {}, APP_NAME = 'heinzel',
    DEFAULTS = {},
    SEPARATOR = '.',
    _, q, rc, findup, path, fs, jsonpretty, config;

function Config($inject) {
    rc = $inject.rc;
    _ = $inject.underscore;
    findup = $inject.findup;
    path = $inject.path;
    fs = $inject.fs;
    q = $inject.q;
    jsonpretty = $inject.jsonpretty;

    return pub;
}

pub.load = function(appName, defaults) {
    appName = appName ||  APP_NAME;
    defaults = defaults ||  DEFAULTS;
    config = rc(appName, defaults);

    return pub;
};

pub.get = function(key) {
    if (_.contains(key, SEPARATOR)) {
        key = key.split(SEPARATOR);
    }
    if (!_.isArray(key)) {
        key = [key];
    }
    return get(config, key, key);
};

function get(obj, keys, allKeys) {
    var rest = _.rest(keys),
        first = _.first(keys),
        deepestObject;
    if (!_.has(obj, first)) {
        if (allKeys.length > 1) {
            allKeys = goUpALevel(allKeys);
            return get(config, allKeys, allKeys);
        } else {
            throw new Error('config has no key ' + keys);
        }
    }

    if (rest.length > 0) {
        return get(obj[first], rest, allKeys);
    } else {
        return obj[keys];
    }
}

function goUpALevel(allKeys) {
    var deepestObject = allKeys[allKeys.length - 2];
    return _.without(allKeys, deepestObject);
}

pub.set = function(object, key, value) {
    if (_.contains(key, SEPARATOR)) {
        key = key.split(SEPARATOR);
    }
    if (!_.isArray(key)) {
        key = [key];
    }
    return setValue(object, key, value);
};

function setValue(obj, keys, value) {
    var rest = _.rest(keys),
        first = _.first(keys);
    if (rest.length > 0) {
        if (!_.has(obj, first)) {
            obj[first] = {};
        }
        obj[first] = setValue(obj[first], rest, value);
        return obj;
    } else {
        obj[first] = value;
        return obj;
    }
}

pub.getLocalConfigPath = function() {
    return findup.sync(SEPARATOR, '.heinzelrc');
};

pub.getGlobalConfigPath = function() {
    return path.join('~', '.heinzelrc');
};

pub.saveLocal = function(key, value) {
    var pathToLocalConfig = path.join(pub.getLocalConfigPath(), '.heinzelrc');
    return q.nfcall(fs.readFile, pathToLocalConfig, {
        encoding: 'utf-8'
    })
        .then(function(localConfig) {
            localConfig = JSON.parse(localConfig) ||  {};
            localConfig = pub.set(localConfig, key, value);
            return q.nfcall(fs.writeFile, pathToLocalConfig, jsonpretty(localConfig));
        });
};

pub.saveGlobal = function(key, value) {
    var pathToGlobalConfig = path.join(pub.getGlobalConfigPath(), '.heinzelrc');
    return q.nfcall(fs.readFile, pathToGlobalConfig, {
        encoding: 'utf-8'
    })
        .then(function(globalConfig) {
            globalConfig = JSON.parse(globalConfig);
            globalConfig = pub.set(globalConfig, key, value);
            return q.nfcall(fs.writeFile, pathToGlobalConfig, jsonpretty(globalConfig));
        });
};

module.exports = Config;
