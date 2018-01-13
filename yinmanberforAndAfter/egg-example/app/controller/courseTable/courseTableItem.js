module.exports = app => {
    class CourseTableItemController extends app.Controller { *
        addItem() {
                const date = app.moment(this.ctx.request.body.date).format('YYYY-MM-DD');
                const classroomId = this.ctx.request.body.classroomId;
                const startTime = this.ctx.request.body.startTime;
                // let endTime = this.ctx.request.body.endTime;
                const courseName = this.ctx.request.body.courseName;
                const number = this.ctx.request.body.number;
                const duration = this.ctx.request.body.duration;
                const level = this.ctx.request.body.level;
                const type = this.ctx.request.body.type;
                const status = '空闲';
                const teacherId = this.ctx.request.body.teacherId || 0;
                const termId = this.ctx.request.body.termId || 0;
                const id = this.ctx.request.body.id || 0;
                const endTime = app.moment('2017-01-01 ' + startTime).add(duration, 'minutes');
                const students= this.ctx.request.body.students || []
                var list = yield this.service.courseTableItem.getList1(termId, teacherId, date);
                for (let _item of list) {
                    let _startTime = `2017-01-01 ${_item.startTime}`;
                    let _endTime = `2017-01-01 ${_item.endTime}`;
                    let _startTime1 = `2017-01-01 ${startTime}`;
                    let _endTime1 = endTime;
                    if (_item.id != id && this.ctx.helper.durationConflict(_startTime, _endTime, _startTime1, _endTime1)) {
                        this.fail('时间有冲突，请选择其他时间');
                        return;
                    }
                }
                if (id > 0) {
                    const info = yield this.ctx.service.courseTableItem.getById(id);
                    if (info == null) {
                        this.fail('数据不存在');
                        return;
                    }
                    info.type = type
                    info.classroomId = classroomId;
                    info.duration = duration;
                    info.endTime = endTime.format('HH:mm');
                    if (info.number > 1) {
                        info.number = number;
                    }
                    yield this.ctx.service.courseTableItem.update(info);
                } else {
                    const info = yield this.ctx.service.courseTableItem.add(0, teacherId, date,
                    startTime, endTime.format('HH:mm'), classroomId, courseName, number, duration, level, status, type, termId);
                    if(students.length>0){
                        for(let item of students){
                            if (item.isSelect){
                                let oUser = yield this.ctx.service.user.getById(item.userId)
                                let teacher = yield this.ctx.service.teacher.getById(teacherId)
                                let classroom = yield this.ctx.service.classroom.getById(classroomId)
                                yield this.ctx.service.wechat.remedialNotice(item.name, courseName, date+' '+startTime+'-'+endTime,startTime+'-'+endTime, teacher.name, classroom.name, oUser.publicOpenId,item.id)
                            }
                        }
                    }
                }
                this.success();
            } *
            getBookingCourseTeacher() {
                let result = yield this.ctx.service.courseTableItem.getBookingCourseTeacher(this.ctx.request.query.courseName, this.ctx.request.query.date)
                this.success(result);
            } *
            getBookingCourse() {
                let result = yield this.ctx.service.courseTableItem.getBookingCourse()
                this.success(result);
            } *
            getBookingCourseTime() {
                let result = yield this.ctx.service.courseTableItem.getBookingCourseTime(this.ctx.request.query.courseName)
                this.success(result);
            } *
            getById() {
                let result = yield this.ctx.service.courseTableItem.getById(this.ctx.request.query.id)
                this.success(result);
            } *
            getBookingCourseOtherTime() {
                let result = yield this.ctx.service.courseTableItem.getBookingCourseOtherTime(this.ctx.request.query.id)
                this.success(result);
            }
            /**
             * 获取转班的开始日期通过课程id
             */
            *
            getWeekById() {
                let result = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(this.ctx.request.query.courseTableDetailId)
                this.success(result)
            } *
            deleteItem() {
                const id = this.ctx.request.body.id;
                const students = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(id);
                const aBookingStudent = yield this.ctx.service.bookingCourse.getByCourseTableItemId(id)
                if (students.length > 0 || aBookingStudent.length > 0) {
                    // this.ctx.body = { result:false, msg:'当前课程下有学生，无法删除'};
                    this.fail('当前课程下有学生，无法删除');
                    return;
                }
                yield this.ctx.service.courseTableItem.deleteById(id);
                this.success();
                // this.ctx.body = { result: true };
            }
            /* 获取一周的课程表 */
            *
            getWeekItems() {
                // var ctx = this.ctx;
                // yield app.mysql.beginTransactionScope(function* (conn){
                //     //this.ctx.conn = conn;
                //     var info = yield ctx.service.courseTableItem.findById(13);
                //     info.courseName = 'test';
                //     yield ctx.service.courseTableItem.update(info);
                //     //console.log(conn.update);
                // }, this.ctx);
                // id, startDate
                const termId = this.ctx.request.query.termId;
                const teacherId = this.ctx.request.query.teacherId;
                const term = yield this.ctx.service.term.getById(termId);
                const startDate = app.moment(this.ctx.request.query.startDate).day(1);
                const endDate = app.moment(startDate).day(7);
                // var courseTable = yield this.ctx.service.courseTable.findById(id);
                const teacher = yield this.ctx.service.teacher.findById(teacherId);
                // courseTable.teacherName = teacher.name;
                const lists = yield this.ctx.service.courseTableItem.find(termId, teacherId, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
                // this.ctx.logger.info(lists);
                const result = yield this.generateItemJson(startDate, lists);
                for (let item of result) {
                    for (let i of item.list) {
                        i.remarks = JSON.parse(i.remarks)
                    }
                }
                this.ctx.body = { list: result, startDate: term.startDate, endDate: term.endDate, name: teacher.name };
            }
            /**
             * 获取请假用户长度
             */
            *
            levelLength() {
                let { courseTableDetailId, studentId } = this.ctx.request.query
                const courseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailId)
                let aCourseTableItemStudent = []
                    // for (let item of courseTableItem) {
                    //     let result = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(item.id, '补课')
                    //     console.log(item.id, result)
                    //     if (result) {
                    //         aCourseTableItemStudent.push(result)
                    //     }
                    // }
                for (let item of courseTableItem) {
                    let courseTableItemId = item.id
                    while (courseTableItemId) {
                        let result = yield this.ctx.service.courseTableItemSwitch.getByToCourseTableItemIdAndStudentId(courseTableItemId, studentId)
                        if (result) {
                            aCourseTableItemStudent.push(result)
                            courseTableItemId = result.toCourseTableItemId
                        } else {
                            courseTableItemId = 0
                        }
                    }
                }
                this.success(aCourseTableItemStudent)
            }
            /* 获取一周的课程表 */
            *
            getWeekItemsForStudent() {

                // id, startDate
                const termId = this.ctx.request.query.termId;
                const studentId = this.ctx.request.query.studentId;
                const startDate = app.moment(this.ctx.request.query.startDate).day(1);
                const endDate = app.moment(startDate).day(7);

                const term = yield this.ctx.service.term.getById(termId);
                const student = yield this.service.student.getById(studentId);
                const lists = yield this.ctx.service.courseTableItem.getList(termId, studentId, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
                // this.ctx.logger.info(lists);

                const result = yield this.generateItemJson(startDate, lists);
                this.ctx.body = { list: result, startDate: term.startDate, endDate: term.endDate, name: student.name };
            }
            /**
             * 根据参数生成客户端可用的json数据
             * @param {Date} startDate
             * @param {Array} lists courseTableItem集合
             */
            *
            getClassBerforsuspendClasses() {
                let { suspensionDateId, studentId } = this.ctx.request.query
                let courseTableItem = yield this.ctx.service.courseTableItem.getById(suspensionDateId)

                let aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableItem.courseTableDetailId)
                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItem.courseTableDetailId, studentId)
                let classBerforsuspendClasses = []
                for (let item of aCourseTableItem) {
                    let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId1(item.id, studentId)
                    if (item.id < suspensionDateId && courseTableItemStudent.length > 0) {
                        classBerforsuspendClasses.push(item)
                    }
                }
                let aCourseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getChangeClassByCourseTableDetailIdAndStudentId(courseTableItem.courseTableDetailId, studentId)
                for (let item of aCourseTableItemChangeCourse) {
                    let courseTableItem1 = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId)
                    let date1 = new Date(courseTableItem.date)
                    let date2 = new Date(courseTableItem1.date)
                    let time1 = new Date(date1.getFullYear() + '-' + (date1.getMonth() + 1) + "-" + date1.getDate()).getTime()
                    let time2 = new Date(date2.getFullYear() + '-' + (date2.getMonth() + 1) + "-" + date2.getDate()).getTime()
                    if (date2 < date1) {
                        classBerforsuspendClasses.push(courseTableItem1)
                    }
                }
                // if (classBerforsuspendClasses.length == 0) {
                let courseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByCourseTableDetailStudentIdAndOne(courseTableDetailStudent.id, 1)
                for (let item of courseTableChangeClassForTeacher) {
                    let fromCourseTableItem = item.fromCourseTableItemId
                    let toCourseTableItem = item.toCourseTableItemId
                    let endCourseTableItem
                    let endToCourseTableItem
                    while (fromCourseTableItem) {
                        let courseTableChangeClassForTeacher1 = yield this.ctx.service.courseTableChangeClassForTeacher.getByCourseTableDetailStudentIdAndToCourseTableItemIdAndOne(courseTableDetailStudent.id, fromCourseTableItem, 0)
                        if (courseTableChangeClassForTeacher1) {
                            fromCourseTableItem = courseTableChangeClassForTeacher1.fromCourseTableItemId
                        } else {
                            endCourseTableItem = fromCourseTableItem
                            fromCourseTableItem = 0
                        }
                    }
                    if (endCourseTableItem < suspensionDateId) {
                        endToCourseTableItem = yield this.ctx.service.courseTableItem.getById(endCourseTableItem)
                        classBerforsuspendClasses.push(endToCourseTableItem)
                    }
                }
                this.success(classBerforsuspendClasses)
            } *
            generateItemJson(startDate, lists) {
                const result = [];
                for (let index = 1; index <= 7; index++) {
                    const dayOfWeek = app.moment.weekdays()[index % 7];
                    var obj = {
                        date: app.moment(startDate).add(index - 1, 'days'),
                        dayOfWeek,
                        list: [],
                    };
                    const list = app.lodash.filter(lists, function(ii) {
                        return app.moment(ii.date).format('YYYY-MM-DD') == app.moment(obj.date).format('YYYY-MM-DD');
                    });
                    for (let j = 0; j < list.length; j++) {

                        const item = list[j];
                        // item.startTime = app.moment(item.startTime);
                        const course = yield this.ctx.service.course.getById(item.courseId);
                        if (course) {
                            item.course = {
                                name: course.name,
                                type: course.type,
                                time: course.time,
                            };
                        }
                        const classroom = yield this.ctx.service.classroom.getById(item.classroomId);
                        if (classroom) {
                            item.classroomName = classroom.name;
                        }
                        // const switchs = yield this.ctx.service.courseTableItemSwitch.getByToCourseTableItemId(item.id);
                        const students = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(item.id);
                        // const switchTo = yield this.ctx.service.courseTableItemSwitch.getByFromCourseTableItemId(item.id);
                        item.students = [];
                        for (let k = 0; k < students.length; k++) {
                            console.log(list, students)
                            if (students[k].status != '正常' && students[k].status != '停课' && students[k].status != '补课' && students[k].status != '转课') continue;
                            const ss = yield this.ctx.service.student.getById(students[k].studentId);
                            let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getCourseTableDetailStudentByCouseTableDetailIdAndStudentId(item.courseTableDetailId, students[k].studentId)
                            let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId)
                            let numberOfleave
                            let allNumberOfChangeClassForTeacher
                            if (students[k].status === '补课' && !students[k].teacherStatus) {
                                let courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(students[k].courseTableItemId, students[k].studentId, 1)
                                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, students[k].studentId)
                                numberOfleave = courseTableDetailStudent.numberOfleave
                                allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher
                            } else if (students[k].status === '正常' && students[k].teacherStatus) {
                                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(Number(students[k].teacherStatus))
                                numberOfleave = courseTableDetailStudent.numberOfleave
                                allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher
                            } else if (students[k].status === '补课' && students[k].teacherStatus) {
                                let courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(students[k].courseTableItemId, students[k].studentId, 1)
                                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, students[k].studentId)
                                numberOfleave = courseTableDetailStudent.numberOfleave
                                allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher
                            } else {
                                let courseTableItem = yield this.ctx.service.courseTableItem.getById(students[k].courseTableItemId)
                                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItem.courseTableDetailId, students[k].studentId)
                                numberOfleave = courseTableDetailStudent.numberOfleave
                                allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher
                            }
                            // ss.switch = app.lodash.find(switchs, { studentId: ss.id });
                            // ss.switchTo = app.lodash.find(switchTo, { studentId: ss.id });
                            item.students.push({ student: ss, status: students[k].status, teacherStatus: students[k].teacherStatus, courseTableItemStudent: courseTableItemStudent[0], courseTableDetail, numberOfleave, allNumberOfChangeClassForTeacher });
                        }
                        const teacher = yield this.service.teacher.findById(item.teacherId);
                        item.teacher = {
                            id: teacher.id,
                            name: teacher.name,
                            // switch: app.lodash.find(switchs, function(ii) { return ii.teacherId > 0; }),
                        };

                        item.aStudentName = []
                        let courses = yield app.mysql.query(`select * from  booking_course  where state ='已确认'`)
                        for (let it of courses) {
                            if (it.confirmedId && it.confirmedId == item.id) {
                                let student = yield this.ctx.service.student.getById(it.studentId)
                                item.aStudentName.push(student)
                            } else if (!it.confirmedId && it.courseTableItemId == item.id) {
                                let student = yield this.ctx.service.student.getById(it.studentId)
                                item.aStudentName.push(student)
                            }
                        }
                        obj.list.push(item);
                    }
                    result.push(obj);
                }
                return result;
            }
    }
    return CourseTableItemController;
};