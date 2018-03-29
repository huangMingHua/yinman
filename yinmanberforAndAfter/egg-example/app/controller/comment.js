'use strict';

module.exports = app => {
  class commentController extends app.Controller {
    *
        add() {
                // console.log(this.ctx.body)
          const teacherId = this.ctx.request.body.teacherId || 0;
          const courseDetailId = this.ctx.request.body.courseDetailId || 0;
          const studentId = this.ctx.request.body.studentId || 0;
          const comment = this.ctx.request.body.comment;
          const now = new Date();
          const teacher = yield this.service.teacher.getById(teacherId);
          if (teacher == null) {
            this.fail('老师不存在');
            return;
          }
          const student = yield this.service.student.getById(studentId);
          if (student == null) {
            this.fail('学生不存在');
            return;
          }
          const courseDetail = yield this.service.courseTableDetail.getById(courseDetailId);
          if (courseDetail == null) {
            this.fail('课程不存在');
            return;
          }
          if (courseDetail.teacherId != teacher.id) {
            this.fail('课程信息跟老师信息不匹配');
            return;
          }
          if (app.lodash.trim(comment) == '') {
            this.fail('点评内容不能为空');
            return;
          }
                // if(courseDetail.studentId != student.id){
                //     this.fail('课程信息跟学生信息不匹配');
                //     return;
                // }
          const studentUser = yield this.ctx.service.user.getById(student.userId);
          yield this.ctx.service.wechat.comment(student.name, courseDetail.courseName, teacher.name, now.getFullYear() + ' ' + (now.getMonth() + 1) + '.' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes(), studentUser.publicOpenId, student.id);
          yield this.service.comment.add(teacherId, courseDetailId, studentId, comment, now);
          this.success();
        } *
            getComments() {
                // let teacherId = this.ctx.request.query.teacherId;
              const studentId = this.ctx.request.query.studentId;
              const courseDetailId = this.ctx.request.query.courseId;
              const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseDetailId);
              if (courseTableDetail == null) {
                this.fail('未找到课程数据');
                return;
              }

              const classroom = yield this.ctx.service.classroom.getById(courseTableDetail.classroomId);
              if (classroom == null) {
                this.fail('未找到教室数据');
                return;
              }
              courseTableDetail.classroomName = classroom.name;

              const student = yield this.ctx.service.student.getById(this.ctx.request.query.studentId);
              const studentUser = yield this.ctx.service.user.getById(student.userId);
              student.wxHead = studentUser.wxHead;
              const teacher = yield this.service.teacher.getById(courseTableDetail.teacherId);
              const teacherUser = yield this.service.user.getById(teacher.userId);
              teacher.wxHead = teacherUser.name;

              const comments = yield this.ctx.service.comment.getList(studentId, courseDetailId);
                // courseTable.startDate = app.moment(courseTable.startDate).format('YYYY.MM.DD')
                // courseTable.endDate = app.moment(courseTable.endDate).format('YYYY.MM.DD')
              const info = {
                courseTableDetail,
                student,
                teacher,
                comments,
              };

              this.success(info);
            }
    }
  return commentController;
};
