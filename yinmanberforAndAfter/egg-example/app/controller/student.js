/**
 * Created by rhino on 2017-04-14.
 */
module.exports = app => {
    class StudentController extends app.Controller { *
        getByStudent() {
                var students = yield this.ctx.service.student.getByUserId(this.ctx.request.query.userId)
                this.ctx.body = students
            } *
            saveStudentInfo() {
                let { name, sex, dateOfBirth, school, parentName, telephone, address, basics, userId, introduceBaby } = this.ctx.request.body
                if (app.lodash.trim(name) == '') {
                    this.fail('学生姓名不能为空')
                    return
                }
                if (app.lodash.trim(sex) == "") {
                    this.fail('宝宝性别不能为空')
                    return
                }
                if (app.lodash.trim(dateOfBirth) == "") {
                    this.fail('出生日期不能空')
                    return
                }
                if (app.lodash.trim(school) == "") {
                    this.fail('学校不能为空')
                    return
                }
                if (app.lodash.trim(parentName) == "") {
                    this.fail('家长姓名不能为空')
                    return
                }
                if (!this.ctx.helper.isMobile(telephone)) {
                    this.fail('请输入正确的手机号码')
                    return
                }
                if (app.lodash.trim(address) == "") {
                    this.fail('家庭住址不能为空')
                    return
                }
                if (app.lodash.trim(basics) == "") {
                    this.fail('学习经历不能为空')
                    return
                }
                var students = yield this.service.student.getByUserId(userId);
                for (let s of students) {
                    if (s.name == name) {
                        this.fail('姓名重复');
                        return;
                    }
                }
                var now = app.moment();
                let result = yield this.ctx.service.student.add(name, sex, school, parentName, telephone, address, basics, app.lodash.trim(introduceBaby),
                    dateOfBirth, userId, now.format('YYYY-MM-DD HH:mm:ss'), now.format('YYYY-MM-DD HH:mm:ss'), 0, 0);
                this.ctx.body = {
                    code: 1,
                    msg: "添加成功",
                    data: result
                };
            } *
            updateStudentInfo() {
                if (!this.ctx.request.body.userInfo) {
                    this.fail('请传入数据');
                    return;
                }
                let { id, name, sex, dateOfBirth, school, parentName, telephone, address, basics, introduceBaby } = this.ctx.request.body.userInfo
                let student = yield this.ctx.service.student.getById(id);
                if (student == null) {
                    this.fail('学生不存在');
                    return;
                }
                if (app.lodash.trim(name) == '') {
                    this.fail('学生姓名不能为空')
                    return
                }
                if (app.lodash.trim(sex) == "") {
                    this.fail('宝宝性别不能为空')
                    return
                }
                if (app.lodash.trim(dateOfBirth) == "") {
                    this.fail('出生日期不能空')
                    return
                }
                if (app.lodash.trim(school) == "") {
                    this.fail('学校不能为空')
                    return
                }
                if (app.lodash.trim(parentName) == "") {
                    this.fail('家长姓名不能为空')
                    return
                }
                if (!this.ctx.helper.isMobile(telephone)) {
                    this.fail('请输入正确的手机号码')
                    return
                }
                if (app.lodash.trim(address) == "") {
                    this.fail('家庭住址不能为空')
                    return
                }
                if (app.lodash.trim(basics) == "") {
                    this.fail('学习经历不能为空')
                    return
                }
                var students = yield this.service.student.getByUserId(student.userId);
                for (let s of students) {
                    if (s.name == name && s.id != student.id) {
                        this.fail('姓名重复');
                        return;
                    }
                }
                introduceBaby = introduceBaby || '';
                Object.assign(student, { name, sex, dateOfBirth, school, parentName, telephone, address, basics, introduceBaby });

                var result = yield this.ctx.service.student.update(student);
                this.ctx.body = {
                    code: 1,
                    msg: '修改成功'
                };
            }
            /**
             * 获取学生报课信息
             */
            *
            getSignUpCourse() {
                var studentId = this.ctx.request.query.studentId;
                var termId = this.ctx.request.query.termId || 1;

                let term = yield this.service.term.getById(termId);
                var detailStudents = yield this.service.courseTableDetailStudent.getList(termId, studentId);
                console.log(detailStudents)
                var details = yield this.service.courseTableDetail.getByIds(app.lodash.map(detailStudents, 'courseTableDetailId'));
                var data = {
                    termId: term.id,
                    termName: term.name,
                    teachers: []
                };
                var teacherIds = app.lodash.union(app.lodash.map(details, 'teacherId'));
                //console.log(teacherIds);
                for (let teacherId of teacherIds) {
                    let teacher = yield this.service.teacher.getById(teacherId);
                    let detailsForTeacher = app.lodash.sortBy(app.lodash.filter(details, { teacherId: teacherId }), 'startTime');
                    let user = yield this.service.user.getById(teacher.userId);
                    let teacherObj = {
                        id: teacher.id,
                        name: teacher.name,
                        wxHead: user.wxHead,
                        list: []
                    };
                    for (let detail of detailsForTeacher) {
                        console.log(detail, 11)
                        let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(detail.id, studentId)
                        if (courseTableDetailStudent.courseTableItem) {
                            courseTableDetailStudent.closingDate = JSON.parse(courseTableDetailStudent.courseTableItem)
                            courseTableDetailStudent.closingDate.date = app.moment(courseTableDetailStudent.closingDate.date).format('YYYY-MM-DD')
                        }
                        if (courseTableDetailStudent.shiftStartDate) {
                            courseTableDetailStudent.reStartDate = JSON.parse(courseTableDetailStudent.shiftStartDate)
                            courseTableDetailStudent.reStartDate.date = app.moment(courseTableDetailStudent.reStartDate.date).format('YYYY-MM-DD')
                            courseTableDetailStudent.reCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailStudent.classTransferCourseTableDetailId)
                            courseTableDetailStudent.reCourseTableDetail.term = yield this.ctx.service.term.getById(courseTableDetailStudent.reCourseTableDetail.termId)
                            courseTableDetailStudent.reCourseTableDetail.teacher = yield this.ctx.service.term.getById(courseTableDetailStudent.reCourseTableDetail.teacherId)
                            courseTableDetailStudent.reCourseTableDetail.classroom = yield this.ctx.service.classroom.getById(courseTableDetailStudent.reCourseTableDetail.classroomId)
                            courseTableDetailStudent.reCourseTableDetail.startDate = app.moment(courseTableDetailStudent.reCourseTableDetail.startDate).format('YYYY-MM-DD')
                            courseTableDetailStudent.reCourseTableDetail.endDate = app.moment(courseTableDetailStudent.reCourseTableDetail.endDate).format('YYYY-MM-DD')
                        }
                        if (courseTableDetailStudent.startCourseTableItemId) {
                            courseTableDetailStudent.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableDetailStudent.startCourseTableItemId)
                            courseTableDetailStudent.startCourseTableItem.date = app.moment(courseTableDetailStudent.startCourseTableItem.date).format("YYYY-MM-DD")
                        }
                        let classroom = yield this.service.classroom.getById(detail.classroomId);
                        let comments = yield this.service.comment.getShowStudentLIst(studentId, teacher.id, detail.id);
                        for (let item of comments) {
                            item.createTime = app.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                        }
                        teacherObj.list.push({
                            id: detail.id,
                            dayOfWeek: detail.dayOfWeek,
                            startDate: this.ctx.helper.formatDate(detail.startDate),
                            endDate: this.ctx.helper.formatDate(detail.endDate),
                            courseName: detail.courseName,
                            startTime: detail.startTime,
                            endTime: detail.endTime,
                            number: detail.number,
                            level: detail.level,
                            classroomName: classroom.name,
                            comments: comments,
                            courseTableDetailStudent
                        });
                    }

                    data.teachers.push(teacherObj);
                }
                this.success(data);
            }

        /**
         * 获取报名的学期
         */
        *
        getSignUpTerms() {
                var studentId = this.ctx.request.query.studentId;
                var termIds = yield this.ctx.service.courseTableDetailStudent.getTermIds(studentId);
                var terms = yield this.ctx.service.term.getTerms(termIds);
                terms.forEach(item => {
                    item.startDate = this.ctx.helper.formatDate(item.startDate);
                    item.endDate = this.ctx.helper.formatDate(item.endDate);
                });
                // console.log(terms)
                for (let term of terms) {
                    let detailStudentList = yield this.service.courseTableDetailStudent.getList(term.id, studentId);
                    let details = [];
                    for (let detailStudent of detailStudentList) {
                        let detail = yield this.service.courseTableDetail.getById(detailStudent.courseTableDetailId);
                        let teacher = yield this.service.teacher.getById(detail.teacherId);
                        let classTransferCourseTableDetailId = yield this.ctx.service.courseTableDetail.getById(detailStudent.classTransferCourseTableDetailId)
                        if (detailStudent.startCourseTableItemId) {
                            let courseTableItem = yield this.ctx.service.courseTableItem.getById(detailStudent.startCourseTableItemId)
                            detail.startDate = app.moment(courseTableItem.date).format('YYYY-MM-DD')
                        }
                        let shiftStartDate
                        if (detailStudent.shiftStartDate) {
                            shiftStartDate = app.moment(JSON.parse(detailStudent.shiftStartDate).date).format('YYYY-MM-DD')
                        }

                        details.push({
                            id: detail.id,
                            teacherId: detail.teacherId,
                            teacherName: teacher.name,
                            courseName: detail.courseName,
                            dayOfWeek: detail.dayOfWeek,
                            startTime: detail.startTime,
                            endTime: detail.endTime,
                            number: detail.number,
                            level: detail.level,
                            startDate: detail.startDate,
                            endDate: detail.endDate,
                            state: detailStudent.status,
                            courseTableItem: JSON.parse(detailStudent.courseTableItem),
                            reasonsForSuspension: detailStudent.reasonsForSuspension,
                            shiftReasons: detailStudent.shiftReasons,
                            shiftStartDate: shiftStartDate,
                            classTransferCourseTableDetail: classTransferCourseTableDetailId,
                            numberOfChangeClass: detailStudent.numberOfChangeClass,
                            allNumberOfChangeClass: detailStudent.allNumberOfChangeClass,
                            numberOfleave: detailStudent.numberOfleave,
                            courseTableDetailId: detailStudent.courseTableDetailId,
                        });
                    }
                    term.details = details;
                }
                this.ctx.body = terms;
            }
            /**
             * 根据学期获取学生调课信息
             */
            *
            getCourseSwitch() {
                let termId = this.ctx.request.query.termId;
                let studentId = this.ctx.request.query.studentId;

                var list = yield this.service.courseTableItemSwitch.getStudentSwitchs(termId, studentId);
                console.log(list)
                for (let info of list) {
                    if (info == null) {
                        this.fail('数据不存在');
                        return;
                    }
                    info.createTime = app.moment(info.createTime).format('YYYY-MM-DD hh:mm:ss');
                    info.fromCourseTableItem = yield this.service.courseTableItem.findById(info.fromCourseTableItemId);
                    info.fromCourseTableItem.teacherName = (yield this.service.teacher.findById(info.fromCourseTableItem.teacherId)).name;
                    info.fromCourseTableItem.classroomName = (yield this.service.classroom.getById(info.fromCourseTableItem.classroomId)).name;
                    info.fromCourseTableItem.date = this.ctx.helper.formatDate(info.fromCourseTableItem.date);
                    info.fromCourseTableItem.startTime = this.ctx.helper.formatTime(info.fromCourseTableItem.startTime);
                    info.fromCourseTableItem.endTime = this.ctx.helper.formatTime(info.fromCourseTableItem.endTime);

                    info.toCourseTableItem = yield this.service.courseTableItem.findById(info.toCourseTableItemId);
                    info.toCourseTableItem.teacherName = (yield this.service.teacher.findById(info.toCourseTableItem.teacherId)).name;
                    info.toCourseTableItem.classroomName = (yield this.service.classroom.getById(info.toCourseTableItem.classroomId)).name;
                    info.toCourseTableItem.date = this.ctx.helper.formatDate(info.toCourseTableItem.date);
                    info.toCourseTableItem.startTime = this.ctx.helper.formatTime(info.toCourseTableItem.startTime);
                    info.toCourseTableItem.endTime = this.ctx.helper.formatTime(info.toCourseTableItem.endTime);
                    if (info.studentId > 0) {
                        info.student = yield this.service.student.getById(info.studentId);
                    }
                    if (info.teacherId > 0) {
                        info.teacher = yield this.service.teacher.getById(info.teacherId);
                    }
                }
                this.success(list);
            } *
            getById() {
                const result = yield this.ctx.service.student.getById(this.ctx.request.query.id)
                this.ctx.body = result
            } *
            deleteUser() {
                //console.log(this.ctx.request.body.id);
                let id = this.ctx.request.body.id || 0;
                let student = yield this.service.student.getById(id);
                console.log(student)
                if (student.sign_up == 1) {
                    this.fail('已报名成功，不能删除！');
                    return;
                }
                if (student == null) {
                    this.fail('学生不存在');
                    return;
                }
                if (student.userId != this.userId) {
                    this.fail('您没有操作权限');
                    return;
                }
                yield this.ctx.service.student.deleteUser(id);
                this.success();
            } *
            getNoReserved() {
                console.log(this.ctx.request.query)
                var result = yield this.ctx.service.student.getNoReserved(this.ctx.request.query.pageIndex, this.ctx.request.query.limit)
                this.ctx.body = result
            } *
            getNoReservedQuery() {
                console.log(this.ctx.request.body)
                var result = yield this.ctx.service.student.getNoReservedQuery(this.ctx.request.body.studentName, this.ctx.request.body.parentName, this.ctx.request.body.pageIndex, this.ctx.request.body.limit)
                this.ctx.body = result
            }
            /**
             *  前台学生调课时获取学生要调哪天的课
             */
            // *
            // getFreeListByCourseTableDetailId() {
            //     let courseTableDetailId = this.ctx.request.query.courseTableDetailId || 0;
            //     let studentId = this.ctx.request.query.studentId || 0;
            //     let detail = yield this.service.courseTableDetail.getById(courseTableDetailId);
            //     if (detail == null) {
            //         this.fail('未找到要调的课程信息');
            //         return;
            //     }
            //     detail.startDate = this.ctx.helper.formatDate(detail.startDate);
            //     detail.endDate = this.ctx.helper.formatDate(detail.endDate);
            //     detail.startTime = this.ctx.helper.formatTime(detail.startTime);
            //     detail.endTime = this.ctx.helper.formatTime(detail.endTime);
            //     detail.teacherName = (yield this.service.teacher.getById(detail.teacherId)).name;
            //     //供学生选择的要请假的时间
            //     let list = yield this.service.courseTableItem.getFreeListByCourseTableDetailId(courseTableDetailId);
            //     let aCourseTableItemStudent = []
            //     for (let item of list) {
            //         let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(item.id, studentId, '正常')
            //         if (courseTableItemStudent) {
            //             aCourseTableItemStudent.push(courseTableItemStudent)
            //         }
            //     }
            //     let courseTableItemChangeClass = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailIdAndStudentIdAndOne(courseTableDetailId, studentId, 1)
            //     for (let item of courseTableItemChangeClass) {
            //         let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(item.courseTableDetailItemId, studentId, '补课')
            //         if (courseTableItemStudent) {
            //             aCourseTableItemStudent.push(courseTableItemStudent)
            //         }
            //     }
            //     let aCourseTableItem = []
            //     for (let item of aCourseTableItemStudent) {
            //         let oCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableItemId)
            //         aCourseTableItem.push(oCourseTableItem)
            //     }
            //     aCourseTableItem.forEach(item => {
            //         item.date = this.ctx.helper.formatDate(item.date);
            //         item.startTime = this.ctx.helper.formatTime(item.startTime);
            //         item.endTime = this.ctx.helper.formatTime(item.endTime);
            //     });
            //     let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.get(courseTableDetailId, studentId);
            //     this.success({
            //         detail,
            //         courseTableItems: aCourseTableItem,
            //         courseTableDetailStudent
            //     });
            // }
            /**
             *  前台学生调课时获取学生要调哪天的课
             */
            *
            getFreeListByCourseTableDetailId() {
                let courseTableDetailId = this.ctx.request.query.courseTableDetailId || 0;
                let studentId = this.ctx.request.query.studentId || 0;
                let detail = yield this.service.courseTableDetail.getById(courseTableDetailId);
                if (detail == null) {
                    this.fail('未找到要调的课程信息');
                    return;
                }
                detail.startDate = this.ctx.helper.formatDate(detail.startDate);
                detail.endDate = this.ctx.helper.formatDate(detail.endDate);
                detail.startTime = this.ctx.helper.formatTime(detail.startTime);
                detail.endTime = this.ctx.helper.formatTime(detail.endTime);
                detail.teacherName = (yield this.service.teacher.getById(detail.teacherId)).name;
                //供学生选择的要请假的时间
                let list = yield this.service.courseTableItem.getFreeListByCourseTableDetailId(courseTableDetailId);
                let aCourseTableItemStudent = []
                for (let item of list) {
                    let courseTableItemStudent
                    let courseTableItemStudent1 = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(item.id, studentId, '正常')
                    if (courseTableItemStudent1) {
                        courseTableItemStudent = courseTableItemStudent1
                    }
                    let courseTableItemStudent2 = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(item.id, studentId, '停课')
                    if (courseTableItemStudent2) {
                        courseTableItemStudent = courseTableItemStudent2
                    }
                    let courseTableItemStudent3 = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(item.id, studentId, '转课')
                    if (courseTableItemStudent3) {
                        courseTableItemStudent = courseTableItemStudent3
                    }
                    if (courseTableItemStudent) {
                        aCourseTableItemStudent.push(courseTableItemStudent)
                    }
                }
                let courseTableItemChangeClass = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailIdAndStudentIdAndOne(courseTableDetailId, studentId, 1)
                for (let item of courseTableItemChangeClass) {
                    let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(item.courseTableDetailItemId, studentId, '补课')
                    if (courseTableItemStudent) {
                        aCourseTableItemStudent.push(courseTableItemStudent)
                    }
                }
                let aCourseTableItem = []
                for (let item of aCourseTableItemStudent) {
                    let oCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableItemId)
                    oCourseTableItem.courseTableItemStudentStatus = item.status
                    aCourseTableItem.push(oCourseTableItem)
                }
                aCourseTableItem.forEach(item => {
                    item.date = this.ctx.helper.formatDate(item.date);
                    item.startTime = this.ctx.helper.formatTime(item.startTime);
                    item.endTime = this.ctx.helper.formatTime(item.endTime);
                });
                aCourseTableItem.sort(function(a, b) {
                    let getTime1 = new Date(a.date + " " + a.startTime).getTime()
                    let getTime2 = new Date(b.date + " " + b.startTime).getTime()
                    return getTime1 - getTime2
                })
                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId);
                this.success({
                    detail,
                    courseTableItems: aCourseTableItem,
                    courseTableDetailStudent
                });
            }

        /**
         * 获取我要续课页面初始数据
         */
        *
        getRenewData() {
            let detailId = this.ctx.request.query.courseDetailId || 0;
            let studentId = this.ctx.request.query.studentId || 0;
            let detail = yield this.service.courseTableDetail.getById(detailId);
            if (detail == null) {
                this.fail('要续的课程不存在');
                return;
            }
            const nextTerm = yield this.service.term.getNext();
            console.log(nextTerm)
            if (nextTerm == null) {
                this.fail('还未创建下学期，无法续课');
                return;
            }
            //console.log(nextTerm);

            let teacher = yield this.service.teacher.getById(detail.teacherId);
            let teacherUser = yield this.service.user.getById(teacher.userId);
            detail.teacher = {
                name: teacher.name,
                wxHead: teacherUser.wxHead
            };
            let classroom = yield this.service.classroom.getById(detail.classroomId);
            detail.classroomName = classroom.name;

            detail.startTime = this.ctx.helper.formatTime(detail.startTime);
            detail.endTime = this.ctx.helper.formatTime(detail.endTime);

            detail.startDate = this.ctx.helper.formatDate(detail.startDate);
            detail.endDate = this.ctx.helper.formatDate(detail.endDate);

            let nextDetails = yield this.service.courseTableDetail.getListForRenew(detail.courseName, detail.number, detail.duration, detail.teacherId,
                nextTerm.id);
            for (let nDetail of nextDetails) {
                nDetail.startTime = this.ctx.helper.formatTime(nDetail.startTime);
                nDetail.endTime = this.ctx.helper.formatTime(nDetail.endTime);

                nDetail.startDate = this.ctx.helper.formatDate(nDetail.startDate);
                nDetail.endDate = this.ctx.helper.formatDate(nDetail.endDate);
            }

            // let nextDetail = yield this.service.courseTableDetail.getFreeForStudent(detail.courseName, detail.number, detail.duration, detail.teacherId,
            //     nextTerm.id, detail.dayOfWeek, detail.startTime, detail.endTime);
            // let result = { detail:nextDetail, hasSignUp:false, canSignUp:false };
            // if(nextDetail != null){
            //     nextDetail.startTime = this.ctx.helper.formatTime(nextDetail.startTime);
            //     nextDetail.endTime = this.ctx.helper.formatTime(nextDetail.endTime);

            //     nextDetail.startDate = this.ctx.helper.formatDate(nextDetail.startDate);
            //     nextDetail.endDate = this.ctx.helper.formatDate(nextDetail.endDate);

            //     result.hasSignUp = yield this.service.courseTableDetailStudent.hasSignUp(nextDetail.id, studentId);
            //     result.canSignUp = result.hasSignUp == false && nextDetail.state == '空闲';
            // }
            // result.renews = yield this.service.renew.getList(detail.id, studentId);

            let renew = yield this.service.renew.get(detail.id, studentId);

            this.success({
                detail,
                details: nextDetails,
                renew: renew
            });
        }

        /**
         * 添加续课报名信息
         */
        *
        _addSignUp(courseDetailId, studentId) {
            // const courseDetailId = this.ctx.request.body.courseDetailId || 0;
            // const studentId = this.ctx.request.body.studentId || 0;
            const ctx = this.ctx;

            const result = yield app.mysql.beginTransactionScope(function*(conn) {
                ctx.conn = conn;
                let student = yield ctx.service.student.getById(studentId);
                if (student == null) {
                    return {
                        code: 0,
                        msg: "学生不存在",
                    };
                }
                let user = yield ctx.service.user.getById(student.userId);
                const detail = yield ctx.service.courseTableDetail.findById(courseDetailId);
                if (detail == null) {
                    return {
                        code: 0,
                        msg: '课程不存在'
                    };
                }
                const detailStudent = yield ctx.service.courseTableDetailStudent.get(detail.id, studentId);
                if (detailStudent != null) {
                    // this.ctx.body = `该老师的${detail.courseName}课已报过名`
                    return {
                        code: 0,
                        msg: `该老师的${detail.courseName}课已报过名`
                    };
                }
                // var students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(detail.id);
                if (detail.status == '') {
                    const msg = `该老师的${detail.courseName}课已满`;
                    return {
                        code: 0,
                        msg: msg,
                    };
                }
                yield ctx.service.courseTableDetailStudent.add(
                    studentId,
                    item.id,
                    '正常',
                    detail.termId);
                const items = yield ctx.service.courseTableItem.getByCourseTableDetailId(detail.id);
                for (const ii of items) {
                    yield ctx.service.courseTableItemStudent.add(
                        ii.id,
                        studentId,
                        '正常',
                        detail.termId
                    );
                }
            });
            this.body = result;
        }

        *
        addRenew() {
            const courseDetailId = this.ctx.request.body.courseDetailId || 0;
            const studentId = this.ctx.request.body.studentId || 0;
            const times = this.ctx.request.body.times || '';
            if (times.length > 0) {
                //console.log(times);
                //times = JSON.parse(times);
                if (!app.lodash.isArray(times)) {
                    this.fail('时间格式错误');
                    return;
                }
                for (let i = 0; i < times.length; i++) {
                    if (!times[i].dayOfWeek || !times[i].startTime || !times[i].endTime) {
                        this.fail('时间格式错误');
                        return;
                    }
                }
            }

            const detail = yield this.service.courseTableDetail.findById(courseDetailId);
            if (detail == null) {
                this.fail('课程不存在');
                return;
            }
            const renew = yield this.service.renew.get(courseDetailId, studentId);
            if (renew != null) {
                this.fail('您已经报名了，无法重复报名');
                return;
            }
            const nextTerm = yield this.service.term.getNext();
            if (nextTerm == null) {
                this.fail('还未创建下学期，无法续课');
                return;
            }
            yield this.service.renew.add(nextTerm.id, courseDetailId, studentId, times);
            //item.dayOfWeek, item.startTime, item.endTime, 

            this.success();


        }
    }
    return StudentController;
};