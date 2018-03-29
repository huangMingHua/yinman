'use strict';

module.exports = app => {
  class ClassroomController extends app.Controller {
    *
        add() {
          if (app.lodash.trim(this.ctx.request.body.classroom) == '') {
            this.ctx.body = {
              msg: '课程不能为空',
              bool: false,
            };
            return;
          }
          const info = yield this.service.classroom.getByName(this.ctx.request.body.classroom);
          if (info != null) {
            this.ctx.body = {
              msg: '教室已存在',
              bool: false,
            };
            return;
          }
          yield this.ctx.service.classroom.add(this.ctx.request.body);
          this.ctx.body = {
            msg: '添加成功',
            bool: true,
          };
        } * getAll() {
          const result = yield this.ctx.service.classroom.getAll(this.ctx.request.query.pageIndex, this.ctx.request.query.limit);
          this.ctx.response.body = result;
        } * delete() {
          const id = this.ctx.request.body.classroom.id || 0;
          const details = yield this.service.courseTableDetail.getListByClassroomId(id);
          if (details.length > 0) {
            this.fail('教室被占用，无法删除');
            return;
          }
          const itemsCount = yield this.service.courseTableItem.countByClassroomId(id);
          if (itemsCount > 0) {
            this.fail('教室被占用，无法删除');
            return;
          }
          const classroom = yield this.ctx.service.classroom.getById(id);
          classroom.isDel = 1;
          yield this.ctx.service.classroom.update(classroom);
          const result = {
            code: 1,
            msg: '删除成功',
          };
          this.ctx.body = result;
        } *
            update() {
              const nowClassRoom = yield this.ctx.service.classroom.getById(this.ctx.request.body.id);
              const classroom = yield this.ctx.service.classroom.getByName(this.ctx.request.body.classroom);
              if (classroom && nowClassRoom.id != classroom.id) {
                this.ctx.body = {
                  msg: '教室已存在',
                  bool: false,
                };
                return;
              }
              const result = yield this.ctx.service.classroom.updates(this.ctx.request.body.id, this.ctx.request.body.classroom, this.ctx.request.body.isPiano);
              this.ctx.body = {
                msg: '修改成功',
                bool: true,
              };
            }
    }
  return ClassroomController;
};
