'use strict';
const path = require('path');
const fs = require('fs');
module.exports = app => {
    class rhythmCourseController extends app.Controller { *
        saveOrUpdateCourseInfo() {
                const parts = this.ctx.multipart({ autoFields: true });
                const part = yield parts;
                console.log(parts.field)
                let { id, name, category, time, courseIntroduction, picId } = parts.field;
                if (app.lodash.trim(name) == '') {
                    this.fail('课程名称不能为空');
                    return;
                }
                if (app.lodash.trim(category) == '') {
                    this.fail('类别不能为空');
                    return;
                }
                if (app.lodash.trim(time) == '') {
                    this.fail('时长不能为空');
                    return;
                }
                if (app.lodash.trim(courseIntroduction) == '') {
                    this.fail('课程介绍不能为空');
                    return;
                }
                if (part) {
                    const fileDate = new Date();
                    const filename = fileDate.getFullYear() + '' + (fileDate.getMonth() + 1) + fileDate.getDate() + fileDate.getHours() + fileDate.getMinutes() + fileDate.getSeconds() + fileDate.getMilliseconds();
                    const filepath = path.join(path.resolve(__dirname, '../public/files'), filename + path.extname(part.filename));
                    if (picId > 0) {
                        yield app.mysql.update('upload', { id: picId, picPath: 'public/files/' + filename + path.extname(part.filename) });
                    } else {
                        const ERR_OK = yield app.mysql.insert('upload', { picPath: 'public/files/' + filename + path.extname(part.filename) });
                        picId = ERR_OK.insertId
                    }
                    yield saveStream(part, filepath);
                }
                const date = new Date();
                if (id == 0) {
                    var res = yield app.mysql.insert('rhythmcourse', {
                        name,
                        time,
                        courseIntroduction,
                        category,
                        picId,
                        creatTime: date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate(),
                        updateTime: '',
                    });
                    this.ctx.body = {
                        id: res.insertId,
                    };
                } else {
                    var res = yield app.mysql.update('rhythmcourse', {
                        id: id,
                        name,
                        time,
                        courseIntroduction,
                        category,
                        updateTime: date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate(),
                        picId,
                    });
                    this.ctx.body = {
                        id: id,
                    };
                }

            } *
            getAll() {
                const list = yield app.mysql.select('rhythmcourse');
                const result = [];
                for (const item of list) {
                    if (item.picId != '') {
                        console.log();
                        const pic = yield app.mysql.get('upload', { id: item.picId });
                        var picPath = this.config.url + '/' + pic.picPath;
                    } else {
                        var picPath = '';
                    }
                    result.push({
                        res: item,
                        picPath,
                    });
                }
                this.ctx.body = result;
            } *
            getList() {
                const list = yield app.mysql.select('rhythmcourse', { limit: Number(this.ctx.request.query.limit), offset: (this.ctx.request.query.pageIndex - 1) * this.ctx.request.query.limit });
                const count = yield app.mysql.query('select count(*) from rhythmcourse');
                const result = [];
                for (const item of list) {
                    if (item.picId > 0) {
                        const pic = yield app.mysql.get('upload', { id: item.picId });
                        var picPath = this.config.url + '/' + pic.picPath;
                    } else {
                        var picPath = '';
                    }
                    result.push({
                        res: item,
                        picPath,
                    });
                }
                this.ctx.body = {
                    list: result,
                    pages: Math.ceil(count[0]['count(*)'] / this.ctx.request.query.limit),
                };
            } *
            getById() {
                console.log(this.ctx.request.query);
                const res = yield app.mysql.get('rhythmcourse', { id: this.ctx.request.query.id });
                let picPath = '';
                if (res.picId > 0) {
                    const pic = yield app.mysql.get('upload', { id: res.picId });
                    picPath = this.config.url + '/' + pic.picPath;
                }
                this.ctx.body = {
                    res,
                    picPath,
                };
            } *
            delete() {
                const ERR_OK = yield app.mysql.delete('rhythmcourse', { id: this.ctx.request.body.id });
                const result = {};
                if (ERR_OK.affectedRows == 1) {
                    this.success();
                } else {
                    this.fail('删除失败');
                }
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
    return rhythmCourseController;
};