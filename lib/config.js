var APP_NAME = 'heinzel',
    DEFAULTS = {},
    _, q, rc, findup, path, fs, config;

function Config($inject) {
    rc = $inject.rc;
    _ = $inject.underscore;
    findup = $inject.findup;
    path = $inject.path;
    fs = $inject.fs;
    q = $inject.q;

    return {
        load: load,
        getLocalConfigPath: getLocalConfigPath,
        getGlobalConfigPath: getGlobalConfigPath,
        saveLocal: saveLocal,
        set: set
    };
}

function load(appName, defaults) {
    appName = appName ||  APP_NAME;
    defaults = defaults ||  DEFAULTS;
    config = rc(appName, defaults);

    return {
        get: get
    };
}

function get(key) {
    if (_.contains(key, '.')) {
        key = key.split('.');
    }
    if (!_.isArray(key)) {
        key = [key];
    }
    return getFromObject(config, key);
}

function getFromObject(obj, keys) {
    var rest = _.rest(keys),
        first = _.first(keys);
    if (!_.has(obj, first)) {
        throw new Error('config has no key ' + keys);
    }
    if (rest.length > 0) {
        return getFromObject(obj[first], rest);
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
    return findup('.', '.heinzelrc');
}

function getGlobalConfigPath() {
    return path.join('~', '.heinzelrc');
}

function saveLocal(key, value) {
    var pathToLocalConfig = getLocalConfigPath();
    return q.nfcall(fs.readFile, pathToLocalConfig)
        .then(function(localConfig) {
            localConfig = set(localConfig, key, value);
            return q.nfcall(fs.writeFile, pathToLocalConfig, localConfig);
        });
}

module.exports = Config;
