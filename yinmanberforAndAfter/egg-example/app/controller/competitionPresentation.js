'use strict';
const path = require('path');
const fs = require('fs');
module.exports = app => {
  class competitionPresentationController extends app.Controller {
    *
        saveOrUpdateCompetitionInfo() {
          const parts = this.ctx.multipart({ autoFields: true });
          const part = yield parts;
          console.log(parts);
          let { id, title, place, time, competitionPresentation, picId } = parts.field;
          if (app.lodash.trim(title) == '') {
            this.fail('标题不能为空');
            return;
          }
          if (app.lodash.trim(place) == '') {
            this.fail('比赛地点不能为空');
            return;
          }
          if (app.lodash.trim(time) == '') {
            this.fail('比赛时间不能为空');
            return;
          }
          if (app.lodash.trim(competitionPresentation) == '') {
            this.fail('比赛介绍不能为空');
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
          if (id == 0) {
            var date = new Date();
            var res = yield app.mysql.insert('competitionpresentation', {
              title,
              place,
              time,
              competitionPresentation,
              creatTime: date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate(),
              updateTime: '',
              picId,
            });
            this.ctx.body = {
              id: res.insertId,
            };
          } else {
            var date = new Date();
            var res = yield app.mysql.update('competitionpresentation', {
              id,
              title,
              place,
              time,
              competitionPresentation,
              updateTime: date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate(),
              picId,
            });
            this.ctx.body = {
              id,
            };
          }
        } *
            getAll() {
              const list = yield app.mysql.select('competitionpresentation');
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
              this.ctx.body = result;
            } *
            getList() {
              const list = yield app.mysql.select('competitionpresentation', { limit: Number(this.ctx.request.query.limit), offset: (this.ctx.request.query.pageIndex - 1) * this.ctx.request.query.limit });
              const count = yield app.mysql.query('select count(*) from competitionpresentation');
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
            delete() {
              const ERR_OK = yield app.mysql.delete('competitionpresentation', { id: this.ctx.request.body.id });
              if (ERR_OK.affectedRows == 1) {
                this.success();
              } else {
                this.fail('删除失败');
              }
            }

    *
        getById() {
          const res = yield app.mysql.get('competitionpresentation', { id: this.ctx.request.query.id });
          let picPath = '';
          if (res.picId > 0) {
            const pic = yield app.mysql.get('upload', { id: res.picId });
            picPath = this.config.url + '/' + pic.picPath;
          }
          this.ctx.body = {
            res,
            picPath,
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
  return competitionPresentationController;
};
