module.exports = app => {
    /**
     * 调课相关方法
     */
    class CourseTableLeaveController extends app.Controller {
        /*
         * 获取调课信息
         */
        *
        getLeaveData() {
            var id = this.ctx.request.query.id;
            var item = yield this.ctx.service.courseTableItem.findById(id);
            var list = yield this.ctx.service.courseTableItem.getFree(item.termId, item.courseName, item.number, item.duration);
            list.forEach(function(item) {
                item.date = app.moment(item.date).format('YYYY-MM-DD');
            }, this);


            this.ctx.body = {
                info: item,
                list: app.lodash.filter(list, function(ii) {
                    return ii.id != id;
                })
            };
        }

        *
        addLeave() {
                var fromCourseTableItemId = this.ctx.request.body.fromCourseTableItemId || 0;
                var reason = this.ctx.request.body.reason;
                var studentId = this.ctx.request.body.studentId || 0;
                // var teacherId = this.ctx.request.body.teacherId || 0;
                var sStatus = this.ctx.request.body.sStatus
                const ctx = this.ctx;
                var now = new Date();
                if (app.lodash.trim(reason) == '') {
                    this.fail('请假原因不能为空');
                    return;
                }
                var fromCourseTableItem = yield this.ctx.service.courseTableItem.findById(fromCourseTableItemId);
                if (fromCourseTableItem == null) {
                    this.fail('要调课的记录不存在');
                    return;
                }
                if (app.moment(fromCourseTableItem.date).diff(now, 'days') < 2) {
                    this.fail('请提前48小时请假');
                    return;
                }
                let result = yield app.mysql.beginTransactionScope(function*(conn) {
                    //有人请假这趟课算空闲
                    fromCourseTableItem.status = '空闲';
                    yield ctx.service.courseTableItem.update(fromCourseTableItem);
                    //关于这个学生这节课算请假
                    var fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '正常')
                    if (fromCourseTableItemStudents.length == 0) {
                        fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '停课')
                    }
                    if (fromCourseTableItemStudents.length == 0) {
                        fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '转课')
                    }
                    if (fromCourseTableItemStudents.length == 0) {
                        //如果正常的课不存在，说明这节课可能是补课
                        let fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '补课');
                        for (let i = 0; i < fromCourseTableItemStudents.length; i++) {
                            var item = fromCourseTableItemStudents[i];
                            item.status = '请假';
                            yield ctx.service.courseTableItemStudent.update(item);
                        }
                    }
                    for (let i = 0; i < fromCourseTableItemStudents.length; i++) {
                        var item = fromCourseTableItemStudents[i];
                        item.status = '请假';
                        yield ctx.service.courseTableItemStudent.update(item);
                    }
                    let courseTableDetailId
                    if (sStatus === '补课') {
                        let courseTableItemChangeCourse = yield ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(fromCourseTableItemId, studentId, 1)
                        console.log(courseTableItemChangeCourse)
                        courseTableItemChangeCourse.one = 0
                        courseTableDetailId = courseTableItemChangeCourse.courseTableDetailId
                        yield ctx.service.courseTableItemChangeCourse.update(courseTableItemChangeCourse)
                    } else {
                        courseTableDetailId = fromCourseTableItem.courseTableDetailId
                    }
                    let courseTableDetailStudent = yield ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId)
                    courseTableDetailStudent.numberOfleave = courseTableDetailStudent.numberOfleave - 1
                    yield ctx.service.courseTableDetailStudent.update(courseTableDetailStudent)
                        //添加请假记录表
                    yield ctx.service.courseTableItemLeave.add(reason, studentId, now, fromCourseTableItem.id, courseTableDetailId);
                    let student = yield ctx.service.student.getById(studentId)
                    let studentUser = yield ctx.service.user.getById(student.userId)
                    let classTime = app.moment(fromCourseTableItem.date).format('YYYY.MM.DD') + " " + fromCourseTableItem.startTime + "-" + fromCourseTableItem.endTime
                    let teacher = yield ctx.service.teacher.getById(fromCourseTableItem.teacherId)
                    let teacherUser = yield ctx.service.user.getById(teacher.userId)
                    yield ctx.service.wechat.addStudentLeave(student.name, fromCourseTableItem.courseName, classTime, teacher.name, reason, studentUser.publicOpenId, teacherUser.publicOpenId, student.id)
                    return { code: 1 };
                }, ctx);
                this.ctx.body = result;
                return;
            }
            /**
             * 获取学生调课页面的初始数据
             */
            *
            getLeaveDataForStudent() {
                let id = this.ctx.request.query.id || 0;
                let studentId = this.ctx.request.query.studentId || 0;
                let teacherId = this.ctx.request.query.teacherId || 0;
                console.log(teacherId)
                let item = yield this.ctx.service.courseTableItem.findById(id);
                if (item == null) {
                    this.fail('数据不存在');
                    return;
                }
                let courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(this.ctx.request.query.id, studentId, 1)
                let courseTableDetailStudent
                if (courseTableItemChangeCourse) {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, studentId)
                } else {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(item.courseTableDetailId, studentId)
                }
                if (!courseTableDetailStudent) {
                    let courseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByToCourseTableItemIdAndOne(id, 1)
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(courseTableChangeClassForTeacher.courseTableDetailStudentId)
                }
                // let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId)
                let list = yield this.ctx.service.courseTableItem.getFreeForStudent(item.courseName, item.number, item.duration, item.termId, item.level);
                let teacher = yield this.service.teacher.getById(item.teacherId);
                let student = yield this.ctx.service.student.getById(studentId)
                this.ctx.body = {
                    info: Object.assign(item, { teacherName: teacher.name, date: app.moment(item.date).format('YYYY-MM-DD') }),
                    student,
                    courseTableDetailStudent
                };

            }

        *
        getLeaveDetail() {
                var id = this.ctx.request.query.id || 0;
                var info = yield this.ctx.service.courseTableItemLeave.getById(id);
                if (info == null) {
                    this.ctx.body = { code: 0, msg: '数据不存在' };
                    return;
                }
                info.fromCourseTableItem = yield this.ctx.service.courseTableItem.findById(info.fromCourseTableItemId);
                info.fromCourseTableItem.teacherName = (yield this.ctx.service.teacher.findById(info.fromCourseTableItem.teacherId)).name;
                info.fromCourseTableItem.classroomName = (yield this.ctx.service.classroom.getById(info.fromCourseTableItem.classroomId)).name;

                info.toCourseTableItem = yield this.ctx.service.courseTableItem.findById(info.toCourseTableItemId);
                info.toCourseTableItem.teacherName = (yield this.ctx.service.teacher.findById(info.toCourseTableItem.teacherId)).name;
                info.toCourseTableItem.classroomName = (yield this.ctx.service.classroom.getById(info.toCourseTableItem.classroomId)).name;
                if (info.studentId > 0) {
                    info.student = yield this.ctx.service.student.getById(info.studentId);
                }
                if (info.teacherId > 0) {
                    info.teacher = yield this.ctx.service.teacher.findById(info.teacherId);
                }

                this.ctx.body = info;
            }
            /**
             * 获取各个学期的请假内容
             */
            *
            getListBystudentIdAndTermId() {
                let { termId, studentId } = this.ctx.request.query
                console.log(termId, studentId)
                if (!termId) {
                    this.fail('没有传学期');
                    return;
                }
                if (!studentId) {
                    this.fail('没有传学生出错');
                    return;
                }
                let result = yield this.ctx.service.courseTableItemLeave.getListBystudentIdAndTermId(termId, studentId)
                for (let item of result) {
                    item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId)
                    item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD')
                    item.oTeacher = yield this.ctx.service.teacher.getById(item.teacherId)
                    item.oClassroom = yield this.ctx.service.classroom.getById(item.classroomId)
                    item.createTime1 = app.moment(item.createTime1).format('YYYY-MM-DD HH:mm')
                    item.courseTableItem.startTime = item.courseTableItem.startTime.substr(0, 5)
                    item.courseTableItem.endTime = item.courseTableItem.endTime.substr(0, 5)
                }
                return this.success(result)
            } *
            getList() {
                const pageIndex = app.lodash.parseInt(this.ctx.request.query.pageIndex) || 0;
                const termId = app.lodash.parseInt(this.ctx.request.query.termId) || 0;
                const limit = app.lodash.parseInt(this.ctx.request.query.limit) || 10;
                let data = yield this.service.courseTableItemLeave.getList(pageIndex, termId, limit);
                console.log(data)
                for (let item of data.list) {
                    if (item.studentId > 0) {
                        let student = yield this.service.student.getById(item.studentId);
                        let studentUser = yield this.service.user.getById(student.userId);
                        item.student = {
                            name: student.name,
                        };
                    }
                    if (item.teacherId > 0) {
                        let teacher = yield this.service.teacher.getById(item.teacherId);
                        item.teacher = {
                            name: teacher.name
                        };
                    }
                    item.classroomName = (yield this.service.classroom.getById(item.classroomId)).name;
                }
                this.success(data);
            }
    }

    return CourseTableLeaveController;

}