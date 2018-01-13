'use strict';

module.exports = app => {
  class abrsmController extends app.Controller {
    *
        saveOrUpdateAbrsmInfo() {
          if (this.ctx.request.body.id == '') {
            var result = yield app.mysql.insert('abrsm', { content: this.ctx.request.body.content });
            this.ctx.body = {
              msg: '添加成功',
            };
          } else {
            console.log(this.ctx.request.body);
            var result = yield app.mysql.update('abrsm', { id: this.ctx.request.body.id, content: this.ctx.request.body.content });
            this.ctx.body = {
              msg: '修改成功',
            };
          }
        } *
            get() {
              const res = yield app.mysql.select('abrsm');
              this.ctx.body = res[0];
            }
    }
  return abrsmController;
};
