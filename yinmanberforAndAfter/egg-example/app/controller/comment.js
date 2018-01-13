'use strict';

module.exports = app => {
    class commentController extends app.Controller { *
        add() {
                // console.log(this.ctx.body)
                let teacherId = this.ctx.request.body.teacherId || 0;
                let courseDetailId = this.ctx.request.body.courseDetailId || 0;
                let studentId = this.ctx.request.body.studentId || 0;
                let comment = this.ctx.request.body.comment;
                let now = new Date();
                var teacher = yield this.service.teacher.getById(teacherId);
                if (teacher == null) {
                    this.fail('老师不存在');
                    return;
                }
                var student = yield this.service.student.getById(studentId);
                if (student == null) {
                    this.fail('学生不存在');
                    return;
                }
                var courseDetail = yield this.service.courseTableDetail.getById(courseDetailId);
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
                let studentUser = yield this.ctx.service.user.getById(student.userId)
                yield this.ctx.service.wechat.comment(student.name, courseDetail.courseName, teacher.name, now.getFullYear() + " " + (now.getMonth() + 1) + '.' + now.getDate() + " " + now.getHours() + ":" + now.getMinutes(), studentUser.publicOpenId, student.id)
                yield this.service.comment.add(teacherId, courseDetailId, studentId, comment, now);
                this.success();
            } *
            getComments() {
                //let teacherId = this.ctx.request.query.teacherId;
                let studentId = this.ctx.request.query.studentId;
                let courseDetailId = this.ctx.request.query.courseId;
                var courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseDetailId);
                if (courseTableDetail == null) {
                    this.fail('未找到课程数据');
                    return;
                }

                var classroom = yield this.ctx.service.classroom.getById(courseTableDetail.classroomId);
                if (classroom == null) {
                    this.fail('未找到教室数据');
                    return;
                }
                courseTableDetail.classroomName = classroom.name;

                var student = yield this.ctx.service.student.getById(this.ctx.request.query.studentId);
                var studentUser = yield this.ctx.service.user.getById(student.userId);
                student.wxHead = studentUser.wxHead;
                var teacher = yield this.service.teacher.getById(courseTableDetail.teacherId);
                var teacherUser = yield this.service.user.getById(teacher.userId);
                teacher.wxHead = teacherUser.name;

                var comments = yield this.ctx.service.comment.getList(studentId, courseDetailId);
                //courseTable.startDate = app.moment(courseTable.startDate).format('YYYY.MM.DD')
                //courseTable.endDate = app.moment(courseTable.endDate).format('YYYY.MM.DD')
                var info = {
                    courseTableDetail: courseTableDetail,
                    student: student,
                    teacher,
                    comments: comments,
                }

                this.success(info);
            }
    }
    return commentController;
};