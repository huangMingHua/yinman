'use strict';

module.exports = app => {
  class CurriculumController extends app.Controller {
    * add() {
      if (app.lodash.trim(this.ctx.request.body.name) == '') {
        this.fail('课程不能为空');
        return;
      }
      const curriculum = yield app.mysql.get('curriculum', { name: this.ctx.request.body.name });
      if (!curriculum) {
        const course = yield this.ctx.service.curriculum.add(this.ctx.request.body);
        this.success();
      } else {
        this.fail('该课程已存在！');
      }
    }
    * getPaging() {
      const result = yield this.ctx.service.curriculum.getPaging(this.ctx.request.query.pageIndex, this.ctx.request.query.limit, this.ctx.request.query.name);
      this.ctx.body = result;
    }
    * getAll() {
      const result = yield this.ctx.service.curriculum.getAll();
      this.ctx.body = result;
    }

    * delete() {
      let id = this.ctx.request.body.id || 0;
      let info = yield this.service.curriculum.getById(id);
      if (info == null) {
        this.fail('数据不存在');
        return;
      }
      let count = yield this.service.bookingCourse.countByCurriculum(info.name);
      if (count > 0) {
        this.fail('该课程已经有人报了，无法删除');
        return;
      }
      yield this.ctx.service.curriculum.delete(id);
      this.success();
    }
    * deleteMulit() {
      let delCurriculum = {
        result: {
          n: 0,
        },
      };
      for (let i = 0; i < this.ctx.request.body.delSelectCurriculum.length; i++) {
        console.log(this.ctx.request.body.delSelectCurriculum[i].date);
        delCurriculum = yield this.ctx.model.addCurriculum.remove({ date: this.ctx.request.body.delSelectCurriculum[i].date });
      }
      console.log(delCurriculum);
      if (delCurriculum.result.n > 0) {
        this.ctx.response.body = {
          msg: '删除成功',
          boff: true,
        };
      } else {
        this.ctx.response.body = {
          msg: '删除失败',
          boff: false,
        };
      }
    }
    * query() {
      const result = yield this.ctx.service.curriculum.query(this.ctx.request.query.name);
      this.ctx.body = result;
    }
  }
  return CurriculumController;
};
