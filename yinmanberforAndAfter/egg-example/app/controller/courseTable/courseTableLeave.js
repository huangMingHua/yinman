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
          const id = this.ctx.request.query.id;
          const item = yield this.ctx.service.courseTableItem.findById(id);
          const list = yield this.ctx.service.courseTableItem.getFree(item.termId, item.courseName, item.number, item.duration);
          list.forEach(function(item) {
            item.date = app.moment(item.date).format('YYYY-MM-DD');
          }, this);


          this.ctx.body = {
            info: item,
            list: app.lodash.filter(list, function(ii) {
              return ii.id != id;
            }),
          };
        }

    *
        addLeave() {
          const fromCourseTableItemId = this.ctx.request.body.fromCourseTableItemId || 0;
          const reason = this.ctx.request.body.reason;
          const studentId = this.ctx.request.body.studentId || 0;
                // var teacherId = this.ctx.request.body.teacherId || 0;
          const sStatus = this.ctx.request.body.sStatus;
          const ctx = this.ctx;
          const now = new Date();
          if (app.lodash.trim(reason) == '') {
            this.fail('请假原因不能为空');
            return;
          }
          const fromCourseTableItem = yield this.ctx.service.courseTableItem.findById(fromCourseTableItemId);
          fromCourseTableItem.course = yield this.ctx.service.course.getById(fromCourseTableItem.courseName);
          if (fromCourseTableItem == null) {
            this.fail('要调课的记录不存在');
            return;
          }
          if (app.moment(fromCourseTableItem.date).diff(now, 'days') < 2) {
            this.fail('请提前48小时请假');
            return;
          }
          const result = yield app.mysql.beginTransactionScope(function* (conn) {
                    // 有人请假这趟课算空闲
            fromCourseTableItem.status = '空闲';
            yield ctx.service.courseTableItem.update(fromCourseTableItem);
                    // 关于这个学生这节课算请假
            let fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '正常');
            if (fromCourseTableItemStudents.length == 0) {
              fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '停课');
            }
            if (fromCourseTableItemStudents.length == 0) {
              fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '转课');
            }
            if (fromCourseTableItemStudents.length == 0) {
                        // 如果正常的课不存在，说明这节课可能是补课
              const fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '补课');
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
            let courseTableDetailId;
            if (sStatus === '补课') {
              const courseTableItemChangeCourse = yield ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(fromCourseTableItemId, studentId, 1);
              console.log(courseTableItemChangeCourse);
              courseTableItemChangeCourse.one = 0;
              courseTableDetailId = courseTableItemChangeCourse.courseTableDetailId;
              yield ctx.service.courseTableItemChangeCourse.update(courseTableItemChangeCourse);
            } else {
              courseTableDetailId = fromCourseTableItem.courseTableDetailId;
            }
            const courseTableDetailStudent = yield ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId);
            console.log(courseTableDetailId, studentId);
            courseTableDetailStudent.numberOfleave = courseTableDetailStudent.numberOfleave - 1;
            yield ctx.service.courseTableDetailStudent.update(courseTableDetailStudent);
                        // 添加请假记录表
            yield ctx.service.courseTableItemLeave.add(reason, studentId, now, fromCourseTableItem.id, fromCourseTableItem.courseTableDetailId, 1);
            const student = yield ctx.service.student.getById(studentId);
            const studentUser = yield ctx.service.user.getById(student.userId);
            const classTime = app.moment(fromCourseTableItem.date).format('YYYY.MM.DD') + ' ' + fromCourseTableItem.startTime + '-' + fromCourseTableItem.endTime;
            const teacher = yield ctx.service.teacher.getById(fromCourseTableItem.teacherId);
            const teacherUser = yield ctx.service.user.getById(teacher.userId);
            yield ctx.service.wechat.addStudentLeave(student.name, fromCourseTableItem.course.name, classTime, teacher.name, reason, studentUser.publicOpenId, teacherUser.publicOpenId, student.id,fromCourseTableItem.courseTableDetailId);
            return { code: 1 };
          }, ctx);
          this.ctx.body = result;
          return;
    }
    //添加课时课请假
    *addClassLeave() {
      let { courseTableDetailId, courseTableItemId, reason, studentId } = this.ctx.request.body
      if (app.lodash.trim(reason) == '') {
        this.fail('请假原因不能为空');
        return;
      }
      const courseTableItem = yield this.ctx.service.courseTableItem.findById(courseTableItemId);
      if (!courseTableItem) {
        this.fail('要调课的记录不存在');
        return;
      }
      const ctx = this.ctx;
      const result = yield app.mysql.beginTransactionScope(function* (conn) {
        // 有人请假这趟课算空闲
        courseTableItem.status = '空闲';
        yield ctx.service.courseTableItem.update(courseTableItem);
        const courseTableDetailStudent = yield ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId);
        courseTableDetailStudent.numberOfleave--;
        yield ctx.service.courseTableDetailStudent.update(courseTableDetailStudent);
        // 关于这个学生这节课算请假
        let fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(courseTableItem.id, studentId, '正常');
        for (let i = 0; i < fromCourseTableItemStudents.length; i++) {
          var item = fromCourseTableItemStudents[i];
          item.status = '请假';
          item.reason = reason;
          yield ctx.service.courseTableItemStudent.update(item);
        }
      })
      this.success()  
    }
    /**
             * 获取学生调课页面的初始数据
             */
    *
            getLeaveDataForStudent() {
              const id = this.ctx.request.query.id || 0;
              const studentId = this.ctx.request.query.studentId || 0;
              const teacherId = this.ctx.request.query.teacherId || 0;
              console.log(teacherId);
              const item = yield this.ctx.service.courseTableItem.findById(id);
              if (item == null) {
                this.fail('数据不存在');
                return;
              }
              const courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(this.ctx.request.query.id, studentId, 1);
              let courseTableDetailStudent;
              if (courseTableItemChangeCourse) {
                courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, studentId);
              } else {
                courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(item.courseTableDetailId, studentId);
              }
              if (!courseTableDetailStudent) {
                const courseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByToCourseTableItemIdAndOne(id, 1);
                courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(courseTableChangeClassForTeacher.courseTableDetailStudentId);
              }
                // let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId)
              const list = yield this.ctx.service.courseTableItem.getFreeForStudent(item.courseName, item.number, item.duration, item.termId, item.level);
              const teacher = yield this.service.teacher.getById(item.teacherId);
              const student = yield this.ctx.service.student.getById(studentId);
              this.ctx.body = {
                info: Object.assign(item, { teacherName: teacher.name, date: app.moment(item.date).format('YYYY-MM-DD') }),
                student,
                courseTableDetailStudent,
              };

            }

    *
        getLeaveDetail() {
          const id = this.ctx.request.query.id || 0;
          const info = yield this.ctx.service.courseTableItemLeave.getById(id);
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
              const { termId, studentId } = this.ctx.request.query;
              console.log(termId, studentId);
              if (!termId) {
                this.fail('没有传学期');
                return;
              }
              if (!studentId) {
                this.fail('没有传学生出错');
                return;
              }
              const result = yield this.ctx.service.courseTableItemLeave.getListBystudentIdAndTermId(termId, studentId);
              for (const item of result) {
                item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
                item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
                item.oTeacher = yield this.ctx.service.teacher.getById(item.teacherId);
                item.oClassroom = yield this.ctx.service.classroom.getById(item.classroomId);
                item.createTime1 = app.moment(item.createTime1).format('YYYY-MM-DD HH:mm');
                item.courseTableItem.startTime = item.courseTableItem.startTime.substr(0, 5);
                item.courseTableItem.endTime = item.courseTableItem.endTime.substr(0, 5);
              }
              return this.success(result);
            } *
            getList() {
              const pageIndex = app.lodash.parseInt(this.ctx.request.query.pageIndex) || 0;
              const termId = app.lodash.parseInt(this.ctx.request.query.termId) || 0;
              const limit = app.lodash.parseInt(this.ctx.request.query.limit) || 10;
              const data = yield this.service.courseTableItemLeave.getList(pageIndex, termId, limit);
              console.log(data);
              for (const item of data.list) {
                if (item.studentId > 0) {
                  const student = yield this.service.student.getById(item.studentId);
                  const studentUser = yield this.service.user.getById(student.userId);
                  item.student = {
                    name: student.name,
                  };
                }
                if (item.teacherId > 0) {
                  const teacher = yield this.service.teacher.getById(item.teacherId);
                  item.teacher = {
                    name: teacher.name,
                  };
                }
                item.classroomName = (yield this.service.classroom.getById(item.classroomId)).name;
              }
              this.success(data);
            }

    }

  return CourseTableLeaveController;

};
