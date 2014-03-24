var APP_NAME = 'heinzel',
    DEFAULTS = { },
    config;

module.exports = function($rc, appName, defaults) {
    appName = appName || APP_NAME;
    defaults = defaults || DEFAULTS;
    config = $rc(appName, defaults);
};
