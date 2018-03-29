'use strict';
const path = require('path');
const fs = require('fs');
module.exports = app => {
  class teachernItroductionController extends app.Controller {
    *
        saveOrUpdateTeacherInfo() {
          const parts = this.ctx.multipart({ autoFields: true });
          const part = yield parts;

          let { id, name, sex, education, major, school, teachingSubjects, professionalExperience, picId } = parts.field;
          if (app.lodash.trim(name) == '') {
            this.fail('姓名不能为空');
            return;
          }
          if (app.lodash.trim(education) == '') {
            this.fail('学历不能为空');
            return;
          }
          if (app.lodash.trim(major) == '') {
            this.fail('专业不能为空');
            return;
          }
          if (app.lodash.trim(school) == '') {
            this.fail('毕业院校不能为空');
            return;
          }
          if (app.lodash.trim(teachingSubjects) == '') {
            this.fail('教授科目不能为空');
            return;
          }
          if (app.lodash.trim(sex) == '') {
            this.fail('性别不能为空');
            return;
          }
          if (app.lodash.trim(professionalExperience) == '') {
            this.fail('专业经历不能为空');
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
              picId = ERR_OK.insertId;
            }
            yield saveStream(part, filepath);
          }
          console.log(id);
          if (!id) {
            const date = new Date();
            var res = yield app.mysql.insert(
                        'teacher_nitroduction', {
                          name,
                          sex,
                          education,
                          major,
                          school,
                          teachingSubjects,
                          professionalExperience,
                          creatTime: date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate(),
                          updateTime: '',
                          picId,
                        }
                    );
            this.ctx.body = {
              id: res.insertId,
            };
          } else {
            const date = new Date();
            var res = yield app.mysql.update('teacher_nitroduction', {
              id,
              name,
              sex,
              education,
              major,
              school,
              teachingSubjects,
              professionalExperience,
              updateTime: date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate(),
              picId,
            });
            this.ctx.body = {
              id,
            };
          }
        } *
            getAll() {
              const list = yield app.mysql.select('teacher_nitroduction');
              const result = [];
              for (const item of list) {
                if (item.picId) {
                  const pic = yield app.mysql.get('upload', { id: item.picId });
                  var picPath = this.config.url + '/' + pic.picPath;
                } else {
                  var picPath = '';
                }
                result.push({
                  list: item,
                  picPath,
                });
              }
              this.ctx.body = result;
            } *
            getList() {
              const list = yield app.mysql.select('teacher_nitroduction', { limit: Number(this.ctx.request.query.limit), offset: (this.ctx.request.query.pageIndex - 1) * this.ctx.request.query.limit });
              const count = yield app.mysql.query('select count(*) from teacher_nitroduction');
              const result = [];
              for (const item of list) {
                if (item.picId) {
                  const pic = yield app.mysql.get('upload', { id: item.picId });
                  var picPath = this.config.url + '/' + pic.picPath;
                } else {
                  var picPath = '';
                }
                result.push({
                  list: item,
                  picPath,
                });
              }
              this.ctx.body = {
                list: result,
                pages: Math.ceil(count[0]['count(*)'] / this.ctx.request.query.limit),
              };
            } *
            getById() {
              const res = yield app.mysql.get('teacher_nitroduction', { id: this.ctx.request.query.id });
              console.log(res);
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
              const ERR_OK = yield app.mysql.delete('teacher_nitroduction', { id: this.ctx.request.body.id });
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
  return teachernItroductionController;
};
