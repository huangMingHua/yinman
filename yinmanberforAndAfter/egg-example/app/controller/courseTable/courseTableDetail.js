module.exports = app => {
    class CourseTableDetailController extends app.Controller { *
        addDetail() {
                // const teacherId = this.ctx.request.body.teacherId || 0;
                // const termId = this.ctx.request.body.termId || 0;
                // const courseName = this.ctx.request.body.courseName || '';
                // const classroomId = this.ctx.request.body.classroomId || 0;
                // const dayOfWeek = this.ctx.request.body.dayOfWeek;
                // const startTime = this.ctx.request.body.startTime;
                // const endTime = this.ctx.request.body.endTime;
                // const number = this.ctx.request.body.number || 0;
                // const duration = this.ctx.request.body.duration || 0;
                // const level = this.ctx.request.body.level;
                // const remarks = this.ctx.request.body.remarks;
                // const startDate = this.ctx.request.body.startDate;
                // const endDate = this.ctx.request.body.endDate;
                let { teacherId = 0, termId = 0, courseName = '', classroomId = 0, dayOfWeek, startTime, endTime, number = 0, duration = 0, level, remarks, startDate, endDate, classHour, belowclassHour, higherThanClassHour, teacherClassHour, teacherBelowclassHour, teacherHigherThanClassHour } = this.ctx.request.body
                const ctx = this.ctx;
                let teacher = yield this.service.teacher.getById(teacherId);
                if (teacher == null) {
                    this.fail('教师不存在');
                    return;
                }
                let classroom = yield this.service.classroom.getById(classroomId);
                if (classroom == null) {
                    this.fail('教室不存在');
                    return;
                }
                let course = yield this.service.course.getByName(courseName);
                if (course == null) {
                    this.fail('课程不存在');
                    return;
                }
                if (number < 1) {
                    this.fail('学生数量至少为1');
                    return;
                }
                if (duration < 10) {
                    this.fail('课程时间需大于10分钟');
                    return;
                }
                if (app.lodash.trim(startTime) == '') {
                    this.fail('开始时间不能为空');
                    return;
                }
                if (app.lodash.trim(endTime) == '') {
                    this.fail('结束时间不能为空');
                    return;
                }
                if (classHour == '' || belowclassHour == '' || higherThanClassHour == '' || teacherClassHour == '' || teacherBelowclassHour == '' || teacherHigherThanClassHour == '') {
                    this.fail('请假内容不能为空');
                    return;
                }
                if (parseInt(classHour, 10) != classHour || parseInt(belowclassHour, 10) != belowclassHour || parseInt(higherThanClassHour, 10) != higherThanClassHour || parseInt(teacherClassHour, 10) != teacherClassHour || parseInt(teacherBelowclassHour, 10) != teacherBelowclassHour || parseInt(teacherHigherThanClassHour, 10) != teacherHigherThanClassHour) {
                    this.fail('请输入整数');
                    return;
                }
                const term = yield this.service.term.getById(termId);
                if (term == null) {
                    this.fail('学期不存在');
                    return;
                }

                var result = yield app.mysql.beginTransactionScope(function*(conn) {
                    ctx.conn = conn;

                    const list = yield ctx.service.courseTableDetail.getList(termId, teacherId);
                    for (let _detail of list) {
                        let _startTime = `2017-01-01 ${_detail.startTime}`;
                        let _endTime = `2017-01-01 ${_detail.endTime}`;
                        let _startTime1 = `2017-01-01 ${startTime}`;
                        let _endTime1 = `2017-01-01 ${endTime}`;


                        // if (_detail.dayOfWeek == dayOfWeek && ctx.helper.durationConflict(_startTime, _endTime, _startTime1, _endTime1)) {
                        //     return {
                        //         code: 0,
                        //         msg: '时间有冲突，请选择其他时间'
                        //     };
                        // }
                        if (_detail.dayOfWeek == dayOfWeek) {
                            var timeStamp1 = new Date(_detail.endDate).getTime()
                            var timeStamp2 = new Date(startDate).getTime()
                            if (timeStamp1 >= timeStamp2 && ctx.helper.durationConflict(_startTime, _endTime, _startTime1, _endTime1)) {
                                return {
                                    code: 0,
                                    msg: '时间有冲突，请选择其他时间'
                                };
                            }
                        }
                    }
                    let tempDate1 = app.moment(startDate);
                    while (tempDate1 <= app.moment(endDate)) {
                        let dayOfWeekTemp = app.moment.weekdays(tempDate1.day());
                        if (dayOfWeekTemp == dayOfWeek) {
                            let list = yield ctx.service.courseTableItem.getListByTeacherIdNOType(teacherId)
                            for (let item of list) {
                                let _startTime = `2017-01-01 ${item.startTime}`;
                                let _endTime = `2017-01-01 ${item.endTime}`;
                                let _startTime1 = `2017-01-01 ${startTime}`;
                                let _endTime1 = `2017-01-01 ${endTime}`;
                                console.log(app.moment(tempDate1).format('YYYY-MM-DD') == app.moment(item.date).format('YYYY-MM-DD'))
                                if (app.moment(tempDate1).format('YYYY-MM-DD') == app.moment(item.date).format('YYYY-MM-DD') && ctx.helper.durationConflict(_startTime, _endTime, _startTime1, _endTime1)) {
                                    return {
                                        code: 0,
                                        msg: '时间有冲突，请选择其他时间'
                                    };
                                }
                            }
                        }
                        tempDate1 = tempDate1.add(1, 'days');
                    }
                    let tempDate2 = app.moment(startDate);
                    console.log(tempDate2, app.moment(endDate))
                    while (tempDate2 <= app.moment(endDate)) {
                        let dayOfWeekTemp = app.moment.weekdays(tempDate2.day());
                        if (dayOfWeekTemp == dayOfWeek) {
                            let list = yield ctx.service.courseTableItem.getListByClassroomId(classroomId)
                            for (let item of list) {
                                let _startTime = `2017-01-01 ${item.startTime}`;
                                let _endTime = `2017-01-01 ${item.endTime}`;
                                let _startTime1 = `2017-01-01 ${startTime}`;
                                let _endTime1 = `2017-01-01 ${endTime}`;
                                if (app.moment(tempDate2).format('YYYY-MM-DD') == app.moment(item.date).format('YYYY-MM-DD') && ctx.helper.durationConflict(_startTime, _endTime, _startTime1, _endTime1)) {
                                    return {
                                        code: 0,
                                        msg: '该时间段内教室已被使用。'
                                    };
                                }
                            }
                        }
                        tempDate2 = tempDate2.add(1, 'days');
                    }
                    const detail = yield ctx.service.courseTableDetail.add(
                        termId,
                        teacherId,
                        courseName,
                        level,
                        number,
                        duration,
                        classroomId,
                        dayOfWeek,
                        startTime,
                        endTime,
                        '空闲',
                        app.moment(startDate).format('YYYY-MM-DD'),
                        app.moment(endDate).format('YYYY-MM-DD'),
                        '否',
                        remarks,
                        classHour,
                        belowclassHour,
                        higherThanClassHour,
                        teacherClassHour,
                        teacherBelowclassHour,
                        teacherHigherThanClassHour
                    );
                    let tempDate = app.moment(detail.startDate);
                    let num = 0
                    while (tempDate <= app.moment(detail.endDate)) {
                        let dayOfWeekTemp = app.moment.weekdays(tempDate.day());
                        if (dayOfWeekTemp == detail.dayOfWeek) {
                            num++
                            yield ctx.service.courseTableItem.add(
                                detail.id,
                                detail.teacherId,
                                app.moment(tempDate).format('YYYY-MM-DD'),
                                detail.startTime,
                                detail.endTime,
                                detail.classroomId,
                                detail.courseName,
                                detail.number,
                                detail.duration,
                                detail.level,
                                '空闲',
                                '正式课程',
                                detail.termId
                            );
                        }
                        tempDate = tempDate.add(1, 'days');
                    }
                    if (num === 0) {
                        yield ctx.service.courseTableDetail.delete(detail.id)
                        return { code: 0, msg: '创建的周期内不包含' + dayOfWeek }
                    }
                    return { code: 1 };
                }, ctx);
                this.ctx.body = result;
            } *
            getById() {
                let result = yield this.ctx.service.courseTableDetail.getById(this.ctx.request.query.id)
                result.teacher = yield this.ctx.service.teacher.getById(result.teacherId)
                this.success(result)
            } *
            delete() {
                const id = this.ctx.request.body.id || 0;
                const info = yield this.ctx.service.courseTableDetail.getById(id);
                if (info == null) {
                    this.fail('未找到数据,请刷新页面重试');
                    return;
                }

                const students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(id);
                if (students.length > 0) {
                    // this.ctx.body = { result:false, msg:'当前课程下有学生，无法删除'};
                    this.fail('当前课程下有学生，无法删除');
                    return;
                }
                const ctx = this.ctx;
                yield app.mysql.beginTransactionScope(function*(conn) {
                    ctx.conn = conn;
                    yield ctx.service.courseTableDetail.delete(id);
                    yield ctx.service.courseTableItem.deleteByCourseTableDetailId(id);
                }, ctx);

                this.success();
                // this.ctx.body = { result: true };
            }

        /**
         * 获取老师的某学期排课信息
         */
        *
        getNumberOfChangeClassByCourseTableDetailIdAndStudentId() {
                let { courseTableDetailId, studentId } = this.ctx.request.query
                let o = yield this.ctx.service.courseTableDetailStudent.get(courseTableDetailId, studentId)
                this.success(o)
            } *
            getSuspendClassByStudentIdAndCourseTableDetailId() {
                let query = this.ctx.request.query
                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(query.courseTableDetailId, query.studentId)
                let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableDetailStudent.courseTableItemId)
                let suspendClass = {
                    courseTableDetailStudent,
                    courseTableItem
                }
                this.success(suspendClass)
            } *
            getInfo() {
                const termId = this.ctx.request.query.termId || 0;
                const teacherId = this.ctx.request.query.teacherId || 0;
                const term = yield this.ctx.service.term.getById(termId);
                // var courseTable = yield this.ctx.service.courseTable.getByTermIdAndTeacherId(termId, teacherId);
                const canEdit = true;
                // if(term.endDate > app.moment() && courseTable == null){
                //     canEdit = true;
                // }
                const details = yield this.ctx.service.courseTableDetail.getList(termId, teacherId);

                const details1 = [];
                for (let index = 1; index <= 7; index++) {
                    const dayOfWeek = app.moment.weekdays()[index % 7];
                    const obj = {
                        dayOfWeek,
                        list: [],
                    };
                    const list = app.lodash.filter(details, { dayOfWeek });
                    for (let j = 0; j < list.length; j++) {
                        const item = list[j];
                        // item.startTime = app.moment(item.startTime)._d;
                        // var course = yield this.ctx.service.course.getById(item.courseId);
                        // if (course) {
                        //     item.courseName = course.name;
                        // }
                        const classroom = yield this.ctx.service.classroom.getById(item.classroomId);
                        if (classroom) {
                            item.classroomName = classroom.name;
                        }
                        const students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(item.id);


                        item.students = [];
                        // if(canEdit){
                        //     canEdit = !(students.length>0);
                        // }

                        for (let k = 0; k < students.length; k++) {
                            const ss = yield this.ctx.service.student.getById(students[k].studentId);
                            item.students.push(ss);
                        }
                        obj.list.push(item);
                    }
                    details1.push(obj);
                }
                this.ctx.body = {
                    data: {
                        canEdit,
                        details: details1,
                    },
                };
            }
            /**
             * 获取老师排课列表
             */
            *
            getListByTeacherId() {
                const teacherId = this.ctx.request.query.teacherId || 0;
                const teacher = yield this.service.teacher.findById(teacherId);
                if (!teacher) {
                    this.fail('老师不存在');
                    return;
                }
                const details = yield this.service.courseTableDetail.getListByTeacherId(teacherId);

                const details1 = app.lodash.groupBy(details, 'termId');
                const list = [];
                for (const termId in details1) {
                    const term = yield this.service.term.getById(termId);
                    const minStartDate = app.lodash.maxBy(details1[termId], function(o) {
                        return o.startDate;
                    }).startDate;
                    const maxEndDate = app.lodash.minBy(details1[termId], function(o) {
                        return o.endDate;
                    }).endDate;

                    list.push({
                        term,
                        minStartDate,
                        maxEndDate,
                    });
                }
                this.success(list);
            } *
            getApplicableCourse() {
                if (!this.ctx.query.courseName) {
                    return this.fail('课程不能为空')
                }
                let result = yield this.ctx.service.courseTableDetail.getApplicableCourse()
                this.ctx.body = result
            } *
            getApplicableCourseByCourseNameAndTermId() {
                if (!this.ctx.query.courseName) {
                    return this.fail('课程不能为空')
                }
                if (!this.ctx.query.termId) {
                    return this.fail('学期不能为空')
                }
                let result = yield this.ctx.service.courseTableDetail.getApplicableCourseByCourseNameAndTermId(this.ctx.query.courseName, this.ctx.query.termId)
                this.success(result)
            } *
            getApplicableCourseByCourseNameAndTeacherNameAndTermId() {
                if (!this.ctx.query.courseName) {
                    return this.fail('课程不能为空')
                }
                if (!this.ctx.query.teacherName) {
                    return this.fail('教师姓名不能为空')
                }
                if (!this.ctx.query.termId) {
                    return this.fail('学期不能为空')
                }
                let result = yield this.ctx.service.courseTableDetail.getApplicableCourseByCourseNameAndTeacherNameAndTermId(this.ctx.query.courseName, this.ctx.query.teacherName, this.ctx.query.termId, this.ctx.query.studentId)
                this.success(result)
            } * getApplicableCourseByTermIdAndCourseNameAndTercherNameAndWeek() {
                if (!this.ctx.query.courseName) {
                    return this.fail('课程不能为空')
                }
                if (!this.ctx.query.teacherName) {
                    return this.fail('教师姓名不能为空')
                }
                if (!this.ctx.query.termId) {
                    return this.fail('学期不能为空')
                }
                if (!this.ctx.query.week) {
                    return this.fail('星期不能为空')
                }
                let result = yield this.ctx.service.courseTableDetail.getApplicableCourseByTermIdAndCourseNameAndTercherNameAndWeek(this.ctx.query.courseName, this.ctx.query.teacherName, this.ctx.query.termId, this.ctx.query.week)
                this.success(result)
            } * getTerm() {
                let result = yield this.ctx.service.term.getAll()
                this.success(result)
            } *
            getApplicableCourseByTermId() {
                let result = yield this.ctx.service.courseTableDetail.getApplicableCourseByTermId(this.ctx.query.termId, this.ctx.query.studentId)
                this.success(result)
            } *
            changeOpen() {

                let signUpCurriculum = yield this.ctx.service.signUpCurriculum.getListByState(this.ctx.request.body.id, '待确认')
                if (signUpCurriculum.length > 0) {
                    this.fail('该课程有学生报名待审核，无法取消')
                    return
                }
                yield this.ctx.service.courseTableDetail.changeOpen(this.ctx.request.body.id, this.ctx.request.body.openEnrollment)
                this.success();
            } *
            suspendClasses() {
                let body = this.ctx.request.body
                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(body.id)
                courseTableDetailStudent.courseTableItem = yield this.ctx.service.courseTableItem.getById(body.courseTableItemId)
                courseTableDetailStudent.courseTableItem = JSON.stringify(courseTableDetailStudent.courseTableItem)
                courseTableDetailStudent.status = '停课'
                courseTableDetailStudent.reasonsForSuspension = body.reasonsForSuspension
                yield this.ctx.service.courseTableDetailStudent.suspendClasses(courseTableDetailStudent)
                let signUpCurriculum = yield app.mysql.get('sign_up_curriculum', { id: courseTableDetailStudent.signUpCurriculumId })
                let aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailStudent.courseTableDetailId)
                let courseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByCourseTableDetailStudentIdAndOne(courseTableDetailStudent.id, 1)
                let endCourseTableItem = []
                let toCourseTableItem
                for (let item of courseTableChangeClassForTeacher) {
                    let fromCourseTableItem = item.fromCourseTableItemId
                    toCourseTableItem = item.toCourseTableItemId
                    let endToCourseTableItem
                    while (fromCourseTableItem) {
                        let courseTableChangeClassForTeacher1 = yield this.ctx.service.courseTableChangeClassForTeacher.getByCourseTableDetailStudentIdAndToCourseTableItemIdAndOne(courseTableDetailStudent.id, fromCourseTableItem, 0)
                        if (courseTableChangeClassForTeacher1) {
                            fromCourseTableItem = courseTableChangeClassForTeacher1.fromCourseTableItemId
                        } else {
                            endCourseTableItem.push(fromCourseTableItem)
                            fromCourseTableItem = 0
                        }
                    }
                }
                // if (courseTableChangeClassForTeacher) {

                // }
                let closingDateId
                for (let item of aCourseTableItem) {
                    /**
                     * 获取请假的id并且知道是不是大于停课的id
                     */
                    if (item.id == body.courseTableItemId) {
                        closingDateId = item.id
                    }
                    if (item.id < body.courseTableItemId) {
                        let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(item.id, courseTableDetailStudent.studentId, '正常')
                        if (courseTableItemStudent.length > 0) {
                            courseTableItemStudent[0].status = '停课'
                            yield this.ctx.service.courseTableItemStudent.update(courseTableItemStudent[0])
                        }
                    } else {
                        yield this.ctx.service.courseTableItemStudent.delete(item.id, courseTableDetailStudent.studentId)
                    }
                    if (courseTableChangeClassForTeacher) {
                        for (let item of endCourseTableItem) {
                            if (item < body.courseTableItemId) {
                                // let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(toCourseTableItem, courseTableDetailStudent.studentId, '正常')
                                // if (courseTableItemStudent.length > 0) {
                                //     courseTableItemStudent[0].status = '停课'
                                //     yield this.ctx.service.courseTableItemStudent.update(courseTableItemStudent[0])
                                // }
                            } else {
                                yield this.ctx.service.courseTableItemStudent.delete(toCourseTableItem, courseTableDetailStudent.studentId)
                            }
                        }

                    }
                }
                let courseTableItem = yield this.ctx.service.courseTableItem.getById(body.courseTableItemId)
                let aCourseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getChangeClassByCourseTableDetailIdAndStudentId(courseTableItem.courseTableDetailId, courseTableDetailStudent.studentId)
                for (let item of aCourseTableItemChangeCourse) {
                    let courseTableItem1 = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId)
                    let date1 = new Date(courseTableItem.date)
                    let date2 = new Date(courseTableItem1.date)
                    let time1 = new Date(date1.getFullYear() + '-' + (date1.getMonth() + 1) + "-" + date1.getDate()).getTime()
                    let time2 = new Date(date2.getFullYear() + '-' + (date2.getMonth() + 1) + "-" + date2.getDate()).getTime()
                    if (date2 > date1) {
                        courseTableDetailStudent.numberOfChangeClass++
                            yield this.ctx.service.courseTableDetailStudent.update(courseTableDetailStudent)
                        courseTableItem1.status = '空闲'
                        yield this.ctx.service.courseTableItem.update(courseTableItem1)
                        yield this.ctx.service.courseTableItemStudent.deleteByCourseTableItemIdAndStudentIdAndStatus(item.courseTableDetailItemId, courseTableDetailStudent.studentId)
                        yield this.ctx.service.courseTableItemChangeCourse.deleteId(item.id)
                    }
                }
                let student = yield this.ctx.service.student.getById(courseTableDetailStudent.studentId)
                let studentUser = yield this.ctx.service.user.getById(student.userId)
                let teacher = yield this.ctx.service.teacher.getById(courseTableItem.teacherId)
                let teacherUser = yield this.ctx.service.user.getById(teacher.userId)
                let closingCourseTableItem = yield this.ctx.service.courseTableItem.getById(closingDateId)
                let suspendClassesTime = app.moment(closingCourseTableItem.date).format('YYYY.MM.DD')
                yield this.ctx.service.wechat.suspendClasses(student.name, teacher.name, courseTableItem.courseName, suspendClassesTime, body.reasonsForSuspension, studentUser.publicOpenId, teacherUser.publicOpenId, student.id)
                this.success();
            } *
            transferTheClass() {
                let admin = this.ctx.cookies.get('adminname', {
                    encrypt: true, // 加密传输
                })
                let body = this.ctx.request.body
                if (!body.originalCourseTableDetailStudentId) {
                    this.fail('原课程周期不能为空')
                    return
                }
                if (!body.studentId) {
                    this.fail('学生不能为空')
                    return
                }
                if (!body.courseTableDetailId) {
                    this.fail('更改课程周期不能为空')
                    return
                }
                if (!body.reason) {
                    this.fail('更改课程周期不能为空')
                    return
                }
                if (!body.courseTableItemId) {
                    this.fail('请选择课程开始日期')
                    return
                }
                let student = yield this.ctx.service.student.getById(body.studentId)
                let user = yield this.ctx.service.user.findById(student.userId)
                let result = yield this.ctx.service.signUpCurriculum.saveCurriculum(body.studentId, body.courseTableDetailId, user.id, '已确认', app.moment().format('YYYY-MM-DD HH:mm'), body.specialRequirements)
                if (result) {
                    let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(body.originalCourseTableDetailStudentId)
                    courseTableDetailStudent.classTransferCourseTableDetailId = body.courseTableDetailId
                    courseTableDetailStudent.status = '转课'
                    courseTableDetailStudent.shiftReasons = body.reason
                    courseTableDetailStudent.shiftStartDate = JSON.stringify(yield this.ctx.service.courseTableItem.getById(body.courseTableItemId))
                    yield this.ctx.service.courseTableDetailStudent.update(courseTableDetailStudent)
                    let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(body.courseTableDetailId)
                    yield this.ctx.service.courseTableDetailStudent.classTransferAdd(body.studentId, body.courseTableDetailId, '正常', courseTableDetail.termId, body.originalCourseTableDetailStudentId, body.courseTableItemId)
                    let courseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(body.courseTableDetailId)
                    yield this.ctx.service.courseTableDetail.resetCurriculumCycle(body.courseTableDetailId, body.studentId, body.courseTableItemId, courseTableItem[courseTableItem.length - 1].id)
                    for (let item of courseTableItem) {
                        if (item.id >= body.courseTableItemId) {
                            yield this.ctx.service.courseTableItemStudent.add(item.id, body.studentId, '正常', item.termId)
                        }
                    }
                    let aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailStudent.courseTableDetailId)
                    for (let item of aCourseTableItem) {
                        let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(item.id, courseTableDetailStudent.studentId, '停课')
                        if (courseTableItemStudent.length != 0) {
                            courseTableItemStudent[0].status = '转课'
                            yield this.ctx.service.courseTableItemStudent.update(courseTableItemStudent[0])
                        }
                    }
                    let originalCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailStudent.courseTableDetailId)
                    let student = yield this.ctx.service.student.getById(courseTableDetailStudent.studentId)
                    let originalCourseInformation = originalCourseTableDetail.courseName + " " + app.moment(originalCourseTableDetail.startDate).format('YYYY.MM.DD') + "~" + app.moment(originalCourseTableDetail.endDate).format('YYYY.MM.DD') + " " + originalCourseTableDetail.dayOfWeek + " " + originalCourseTableDetail.startTime + "-" + originalCourseTableDetail.endTime
                    let nowCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(body.courseTableDetailId)
                    let nowCourseInformation = nowCourseTableDetail.courseName + " " + app.moment(nowCourseTableDetail.startDate).format('YYYY.MM.DD') + "~" + app.moment(nowCourseTableDetail.endDate).format('YYYY.MM.DD') + " " + nowCourseTableDetail.dayOfWeek + " " + nowCourseTableDetail.startTime + "-" + nowCourseTableDetail.endTime
                    let studentUser = yield this.ctx.service.user.getById(student.userId)
                    let teacher = yield this.ctx.service.teacher.getById(nowCourseTableDetail.teacherId)
                    let teacherUser = yield this.ctx.service.user.getById(teacher.userId)
                    yield this.ctx.service.wechat.transferTheClass(student.name, originalCourseInformation, nowCourseInformation, studentUser.publicOpenId, teacher.name, admin, teacherUser.publicOpenId, student.id)
                    this.success()
                } else {
                    this.fail('已经报过相关课程了')
                    return
                }

            } *
            getSuspension() {
                let coursrTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(this.ctx.request.body.id)
                let suspensionDate = JSON.parse(coursrTableDetailStudent.courseTableItem)
                let aCousrTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(coursrTableDetailStudent.courseTableDetailId)
                let aCousrTableItems = []
                for (let item of aCousrTableItem) {
                    let time1 = new Date(item.date).getTime()
                    let time2 = new Date(suspensionDate.date).getTime()
                    if (time1 >= time2) {
                        item.date = app.moment(item.date).format('YYYY-MM-DD')
                        aCousrTableItems.push(item)
                    }
                }
                let result = {
                    suspensionDate,
                    aCousrTableItems
                }
                this.success(result)
            } *
            getAllSuspensionAndClasstransfer() {
                let { pageIndex, limit, termId } = this.ctx.request.query
                let list = yield this.ctx.service.courseTableDetailStudent.getAllSuspensionAndClasstransfer(pageIndex, termId, limit)
                for (let item of list.list) {
                    item.courseTableItem = JSON.parse(item.courseTableItem)
                    item.shiftStartDate = JSON.parse(item.shiftStartDate)
                    item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId)
                    item.classTransferCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.classTransferCourseTableDetailId)
                }
                this.success(list)
            }

        *
        clearCourse() {
                if (!this.ctx.request.body.id) {
                    this.fail('清空开始日期不能为空')
                    return
                }
                if (!this.ctx.request.body.studentId) {
                    this.fail('学生不存在')
                    return
                }
                let courseTableItem = yield this.ctx.service.courseTableItem.getById(this.ctx.request.body.id)
                let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableItem.courseTableDetailId)
                courseTableDetail.endDate = app.moment(courseTableItem.date).subtract(1, 'days')
                courseTableDetail.endDate = app.moment(courseTableDetail.endDate).format('YYYY-MM-DD')
                courseTableDetail.clearCourse = "是"
                let aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetail.id)
                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItem.courseTableDetailId, this.ctx.request.body.studentId)
                let aCourseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByCourseTableDetailStudentId(courseTableDetailStudent.id)
                for (let item of aCourseTableChangeClassForTeacher) {
                    yield this.ctx.service.courseTableChangeClassForTeacher.deleteById(item.id)
                }
                for (let i = 0; i < aCourseTableItem.length; i++) {
                    if (aCourseTableItem[i].id >= this.ctx.request.body.id && aCourseTableItem[i].courseTableDetailId != 0) {
                        yield this.ctx.service.courseTableItem.deleteById(aCourseTableItem[i].id)
                        let aCourseTableItemLeave = yield this.ctx.service.courseTableItemLeave.getByCourseTableItemId(aCourseTableItem[i].id)
                        let aCourseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getListByCourseTableDetailItemId(aCourseTableItem[i].id)
                        for (let item of aCourseTableItemLeave) {
                            courseTableDetailStudent.numberOfleave++
                                yield this.ctx.service.courseTableDetailStudent.update(courseTableDetailStudent)
                            yield this.ctx.service.courseTableItemLeave.deleteId(item.id)
                        }
                        for (let item of aCourseTableItemChangeCourse) {
                            yield this.ctx.service.courseTableItemChangeCourse.deleteId(item.id)
                        }
                    }
                }
                yield this.ctx.service.courseTableDetail.update(courseTableDetail)
                yield this.ctx.service.courseTableItem.deleteById(this.ctx.request.body.id)
                this.success()
            } *
            getnLeaveLengthAndnChangeClassLengthBycourseTableItemId() {
                let courseTableItem = yield this.ctx.service.courseTableItem.getById(this.ctx.request.query.courseTableItemId)
                let aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableItem.courseTableDetailId)
                let aLeave = []
                let aChangeClass = []
                for (let item of aCourseTableItem) {
                    if (item.id >= this.ctx.request.query.courseTableItemId) {
                        let aCourseTableItemLeave = yield this.ctx.service.courseTableItemLeave.getByCourseTableItemId(item.id)
                        let aCourseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getListByCourseTableDetailItemId(item.id)
                        for (let i of aCourseTableItemLeave) {
                            aLeave.push(i)
                        }
                        for (let i of aCourseTableItemChangeCourse) {
                            aChangeClass.push(i)
                        }
                    }
                }
                this.success({
                    aLeave,
                    aChangeClass
                })
            }
    }
    return CourseTableDetailController;
};