module.exports = app => {
    /**
     * 调课相关方法
     */
  class courseTableLeaveForTeacher extends app.Controller {
        /**
         * 添加老师调课信息
         */
       * addLeave() {
         let { fromCourseTableItemId, reason, teacherId } = this.ctx.request.body;
         let ctx = this.ctx;
         let result = yield app.mysql.beginTransactionScope(function* (conn) { 
           let courseTableItem = yield ctx.service.courseTableItem.getById(fromCourseTableItemId);   
           courseTableItem.isDel = 1;
           let courseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(fromCourseTableItemId);
           for (let item of courseTableItemStudents) { 
              let courseTableItemChangeCourse = yield ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(item.courseTableItemId, item.studentId, 1);
              if (courseTableItemChangeCourse) {
                courseTableItemChangeCourse.one = 0; 
                item.status = '请假'; 
                let courseTableDetailStudent = yield ctx.service.courseTableDetailStudent.get(courseTableItemChangeCourse.courseTableDetailId, courseTableItemChangeCourse.studentId);
                courseTableDetailStudent.numberOfChangeClass++;
                courseTableDetailStudent.allNumberOfChangeClass++;
                courseTableDetailStudent.numberOfleave++;
                yield conn.update('course_table_detail_student', courseTableDetailStudent);
                yield conn.update('course_table_item_change_class', courseTableItemChangeCourse);
                yield conn.update('course_table_item_student', item)
                let now = new Date();
              yield conn.insert('course_table_item_leave', {courseTableDetailId:courseTableItemChangeCourse.courseTableDetailId,courseTableDetailItemId:fromCourseTableItemId,reason,teacherId,createTime:now,studentId:item.studentId})
              } else { 
                item.status = '请假'; 
                let courseTableDetailStudent = yield ctx.service.courseTableDetailStudent.get(courseTableItem.courseTableDetailId, item.studentId);
                courseTableDetailStudent.numberOfChangeClass+=1;
                courseTableDetailStudent.allNumberOfChangeClass+=1;
                courseTableDetailStudent.numberOfleave+=1;
                yield conn.update('course_table_detail_student', courseTableDetailStudent);
                yield conn.update('course_table_item_student', item)
                let now = new Date();
                yield conn.insert('course_table_item_leave', {courseTableDetailId:courseTableDetailStudent.courseTableDetailId,courseTableDetailItemId:fromCourseTableItemId,reason,teacherId,createTime:now,studentId:item.studentId})
              }
              yield conn.update('course_table_item', courseTableItem)
           }
           return {
            success:true
          }
         },this.ctx) 
         this.success();  
       }
         /*
             * 课时课请假
             */
       * addClassTimeLeave() {
        let { fromCourseTableItemId, reason, teacherId } = this.ctx.request.body;
        let ctx = this.ctx;
        let result = yield app.mysql.beginTransactionScope(function* (conn) { 
        let courseTableItem = yield ctx.service.courseTableItem.getById(fromCourseTableItemId);   
        courseTableItem.isDel = 1;
        conn.update('course_table_item',courseTableItem)  
        let courseTableItems = yield ctx.service.courseTableItem.getSameClassByCourseNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumberAndIsDel(courseTableItem.courseName, courseTableItem.teacherId, courseTableItem.duration, courseTableItem.level, courseTableItem.termId, courseTableItem.number)
        let courseTableDetail
        for (let item of courseTableItems) { 
          courseTableDetail = yield ctx.service.courseTableDetail.getByCourseTableItemId(item.id)
          if (courseTableDetail) {
            break
          }
        }  
        let courseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(fromCourseTableItemId);
          for (let item of courseTableItemStudents) {
            let courseTableDetailStudent = yield ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetail.id, item.studentId);
            if (courseTableDetailStudent) {
              courseTableDetailStudent.classTimeNum++;
              conn.update('course_table_detail_student', courseTableDetailStudent);
              item.status = '请假';
              conn.update('course_table_item_student', item);
              conn.insert('course_table_item_leave', { courseTableDetailId: courseTableDetail.id, courseTableDetailItemId: fromCourseTableItemId, reason: '老师请假', createTime: new Date(), studentId: item.studentId })
            }
          }
          conn.insert('course_table_item_leave', {courseTableDetailId:courseTableDetail.id,courseTableDetailItemId:fromCourseTableItemId,reason:reason,createTime:new Date(),teacherId:teacherId}) 
        return {
          success:true
        }
       },this.ctx) 
       this.success();  
     } 
            
  
    }

  return courseTableLeaveForTeacher;

};
