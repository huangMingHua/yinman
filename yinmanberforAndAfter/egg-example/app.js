'use strict';
var moment = require('moment');
require('moment/locale/zh-cn');
const lodash = require('lodash');
var WechatAPI = require('wechat-api');
var api = new WechatAPI("wx47a24f23f864ba75", "7aa7251fe9d96a8d3d3074795ffeb9d0");
const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');

moment.locale('zh-cn', {
    week: {
        dow: 1
    }
});


module.exports = app => {
    app.moment = moment;
    app.lodash = lodash;
    app.api = api
    class BaseController extends app.Controller {
        get userId() {
            const id = this.ctx.cookies.get('username', {
                encrypt: true,
            });
            // console.log(id);
            // let user = yield this.service.user.getById(id);
            // console.log(user);
            // return user;
            return id;
        }

        /**
         * 
         * @param {Object} data 
         */
        success(data) {
            this.ctx.body = {
                code: 1,
                data
            }
        }
        /**
         * 
         * @param {String} msg 
         */
        fail(msg) {
            this.ctx.body = {
                code: 0,
                msg: msg,
            }
        }

        *
        upload(stream) {
            let now = app.moment();
            var filename = now.format('YYMMDDHHmmss') + app.lodash.random(1000, 9999);
            let relativeDir = './app/public/files/' + now.format('YYMMDD');
            let dir = path.resolve(__dirname, relativeDir);
            if (!fsExistsSync(dir)) {
                fs.mkdirSync(dir);
            }
            const filepath = path.join(dir, filename + path.extname(stream.filename));
            try {
                yield saveStream(stream, filepath);

            } catch (err) {
                yield sendToWormhole(stream);
                throw err;
            }
            return path.join('/' + now.format('YYMMDD'), filename + path.extname(stream.filename));
        }
    }

    //检测文件或者文件夹存在 nodeJS
    function fsExistsSync(path) {
        try {
            fs.accessSync(path, fs.F_OK);
        } catch (e) {
            return false;
        }
        return true;
    }

    function saveStream(stream, filepath) {
        return new Promise((resolve, reject) => {
            const ws = fs.createWriteStream(filepath);
            stream.pipe(ws);
            ws.on('error', reject);
            ws.on('finish', resolve);
        });
    }

    app.Controller = BaseController;
};