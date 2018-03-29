'use strict';

module.exports = app => {
  class studentRelatedCourseController extends app.Controller {
    *
        saveAssociation() {
          for (let i = 0; i < this.ctx.request.body.result.length; i++) {
            yield this.ctx.model.studentRelatedCourse.create({
              startDate: this.ctx.request.body.date.startDate,
              endDate: this.ctx.request.body.date.endDate,
              studentId: this.ctx.request.body.studentId,
              courseName: this.ctx.request.body.result[i].courseName,
              day: this.ctx.request.body.result[i].day,
              classroomName: this.ctx.request.body.result[i].classroomName,
              startTime: this.ctx.request.body.result[i].startTime,
              endTime: this.ctx.request.body.result[i].endTime,
              teacherId: this.ctx.request.body.teacherId,
            });

          }

        } *
            getByteacherId() {

                // console.log(this.ctx.request.query)
              const res = yield this.ctx.model.studentRelatedCourse.find({ teacherId: this.ctx.request.query.teacherId });
              console.log(res);
              const result = [];
              for (let i = 0; i < res.length; i++) {
                const user = yield this.ctx.model.user.findOne({ _id: res[i].studentId });
                const student = yield this.ctx.model.student.findOne({ userId: res[i].studentId });
                res[i].startDate = app.moment(res[i].startDate).format('YYYY,MM,DD');
                res[i].endDate = app.moment(res[i].endDate).format('YYYY,MM,DD');
                result.push({
                  info: res[i],
                  student: user,
                  user: student,
                });
              }
              this.ctx.body = result;

            } *
            getById() {
              const association = yield this.ctx.model.studentRelatedCourse.findOne({ _id: this.ctx.request.query.id });
              const curriculum = yield this.ctx.model.signUpCurriculum.findOne({ userId: association.studentId });
              const student = yield this.ctx.model.student.findOne({ _id: curriculum.studentId });
              this.ctx.body = {
                association,
                curriculum,
                student,
              };

            } *
            getByCourseInfo() {
              const association = yield this.ctx.model.studentRelatedCourse.find({ courseId: this.ctx.request.query.courseId });
              const result = [];
              for (let i = 0; i < association.length; i++) {
                const student = yield this.ctx.model.student.findOne({ studentId: association[i].studentId });
                const user = yield this.ctx.model.userId.findOne({ _id: student.userId });
                result.push({
                  association: association[i],
                  student,
                  user,
                });
              }
              this.ctx.body = result;
            } *
            getStudentData() {
              const student = yield this.ctx.model.student.findOne({ userId: this.ctx.request.query.userId });
              const association = yield this.ctx.model.studentRelatedCourse.find({ studentId: student._id });
              const result = [];
              for (let i = 0; i < association.length; i++) {
                const user = yield this.ctx.model.user.findOne({ _id: association[i].teacherId });
                const teacher = yield this.ctx.model.teacher.findOne({ userId: user._id });
                association[i].startDate = app.moment(association[i].startDate).format('YYYY,MM,DD');
                association[i].endDate = app.moment(association[i].endDate).format('YYYY,MM,DD');
                result.push({
                  association: association[i],
                  user,
                  teacher,
                });
              }
              this.ctx.body = result;
            } *
            getByAssociationId() {

              const association = yield this.ctx.model.studentRelatedCourse.findOne({ _id: this.ctx.query.associationId });
              const teacher = yield this.ctx.model.teacher.findOne({ userId: association.teacherId });
              this.ctx.body = {
                association,
                teacher,
              };
            }
    }
  return studentRelatedCourseController;
};
