module.exports = app => {
    /**
     * 调课相关方法
     */
    class courseTableChangeClassForTeacherController extends app.Controller {
        /**
         * 添加老师调课信息
         */
        *
        addChangeClass() {
                let { fromCourseTableItemId, toCourseTableItemId, reason, teacherId } = this.ctx.request.body
                let courseTableItem = yield this.ctx.service.courseTableItem.getById(fromCourseTableItemId)
                    //获取源信息
                let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave(fromCourseTableItemId)
                console.log(courseTableItemStudent)
                    //当前老师调课的信息学生正常，老师正常
                if (courseTableItemStudent.status == '正常' && !courseTableItemStudent.teacherStatus) {
                    //获取学生报名表的课程
                    let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItem.courseTableDetailId, courseTableItemStudent.studentId)
                    if (courseTableDetailStudent.allNumberOfChangeClassForTeacher == 0) {
                        this.fail('教师调课次数已满')
                        return
                    }
                    //添加调课新的课程信息
                    yield this.ctx.service.courseTableItemStudent.add(toCourseTableItemId, courseTableItemStudent.studentId, courseTableItemStudent.status, courseTableItemStudent.termId, courseTableDetailStudent.id)
                        //修改旧的信息学生状态为请假因为课程表根据是不是请假获取信息
                    courseTableItemStudent.status = '请假'
                    yield this.ctx.service.courseTableItemStudent.update(courseTableItemStudent)
                        //添加老师调课记录
                    yield this.ctx.service.courseTableChangeClassForTeacher.add(courseTableDetailStudent.id, fromCourseTableItemId, toCourseTableItemId, reason, 1, teacherId)
                    courseTableDetailStudent.allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher - 1
                        //原来的课变成空闲
                    courseTableItem.status = '教师调课'
                    yield this.ctx.service.courseTableItem.update(courseTableItem)
                    yield this.ctx.service.courseTableDetailStudent.update(courseTableDetailStudent)
                    yield sendChageClass(this, courseTableDetailStudent)
                    this.success()
                        //当前老师调课的信息学生正常，老师补课
                } else if (courseTableItemStudent.status == '正常' && courseTableItemStudent.teacherStatus) {
                    //获取老师调课的信息
                    let courseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByToCourseTableItemIdAndOne(fromCourseTableItemId, 1)
                        //获取源信息
                    let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(courseTableChangeClassForTeacher.courseTableDetailStudentId)
                    if (courseTableDetailStudent.allNumberOfChangeClassForTeacher == 0) {
                        this.fail('教师调课次数已满')
                        return
                    }
                    //添加调课新的课程信息
                    yield this.ctx.service.courseTableItemStudent.add(toCourseTableItemId, courseTableItemStudent.studentId, courseTableItemStudent.status, courseTableItemStudent.termId, courseTableDetailStudent.id)
                        //修改旧的信息学生状态为请假因为课程表根据是不是请假获取信息
                    courseTableItemStudent.status = '请假'
                    yield this.ctx.service.courseTableItemStudent.update(courseTableItemStudent)
                        //调课记录的唯一性
                    courseTableChangeClassForTeacher.one = 0
                        //更新原来调课的信息
                    yield this.ctx.service.courseTableChangeClassForTeacher.update(courseTableChangeClassForTeacher)
                        //添加老师调课记录
                    yield this.ctx.service.courseTableChangeClassForTeacher.add(courseTableDetailStudent.id, fromCourseTableItemId, toCourseTableItemId, reason, 1, teacherId)
                    courseTableDetailStudent.allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher - 1
                        //原来的课变成空闲
                    courseTableItem.status = '教师调课'
                    yield this.ctx.service.courseTableItem.update(courseTableItem)
                    yield this.ctx.service.courseTableDetailStudent.update(courseTableDetailStudent)
                    yield sendChageClass(this, courseTableDetailStudent)
                    this.success()
                        //学生补课，老师正常
                } else if (courseTableItemStudent.status == '补课' && !courseTableItemStudent.teacherStatus) {

                    //学生调课信息
                    let courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(fromCourseTableItemId, courseTableItemStudent.studentId, 1)
                        //获取源信息
                    let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, courseTableItemStudent.studentId)
                    console.log(courseTableItemChangeCourse)
                    if (courseTableDetailStudent.allNumberOfChangeClassForTeacher == 0) {
                        this.fail('教师调课次数已满')
                        return
                    }
                    //添加调课新的课程信息
                    yield this.ctx.service.courseTableItemStudent.add(toCourseTableItemId, courseTableItemStudent.studentId, courseTableItemStudent.status, courseTableItemStudent.termId, courseTableDetailStudent.id)
                        //修改旧的信息学生状态为请假因为课程表根据是不是请假获取信息
                    courseTableItemStudent.status = '请假'
                    yield this.ctx.service.courseTableItemStudent.update(courseTableItemStudent)
                        //添加老师调课记录
                    yield this.ctx.service.courseTableChangeClassForTeacher.add(courseTableDetailStudent.id, fromCourseTableItemId, toCourseTableItemId, reason, 1, teacherId)
                    courseTableDetailStudent.allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher - 1
                        //把学生原来的补课改成现在课
                    courseTableItemChangeCourse.courseTableDetailItemId = toCourseTableItemId
                    yield this.ctx.service.courseTableItemChangeCourse.update(courseTableItemChangeCourse)
                        //原来的课变成空闲
                    courseTableItem.status = '教师调课'
                    yield this.ctx.service.courseTableItem.update(courseTableItem)
                    yield this.ctx.service.courseTableDetailStudent.update(courseTableDetailStudent)
                    yield sendChageClass(this, courseTableDetailStudent)
                    this.success()
                        //学生补课，老师补课
                } else if (courseTableItemStudent.status == '补课' && courseTableItemStudent.teacherStatus) {
                    //学生调课信息
                    let courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(fromCourseTableItemId, courseTableItemStudent.studentId, 1)
                        //获取老师调课的信息
                    let courseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByToCourseTableItemIdAndOne(fromCourseTableItemId, 1)
                        //获取源信息
                    let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, courseTableItemStudent.studentId)

                    if (courseTableDetailStudent.allNumberOfChangeClassForTeacher == 0) {
                        this.fail('教师调课次数已满')
                        return
                    }
                    //添加调课新的课程信息
                    yield this.ctx.service.courseTableItemStudent.add(toCourseTableItemId, courseTableItemStudent.studentId, courseTableItemStudent.status, courseTableItemStudent.termId, courseTableDetailStudent.id)
                        //修改旧的信息学生状态为请假因为课程表根据是不是请假获取信息
                    courseTableItemStudent.status = '请假'
                    yield this.ctx.service.courseTableItemStudent.update(courseTableItemStudent)
                        //添加老师调课记录
                    yield this.ctx.service.courseTableChangeClassForTeacher.add(courseTableDetailStudent.id, fromCourseTableItemId, toCourseTableItemId, reason, 1, teacherId)
                    courseTableDetailStudent.allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher - 1
                        //调课记录的唯一性
                    courseTableChangeClassForTeacher.one = 0
                        //更新原来调课的信息
                    yield this.ctx.service.courseTableChangeClassForTeacher.update(courseTableChangeClassForTeacher)
                        //把学生原来的补课改成现在课
                    courseTableItemChangeCourse.courseTableDetailItemId = toCourseTableItemId
                    yield this.ctx.service.courseTableItemChangeCourse.update(courseTableItemChangeCourse)
                        //原来的课变成空闲
                    courseTableItem.status = '教师调课'
                    yield this.ctx.service.courseTableItem.update(courseTableItem)
                    yield this.ctx.service.courseTableDetailStudent.update(courseTableDetailStudent)
                    yield sendChageClass(this, courseTableDetailStudent)
                    this.success()
                } else {
                    this.fail('没有找到数据')
                }

                function* sendChageClass(This, courseTableDetailStudent) {
                    let fromCourseTableItem = yield This.ctx.service.courseTableItem.getById(fromCourseTableItemId)
                    let toCourseTableItem = yield This.ctx.service.courseTableItem.getById(toCourseTableItemId)
                    let student = yield This.ctx.service.student.getById(courseTableDetailStudent.studentId)
                    let studentUser = yield This.ctx.service.user.getById(student.userId)
                    let oldTeacher = yield This.ctx.service.teacher.getById(fromCourseTableItem.teacherId)
                    let oldClassTime = app.moment(fromCourseTableItem.date).format('YYYY.MM.DD') + " " + fromCourseTableItem.startTime + "-" + fromCourseTableItem.endTime
                    let newClassTime = app.moment(toCourseTableItem.date).format('YYYY.MM.DD') + " " + toCourseTableItem.startTime + "-" + toCourseTableItem.endTime
                    let newTeacher = yield This.ctx.service.teacher.getById(toCourseTableItem.teacherId)
                    let classroom = yield This.ctx.service.classroom.getById(toCourseTableItem.classroomId)
                    let oldTeacherUser = yield This.ctx.service.user.getById(oldTeacher.userId)
                    let newTeacherUser = yield This.ctx.service.user.getById(newTeacher.userId)
                    yield This.ctx.service.wechat.teacherChageClass(student.name, oldTeacher.name, fromCourseTableItem.courseName, oldClassTime, newClassTime, reason, newTeacher.name, classroom.name, studentUser.publicOpenId, oldTeacherUser.publicOpenId, newTeacherUser.publicOpenId, student.id)
                }
            }
            /*
             * 获取调课之前所要获取的信息
             */
            *
            getBeforeChangeClassDate() {
                const id = this.ctx.request.query.id
                const nStudentId = this.ctx.request.query.nStudentId
                    //获取当前调的课信息
                let courseTableItem = yield this.ctx.service.courseTableItem.getById(id)
                console.log(courseTableItem)
                    //获取当前调的课报名的信息
                let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableItem.courseTableDetailId)
                    //获取当前能调到的课
                let courseTableItemOther = yield this.ctx.service.courseTableItem.getFreeByteacherIdForStudent(courseTableItem.courseName, courseTableItem.number, courseTableItem.duration, courseTableItem.termId, courseTableItem.level, courseTableItem.teacherId)
                let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId2(id, nStudentId)
                let courseTableDetailStudent
                if (courseTableItemStudent[0].teacherStatus) {
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(courseTableItemStudent[0].teacherStatus)
                } else {
                    if (courseTableDetail) {
                        courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(courseTableDetail.id)
                        if (courseTableDetailStudent.length == 0) {
                            let courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(courseTableItem.id, nStudentId, 1)
                            courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, nStudentId)
                        } else {
                            courseTableDetailStudent = courseTableDetailStudent[0]
                        }
                    } else {
                        let courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(courseTableItem.id, nStudentId, 1)
                        courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, nStudentId)
                    }
                }
                for (let j = 0; j < courseTableItemOther.length; j++) {
                    let day = new Date().getDay()
                    let startDate = app.moment().subtract(day, 'days');
                    let endDate = app.moment(startDate).add(14, 'days');
                    if (new Date(startDate).getTime() < new Date(courseTableItemOther[j].date).getTime() && new Date(courseTableItemOther[j].date).getTime() < new Date(endDate).getTime()) {
                        courseTableItemOther[j].startTime = this.ctx.helper.formatTime(courseTableItemOther[j].startTime);
                        courseTableItemOther[j].endTime = this.ctx.helper.formatTime(courseTableItemOther[j].endTime);
                        courseTableItemOther[j].date = app.moment(courseTableItemOther[j].date).format('YYYY-MM-DD');
                        courseTableItemOther[j].classroomName = (yield this.service.classroom.getById(courseTableItemOther[j].classroomId)).name;
                    } else {
                        courseTableItemOther.splice(j, 1)
                        j = -1
                    }
                }
                let aDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                let dayOfWeek
                if (courseTableDetail) {
                    dayOfWeek = courseTableDetail.dayOfWeek
                } else {
                    dayOfWeek = aDay[new Date(courseTableItem.date).getDay()]
                }
                this.success({
                    courseTableItem,
                    courseTableItemOther,
                    dayOfWeek,
                    courseTableDetailStudent
                })

            } *
            getList() {
                const pageIndex = app.lodash.parseInt(this.ctx.request.query.pageIndex) || 0;
                const termId = app.lodash.parseInt(this.ctx.request.query.termId) || 0;
                const limit = app.lodash.parseInt(this.ctx.request.query.limit) || 10;
                let data = yield this.ctx.service.courseTableChangeClassForTeacher.getList(pageIndex, termId, limit);
                for (let item of data.list) {
                    item.fromCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.fromCourseTableItemId)
                    item.fromCourseTableItem.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.fromCourseTableItem.courseTableDetailId)
                    item.fromCourseTableItem.classroom = yield this.ctx.service.classroom.getById(item.fromCourseTableItem.classroomId)
                    item.toCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.toCourseTableItemId)
                    item.toCourseTableItem.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.toCourseTableItem.courseTableDetailId)
                    item.toCourseTableItem.classroom = yield this.ctx.service.classroom.getById(item.toCourseTableItem.classroomId)
                    item.teacher = yield this.ctx.service.teacher.getById(item.fromCourseTableItem.teacherId)
                }
                this.success(data)
            } *
            getListByTeacherIdAndtermId() {
                let { termId, teacherId } = this.ctx.request.query
                if (!termId) {
                    this.fail('学期不能为空')
                    return
                }
                if (!teacherId) {
                    this.fail('教师不能为空')
                    return
                }
                let data = yield this.ctx.service.courseTableChangeClassForTeacher.getListByTeacherIdAndtermId(termId, teacherId);
                for (let item of data) {
                    item.fromCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.fromCourseTableItemId)
                    item.fromCourseTableItem.date = app.moment(item.fromCourseTableItem.date).format('YYYY-MM-DD')
                    item.fromCourseTableItem.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.fromCourseTableItem.courseTableDetailId)
                    item.fromCourseTableItem.classroom = yield this.ctx.service.classroom.getById(item.fromCourseTableItem.classroomId)
                    item.toCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.toCourseTableItemId)
                    item.toCourseTableItem.date = app.moment(item.toCourseTableItem.date).format('YYYY-MM-DD')
                    item.toCourseTableItem.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.toCourseTableItem.courseTableDetailId)
                    item.toCourseTableItem.classroom = yield this.ctx.service.classroom.getById(item.toCourseTableItem.classroomId)
                    item.teacher = yield this.ctx.service.teacher.getById(item.fromCourseTableItem.teacherId)
                }
                this.success(data)
            }
    }

    return courseTableChangeClassForTeacherController;

}