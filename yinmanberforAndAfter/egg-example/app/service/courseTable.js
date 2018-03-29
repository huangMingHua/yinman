const moment = require('moment');
module.exports = app => {
  class CourseTable extends app.Service {
    * add(teacherId, termId, startDate, endDate) {
      const result = yield app.mysql.insert('course_table', {
        teacherId,
        termId,
        startDate,
        endDate,
      });
      if (result.insertId > 0) {
        return yield this.findById(result.insertId);
      }
      return null;
    }

    * update(info) {
      yield app.mysql.update('course_table', info);
    }
    * getByTermId(termId) {
      const list = yield app.mysql.select('course_table', {
        where: { termId },
      });
      return list;
    }
    * findById(id) {
            // let info = yield this.ctx.model.courseTable.findOne({ _id: id });
      const info = yield app.mysql.get('course_table', { id });
      return info;
    }
    * getByTermIdAndTeacherId(termId, teacherId) {
      const info = yield app.mysql.get('course_table', { termId, teacherId });
      return info;
    }
    * findByTeacherId(teacherId) {
      const termId = yield this.service.term.getCurrentId();
            // let info = yield app.mysql.query('select * from `course_table` where teacherId = ? and termId = ? LIMIT 0,1',
            //    [teacherId, termId]);
      const info = yield app.mysql.get('course_table', { teacherId, termId });
      return info;
    }
    * findStudentCourse(studentId) {
      const result = yield app.mysql.select('course_table_detail_student', { where: { studentId } });
      return result;
    }
    * getMakeUpStudents() {
      // 判断numberOfChangeClass 调课剩余比请假剩余大 大的话就返回出去
      const result = yield app.mysql.query('select * from course_table_detail_student where numberOfChangeClass>numberOfleave');
      return result;
    }
  }
  return CourseTable;
};
