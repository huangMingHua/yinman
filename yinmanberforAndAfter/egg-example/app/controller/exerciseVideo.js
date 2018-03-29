'use strict';

module.exports = app => {
  class exerciseVideoController extends app.Controller {
    * saveOrUpdateVideoInfo() {
      const parts = this.ctx.multipart({ autoFields: true });
      const stream = yield parts;
      const { id, title, name } = parts.field;
      if (app.lodash.trim(title) == '') {
        this.fail('标题不能为空');
        return;
      }
      if (app.lodash.trim(name) == '') {
        this.fail('姓名不能为空');
        return;
      }

      const now = app.moment();
      if (!id || id == 0) {
        if (stream == null) {
          this.fail('请上传文件');
          return;
        }
        const filePath = yield this.upload(stream);
        const res = yield this.service.exerciseVideo.add(
          title,
          name,
          filePath,
          now.format('YYYY-MM-DD hh:mm:ss'),
          now.format('YYYY-MM-DD hh:mm:ss')
        );
        this.success();
      } else {
        const info = yield this.service.exerciseVideo.getById(id);
        if (info == null) {
          this.fail('未找到数据');
          return;
        }
        if (stream != null) {
          const filePath = yield this.upload(stream);
          info.path = filePath;
        }
        info.title = title;
        info.name = name;
        info.updateTime = now.format('YYYY-MM-DD hh:mm:ss');
        yield this.service.exerciseVideo.update(info);
        this.success();
      }


    }
    * getList() {
      const list = yield app.mysql.select('exercise_video', { limit: Number(this.ctx.request.query.limit), offset: (this.ctx.request.query.pageIndex - 1) * this.ctx.request.query.limit });
      const count = yield app.mysql.query('select count(*) from exercise_video');

      for (const item of list) {
        item.path = this.config.url + '/public/files' + item.path.replace(/\\/g, '/');
        item.createTime = app.moment(item.createTime).format('YYYY-MM-DD hh:mm:ss');
        item.updateTime = app.moment(item.updateTime).format('YYYY-MM-DD hh:mm:ss');
      }
      this.ctx.body = {
        list,
        pages: Math.ceil(count[0]['count(*)'] / this.ctx.request.query.limit),
      };
    }

    * getById() {
      const item = yield this.service.exerciseVideo.getById(this.ctx.request.query.id);

      item.path = this.config.url + '/public/files' + item.path.replace(/\\/g, '/');
      item.createTime = app.moment(item.createTime).format('YYYY-MM-DD hh:mm:ss');
      item.updateTime = app.moment(item.updateTime).format('YYYY-MM-DD hh:mm:ss');

      this.success(item);
    }
    * delete() {
      const id = this.ctx.request.body.id;
      const info = yield this.service.exerciseVideo.getById(id);
      try {
        const filepath = path.resolve(__dirname, '../public/files' + info.path);
        if (fs.existsSync(filepath)) {
          fs.unlink(filepath);
        }
      } catch (error) {

      }
      yield this.service.exerciseVideo.delete(this.ctx.request.body.id);
      this.success();
    }

  }
  return exerciseVideoController;
};
