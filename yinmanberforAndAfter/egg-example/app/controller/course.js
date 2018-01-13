/**
 * Created by rhino on 2017-04-14.
 */
module.exports = app => {
    class CourseController extends app.Controller { *
        add() {
                // const isCourse = yield app.mysql.get('course', this.ctx.request.body.addCouseCreate);
                const isCourse = yield this.ctx.service.course.getByName(this.ctx.request.body.addCouseCreate.name);
                const result = {};
                if (!isCourse) {
                    const course = yield this.ctx.service.course.add(this.ctx.request.body.addCouseCreate);
                    result.msg = '添加成功';
                    result.bool = true;
                } else {
                    result.msg = '课程已经存在';
                    result.bool = false;
                }
                console.log(result);
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
                    return
                }
                let aCourseTableDetail = yield this.ctx.service.courseTableDetail.getListByCourseName(nowCourse.name)
                let aCourseTableItem = yield this.ctx.service.courseTableItem.getListByCourseName(nowCourse.name)
                for (let item of aCourseTableDetail) {
                    item.courseName = this.ctx.request.body.makeCouseCreate.name
                    yield this.ctx.service.courseTableDetail.update(item)
                }
                for (let item of aCourseTableItem) {
                    item.courseName = this.ctx.request.body.makeCouseCreate.name
                    yield this.ctx.service.courseTableItem.update(item)
                }
                yield this.ctx.service.course.modify(this.ctx.request.body);
                result.msg = '修改成功';
                result.bool = true;
                this.ctx.body = result;
            } *
            delete() {
                let course = yield this.ctx.service.course.getById(this.ctx.request.body.id)
                let list = yield this.ctx.service.courseTableDetail.getListByCourseName(course.name)
                if (list.length > 0) {
                    this.ctx.body = {
                        code: 0,
                        msg: '课程已被使用，不能删除',
                    };
                    return
                }
                let lists = yield this.ctx.service.courseTableItem.getListByCourseName(course.name)
                if (lists.length > 0) {
                    this.ctx.body = {
                        code: 0,
                        msg: '课程已被使用，不能删除',
                    };
                    return
                }
                const n = yield app.mysql.delete('course', { id: this.ctx.request.body.id });
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