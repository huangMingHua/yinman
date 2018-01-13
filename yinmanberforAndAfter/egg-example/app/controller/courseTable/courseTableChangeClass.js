module.exports = app => {
    /**
     * 调课相关方法
     */
    class CourseTableChangeClassController extends app.Controller {
        /*
         * 获取调课信息
         */
        *
        getChangeClassData() {
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
         * 请假
         */
        // *
        // addLeave() {
        //         var fromCourseTableItemId = this.ctx.request.body.fromCourseTableItemId || 0;
        //         var reason = this.ctx.request.body.reason;
        //         var studentId = this.ctx.request.body.studentId || 0;
        //         var teacherId = this.ctx.request.body.teacherId || 0;
        //         const ctx = this.ctx;
        //         var now = new Date();

        //         if (app.lodash.trim(reason) == '') {
        //             this.fail('请假原因不能为空');
        //             return;
        //         }

        //         var fromCourseTableItem = yield this.ctx.service.courseTableItem.findById(fromCourseTableItemId);
        //         if (fromCourseTableItem == null) {
        //             this.fail('要调课的记录不存在');
        //             return;
        //         }
        //         if (app.moment(fromCourseTableItem.date).diff(now, 'days') < 2) {
        //             this.fail('请提前48小时请假');
        //             return;
        //         }

        //         if (app.moment(toCourseTableItem.date).diff(now, 'days') < 2) {
        //             this.fail('请提前48小时请假');
        //             return;
        //         }
        //         var termId = fromCourseTableItem.termId;
        //         if (teacherId > 0) { //老师
        //             let result = yield app.mysql.beginTransactionScope(function*(conn) {
        //                 ctx.conn = conn;
        //                 if (fromCourseTableItem.number > 1) {
        //                     return { code: 0, msg: '当前课程为一对多，无法调课' };
        //                 }
        //                 let courseTableDetailId = 0;
        //                 if (fromCourseTableItem.courseTableDetailId > 0) {
        //                     courseTableDetailId = fromCourseTableItem.courseTableDetailId;
        //                 } else {
        //                     let students = yield ctx.service.courseTableItemStudent.getByCourseTableItemId(fromCourseTableItem.id, '正常');
        //                     let students1 = yield ctx.service.courseTableItemStudent.getByCourseTableItemId(fromCourseTableItem.id, '停课');
        //                     let students2 = yield ctx.service.courseTableItemStudent.getByCourseTableItemId(fromCourseTableItem.id, '补课');
        //                     let students4 = students.concat(students1, students2)
        //                     if (students4.length > 1) {
        //                         return { code: 0, msg: '当前课程有多名学生，无法调课' };
        //                     }
        //                     let originSwitch = yield ctx.service.courseTableItemLeave.get(fromCourseTableItem.id, students4[0].studentId);
        //                     if (originSwitch == null) {
        //                         return { code: 0, msg: '未找到源请假信息' };
        //                     }
        //                     courseTableDetailId = originSwitch.fromCourseTableDetailId;
        //                 }
        //                 let switchMaxCount = parseInt((yield ctx.service.config.getByKey('教师调课次数')).value);
        //                 let switchs = yield ctx.service.courseTableItemLeave.getTeacherSwitchs1(courseTableDetailId, teacherId);
        //                 if (switchs.length >= switchMaxCount) {
        //                     return { code: 0, msg: '您本学期已经不能再调课了' };
        //                 }

        //                 fromCourseTableItem.status = '老师请假';
        //                 yield ctx.service.courseTableItem.update(fromCourseTableItem);
        //                 var fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemId(fromCourseTableItem.id);
        //                 for (let i = 0; i < fromCourseTableItemStudents.length; i++) {
        //                     let item = fromCourseTableItemStudents[i];
        //                     item.status = '老师请假';
        //                     yield ctx.service.courseTableItemStudent.update(item);

        //                     yield ctx.service.courseTableItemStudent.add(toCourseTableItem.id, item.studentId, '正常', toCourseTableItem.termId);
        //                 }
        //                 yield ctx.service.courseTableItemLeave.add(fromCourseTableItem.id, toCourseTableItem.id, reason, 0, now, termId, teacherId, courseTableDetailId);
        //                 return { code: 1 };
        //             }, ctx);

        //             this.ctx.body = result;
        //             return;
        //         } else {

        //             let result = yield app.mysql.beginTransactionScope(function*(conn) {
        //                 ctx.conn = conn;

        //                 let courseTableDetailId = 0;
        //                 if (fromCourseTableItem.courseTableDetailId > 0) {
        //                     courseTableDetailId = fromCourseTableItem.courseTableDetailId;
        //                 } else {
        //                     let originSwitch = yield ctx.service.courseTableItemLeave.get(fromCourseTableItem.id, studentId);
        //                     if (originSwitch == null) {
        //                         // this.fail('未找到源请假信息');
        //                         // return;
        //                         return { code: 0, msg: '未找到源请假信息' };
        //                     }
        //                     courseTableDetailId = originSwitch.fromCourseTableDetailId;
        //                 }
        //                 let switchMaxCount = parseInt((yield ctx.service.config.getByKey('学生调课次数')).value);
        //                 let switchs = yield ctx.service.courseTableItemLeave.getStudentLeave1(courseTableDetailId, studentId);
        //                 //this.ctx.logger.info(switchMaxCount, app.lodash.filter(switchs, { fromCourseTableDetailId:courseTableDetailId, studentId: studentId }).length);
        //                 if (switchs.length >= switchMaxCount) {
        //                     return { code: 0, msg: '您本学期已经不能再调课了' };
        //                 }
        //                 fromCourseTableItem.status = '空闲';

        //                 yield ctx.service.courseTableItem.update(fromCourseTableItem);
        //                 var fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '正常');
        //                 for (let i = 0; i < fromCourseTableItemStudents.length; i++) {
        //                     var item = fromCourseTableItemStudents[i];
        //                     item.status = '请假';
        //                     yield ctx.service.courseTableItemStudent.update(item);
        //                 }
        //                 yield ctx.service.courseTableItemStudent.add(toCourseTableItem.id, studentId, '补课', fromCourseTableItem.termId);
        //                 yield ctx.service.courseTableItemLeave.add(reason, studentId, now, courseTableDetailId);
        //                 return { code: 1 };
        //             }, ctx);
        //             this.ctx.body = result;
        //             return;
        //         }
        // }
        *
        addChangeClass() {
                let { fromCourseTableItemId = 0, toCourseTableItemId = 0, reason = '', studentId = 0, currentTeacher = 0 } = this.ctx.request.body;
                let ctx = this.ctx;
                var now = new Date();
                if (app.lodash.trim(reason) == '') {
                    this.fail('请假原因不能为空');
                    return;
                }
                var fromCourseTableItem = yield this.ctx.service.courseTableItem.findById(fromCourseTableItemId);
                if (fromCourseTableItem == null) {
                    this.fail('要调课的课程不存在');
                    return;
                }
                if (app.moment(fromCourseTableItem.date).diff(now, 'days') < 2) {
                    this.fail('请提前48小时请假');
                    return;
                }
                var toCourseTableItem
                var length 
                if(toCourseTableItemId != 0){
                    toCourseTableItem = yield this.ctx.service.courseTableItem.findById(toCourseTableItemId);
                    if (app.moment(toCourseTableItem.date).diff(now, 'days') < 2) {
                        this.fail('请提前48小时请假');
                        return;
                    }
                    length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId1(toCourseTableItemId, studentId);
                    if (length > 0) {
                        this.fail('同一节课不可以有同一个人存在');
                        return;
                    }
                }
                let courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(fromCourseTableItemId, studentId, 1)
                let courseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByToCourseTableItemIdAndOne(fromCourseTableItemId, 1)
                let courseTableDetailStudent
                if (courseTableItemChangeCourse && !courseTableChangeClassForTeacher) {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, studentId)
                } else if (!courseTableItemChangeCourse && !courseTableChangeClassForTeacher) {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(fromCourseTableItem.courseTableDetailId, studentId)
                } else if (!courseTableItemChangeCourse && courseTableChangeClassForTeacher) {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(courseTableChangeClassForTeacher.courseTableDetailStudentId)
                } else if (courseTableItemChangeCourse && courseTableChangeClassForTeacher) {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, studentId)
                } else {
                    this.fail('没有找到数据')
                    return
                }
                if (!courseTableDetailStudent.numberOfChangeClass) {
                    this.fail('你的调课次数已满不可以在调');
                    return;
                }
                let result = yield app.mysql.beginTransactionScope(function*(conn) {

                    //有人请假这趟课算空闲
                    fromCourseTableItem.status = '空闲';
                    yield ctx.service.courseTableItem.update(fromCourseTableItem);
                    //关于这个学生这节课算请假
                    var fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '正常');
                    if (fromCourseTableItemStudents.length === 0) {
                        fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '停课');
                    }
                    if (fromCourseTableItemStudents.length === 0) {
                        fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '转课');
                    }
                    for (let i = 0; i < fromCourseTableItemStudents.length; i++) {
                        var item = fromCourseTableItemStudents[i];
                        item.status = '请假';
                        yield ctx.service.courseTableItemStudent.update(item);
                    }
                    if (courseTableItemChangeCourse) {
                        courseTableItemChangeCourse.one = 0
                        yield ctx.service.courseTableItemChangeCourse.update(courseTableItemChangeCourse)
                        let fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '补课');
                        fromCourseTableItemStudents[0].status = '请假';
                        yield ctx.service.courseTableItemStudent.update(fromCourseTableItemStudents[0]);
                    }
                    courseTableDetailStudent.numberOfChangeClass = courseTableDetailStudent.numberOfChangeClass - 1
                    courseTableDetailStudent.numberOfleave = courseTableDetailStudent.numberOfleave - 1
                    if (courseTableChangeClassForTeacher) {
                        courseTableChangeClassForTeacher.fromCourseTableItemId = fromCourseTableItemId
                        courseTableChangeClassForTeacher.toCourseTableItemId = toCourseTableItemId
                        yield ctx.service.courseTableChangeClassForTeacher.update(courseTableChangeClassForTeacher)
                        yield ctx.service.courseTableItemStudent.add(toCourseTableItem.id, studentId, '补课', toCourseTableItem.termId, courseTableDetailStudent.id)
                    } else {
                        yield ctx.service.courseTableItemStudent.add(toCourseTableItem.id, studentId, '补课', toCourseTableItem.termId)
                    }
                    //添加请假记录表
                    yield ctx.service.courseTableItemLeave.add(reason, studentId, now, fromCourseTableItem.id, fromCourseTableItem.courseTableDetailId);
                    yield ctx.service.courseTableItemChangeCourse.add(reason, studentId, now, toCourseTableItem.id, courseTableDetailStudent.courseTableDetailId, 1);
                    yield ctx.service.courseTableDetailStudent.update(courseTableDetailStudent)
                    let student = yield ctx.service.student.getById(studentId)
                    let studentUser = yield ctx.service.user.getById(student.userId)
                    let courseTableDetail = yield ctx.service.courseTableDetail.getById(courseTableDetailStudent.courseTableDetailId)
                    let oldClassTime = app.moment(fromCourseTableItem.date).format('YYYY.MM.DD') + " " + fromCourseTableItem.startTime + "-" + fromCourseTableItem.endTime
                    let newClassTime = app.moment(toCourseTableItem.date).format('YYYY.MM.DD') + " " + toCourseTableItem.startTime + "-" + toCourseTableItem.endTime
                    let oldTeacher = yield ctx.service.teacher.getById(fromCourseTableItem.teacherId)
                    let oldTeacherUser = yield ctx.service.user.getById(oldTeacher.userId)
                    let newTeacher = yield ctx.service.teacher.getById(toCourseTableItem.teacherId)
                    let newTeacherUser = yield ctx.service.user.getById(newTeacher.userId)
                    let newClassroom = yield ctx.service.classroom.getById(toCourseTableItem.classroomId)
                    yield ctx.service.wechat.changeClass(student.name, courseTableDetail.courseName, oldClassTime, newClassTime, reason, newTeacher.name, oldTeacher.name, newClassroom.name, studentUser.publicOpenId, oldTeacherUser.publicOpenId, newTeacherUser.publicOpenId, student.id, oldTeacherUser.id)
                    return { code: 1 };
                }, ctx);
                this.ctx.body = result;
                return;

            } *
            addMakeup() {
                let { courseTableDetailId = 0, toCourseTableItemId = 0, reason = '', studentId = 0, currentTeacher = 0 } = this.ctx.request.body;
                let ctx = this.ctx;
                var now = new Date();

                // var fromCourseTableItem = yield this.ctx.service.courseTableItem.findById(fromCourseTableItemId);
                // if (fromCourseTableItem == null) {
                //     this.fail('要调课的记录不存在');
                //     return;
                // }
                // if (app.moment(fromCourseTableItem.date).diff(now, 'days') < 2) {
                //     this.fail('请提前48小时请假');
                //     return;
                // }
                var toCourseTableItem = yield this.ctx.service.courseTableItem.findById(toCourseTableItemId);
                if (app.moment(toCourseTableItem.date).diff(now, 'days') < 2) {
                    this.fail('请提前48小时请假');
                    return;
                }
                var length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId1(toCourseTableItemId, studentId);
                if (length > 0) {
                    this.fail('同一节课不可以有同一个人存在');
                    return;
                }
                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId)
                if (!courseTableDetailStudent.numberOfChangeClass) {
                    this.fail('你的调课次数已满不可以在调');
                    return;
                }
                let result = yield app.mysql.beginTransactionScope(function*(conn) {
                    //有人请假这趟课算空闲
                    if (toCourseTableItem.number == 1) {
                        toCourseTableItem.status = '';
                        yield ctx.service.courseTableItem.update(toCourseTableItem);
                    }
                    courseTableDetailStudent.numberOfChangeClass = courseTableDetailStudent.numberOfChangeClass - 1
                        //添加请假记录表
                    yield ctx.service.courseTableItemChangeCourse.add(reason, studentId, now, toCourseTableItem.id, courseTableDetailStudent.courseTableDetailId, 1);
                    yield ctx.service.courseTableDetailStudent.update(courseTableDetailStudent)
                    yield ctx.service.courseTableItemStudent.add(toCourseTableItem.id, studentId, '补课', toCourseTableItem.termId)
                    let student = yield ctx.service.student.getById(studentId)
                    let studentUser = yield ctx.service.user.getById(student.userId)
                    let classDate = app.moment(toCourseTableItem.date).format('YYYY.MM.DD')
                    let classTime = toCourseTableItem.startTime + '-' + toCourseTableItem.endTime
                    let teacher = yield ctx.service.teacher.getById(toCourseTableItem.teacherId)
                    let teacherUser = yield ctx.service.user.getById(teacher.userId)
                    let classroom = yield ctx.service.classroom.getById(toCourseTableItem.classroomId)
                    yield ctx.service.wechat.addMakeUp(student.name, classDate, classTime, teacher.name, classroom, studentUser.publicOpenId, teacherUser.publicOpenId, student.id, toCourseTableItem.courseName)
                    return { code: 1 };
                }, ctx);
                this.ctx.body = result;
                return;

            }
            /**
             * 获取学生调课页面的初始数据
             */
            *
            getChangeClassDataForStudent() {
                let id = this.ctx.request.query.id || 0;
                let studentId = this.ctx.request.query.studentId || 0;
                let item = yield this.ctx.service.courseTableItem.findById(id);
                if (item == null) {
                    this.fail('数据不存在');
                    return;
                }
                let courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(this.ctx.request.query.id, studentId, 1)
                let courseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByToCourseTableItemIdAndOne(id, 1)
                let courseTableDetailStudent
                if (courseTableItemChangeCourse && !courseTableChangeClassForTeacher) {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, studentId)
                } else if (!courseTableItemChangeCourse && !courseTableChangeClassForTeacher) {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(item.courseTableDetailId, studentId)
                } else if (!courseTableItemChangeCourse && courseTableChangeClassForTeacher) {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(courseTableChangeClassForTeacher.courseTableDetailStudentId)
                } else if (courseTableItemChangeCourse && courseTableChangeClassForTeacher) {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, studentId)
                } else {
                    this.fail('没有找到数据')
                    return
                }
                let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId)
                let list = yield this.ctx.service.courseTableItem.getFreeForStudent(item.courseName, item.number, item.duration, item.termId, item.level);
                let teacher = yield this.service.teacher.getById(item.teacherId);
                var result = [];
                var groupList = app.lodash.groupBy(list, 'teacherId');
                for (let item in groupList) {
                    for (var i = 0; i < groupList[item].length; i++) {
                        let length = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(groupList[item][i].id)
                        if (length >= groupList[item][i].number) {
                            groupList[item].splice(i, 1)
                            i = -1
                        }
                    }
                }
                for (let item in groupList) {
                    for (var i = 0; i < groupList[item].length; i++) {
                        let isCourseTableItem = yield this.ctx.service.courseTableItemStudent.getStudentByCourseTableItemIdAndStudentId(groupList[item][i].id, studentId)
                        for (let j = 0; j < isCourseTableItem.length; j++) {
                            if (isCourseTableItem[j].status == '请假') {
                                isCourseTableItem.splice(j, 1)
                                j = -1
                            }
                        }
                        if (isCourseTableItem.length > 0 && isCourseTableItem.length >= groupList[item][i].number) {
                            groupList[item].splice(i, 1)
                            i = -1
                        }
                    }
                }
                // console.log(groupList)
                for (var i in groupList) {
                    if (groupList[Number(i)].length > 0) {
                        let teacher1 = yield this.ctx.service.teacher.findById(parseInt(i));
                        teacher1.courseTableItems = app.lodash.sortBy(groupList[i], function(o) {
                            //console.log(o.date +' '+ o.startTime);
                            let date = app.moment(o.date).format('YYYY-MM-DD');
                            return app.moment(date + ' ' + o.startTime).unix();
                        });
                        for (let j = 0; j < teacher1.courseTableItems.length; j++) {
                            let day = new Date().getDay()
                            let startDate = app.moment().subtract(day, 'days');
                            let endDate = app.moment(startDate).add(14, 'days');
                            if (new Date(startDate).getTime() < new Date(teacher1.courseTableItems[j].date).getTime() && new Date(teacher1.courseTableItems[j].date).getTime() < new Date(endDate).getTime()) {
                                teacher1.courseTableItems[j].startTime = this.ctx.helper.formatTime(teacher1.courseTableItems[j].startTime);
                                teacher1.courseTableItems[j].endTime = this.ctx.helper.formatTime(teacher1.courseTableItems[j].endTime);
                                teacher1.courseTableItems[j].date = app.moment(teacher1.courseTableItems[j].date).format('YYYY-MM-DD');
                                teacher1.courseTableItems[j].classroomName = (yield this.service.classroom.getById(teacher1.courseTableItems[j].classroomId)).name;
                            } else {
                                teacher1.courseTableItems.splice(j, 1)
                                j = -1
                            }
                        }
                        teacher1.courseTableItems.sort(function(a, b) {
                            let getTime1 = new Date(a.date + " " + a.startTime).getTime()
                            let getTime2 = new Date(b.date + " " + b.startTime).getTime()
                            return getTime1 - getTime2
                        })
                        result.push(teacher1);
                    }
                }
                let aDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                let dayOfWeek
                if (courseTableDetail) {
                    dayOfWeek = courseTableDetail.dayOfWeek
                } else {
                    dayOfWeek = aDay[new Date(item.date).getDay()]
                }
                let student = yield this.ctx.service.student.getById(studentId)
                this.ctx.body = {
                    info: Object.assign(item, { teacherName: teacher.name, date: app.moment(item.date).format('YYYY-MM-DD'), dayOfWeek: dayOfWeek }),
                    teachers: result,
                    student,
                    courseTableDetailStudent: courseTableDetailStudent
                };

            }
            /**
             * 获取学生补课页面的初始数据
             */
            *
            getMakeupDataForStudent() {
                let courseTableDetailId = this.ctx.request.query.courseTableDetailId || 0;
                let studentId = this.ctx.request.query.studentId || 0;
                let item = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
                if (item == null) {
                    this.fail('数据不存在');
                    return;
                }
                let list = yield this.ctx.service.courseTableItem.getFreeForStudent(item.courseName, item.number, item.duration, item.termId, item.level);
                let teacher = yield this.service.teacher.getById(item.teacherId);
                var result = [];
                var groupList = app.lodash.groupBy(list, 'teacherId');
                for (let item in groupList) {
                    for (var i = 0; i < groupList[item].length; i++) {
                        let length = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(groupList[item][i].id)
                        if (length >= groupList[item][i].number) {
                            groupList[item].splice(i, 1)
                            i = -1
                        }
                    }
                }
                for (let item in groupList) {
                    for (var i = 0; i < groupList[item].length; i++) {
                        let isCourseTableItem = yield this.ctx.service.courseTableItemStudent.getStudentByCourseTableItemIdAndStudentId(groupList[item][i].id, studentId)
                        for (let j = 0; j < isCourseTableItem.length; j++) {
                            if (isCourseTableItem[j].status == '请假') {
                                isCourseTableItem.splice(j, 1)
                                j = -1
                            }
                        }
                        if (isCourseTableItem.length > 0 && isCourseTableItem.length >= groupList[item][i].number) {
                            groupList[item].splice(i, 1)
                            i = -1
                        }
                    }
                }
                // console.log(groupList)
                for (var i in groupList) {
                    if (groupList[Number(i)].length > 0) {
                        let teacher1 = yield this.ctx.service.teacher.findById(parseInt(i));
                        console.log(parseInt(i), teacher1, '1010')
                        teacher1.courseTableItems = app.lodash.sortBy(groupList[i], function(o) {
                            //console.log(o.date +' '+ o.startTime);
                            let date = app.moment(o.date).format('YYYY-MM-DD');
                            return app.moment(date + ' ' + o.startTime).unix();
                        });

                        for (let j = 0; j < teacher1.courseTableItems.length; j++) {
                            let day = new Date().getDay()
                            let startDate = app.moment().subtract(day, 'days');
                            let endDate = app.moment(startDate).add(14, 'days');
                            if (new Date(startDate).getTime() < new Date(teacher1.courseTableItems[j].date).getTime() && new Date(teacher1.courseTableItems[j].date).getTime() < new Date(endDate).getTime()) {
                                teacher1.courseTableItems[j].startTime = this.ctx.helper.formatTime(teacher1.courseTableItems[j].startTime);
                                teacher1.courseTableItems[j].endTime = this.ctx.helper.formatTime(teacher1.courseTableItems[j].endTime);
                                teacher1.courseTableItems[j].date = app.moment(teacher1.courseTableItems[j].date).format('YYYY-MM-DD');
                                teacher1.courseTableItems[j].classroomName = (yield this.service.classroom.getById(teacher1.courseTableItems[j].classroomId)).name;
                            } else {
                                teacher1.courseTableItems.splice(j, 1)
                                j = -1
                            }
                        }
                        result.push(teacher1);
                    }
                }
                let student = yield this.ctx.service.student.getById(studentId)
                this.ctx.body = {
                    info: Object.assign(item, { teacherName: teacher.name, date: app.moment(item.date).format('YYYY-MM-DD') }),
                    teachers: result,
                    student
                };

            } *
            getChangeClassDataForStudentByTeacherId() {
                let { id = 0, studentId = 0, teacherId = 0 } = this.ctx.request.body
                let item = yield this.ctx.service.courseTableItem.findById(id);
                if (item == null) {
                    this.fail('数据不存在');
                    return;
                }
                //当前老师下查询空闲时间
                let list = yield this.ctx.service.courseTableItem.getFreeByteacherIdForStudent(item.courseName, item.number, item.duration, item.termId, item.level, teacherId);
                for (let [index, it] of list.entries()) {
                    if (item.id == it.id) {
                        list.splice(index, 1)
                    }
                }
                let teacher = yield this.service.teacher.getById(item.teacherId);
                var result = [];
                var groupList = app.lodash.groupBy(list, 'teacherId');
                //筛选空闲的时间（二次筛选）
                for (let item in groupList) {
                    for (var i = 0; i < groupList[item].length; i++) {
                        let length = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(groupList[item][i].id)
                        if (length >= groupList[item][i].number) {
                            groupList[item].splice(i, 1)
                            i = -1
                        }
                    }
                }

                //筛选空闲的时间（三次筛选）
                for (let item in groupList) {
                    for (var i = 0; i < groupList[item].length; i++) {
                        let isCourseTableItem = yield this.ctx.service.courseTableItemStudent.getStudentByCourseTableItemIdAndStudentId(groupList[item][i].id, studentId)
                        for (let j = 0; j < isCourseTableItem.length; j++) {
                            if (isCourseTableItem[j].status == '请假') {
                                isCourseTableItem.splice(j, 1)
                                j = -1
                            }
                        }
                        if (isCourseTableItem.length > 0 && isCourseTableItem.length >= groupList[item][i].number) {
                            groupList[item].splice(i, 1)
                            i = -1
                        }
                    }
                }

                let courseTableItems = []
                for (var i in groupList) {
                    courseTableItems = app.lodash.sortBy(groupList[i], function(o) {
                        //console.log(o.date +' '+ o.startTime);
                        let date = app.moment(o.date).format('YYYY-MM-DD');
                        return app.moment(date + ' ' + o.startTime).unix();
                    });
                    for (let j = 0; j < courseTableItems.length; j++) {
                        let day = new Date().getDay()
                        let startDate = app.moment().subtract(day, 'days');
                        let endDate = app.moment(startDate).add(14, 'days');
                        if (new Date(startDate).getTime() < new Date(courseTableItems[j].date).getTime() && new Date(courseTableItems[j].date).getTime() < new Date(endDate).getTime()) {
                            courseTableItems[j].startTime = this.ctx.helper.formatTime(courseTableItems[j].startTime);
                            courseTableItems[j].endTime = this.ctx.helper.formatTime(courseTableItems[j].endTime);
                            courseTableItems[j].date = app.moment(courseTableItems[j].date).format('YYYY-MM-DD');
                            courseTableItems[j].classroomName = (yield this.service.classroom.getById(courseTableItems[j].classroomId)).name;
                        } else {
                            courseTableItems.splice(j, 1)
                            j = -1
                        }
                    }
                }
                //筛选空闲的时间（四次筛选）
                for (let i = 0; i < courseTableItems.length; i++) {
                    let isCourseTableItem = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(courseTableItems[i].id, studentId)
                    if (isCourseTableItem > 0) {
                        courseTableItems.splice(i, 1)
                        courseTableItems
                        i = -1
                    }
                }
                this.success(courseTableItems)
            } *
            getMakeupDataForStudentByTeacherId() {
                let { nCourseTableDetailId = 0, studentId = 0, teacherId = 0 } = this.ctx.request.body
                let item = yield this.ctx.service.courseTableDetail.getById(nCourseTableDetailId);
                if (item == null) {
                    this.fail('数据不存在');
                    return;
                }
                //当前老师下查询空闲时间
                let list = yield this.ctx.service.courseTableItem.getFreeByteacherIdForStudent(item.courseName, item.number, item.duration, item.termId, item.level, teacherId);
                console.log(list)
                let teacher = yield this.service.teacher.getById(item.teacherId);
                var result = [];
                var groupList = app.lodash.groupBy(list, 'teacherId');

                //筛选空闲的时间（二次筛选）
                for (let item in groupList) {
                    for (var i = 0; i < groupList[item].length; i++) {
                        let length = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(groupList[item][i].id)
                        if (length >= groupList[item][i].number) {
                            groupList[item].splice(i, 1)
                            i = -1
                        }
                    }
                }

                //筛选空闲的时间（三次筛选）
                for (let item in groupList) {
                    for (var i = 0; i < groupList[item].length; i++) {
                        let isCourseTableItem = yield this.ctx.service.courseTableItemStudent.getStudentByCourseTableItemIdAndStudentId(groupList[item][i].id, studentId)
                        for (let j = 0; j < isCourseTableItem.length; j++) {
                            if (isCourseTableItem[j].status == '请假') {
                                isCourseTableItem.splice(j, 1)
                                j = -1
                            }
                        }
                        if (isCourseTableItem.length > 0 && isCourseTableItem.length >= groupList[item][i].number) {
                            groupList[item].splice(i, 1)
                            i = -1
                        }
                    }
                }
                let courseTableItems = []
                for (var i in groupList) {
                    courseTableItems = app.lodash.sortBy(groupList[i], function(o) {
                        //console.log(o.date +' '+ o.startTime);
                        let date = app.moment(o.date).format('YYYY-MM-DD');
                        return app.moment(date + ' ' + o.startTime).unix();
                    });
                    for (let j = 0; j < courseTableItems.length; j++) {
                        let day = new Date().getDay()
                        let startDate = app.moment().subtract(day, 'days');
                        let endDate = app.moment(startDate).add(14, 'days');
                        if (new Date(startDate).getTime() < new Date(courseTableItems[j].date).getTime() && new Date(courseTableItems[j].date).getTime() < new Date(endDate).getTime()) {
                            courseTableItems[j].startTime = this.ctx.helper.formatTime(courseTableItems[j].startTime);
                            courseTableItems[j].endTime = this.ctx.helper.formatTime(courseTableItems[j].endTime);
                            courseTableItems[j].date = app.moment(courseTableItems[j].date).format('YYYY-MM-DD');
                            courseTableItems[j].classroomName = (yield this.service.classroom.getById(courseTableItems[j].classroomId)).name;
                        } else {
                            courseTableItems.splice(j, 1)
                            j = -1
                        }
                    }
                }

                //筛选空闲的时间（四次筛选）
                for (let i = 0; i < courseTableItems.length; i++) {
                    console.log(courseTableItems[i].id, studentId)
                    let isCourseTableItem = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(courseTableItems[i].id, studentId)
                    console.log(isCourseTableItem)
                    if (isCourseTableItem > 0) {
                        courseTableItems.splice(i, 1)
                        i = -1
                    }
                }
                this.success(courseTableItems)
            } *
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
            } *
            getListByTermIdAndstundetId() {
                let { termId, studentId } = this.ctx.request.query
                if (!termId) {
                    this.fail('学期不能为空')
                    return
                }
                if (!studentId) {
                    this.fail('学生不能为空')
                    return
                }
                let result = yield this.ctx.service.courseTableItemChangeCourse.getListByTermIdAndstundetId(termId, studentId)
                for (let item of result) {
                    item.date = app.moment(item.date).format('YYYY-MM-DD')
                    item.startTime = item.startTime.substr(0, 5)
                    item.endTime = item.endTime.substr(0, 5)
                    item.createTime1 = app.moment(item.createTime1).format('YYYY-MM-DD HH:mm')
                    item.oTeacher = yield this.ctx.service.teacher.getById(item.teacherId)
                    item.oClassroom = yield this.ctx.service.classroom.getById(item.classroomId)
                }
                this.success(result)

            } *
            getList() {
                const pageIndex = app.lodash.parseInt(this.ctx.request.query.pageIndex) || 0;
                const termId = app.lodash.parseInt(this.ctx.request.query.termId) || 0;
                const limit = app.lodash.parseInt(this.ctx.request.query.limit) || 10;
                let data = yield this.ctx.service.courseTableItemChangeCourse.getList(pageIndex, termId, limit);
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
            } *
            getChangeClassByCourseTableDetailIdAndStudentId() {
                let { courseTableDetailId, studentId } = this.ctx.request.query
                let aList = yield this.ctx.service.courseTableItemChangeCourse.getChangeClassByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId)
                for (let item of aList) {
                    item.courseTableDetailItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId)
                }
                this.success(aList)
            }
    }

    return CourseTableChangeClassController;

}