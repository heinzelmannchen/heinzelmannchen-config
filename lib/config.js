var APP_NAME = 'heinzel',
    DEFAULTS = {},
    _, rc, findup, path, config;

function Config($rc, $underscore, $findup, $path) {
    rc = $rc;
    _ = $underscore;
    findup = $findup;
    path = $path;
    return {
        load: load,
        getLocalConfigPath: getLocalConfigPath,
        getGlobalConfigPath: getGlobalConfigPath
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

function getLocalConfigPath() {
    return findup('.', '.heinzelrc');
}

function getGlobalConfigPath() {
    return path.join('~', '.heinzelrc');
}

module.exports = Config;
