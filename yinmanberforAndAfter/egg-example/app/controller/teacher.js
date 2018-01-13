'use strict';

module.exports = app => {
    class TeacherController extends app.Controller { *
        update() {
            let teacherInfo = this.ctx.request.body.teacherInfo
            if (app.lodash.trim(teacherInfo.name) == '') {
                this.fail('教师姓名不能为空')
                return
            }
            if (app.lodash.trim(teacherInfo.sex) == "") {
                this.fail('性别不能为空')
                return
            }
            if (app.lodash.trim(teacherInfo.dateOfBirth) == "") {
                this.fail('出生日期不能空')
                return
            }
            if (!this.ctx.helper.isMobile(teacherInfo.phoneNumber)) {
                this.fail('请输入正确的手机号码')
                return
            }
            var teacher = yield this.ctx.service.teacher.getById(teacherInfo.id);
            if (!teacher.id) {
                this.fail('老师不存在')
                return
            }
            console.log(app.moment(teacherInfo.createTime).format('YYYY-MM-DD HH:mm:ss'))
            teacher.name = teacherInfo.name;
            teacher.sex = teacherInfo.sex;
            teacher.dateOfBirth = teacherInfo.dateOfBirth;
            teacher.phoneNumber = teacherInfo.phoneNumber;
            teacher.createTime = app.moment(teacherInfo.createTime).format('YYYY-MM-DD HH:mm:ss');
            teacher.upDateTime = app.moment().format('YYYY-MM-DD HH:mm:ss');
            //teacher.updateTime = new Date();
            yield this.ctx.service.teacher.update(teacher);
            this.success();
        }

        *
        getAll() {
                var teachers = yield this.ctx.service.teacher.getAll();
                const result = []
                for (var i = 0; i < teachers.length; i++) {
                    const user = yield this.ctx.service.user.getById(teachers[i].userId)
                    result.push({ teacher: teachers[i], user: user })
                }
                this.ctx.body = result;
            } *
            getList() {
                const result = yield this.ctx.service.teacher.getList(this.ctx.request.query.page, this.ctx.request.query.limit)
                this.ctx.body = result
            } *
            getById() {
                var teacher = yield this.ctx.service.teacher.getById(this.ctx.request.query.id);

                if (teacher) {
                    teacher.professorCourse = teacher.professorCourse || '';
                    this.ctx.body = teacher;
                } else {
                    this.ctx.body = "没有当前老师"
                }

            } *
            query() {
                console.log(this.ctx.request.body)
                const body = this.ctx.request.body
                const result = yield this.ctx.service.teacher.query(body.teacherName, body.professorCourse, body.telephone, body.pageIndex, body.limit);
                this.ctx.body = result
            } *
            getByUserId() {
                let info = yield this.ctx.service.teacher.getByUserId(this.ctx.request.query.userId);
                if (!info) {
                    this.fail('未找到老师');
                    return;
                }
                this.success(info);
            }

        /**
         * 获取老师有排课的学期列表
         */
        *
        getTerms() {
            let teacherId = this.ctx.request.query.teacherId || 0;
            var teacher = yield this.service.teacher.findById(teacherId);
            if (!teacher) {
                this.fail('老师不存在');
                return;
            }
            var details = yield this.service.courseTableDetail.getListByTeacherId(teacherId);

            var details1 = app.lodash.groupBy(details, 'termId');
            var list = [];
            let now = app.moment().hours(0).minutes(0).seconds(0).millisecond(0);
            for (let termId in details1) {
                let term = yield this.service.term.getById(termId);
                var minStartDate = app.lodash.maxBy(details1[termId], function(o) {
                    return o.startDate;
                }).startDate;
                var maxEndDate = app.lodash.minBy(details1[termId], function(o) {
                    return o.endDate;
                }).endDate;

                let startDate = app.moment(term.startDate);
                let endDate = app.moment(term.endDate);

                var tempDate = app.moment(startDate);
                let days = app.moment(term.endDate).diff(term.startDate, 'days');
                var index = 0;
                var weeks = [];
                for (let i = 0; i <= days; i++) {
                    tempDate = app.moment(startDate).add(i, 'day');
                    if (tempDate.format('YYYY-MM-DD') == startDate.format('YYYY-MM-DD') || tempDate.weekday() == 0) {
                        index++;
                        let endDate = app.moment(tempDate).weekday(6);
                        if (endDate > endDate) {
                            endDate = app.moment(endDate);
                        }
                        //console.log(now, tempDate, endDate);
                        weeks.push({
                            lable: "第" + index + "周",
                            startDate: this.ctx.helper.formatDate(tempDate),
                            endDate: this.ctx.helper.formatDate(endDate),
                            current: now >= tempDate && now <= endDate
                        });
                    }
                }

                list.push({
                    id: term.id,
                    name: term.name,
                    startDate: this.ctx.helper.formatDate(term.startDate),
                    endDate: this.ctx.helper.formatDate(term.endDate),
                    minStartDate: this.ctx.helper.formatDate(minStartDate),
                    maxEndDate: this.ctx.helper.formatDate(maxEndDate),
                    weeks
                });
            }
            this.success(list);
        }

        /**
         * 根据学期获取老师调课信息
         */
        *
        getCourseSwitch() {
            let termId = this.ctx.request.query.termId;
            let teacherId = this.ctx.request.query.teacherId;

            let list = yield this.service.courseTableChangeClassForTeacher.getListByTeacherIdAndtermId(termId, teacherId);
            for (let info of list) {
                if (info == null) {
                    this.fail('数据不存在');
                    return;
                }
                info.fromCourseTableItem = yield this.ctx.service.courseTableItem.findById(info.fromCourseTableItemId);
                info.fromCourseTableItem.teacherName = (yield this.ctx.service.teacher.findById(info.fromCourseTableItem.teacherId)).name;
                info.fromCourseTableItem.classroomName = (yield this.ctx.service.classroom.getById(info.fromCourseTableItem.classroomId)).name;
                info.toCourseTableItem = yield this.ctx.service.courseTableItem.findById(info.toCourseTableItemId);
                info.toCourseTableItem.teacherName = (yield this.ctx.service.teacher.findById(info.toCourseTableItem.teacherId)).name;
                info.toCourseTableItem.classroomName = (yield this.ctx.service.classroom.getById(info.toCourseTableItem.classroomId)).name;
                info.fromCourseTableItem.date = app.moment(info.fromCourseTableItem.date).format('YYYY-MM-DD')
                info.toCourseTableItem.date = app.moment(info.toCourseTableItem.date).format('YYYY-MM-DD')
                if (info.studentId > 0) {
                    info.student = yield this.ctx.service.student.getById(info.studentId);
                }
                if (info.teacherId > 0) {
                    info.teacher = yield this.ctx.service.teacher.findById(info.teacherId);
                }
            }
            this.success(list);
        }

        /**
         * 获取老师的某学期排课信息
         */
        *
        getCourseDetails() {
            var termId = this.ctx.request.query.termId || 0;
            var teacherId = this.ctx.request.query.teacherId || 0;
            var term = yield this.ctx.service.term.getById(termId);
            //var courseTable = yield this.ctx.service.courseTable.getByTermIdAndTeacherId(termId, teacherId);
            var canEdit = true;
            // if(term.endDate > app.moment() && courseTable == null){
            //     canEdit = true;
            // }
            var details = yield this.ctx.service.courseTableDetail.getList(termId, teacherId);
            var details1 = [];
            for (var index = 1; index <= 7; index++) {
                let dayOfWeek = app.moment.weekdays()[index % 7];
                var obj = {
                    dayOfWeek: dayOfWeek,
                    list: []
                };
                let list = app.lodash.filter(details, { 'dayOfWeek': dayOfWeek });
                for (var j = 0; j < list.length; j++) {
                    var item = list[j];
                    //item.startTime = app.moment(item.startTime)._d;
                    // var course = yield this.ctx.service.course.getById(item.courseId);
                    // if (course) {
                    //     item.courseName = course.name;
                    // }
                    var classroom = yield this.ctx.service.classroom.getById(item.classroomId);
                    if (classroom) {
                        item.classroomName = classroom.name;
                    }
                    var students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(item.id);


                    item.students = [];

                    for (var k = 0; k < students.length; k++) {
                        var ss = yield this.ctx.service.student.getById(students[k].studentId);
                        item.students.push(ss);
                    }
                    item.course = yield this.ctx.service.course.getByName(item.courseName)
                    let aSignUpInfo = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumIdAndState(item.id)
                    item.aSignUpStudent = []
                    item.courseTableDetailStudent = []
                    for (let it of aSignUpInfo) {
                        let student = yield this.ctx.service.student.getById(it.studentId)
                        let resetCurriculumCycle = yield this.ctx.service.courseTableDetail.getByCourseTableDetailIdAndStudentId(item.id, it.studentId)
                        let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getCourseTableDetailStudentByCouseTableDetailIdAndStudentId(item.id, it.studentId)
                        item.courseTableDetailStudent.push(courseTableItemStudent[0])
                        if (resetCurriculumCycle) {
                            let startDate = yield this.ctx.service.courseTableItem.getById(resetCurriculumCycle.startDateId)
                            let endDate
                            endDate = yield this.ctx.service.courseTableItem.getById(resetCurriculumCycle.endDateId)
                            console.log(startDate)
                            if (!endDate) {
                                let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(startDate.courseTableDetailId)
                                item.aSignUpStudent.push({ studentId: student.id, name: student.name, startDate: startDate.date, endDate: courseTableDetail.endDate })
                            } else {
                                item.aSignUpStudent.push({ studentId: student.id, name: student.name, startDate: startDate.date, endDate: endDate.date })
                            }

                        } else {
                            item.aSignUpStudent.push({ studentId: student.id, name: student.name, startDate: '', endDate: '' })
                        }
                    }
                    obj.list.push(item);
                }
                obj.list.sort(function(a, b) {
                    let getTime1 = new Date(app.moment().format("YYYY-MM-DD") + " " + a.startTime).getTime()
                    let getTime2 = new Date(app.moment().format("YYYY-MM-DD") + " " + b.startTime).getTime()
                    return getTime1 - getTime2
                })
                details1.push(obj);
            }

            this.ctx.body = {
                data: {
                    canEdit,
                    details: details1
                }
            }
        }

        /**
         * 获取某学期老师的学生信息
         */
        *
        getStudents() {
            var termId = this.ctx.request.query.termId || 0;
            var teacherId = this.ctx.request.query.teacherId || 0;
            var term = yield this.ctx.service.term.getById(termId);
            var list = yield this.service.courseTableDetailStudent.getStudents(termId, teacherId);
            console.log(list)
            var result = [];
            for (let detailStudent of list) {
                let detail = yield this.service.courseTableDetail.getById(detailStudent.courseTableDetailId);
                detail.classroomName = (yield this.service.classroom.getById(detail.classroomId)).name;
                detail.startDate = this.ctx.helper.formatDate(detail.startDate);
                detail.endDate = this.ctx.helper.formatDate(detail.endDate);
                detail.startTime = this.ctx.helper.formatTime(detail.startTime);
                detail.endTime = this.ctx.helper.formatTime(detail.endTime);
                detail.courseTableItem = yield this.ctx.service.courseTableItem.getById(detailStudent.courseTableItemId)
                detail.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(detailStudent.startCourseTableItemId)
                detail.courseTableDetail = yield this.service.courseTableDetail.getById(detailStudent.classTransferCourseTableDetailId);
                if (detailStudent.courseTableItem) {
                    detail.courseTableItem = JSON.parse(detailStudent.courseTableItem)
                    detail.courseTableItem.date = app.moment(detail.courseTableItem.date).format('YYYY-MM-DD')
                }
                if (detail.startCourseTableItem) {
                    detail.startCourseTableItem.date = this.ctx.helper.formatDate(detail.startCourseTableItem.date);
                }
                if (detail.courseTableDetail) {
                    if (detailStudent.shiftStartDate) {
                        detail.courseTableDetail.startDate = app.moment(JSON.parse(detailStudent.shiftStartDate).date).format("YYYY-MM-DD");
                    } else {
                        detail.courseTableDetail.startDate = this.ctx.helper.formatDate(detail.courseTableDetail.startDate);
                    }
                    detail.courseTableDetail.endDate = this.ctx.helper.formatDate(detail.courseTableDetail.endDate);
                    detail.courseTableDetail.startTime = this.ctx.helper.formatTime(detail.courseTableDetail.startTime);
                    detail.courseTableDetail.endTime = this.ctx.helper.formatTime(detail.courseTableDetail.endTime);
                }
                let student = yield this.service.student.getById(detailStudent.studentId);
                student.wxHead = (yield this.service.user.getById(student.userId)).wxHead;
                student.courseDetail = detail;
                student.status = detailStudent.status
                student.comments = yield this.service.comment.getList(student.id, detail.id);
                student.comments.forEach(comment => {
                    comment.createTime = app.moment(comment.createTime).format('YYYY-MM-DD hh:mm:ss');
                });
                result.push(student);
            }
            this.success(result);
        }

        *
        getStudentsByDetailId() {
                let detailId = this.ctx.request.query.detailId || 0;

                let detail = yield this.service.courseTableDetail.getById(detailId);
                if (detail == null) {
                    this.fail('课程信息不存在');
                    return;
                }
                detail.startDate = this.ctx.helper.formatDate(detail.startDate);
                detail.endDate = this.ctx.helper.formatDate(detail.endDate);
                detail.startTime = this.ctx.helper.formatTime(detail.startTime);
                detail.endTime = this.ctx.helper.formatTime(detail.endTime);
                detail.classroomName = (yield this.service.classroom.getById(detail.classroomId)).name;

                let detailStudents = yield this.service.courseTableDetailStudent.getByCourseTableDetailId(detailId, '正常');

                var students = [];
                for (let item of detailStudents) {
                    var student = yield this.service.student.getById(item.studentId);
                    if (student == null) continue;
                    var user = yield this.service.user.getById(student.userId);

                    students.push({
                        id: student.id,
                        name: student.name,
                        wxHead: user.wxHead,
                    });
                }

                this.success({
                    detail: detail,
                    students
                })
            }
            /**
             * 获取某节课的信息
             */
            *
            getStudentsByItemId() {
                let detailId = this.ctx.request.query.itemId || 0;

                let detail = yield this.service.courseTableItem.getById(detailId);
                if (detail == null) {
                    this.fail('课程信息不存在');
                    return;
                }
                let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(detail.courseTableDetailId)
                detail.date = this.ctx.helper.formatDate(detail.date);
                if (courseTableDetail) {
                    detail.startDate = this.ctx.helper.formatDate(courseTableDetail.startDate);
                    detail.endDate = this.ctx.helper.formatDate(courseTableDetail.endDate);
                }
                detail.startTime = this.ctx.helper.formatTime(detail.startTime);
                detail.endTime = this.ctx.helper.formatTime(detail.endTime);
                detail.classroomName = (yield this.service.classroom.getById(detail.classroomId)).name;
                let teacher = yield this.service.teacher.getById(detail.teacherId);
                detail.teacherName = teacher.name;
                let teacherUser = yield this.service.user.getById(teacher.userId);
                detail.teacherWxHead = teacherUser.wxHead;

                let itemsStudents = yield this.service.courseTableItemStudent.getByCourseTableItemId(detailId, '正常');
                let itemsStudents1 = yield this.service.courseTableItemStudent.getByCourseTableItemId(detailId, '补课');
                let itemsStudents2 = yield this.service.courseTableItemStudent.getByCourseTableItemId(detailId, '停课');
                let itemsStudents3 = yield this.service.courseTableItemStudent.getByCourseTableItemId(detailId, '转课');
                let itemsStudents4 = []
                if (detail.type == '预约试课') {
                    itemsStudents4 = yield this.ctx.service.bookingCourse.getByCourseTableItemId1(detail.id)
                }
                itemsStudents = itemsStudents.concat(itemsStudents1, itemsStudents2, itemsStudents3, itemsStudents4)
                console.log(itemsStudents, 1111)
                var students = [];
                for (let item of itemsStudents) {
                    var student = yield this.service.student.getById(item.studentId);
                    if (student == null) continue;
                    var user = yield this.service.user.getById(student.userId);
                    students.push({
                        id: student.id,
                        name: student.name,
                        wxHead: user.wxHead,
                        status: item.status
                    });
                }
                this.success({
                    detail: detail,
                    students
                });
            }
    }
    return TeacherController;
};