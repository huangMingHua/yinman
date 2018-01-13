'use strict';

module.exports = app => {
  class courseAdjustmentRecordController extends app.Controller {
    * fun() {
      console.log(this.ctx.request.body);
      if (this.ctx.request.body.state == 0) {
        yield this.ctx.model.courseAdjustmentRecord.create(this.ctx.request.body);
        this.ctx.body = {
          boff: true,
          msg: '添加成功',
        };
      }

    }
    * get() {
      if (this.ctx.request.query.state == 1) {
        // 老师端学生调课记录
        const n = yield this.ctx.model.courseAdjustmentRecord.find({ studetnId: this.ctx.request.query.studetnId });
        this.ctx.body = {
          boff: true,
          msg: '数据查找成功',
          data: n,
        };
      }

    }
  }
  return courseAdjustmentRecordController;
};
