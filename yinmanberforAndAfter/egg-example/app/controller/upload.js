'use strict';
const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
module.exports = app => {
    class uploadController extends app.Controller { *
        upload() {
            const parts = this.ctx.multipart();

            let part;
            while ((part = yield parts) != null) {
                if (Array.isArray(part)) {
                    continue;
                } else {
                    break;
                }
            }
            // 并没有文件被上传，这时候需要根据业务需要做针对性的处理
            // 例如 文件是必须字段，那么就报错
            // 这里只是给出提示
            if (!part || !part.filename) {
                this.body = {
                    message: 'no file',
                };
                return;
            }
            if (this.ctx.query.mock_stream_error) {
                // mock save stream error
                const filepath = path.join(this.app.config.logger.dir, 'not-exists-dir/dir2/testfile');
                try {
                    yield saveStream(part, filepath);
                } catch (err) {
                    yield sendToWormhole(part);
                    throw err;
                }
                this.body = {
                    filename: part.filename,
                };
            }
            const date = new Date();
            const filename = date.getFullYear() + '' + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
            const dirname = app.moment().format('YYMMDD');
            const filepath = path.join(path.resolve(__dirname, '../public/files/' + dirname + "/"), filename + path.extname(part.filename));
            let res = {};

            if (!fs.existsSync('app/public/files/' + dirname + '/')) {
                fs.mkdirSync('app/public/files/' + dirname + '/');
            }
            if (this.ctx.request.query.id == '') {

                yield app.mysql.update('upload', { id: this.ctx.request.query.id, picPath: 'public/files/' + dirname + '/' + filename + path.extname(part.filename) });
                res.id = this.ctx.request.query.id;
            } else {
                const ERR_OK = yield app.mysql.insert('upload', { picPath: 'public/files/' + dirname + '/' + filename + path.extname(part.filename) });
                res = yield app.mysql.get('upload', { id: ERR_OK.insertId });
            }
            yield saveStream(part, filepath);
            this.ctx.body = {
                data: this.config.url + '/' + res.picPath,
                res: res,
                ok: true,
            };
        }
    }

    function saveStream(stream, filepath) {
        return new Promise((resolve, reject) => {
            const ws = fs.createWriteStream(filepath);
            stream.pipe(ws);
            ws.on('error', reject);
            ws.on('finish', resolve);
        });
    }
    return uploadController;
};