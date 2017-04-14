'use strict';

module.exports = appInfo => {
    const config = {};
    // should change to your own
    config.keys = appInfo.name + '_1491881006043_4179';
    config.mongoose = {
        url: 'mongodb://127.0.0.1:27017/user',
        options: {}
    };
    config.bodyParser = {
        enable: true,
    };
    config.security = {
        csrf: false,
        ctoken: false,
    };
    return config;
};


