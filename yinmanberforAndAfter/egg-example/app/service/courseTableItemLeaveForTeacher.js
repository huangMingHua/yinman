module.exports = app => {
    class courseTableItemLeaveForTeacher extends app.Service {
      * add(courseTableItemId, reason) {
          let result = yield app.mysql.insert('course_table_item_leave_for_teacher', { courseTableItemId, reason})  
          return result;   
      }
    }
    return courseTableItemLeaveForTeacher;
  };
  