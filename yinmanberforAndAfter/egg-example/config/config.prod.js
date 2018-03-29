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
    mysql: {
      client: {
        host: '127.0.0.1',
        port: '3306',
        user: 'yinman',
        password: 'ivj76xbej8',
        database: 'yinman',
      },
      app: true,
      agent: false,
    },
    url: 'https://wx.yinmanyinyue.com', // 'http://ym.ipet66.com',
    wxApp: {
      appid: 'wxdc06b91aef63b7b4',
      secret: '8196ad0809542cf54fd0df55382a05fe',
    },
    middleware: [ 'errorHandler' ],
    admins: [{
      wxName: 'lisa',
      publicOpenId: 'oKA9kwOrkgK6S5p853trHMJ5B0UM',
      isEnabled: 1,
    }, {
      wxName: '音曼音乐课堂',
      publicOpenId: 'oKA9kwN6i5-1vsnBdhA8thFfmq3Y',
      isEnabled: 1,
    }, {
      wxName: '????小贝贝菜菜子????',
      publicOpenId: 'oKA9kwB5MW9e1w1h-F2qA1IdLwBQ',
      isEnabled: 1,
    }],
  };
  return config;
};
