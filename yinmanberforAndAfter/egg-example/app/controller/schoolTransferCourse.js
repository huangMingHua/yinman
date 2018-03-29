module.exports = app => {
    /**
     * 学校调课
     */
  class schoolTransferCourse extends app.Controller {
    *
        createCourseInfo() {
          const body = this.ctx.request.body;
          if (!body.iClassSchedulingTime) {
            this.fail('请选择调课时间');
            return;
          }
          if (!body.iMakeupTime) {
            this.fail('请选择补课时间');
            return;
          }
          if (!body.iReason) {
            this.fail('请填写原因');
            return;
          }
          if (!body.nTermId) {
            this.fail('还没有学期');
            return;
          }
          const iTermDate = yield this.ctx.service.term.getById(body.nTermId);
          if (new Date(iTermDate.startDate).getTime() > new Date(this.iClassSchedulingTime).getTime() || new Date(this.iClassSchedulingTime).getTime() > new Date(iTermDate.endDate).getTime() || new Date(this.iMakeupTime).getTime() < new Date(iTermDate.startDate).getTime() || new Date(iTermDate.endDate).getTime() < new Date(this.iMakeupTime).getTime()) {
            this.$message('请选择当前学期内日期');
            return;
          }
          if (body.iClassSchedulingTime == body.iMakeupTime) {
            this.fail('调课时间和补课时间不能重复');
            return;
          }
          const aDate = yield this.ctx.service.courseTableItem.getAll();
          const aId = [];
          const aEnd = [];
          for (const item of aDate) {
            const date = new Date(item.date);
            if (app.moment(item.date).format('YYYY-MM-DD') == body.iClassSchedulingTime) {
              aId.push(item.id);
            }
            console.log(app.moment(item.date).format('YYYY-MM-DD'), body.iMakeupTime);
            if (app.moment(item.date).format('YYYY-MM-DD') == body.iMakeupTime) {
              aEnd.push(item.id);
            }
          }

          if (aId.length == 0) {
            this.fail('当天没有课程');
            return;
          }
          if (aEnd.length > 0) {
            this.fail('补课时间已存在课程');
            return;
          }
          const This = this;
          const result = yield app.mysql.beginTransactionScope(function* (conn) {
            for (let i = 0; i < aId.length; i++) {
              const data = yield This.ctx.service.courseTableItem.findById(aId[i]);
              data.remarks = {
                originalDate: data.date,
                nowDate: body.iMakeupTime,
                iReason: body.iReason,
              };
              data.remarks = JSON.stringify(data.remarks);
              const oldTime = app.moment(data.date).format('YYYY.MM.DD') + ' ' + data.startTime + '-' + data.endTime;
              const nowTime = app.moment(body.iMakeupTime).format('YYYY.MM.DD') + ' ' + data.startTime + '-' + data.endTime;
              data.date = body.iMakeupTime;
              yield app.mysql.update('course_table_item', data);
              const courseTableItemStudentS = yield This.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(aId[i]);
              const teacher = yield This.ctx.service.teacher.getById(data.teacherId);
              const teacherUser = yield This.ctx.service.user.getById(teacher.userId);
              for (const item of courseTableItemStudentS) {
                const student = yield This.ctx.service.student.getById(item.studentId);
                const studentUser = yield This.ctx.service.user.getById(student.userId);
                yield This.ctx.service.wechat.schoolChangeClass(student.name, data.courseName, oldTime, nowTime, body.iReason, studentUser.publicOpenId, teacherUser.publicOpenId, teacher.name);
              }
              yield This.ctx.service.wechat.schoolChangeClassTeacher(data.courseName, oldTime, nowTime, body.iReason, teacherUser.publicOpenId, teacher.name);
            }
            const result = yield This.ctx.service.schoolTransferCourse.createCourseInfo(body.nTermId, body.iClassSchedulingTime, body.iMakeupTime, body.iReason);
          }, This);

          this.success();
        } *
            getAll() {
              const result = yield this.ctx.service.schoolTransferCourse.getAll(this.ctx.request.query.nTermId);
              this.success(result);
            }
    }
  return schoolTransferCourse;
};
