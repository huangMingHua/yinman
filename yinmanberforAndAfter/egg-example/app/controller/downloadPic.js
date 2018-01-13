'use strict';
const path = require('path');
const fs = require('fs');

module.exports = app => {
    class downloadPicController extends app.Controller { *
        saveOrUpdatePicInfo() {
            const parts = this.ctx.multipart({ autoFields: true });

            const stream = yield parts;
            //console.log(parts.field, stream);
            //const stream = yield this.ctx.getFileStream();
            var now = app.moment();

            let { id, title, explain } = parts.field;
            if (app.lodash.trim(title) == '') {
                this.fail("标题不能为空");
                return
            }
            if (app.lodash.trim(explain) == '') {
                this.fail("说明不能为空");
                return
            }
            //this.ctx.logger.info(stream.mimeType);
            var date = app.moment();
            if (!id || id == 0) {
                if (stream == null) {
                    this.fail('请上传文件');
                    return;
                }
                const filePath = yield this.upload(stream);
                // var res = yield this.model.downloadVideo.findOne({ title: req.form.title })
                var res = yield this.service.files.add(
                    title,
                    explain,
                    filePath,
                    now.format('YYYY-MM-DD hh:mm:ss'),
                    now.format('YYYY-MM-DD hh:mm:ss'),
                    stream.mimeType
                );
                this.success();
            } else {
                let info = yield this.service.files.getById(id);
                if (info == null) {
                    this.fail('记录不存在');
                    return;
                }
                if (stream != null) {
                    const filePath = yield this.upload(stream);
                    info.path = filePath;
                }
                Object.assign(info, { title, explain, updateTime: now.format('YYYY-MM-DD hh:mm:ss') });
                var res = yield this.service.files.update(info);
                this.success();
            }
        }

        *
        getList() {
                let types = ['image/jpeg'];
                let pageIndex = this.ctx.request.query.pageIndex || 1;
                let limit = this.ctx.request.query.limit || 10;
                var type = this.ctx.request.query.type || 'image';
                switch (type) {
                    case "image":
                        types = ['image/jpeg', 'image/png'];
                        break;
                    case "audio":
                        types = ['audio/mp3'];
                        break;
                    case "video":
                        types = ['video/mp4'];
                        break;
                }
                var data = yield this.service.files.getList(pageIndex, limit, types);
                for (var item of data.list) {
                    item.path = this.config.url + '/public/files' + item.path.replace(/\\/g, '/');
                    item.createTime = app.moment(item.createTime).format('YYYY-MM-DD hh:mm:ss');
                    item.updateTime = app.moment(item.updateTime).format('YYYY-MM-DD hh:mm:ss');
                }
                this.ctx.body = data;
            } *
            getById() {
                console.log(this.ctx.request.query)
                var res = yield this.ctx.model.downloadPic.findOne({ _id: this.ctx.request.query._id })
                var pic = yield this.ctx.model.upload.findOne({ _id: res.picId })
                var picPath = "http://ym.ipet66.com/" + pic.picPath
                this.ctx.body = {
                    res: res,
                    picPath: picPath
                }
            } *
            delete() {
                let id = this.ctx.request.body.id;
                let info = yield this.service.files.getById(id);
                try {
                    let filepath = path.resolve(__dirname, '../public/files' + info.path);
                    if (fs.existsSync(filepath)) {
                        fs.unlink(filepath);
                    }
                } catch (error) {

                }
                yield this.service.files.delete(id);
                this.success();
            }
    }
    return downloadPicController;
};