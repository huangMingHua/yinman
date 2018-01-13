'use strict';
const path = require('path');
const fs = require('fs');

module.exports = app => {
    class OnlineGuideController extends app.Controller { 
        * add() {
            const parts = this.ctx.multipart({ autoFields: true });
            const stream = yield parts;
            //console.log(parts.field, stream);
            //const stream = yield this.ctx.getFileStream();
            var now = app.moment();
            
            let { id,title, explain, studentId } = parts.field;
            if (app.lodash.trim(title) == '') {
                this.fail("标题不能为空");
                return
            }
            // if (app.lodash.trim(explain) == '') {
            //     this.fail("说明不能为空");
            //     return
            // }

            
            //this.ctx.logger.info(stream.mimeType);
            var date = app.moment();
            if (!id || id == 0) {
                if(stream == null){
                    this.fail('请上传文件');
                    return;
                }
                let student = yield this.service.student.getById(studentId);
                if(student == null){
                    this.fail('学生不存在');
                    return;
                }
                const filePath = yield this.upload(stream);
                var res = yield this.service.onlineGuide.add(
                    title,
                    explain,
                    filePath,
                    now.format('YYYY-MM-DD hh:mm:ss'),
                    now.format('YYYY-MM-DD hh:mm:ss'),
                    stream.mimeType,
                    studentId,
                    "",
                    0
                );
                this.success();
            } else {
                let info = this.service.onlineGuide.getById(id);
                if(info == null){
                    this.fail('对象不存在');
                    return;
                }
                if(stream != null){
                    const filePath = yield this.upload(stream);
                    info.path = filePath;
                }
                //info.title = title;
                Object.assign(info, { title, explain, updateTime: now.format('YYYY-MM-DD hh:mm:ss') });
                var res = yield this.service.onlineGuide.update(info);
                this.success();
            }
        }
        * getList() {
            let types = ['video/mp4'];
            let pageIndex = this.ctx.request.query.pageIndex || 1;
            let limit = this.ctx.request.query.limit || 10;
            let studentId = this.ctx.request.query.studentId || 0;
            //var type = this.ctx.request.query.type || 'image';
            // switch(type){
            //     case "image":
            //         types = ['image/jpeg'];
            //         break;
            //     case "audio":
            //         types = ['audio/mp3'];
            //         break;
            //     case "video":
            //         types = ['video/mp4'];
            //         break;
            // }
            var data = yield this.service.onlineGuide.getList(pageIndex, limit, studentId);
            
            for (var item of data.list) {
                item.path = this.config.url +'/public/files' + item.path.replace(/\\/g, '/');
                item.createTime = app.moment(item.createTime).format('YYYY-MM-DD hh:mm:ss');
                item.updateTime = app.moment(item.updateTime).format('YYYY-MM-DD hh:mm:ss');
                item.state = item.teacherId == 0 ? '未点评':'已点评';
                let student = yield this.service.student.getById(item.studentId);
                let user = yield this.service.user.getById(student.userId);
                item.student = {
                    name: student.name,
                    wxHead: user.wxHead
                };
                if(item.teacherId>0){
                    let teacher = yield this.service.teacher.getById(item.teacherId);
                    let user = yield this.service.user.getById(teacher.userId);
                    item.teacher = {
                        name: teacher.name,
                        wxHead:user.wxHead
                    }
                }
            }
            this.ctx.body = data;
        }

        * getById(){
            let id = this.ctx.request.query.id || 0;
            let item = yield this.service.onlineGuide.getById(id);
            if(item == null){
                this.fail('数据不存在');
                return;
            }
            item.path = this.config.url +'/public/files' + item.path.replace(/\\/g, '/');
            item.createTime = app.moment(item.createTime).format('YYYY-MM-DD hh:mm:ss');
            item.updateTime = app.moment(item.updateTime).format('YYYY-MM-DD hh:mm:ss');
            item.state = item.teacherId == 0 ? '未点评':'已点评';
            let student = yield this.service.student.getById(item.studentId);
            let user = yield this.service.user.getById(student.userId);
            item.student = {
                name: student.name,
                wxHead: user.wxHead
            };
            if(item.teacherId>0){
                let teacher = yield this.service.teacher.getById(item.teacherId);
                let user = yield this.service.user.getById(teacher.userId);
                item.teacher = {
                    name: teacher.name,
                    wxHead:user.wxHead
                }
            }
            this.success(item);
        }
        * addContent(){
            let id = this.ctx.request.body.id || 0;
            let teacherId = this.ctx.request.body.teacherId || 0;
            let content = this.ctx.request.body.content || '';
            if(app.lodash.trim(content) == ''){
                this.fail('点评内容不能为空');
                return;
            }
            let item = yield this.service.onlineGuide.getById(id);
            if(item == null){
                this.fail('数据不存在');
                return;
            }
            if(item.teacherId > 0){
                this.fail('该视频已经呗老师点评了');
                return;
            }
            let teacher = yield this.service.teacher.getById(teacherId);
            if(teacher == null){
                this.fail('老师不存在');
                return;
            }
            item.teacherId = teacher.id;
            item.content = content;
            item.updateTime = app.moment().format('YYYY-MM-DD hh:mm:ss');
            yield this.service.onlineGuide.update(item);
            this.success();
        }

        * delete() {
            let id = this.ctx.request.body.id;
            let info = yield this.service.onlineGuide.getById(id);
            try{
                let filepath = path.resolve(__dirname, '../public/files'+info.path);
                if(fs.existsSync(filepath) ) {
                    fs.unlink(filepath);
                }
            }
            catch (error){

            }
            yield this.service.onlineGuide.delete(id);
            this.success();
        }

        
    }
    return OnlineGuideController;
};