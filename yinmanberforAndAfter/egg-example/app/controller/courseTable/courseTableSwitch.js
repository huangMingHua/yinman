module.exports = app => {
    /**
     * 调课相关方法
     */
    class CourseTableSwitchController extends app.Controller {
        /*
         * 获取调课信息
         */
        *
        getSwitchData() {
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

        /**
         * 调课
         */
        *
        addSwitch() {
                var fromCourseTableItemId = this.ctx.request.body.fromCourseTableItemId || 0;
                var toCourseTableItemId = this.ctx.request.body.toCourseTableItemId || 0;
                var reason = this.ctx.request.body.reason;
                var studentId = this.ctx.request.body.studentId || 0;
                var teacherId = this.ctx.request.body.teacherId || 0;
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

                var toCourseTableItem = yield this.ctx.service.courseTableItem.findById(toCourseTableItemId);
                if (toCourseTableItem == null || toCourseTableItem.status != '空闲') {
                    this.fail('准备调的课不存在或者不是空闲状态');
                    return;
                }
                if (app.moment(toCourseTableItem.date).diff(now, 'days') < 2) {
                    this.fail('请提前48小时请假');
                    return;
                }
                var termId = fromCourseTableItem.termId;
                if (teacherId > 0) { //老师
                    let result = yield app.mysql.beginTransactionScope(function*(conn) {
                        ctx.conn = conn;
                        if (fromCourseTableItem.number > 1) {
                            return { code: 0, msg: '当前课程为一对多，无法调课' };
                        }
                        let courseTableDetailId = 0;
                        if (fromCourseTableItem.courseTableDetailId > 0) {
                            courseTableDetailId = fromCourseTableItem.courseTableDetailId;
                        } else {
                            let students = yield ctx.service.courseTableItemStudent.getByCourseTableItemId(fromCourseTableItem.id, '正常');
                            if (students.length > 1) {
                                return { code: 0, msg: '当前课程有多名学生，无法调课' };
                            }
                            let originSwitch = yield ctx.service.courseTableItemSwitch.get(fromCourseTableItem.id, students[0].id);
                            if (originSwitch == null) {
                                return { code: 0, msg: '未找到源请假信息' };
                            }
                            courseTableDetailId = originSwitch.fromCourseTableDetailId;
                        }

                        let switchMaxCount = parseInt((yield ctx.service.config.getByKey('教师调课次数')).value);
                        let switchs = yield ctx.service.courseTableItemSwitch.getTeacherSwitchs1(courseTableDetailId, teacherId);
                        if (switchs.length >= switchMaxCount) {
                            return { code: 0, msg: '您本学期已经不能再调课了' };
                        }

                        fromCourseTableItem.status = '老师请假';
                        yield ctx.service.courseTableItem.update(fromCourseTableItem);
                        var fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemId(fromCourseTableItem.id);
                        for (let i = 0; i < fromCourseTableItemStudents.length; i++) {
                            let item = fromCourseTableItemStudents[i];
                            item.status = '老师请假';
                            yield ctx.service.courseTableItemStudent.update(item);

                            yield ctx.service.courseTableItemStudent.add(toCourseTableItem.id, item.studentId, '正常', toCourseTableItem.termId);
                        }
                        yield ctx.service.courseTableItemSwitch.add(fromCourseTableItem.id, toCourseTableItem.id, reason, 0, now, termId, teacherId, courseTableDetailId);
                        return { code: 1 };
                    }, ctx);

                    this.ctx.body = result;
                    return;
                } else {
                    let result = yield app.mysql.beginTransactionScope(function*(conn) {
                        ctx.conn = conn;

                        let courseTableDetailId = 0;
                        if (fromCourseTableItem.courseTableDetailId > 0) {
                            courseTableDetailId = fromCourseTableItem.courseTableDetailId;
                        } else {
                            let originSwitch = yield ctx.service.courseTableItemSwitch.get(fromCourseTableItem.id, studentId);
                            if (originSwitch == null) {
                                // this.fail('未找到源请假信息');
                                // return;
                                return { code: 0, msg: '未找到源请假信息' };
                            }
                            courseTableDetailId = originSwitch.fromCourseTableDetailId;
                        }


                        let switchMaxCount = parseInt((yield ctx.service.config.getByKey('学生调课次数')).value);
                        let switchs = yield ctx.service.courseTableItemSwitch.getStudentSwitchs1(courseTableDetailId, studentId);
                        //this.ctx.logger.info(switchMaxCount, app.lodash.filter(switchs, { fromCourseTableDetailId:courseTableDetailId, studentId: studentId }).length);
                        if (switchs.length >= switchMaxCount) {
                            return { code: 0, msg: '您本学期已经不能再调课了' };
                        }
                        fromCourseTableItem.status = '空闲';

                        yield ctx.service.courseTableItem.update(fromCourseTableItem);
                        var fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '正常');
                        for (let i = 0; i < fromCourseTableItemStudents.length; i++) {
                            var item = fromCourseTableItemStudents[i];
                            item.status = '请假';
                            yield ctx.service.courseTableItemStudent.update(item);
                        }

                        yield ctx.service.courseTableItemStudent.add(toCourseTableItem.id, studentId, '正常', fromCourseTableItem.termId);
                        yield ctx.service.courseTableItemSwitch.add(fromCourseTableItem.id, toCourseTableItem.id, reason, studentId, now, termId, 0, courseTableDetailId);
                        return { code: 1 };
                    }, ctx);
                    this.ctx.body = result;
                    return;
                }
            }
            /**
             * 获取学生调课页面的初始数据
             */
            *
            getSwitchDataForStudent() {
                let id = this.ctx.request.query.id || 0;
                let item = yield this.ctx.service.courseTableItem.findById(id);
                if (item == null) {
                    this.fail('数据不存在');
                    return;
                }
                console.log(item.level)
                let list = yield this.ctx.service.courseTableItem.getFreeForStudent(item.courseName, item.number, item.duration, item.termId, item.level);
                let teacher = yield this.service.teacher.getById(item.teacherId);
                var result = [];
                var groupList = app.lodash.groupBy(list, 'teacherId');
                //console.log(groupList);
                for (var i in groupList) {
                    let teacher1 = yield this.ctx.service.teacher.findById(parseInt(i));
                    teacher1.courseTableItems = app.lodash.sortBy(groupList[i], function(o) {
                        //console.log(o.date +' '+ o.startTime);
                        let date = app.moment(o.date).format('YYYY-MM-DD');
                        return app.moment(date + ' ' + o.startTime).unix();
                    });
                    for (let l of teacher1.courseTableItems) {
                        l.startTime = this.ctx.helper.formatTime(l.startTime);
                        l.endTime = this.ctx.helper.formatTime(l.endTime);
                        l.date = app.moment(l.date).format('YYYY-MM-DD');
                        l.classroomName = (yield this.service.classroom.getById(l.classroomId)).name;
                    }
                    // teacher1.courseTableItems.forEach(l=>{
                    //     l.startTime = this.ctx.helper.formatTime(l.startTime);
                    //     l.endTime = this.ctx.helper.formatTime(l.endTime);
                    //     l.date = app.moment(l.date).format('YYYY-MM-DD');                 
                    // });
                    result.push(teacher1);
                }

                this.ctx.body = {
                    info: Object.assign(item, { teacherName: teacher.name, date: app.moment(item.date).format('YYYY-MM-DD') }),
                    teachers: result
                };

            }

        *
        getSwitchDetail() {
            var id = this.ctx.request.query.id || 0;
            var info = yield this.ctx.service.courseTableItemSwitch.getById(id);
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

        *
        getList() {
            const pageIndex = app.lodash.parseInt(this.ctx.request.query.pageIndex) || 0;
            const termId = app.lodash.parseInt(this.ctx.request.query.termId) || 0;
            const limit = app.lodash.parseInt(this.ctx.request.query.limit) || 10;
            console.log(typeof limit);
            let data = yield this.service.courseTableItemSwitch.getList(pageIndex, termId, limit);
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

                let fromCourseTableItem = yield this.service.courseTableItem.getById(item.fromCourseTableItemId);
                fromCourseTableItem.classroomName = (yield this.service.classroom.getById(fromCourseTableItem.classroomId)).name;
                fromCourseTableItem.teacherName = (yield this.service.teacher.getById(fromCourseTableItem.teacherId)).name;
                item.fromCourseTableItem = fromCourseTableItem;

                let toCourseTableItem = yield this.service.courseTableItem.getById(item.toCourseTableItemId);
                toCourseTableItem.classroomName = (yield this.service.classroom.getById(toCourseTableItem.classroomId)).name;
                toCourseTableItem.teacherName = (yield this.service.teacher.getById(toCourseTableItem.teacherId)).name;
                item.toCourseTableItem = toCourseTableItem;
            }
            this.success(data);
        }
    }

    return CourseTableSwitchController;

}