'use strict';

module.exports = appInfo => {
    const config = {
        // should change to your own
        keys: appInfo.name + '_1491881006043_4179',
        // config.mongoose = {
        //     url: 'mongodb://192.168.0.90:27017/user',
        //     options: {}
        // };
        bodyParser: {
            enable: true,
        },
        security: {
            csrf: false,
            ctoken: false,
        },
        multipart: {
            whitelist: ['.jpg', '.jpeg', '.png', '.mp3', '.mp4'],
            fileSize: '50mb',
        },
        mysql: {
            client: {
                host: 'localhost',
                port: '3306',
                user: 'root',
                password: '',
                database: 'yinman'
            },
            app: true,
            agent: false,
        },
        url: 'http://192.168.0.90:7001', //'http://ym.ipet66.com',
        wxApp: {
            appid: 'wxdc06b91aef63b7b4',
            secret: '8196ad0809542cf54fd0df55382a05fe',
        },
        middleware: ['errorHandler'],
        // static: {
        //     prefix: '/.well-known',
        //     dir: appInfo.baseDir + '/.well-known',
        //     buffer: true,
        // }
        admins: []
    }
    return config;
};