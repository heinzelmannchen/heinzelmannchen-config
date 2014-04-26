var APP_NAME = 'heinzel',
    DEFAULTS = {},
    _, q, rc, findup, path, fs,jsonpretty, config;

function Config($inject) {
    rc = $inject.rc;
    _ = $inject.underscore;
    findup = $inject.findup;
    path = $inject.path;
    fs = $inject.fs;
    q = $inject.q;
    jsonpretty = $inject.jsonpretty;

    return {
        load: load,
        getLocalConfigPath: getLocalConfigPath,
        getGlobalConfigPath: getGlobalConfigPath,
        saveLocal: saveLocal,
        saveGlobal: saveGlobal,
        set: set
    };
}

function load(appName, defaults) {
    appName = appName ||  APP_NAME;
    defaults = defaults ||  DEFAULTS;
    config = rc(appName, defaults);

    return {
        get: get,
        getLocalConfigPath: getLocalConfigPath,
        getGlobalConfigPath: getGlobalConfigPath,
        saveLocal: saveLocal,
        saveGlobal: saveGlobal,
        set: set
    };
}

function get(key) {
    if (_.contains(key, '.')) {
        key = key.split('.');
    }
    if (!_.isArray(key)) {
        key = [key];
    }
    return getFromObject(config, key, key);
}

function getFromObject(obj, keys, allKeys) {
    var rest = _.rest(keys),
        first = _.first(keys),
        deepestObject;
    if (!_.has(obj, first)) {
        if (allKeys.length > 1) {
            deepestObject = allKeys[allKeys.length - 2];
            allKeys = _.without(allKeys, deepestObject);
            return getFromObject(config, allKeys, allKeys);
        } else {
            throw new Error('config has no key ' + keys);
        }
    }
    if (rest.length > 0) {
        return getFromObject(obj[first], rest, allKeys);
    } else {
        return obj[keys];
    }
}

function set(object, key, value) {
    if (_.contains(key, '.')) {
        key = key.split('.');
    }
    if (!_.isArray(key)) {
        key = [key];
    }
    return setValue(object, key, value);
}

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

function getLocalConfigPath() {
    return findup.sync('.', '.heinzelrc');
}

function getGlobalConfigPath() {
    return path.join('~', '.heinzelrc');
}

function saveLocal(key, value) {
    var pathToLocalConfig = path.join(getLocalConfigPath(), '.heinzelrc');
    return q.nfcall(fs.readFile, pathToLocalConfig, {
        encoding: 'utf-8'
    })
        .then(function(localConfig) {
            localConfig = JSON.parse(localConfig) || {};
            localConfig = set(localConfig, key, value);
            return q.nfcall(fs.writeFile, pathToLocalConfig, jsonpretty(localConfig));
        });
}

function saveGlobal(key, value) {
    var pathToGlobalConfig = path.join(getGlobalConfigPath(), '.heinzelrc');
    return q.nfcall(fs.readFile, pathToGlobalConfig, {
        encoding: 'utf-8'
    })
        .then(function(globalConfig) {
            globalConfig = JSON.parse(globalConfig);
            globalConfig = set(globalConfig, key, value);
            return q.nfcall(fs.writeFile, pathToGlobalConfig, jsonpretty(globalConfig));
        });
}

module.exports = Config;
