/**
 * Created by rhino on 2017-04-14.
 */
module.exports = app => {
  class CourseController extends app.Controller {
    *
        add() {
                // const isCourse = yield app.mysql.get('course', this.ctx.request.body.addCouseCreate);
          const { id, name, color, courseDescription } = this.ctx.request.body;
          const isCourse = yield this.ctx.service.course.getByName(this.ctx.request.body.name);
          const result = {};
          if (!isCourse) {
            const course = yield this.ctx.service.course.add(name, color, courseDescription);
            result.msg = '添加成功';
            result.bool = true;
          } else {
            result.msg = '课程已经存在';
            result.bool = false;
          }
          this.ctx.body = result;
        } *
            update() {
                // const isCourse = yield this.ctx.service.course.getByName(this.ctx.request.body.makeCouseCreate.name)
              const nowCourse = yield this.ctx.service.course.getById(this.ctx.request.body.makeCouseCreate.id);
              const course = yield this.ctx.service.course.getByName(this.ctx.request.body.makeCouseCreate.name);
              const result = {};
              if (course && nowCourse.id != course.id && this.ctx.request.body.makeCouseCreate.name == course.name) {
                result.msg = '课程已存在，无法修改';
                result.bool = false;
                this.ctx.body = result;
                return;
              }
              console.log(this.ctx.request.body.makeCouseCreate);
              yield this.ctx.service.course.modify(this.ctx.request.body);
              result.msg = '修改成功';
              result.bool = true;
              this.ctx.body = result;
            } *
            delete() {
              const course = yield this.ctx.service.course.getById(this.ctx.request.body.id);
              const list = yield this.ctx.service.courseTableDetail.getListByCourseNameId(course.id);
              if (list.length > 0) {
                this.ctx.body = {
                  code: 0,
                  msg: '课程已被使用，不能删除',
                };
                return;
              }
              console.log(course);
              const lists = yield this.ctx.service.courseTableItem.getListByCourseName(course.id);
              if (lists.length > 0) {
                this.ctx.body = {
                  code: 0,
                  msg: '课程已被使用，不能删除',
                };
                return;
              }
              course.isDel = 1;
              const n = yield this.ctx.service.course.update(course);
              console.log(n);
              if (n.affectedRows == 1) {
                this.ctx.body = {
                  code: 1,
                  msg: '刪除成功',
                };
              } else {
                this.ctx.body = {
                  code: 0,
                  msg: '刪除失败',
                };
              }
            }

    *
        query() {
          const queryRuselt = yield this.ctx.model.course.find({ name: this.ctx.request.body.queryname });
          this.ctx.body = { count: queryRuselt };
        }

    *
        getAll() {
          if (this.ctx.request.query) {
            const data = yield this.ctx.service.course.getAll();
            this.ctx.body = data;
          }
        }

    *
        getAll() {
          let result = yield this.ctx.service.course.getAll();
          result = app.lodash._.uniqBy(result, 'name');
          console.log(result);
          this.ctx.body = result;
        } *
            getPaging() {
              const result = yield this.ctx.service.course.getPaging(this.ctx.request.query.pageIndex, this.ctx.request.query.limit);
              this.ctx.body = result;
            }


    }
  return CourseController;
};
