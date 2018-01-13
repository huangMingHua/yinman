'use strict';
/**
 * 光荣榜
 */
module.exports = app => {
  class honorRollController extends app.Controller {
    * saveOrUpdatehonorRollInfo() {
      // const { id, name, introduce, picId } = this.ctx.request.body.form;
      const parts = this.ctx.multipart({ autoFields: true });
      const stream = yield parts;
      const { id, name, introduce } = parts.field;

      if (app.lodash.trim(name) == '') {
        this.fail('姓名不能为空');
        return;
      }
      if (app.lodash.trim(introduce) == '') {
        this.fail('获奖内容不能为空');
        return;
      }

      let now = app.moment();
      if (!id || id == 0) {
        if (stream == null) {
          this.fail('请上传文件');
          return;
        }
        const filePath = yield this.upload(stream);
        yield this.service.honorRoll.add(
          name,
          introduce,
          now.format('YYYY-MM-DD hh:mm:ss'),
          now.format('YYYY-MM-DD hh:mm:ss'),
          filePath
        );
        this.success();
      } else {
        const info = yield this.service.honorRoll.getById(id);
        if (info == null) {
          this.fail('未找到数据');
          return;
        }
        if (stream != null) {
          const filePath = yield this.upload(stream);
          info.path = filePath;
        }
        info.name = name;
        info.introduce = introduce;

        info.updateTime = now.format('YYYY-MM-DD hh:mm:ss');
        yield this.service.honorRoll.update(info);
        this.success();
      }
    }
    * getList() {
      const list = yield app.mysql.select('honor_roll', { limit: Number(this.ctx.request.query.limit), offset: (this.ctx.request.query.pageIndex - 1) * this.ctx.request.query.limit });
      const count = yield app.mysql.query('select count(*) from honor_roll');
      //const result = [];
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
      const item = yield this.service.honorRoll.getById(this.ctx.request.query.id);

      item.path = this.config.url + '/public/files' + item.path.replace(/\\/g, '/');
      item.createTime = app.moment(item.createTime).format('YYYY-MM-DD hh:mm:ss');
      item.updateTime = app.moment(item.updateTime).format('YYYY-MM-DD hh:mm:ss');

      this.success(item);
    }
    * delete() {
      let id = this.ctx.request.body.id;
      let info = yield this.service.honorRoll.getById(id);
      try {
        let filepath = path.resolve(__dirname, '../public/files' + info.path);
        if (fs.existsSync(filepath)) {
          fs.unlink(filepath);
        }
      }
      catch (error) {

      }
      yield this.service.honorRoll.delete(this.ctx.request.body.id);
      this.success();
    }
  }
  return honorRollController;
};
