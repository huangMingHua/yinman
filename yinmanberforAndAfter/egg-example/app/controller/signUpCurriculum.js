'use strict';

module.exports = app => {
    class SignUpCurriculumController extends app.Controller { *
            saveCurriculum() {
                    let body = this.ctx.request.body
                    if (!body.studentId) {
                        this.fail('学生不能为空')
                        return
                    }
                    if (!body.curriculumId) {
                        this.fail('课程不能为空')
                        return
                    }
                    let student = yield this.ctx.service.student.getById(body.studentId)
                    let user = yield this.ctx.service.user.findById(student.userId)
                    let result = yield this.ctx.service.signUpCurriculum.saveCurriculum(body.studentId, body.curriculumId, user.id, '待确认', app.moment().format('YYYY-MM-DD HH:mm'), body.specialRequirements)
                    let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(body.curriculumId)
                    let classTime = app.moment(courseTableDetail.startDate).format('YYYY.MM.DD') + "至" + app.moment(courseTableDetail.endDate).format('YYYY.MM.DD') + " " + courseTableDetail.dayOfWeek + " " + courseTableDetail.startTime + "-" + courseTableDetail.endTime
                    if (result != 1 && result != 2) {
                        if (user.publicOpenId) {
                            yield this.ctx.service.wechat.signUpSuccess(student.name, courseTableDetail.courseName, classTime, user.publicOpenId, student.id)
                        }
                        for (let item of app.config.admins) {
                            if (item.publicOpenId) {
                                if (item.isEnabled === 1) {
                                    yield this.ctx.service.wechat.signUpSuccessAdmin(courseTableDetail.courseName, student.name, student.address, app.moment().format('YYYY.MM.DD HH:mm'), item.publicOpenId, student.telephone)
                                }
                            }
                        }
                        this.success()
                    } else {
                        if (result == 1) {
                            this.fail('已经报过相关课程了')
                        } else if (result == 2) {
                            this.fail('时间有冲突，请换其他课程')
                        }
                    }
                } *
                getStudentCurriculum() {
                    let query = this.ctx.request.query
                    const result = yield this.ctx.service.signUpCurriculum.getStudentCurriculum(this.ctx.request.query.studentId);
                    this.ctx.body = result;
                } *
                getAll() {
                    let query = this.ctx.request.query
                    let result = yield this.ctx.service.signUpCurriculum.getAll(query.pageIndex, query.limit, query.state, query.termDate)
                    for (let item of result.aCurriculum) {
                        if (item.startCourseTableItemId) {
                            item.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.startCourseTableItemId)
                            item.startCourseTableItem.date = app.moment(item.startCourseTableItem.date).format("YYYY-MM-DD")
                            item.startCourseTableItem.length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.startCourseTableItemId)
                        }
                    }
                    this.success(result)
                } *
                getEnrolmentInfo() {
                    const result = yield this.ctx.service.signUpCurriculum.getEnrolmentInfo(this.ctx.request.query.studentId);
                    this.ctx.body = result;
                } *
                getSignCurriculum() {
                    const result = yield this.ctx.service.signUpCurriculum.getSignCurriculum(this.ctx.request.query.studentId);
                    for (let item of result) {
                        if (item.startCourseTableItemId) {
                            item.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.startCourseTableItemId)
                            item.startCourseTableItem.date = app.moment(item.startCourseTableItem.date).format("YYYY-MM-DD")
                            item.startCourseTableItem.length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.startCourseTableItemId)
                        }
                    }
                    this.ctx.body = result;
                } *
                check() {
                    const id = this.ctx.request.body.id || 0;
                    const v = this.ctx.request.body.v;

                    let info = yield this.service.signUpCurriculum.getById(id);
                    if (info == null) {
                        this.fail('未找到对象');
                        return;
                    }


                    if (v) {
                        info.state = 2;
                    } else {
                        info.state = 0;
                    }
                    yield this.service.signUpCurriculum.changeState(this.ctx.request.body.id, info.state);
                    this.success();
                } *
                saveBackstageStudent() {
                    const req = this.ctx.request.body;
                    console.log(req);
                    const date = new Date(this.ctx.request.body.student.dateOfBirth);
                    const timeStart = new Date(this.ctx.request.body.student.time[0]);
                    const timeEnd = new Date(this.ctx.request.body.student.time[1]);
                    this.ctx.request.body.student.dateOfBirth = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                    yield this.ctx.model.student.create(req.student).then(res => {
                        const week = ['每周一', '每周二', '每周三', '每周四', '每周五'];
                        const times = [];
                        let indexDay = '';
                        for (let i = 0; i < week.length; i++) {
                            if (this.ctx.request.body.student.day == week[i]) {
                                indexDay = i;
                            }
                        }
                        const createTime = new Date();
                        this.ctx.model.user.update({ _id: req.student.userId }, { $set: { state: 1 } });
                        times.push({ arrayDay: this.ctx.request.body.student.day, indexDay, timeStart: timeStart.getHours() + ':' + timeStart.getMinutes(), timeEnd: timeEnd.getHours() + ':' + timeEnd.getMinutes() });
                        this.ctx.model.signUpCurriculum.create({ curriculum: req.student.curriculum, studentId: res._id, userId: req.student.userId, state: 1, times, createTime: createTime.getFullYear() + ':' + (createTime.getMonth() + 1) + ':' + createTime.getDate() + ' ' + createTime.getHours() + ':' + createTime.getMinutes() }).then(res => {});
                        this.ctx.body = res;
                    });

                } *
                getById() {
                    const result = yield this.ctx.service.signUpCurriculum.getById(this.ctx.request.query._id);
                    if (result.startCourseTableItemId) {
                        result.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(result.startCourseTableItemId)
                        result.startCourseTableItem.date = app.moment(result.startCourseTableItem.date).format("YYYY-MM-DD")
                    }
                    this.ctx.body = result;
                } * changeState() {
                    let { id, state, checked, nStartWeekId, nEndWeekId, reviewRemarks, paymentMethod } = this.ctx.request.body;
                    if (checked) {
                        if (!nStartWeekId) {
                            return this.fail('开始周期不能为空')
                        }
                    }
                    let info = yield app.mysql.get('sign_up_curriculum', { id })
                    info.state = '已' + state;
                    info.reviewRemarks = reviewRemarks;
                    info.paymentMethod = paymentMethod;
                    info.startCourseTableItemId = nStartWeekId
                    let course = yield this.ctx.service.courseTableDetail.getById(info.curriculumId)
                    let student = yield this.ctx.service.student.getById(info.studentId)
                    let studentUser = yield this.ctx.service.user.getById(student.userId)
                    if (state == '确认') {
                        let classroom = yield this.ctx.service.classroom.getById(course.classroomId)
                        let teacher = yield this.ctx.service.teacher.getById(course.teacherId)
                        let teacherUser = yield this.ctx.service.user.getById(teacher.userId)
                        let aCourseItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(info.curriculumId)
                        if (checked) {
                            for (let item of aCourseItem) {
                                if (nStartWeekId <= item.id) {
                                    let length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, info.studentId)
                                    if (length > 0) {
                                        this.fail('当前课程已有该学生的课')
                                        return
                                    }
                                    let length1 = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.id)
                                    if (length1 >= item.number) {
                                        this.fail('当前课程的某节课人数已满，请更改课程开始日期')
                                        return
                                    }
                                    // yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId)
                                    // item.status = ""
                                    // yield this.ctx.service.courseTableItem.update(item)
                                }
                            }
                            let aCourseItem1 = []
                            for (let item of aCourseItem) {
                                if (nStartWeekId <= item.id) {
                                    aCourseItem1.push(nStartWeekId)
                                }
                            }
                            let sutdentLeave
                            let teacherLeave
                            if (aCourseItem1.length <= course.belowClass) {
                                sutdentLeave = course.numberOfRequests1
                            } else {
                                sutdentLeave = course.numberOfRequests2
                            }
                            if (aCourseItem1.length <= course.teacherBelowClass) {
                                teacherLeave = course.teacherNumberOfRequests1
                            } else {
                                teacherLeave = course.teacherNumberOfRequests2
                            }
                            yield this.ctx.service.courseTableDetailStudent.add(info.studentId, info.curriculumId, '正常', course.termId, id, nStartWeekId)
                            let courseTableItem = yield this.ctx.service.courseTableItem.getById(nStartWeekId)
                            let classTime = app.moment(courseTableItem.date).format('YYYY.MM.DD') + "至" + app.moment(course.endDate).format('YYYY.MM.DD') + " " + course.dayOfWeek + " " + course.startTime + "-" + course.endTime
                            yield this.ctx.service.wechat.signUpAuditingSuccess(student.name, teacher.name, course.courseName, classTime, classroom.name, studentUser.publicOpenId, teacherUser.publicOpenId, student.id)
                            for (let item of aCourseItem) {
                                if (nStartWeekId <= item.id) {
                                    item.status = ""
                                    yield this.ctx.service.courseTableItem.update(item)
                                    yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId)
                                }
                            }
                            yield this.ctx.service.courseTableDetail.resetCurriculumCycle(info.curriculumId, info.studentId, nStartWeekId, aCourseItem[aCourseItem.length - 1].id)
                        } else {
                            for (let item of aCourseItem) {
                                let length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, info.studentId)
                                if (length > 0) {
                                    this.fail('当前课程已有该学生的课')
                                    return
                                }
                                let length1 = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.id)
                                if (length1 >= item.number) {
                                    this.fail('当前课程的某节课人数已满，请更改课程开始日期')
                                    return
                                }
                            }
                            let sutdentLeave
                            let teacherLeave
                            if (aCourseItem.length <= course.belowClass) {
                                sutdentLeave = course.numberOfRequests1
                            } else {
                                sutdentLeave = course.numberOfRequests2
                            }
                            if (aCourseItem.length <= course.teacherBelowClass) {
                                teacherLeave = course.teacherNumberOfRequests1
                            } else {
                                teacherLeave = course.teacherNumberOfRequests2
                            }
                            let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.add(info.studentId, info.curriculumId, '正常', course.termId, id, null, sutdentLeave, sutdentLeave, sutdentLeave, teacherLeave, teacherLeave)
                            let classTime = app.moment(course.startDate).format('YYYY.MM.DD') + "至" + app.moment(course.endDate).format('YYYY.MM.DD') + " " + course.dayOfWeek + " " + course.startTime + "-" + course.endTime
                            yield this.ctx.service.wechat.signUpAuditingSuccess(student.name, teacher.name, course.courseName, classTime, classroom.name, studentUser.publicOpenId, teacherUser.publicOpenId, student.id)
                            yield this.ctx.service.signUpWechat.add(courseTableDetailStudent.insertId)
                            for (let item of aCourseItem) {
                                item.status = ""
                                yield this.ctx.service.courseTableItem.update(item)
                                yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId)
                            }
                        }
                        student.sign_up = 1;
                        yield this.service.student.update(student);
                    } else {
                        let classTime = app.moment(course.startDate).format('YYYY.MM.DD') + "至" + app.moment(course.endDate).format('YYYY.MM.DD') + " " + course.dayOfWeek + " " + course.startTime + "-" + course.endTime
                        if (state == '取消') {
                            for (let item of app.config.admins) {
                                if (item.publicOpenId) {
                                    if (item.isEnabled === 1) {
                                        yield this.ctx.service.wechat.signUpCacleFailToAdmin(student.name, course.courseName, item.publicOpenId)
                                    }
                                }
                            }
                            let list = yield this.ctx.service.signUpCurriculum.getByStudentIdAndState1(info.studentId)
                            if (list.length < 2) {
                                student.sign_up = 1;
                                yield this.service.student.update(student);
                            }
                            yield this.ctx.service.wechat.signUpCacleFail(student.name, course.courseName, classTime, studentUser.publicOpenId, student.id)
                        } else if (state == '拒绝') {
                            yield this.ctx.service.wechat.signUpAuditingFail(student.name, course.courseName, classTime, studentUser.publicOpenId, student.id)
                        } else {
                            this.fail('出错')
                            return
                        }
                    }
                    yield this.service.signUpCurriculum.update(info);
                    this.success();
                } *
                getSignUpCourseOtherTime() {
                    let result = yield this.ctx.service.courseTableDetail.getSignUpCourseOtherTime(this.ctx.request.query.id)
                    for (let item of result) {
                        item.teacher = yield this.ctx.service.teacher.getById(item.teacherId)
                    }
                    this.success(result)
                } *
                confirm() {
                    let { id, changeCurriculumId, checked, nStartWeekId, nEndWeekId, reviewRemarks, paymentMethod } = this.ctx.request.body;
                    if (checked) {
                        if (!nStartWeekId) {
                            return this.fail('开始周期不能为空')
                        }
                    }
                    let info = yield app.mysql.get('sign_up_curriculum', { id });
                    // if (info.state != '待确认') {
                    //     this.fail('当前状态不是待确认状态');
                    //     return;
                    // }
                    info.state = '已确认';
                    info.changeCurriculumId = changeCurriculumId;
                    info.reviewRemarks = reviewRemarks;
                    info.paymentMethod = paymentMethod;
                    info.startCourseTableItemId = nStartWeekId
                    if (!changeCurriculumId) {
                        this.fail('更改时间不能为空');
                        return;
                    }
                    let course = yield this.ctx.service.courseTableDetail.getById(info.changeCurriculumId)
                    let student = yield this.ctx.service.student.getById(info.studentId)
                    let classroom = yield this.ctx.service.classroom.getById(course.classroomId)
                    let teacher = yield this.ctx.service.teacher.getById(course.teacherId)
                    let studentUser = yield this.ctx.service.user.getById(student.userId)
                    let teacherUser = yield this.ctx.service.user.getById(teacher.userId)
                    let aCourseItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(info.changeCurriculumId)
                    if (checked) {
                        yield this.ctx.service.courseTableDetailStudent.add(info.studentId, info.changeCurriculumId, '正常', course.termId, id, nStartWeekId)
                        for (let item of aCourseItem) {
                            if (nStartWeekId <= item.id) {
                                let length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, info.studentId)
                                if (length > 0) {
                                    this.fail('当前课程已有该学生的课')
                                    return
                                }
                                let length1 = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.id)
                                if (length1 >= item.number) {
                                    this.fail('当前课程的某节课人数已满，请更改课程开始日期')
                                    return
                                }
                                // yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId)
                                // item.status = ""
                                // yield this.ctx.service.courseTableItem.update(item)
                            }
                        }
                        for (let item of aCourseItem) {
                            if (nStartWeekId <= item.id) {
                                yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId)
                                item.status = ""
                                yield this.ctx.service.courseTableItem.update(item)
                            }
                        }
                        let courseTableItem = yield this.ctx.service.courseTableItem.getById(nStartWeekId)
                        let classTime = app.moment(courseTableItem.date).format('YYYY.MM.DD') + "至" + app.moment(course.endDate).format('YYYY.MM.DD') + " " + course.dayOfWeek + " " + course.startTime + "-" + course.endTime
                        yield this.ctx.service.wechat.signUpAuditingSuccess(student.name, teacher.name, course.courseName, classTime, classroom.name, studentUser.publicOpenId, teacherUser.publicOpenId, student.id)
                        yield this.ctx.service.courseTableDetail.resetCurriculumCycle(info.changeCurriculumId, info.studentId, nStartWeekId, aCourseItem[aCourseItem.length - 1].id)
                    } else {
                        for (let item of aCourseItem) {
                            let length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, info.studentId)
                            if (length > 0) {
                                this.fail('当前课程已有该学生的课')
                                return
                            }
                            let length1 = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.id)
                            if (length1 >= item.number) {
                                this.fail('当前课程的某节课人数已满，请更改课程开始日期')
                                return
                            }
                            // yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId)
                            // item.status = ""
                            // yield this.ctx.service.courseTableItem.update(item)
                        }
                        for (let item of aCourseItem) {
                            item.status = ""
                            yield this.ctx.service.courseTableItem.update(item)
                            yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId)
                        }
                        yield this.ctx.service.courseTableDetailStudent.add(info.studentId, info.changeCurriculumId, '正常', course.termId, id)
                        let classTime = app.moment(course.startDate).format('YYYY.MM.DD') + "至" + app.moment(course.endDate).format('YYYY.MM.DD') + " " + course.dayOfWeek + " " + course.startTime + "-" + course.endTime
                        yield this.ctx.service.wechat.signUpAuditingSuccess(student.name, teacher.name, course.courseName, classTime, classroom.name, studentUser.publicOpenId, teacherUser.publicOpenId, student.id)
                    }
                    student.sign_up = 1;
                    yield this.service.student.update(student);
                    yield this.service.signUpCurriculum.update(info);
                    this.success();
                } *
                getWeekById() {
                    let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(this.ctx.request.query.id)
                    let aCourseItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(this.ctx.request.query.id)
                    for (let i = 0; i < aCourseItem.length; i++) {
                        if (this.ctx.request.query.startDate) {
                            let startDate = new Date(this.ctx.request.query.startDate).getTime()
                            let endDate = new Date(this.ctx.request.query.endDate).getTime()
                            let betweenDate = new Date(aCourseItem[i].date).getTime()
                            if (startDate <= betweenDate && betweenDate < endDate) {
                                aCourseItem[i].date = app.moment(aCourseItem[i].date).format('YYYY-MM-DD')
                            } else {
                                aCourseItem.splice(i, 1)
                                i = -1
                            }
                        } else {
                            aCourseItem[i].date = app.moment(aCourseItem[i].date).format('YYYY-MM-DD')
                        }
                    }
                    for (let item of aCourseItem) {
                        item.length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.id)
                    }
                    let result
                    if (courseTableDetailStudent[0]) {
                        result = {
                            courseTableDetailStudent: courseTableDetailStudent[0],
                            aCourseItem
                        }
                    } else {
                        result = {
                            aCourseItem
                        }
                    }

                    this.success(result)
                } *
                backEndCancel() {
                    let oSignUp = yield app.mysql.get('sign_up_curriculum', { id: this.ctx.request.body.id });
                    oSignUp.state = '已取消';
                    let courseTableDetailId = oSignUp.changeCurriculumId || oSignUp.curriculumId
                    yield this.ctx.service.courseTableDetailStudent.delete(courseTableDetailId, oSignUp.studentId)
                    let aCourseItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailId)
                    for (let item of aCourseItem) {
                        yield this.ctx.service.courseTableItemStudent.delete(item.id, oSignUp.studentId)
                    }
                    let student = yield this.ctx.service.student.getById(oSignUp.studentId)
                    yield this.ctx.service.courseTableDetail.deleteByCourseTableDetailIdAndStudentId(courseTableDetailId, oSignUp.studentId);
                    student.sign_up = 0;
                    yield this.service.student.update(student);
                    yield this.ctx.service.signUpCurriculum.update(oSignUp)
                    this.success()
                } * getByState() {
                    let body = this.ctx.request.body
                    let result = yield this.ctx.service.signUpCurriculum.getByState(body.state, body.pageIndex, body.limit)
                    this.success(result)
                }
        }
        // * get
    return SignUpCurriculumController;
};