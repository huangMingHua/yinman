module.exports = app => {
    /**
     * 调课相关方法
     */
  class courseTableChangeClassForTeacherController extends app.Controller {
        /**
         * 添加老师调课信息
         */
       * addChangeClass() {
          const { fromCourseTableItemId=0, toCourseTableItemId=0, reason='', teacherId } = this.ctx.request.body;
          if (fromCourseTableItemId === 0||toCourseTableItemId === 0 ) { 
            return this.fail('参数不能为空');
          }
          if (reason === '') { 
            return this.fail('请假原因不能为空');
          }
          let ctx = this.ctx;
          const result = yield app.mysql.beginTransactionScope(function* (conn) {
          let fromCourseTableItem = yield ctx.service.courseTableItem.getById(fromCourseTableItemId);
          let courseTableItemChangeClasses = yield ctx.service.courseTableItemChangeCourse.getByToCourseTableItemIdAndOnes(fromCourseTableItemId, 1);
            let courseTableDetailIdes = [];
            if (courseTableItemChangeClasses.length > 0) {
              for (let item of courseTableItemChangeClasses) { 
                let courseTableDetailId = item.courseTableDetailId;
                courseTableDetailIdes.push(courseTableDetailId);
              }
            } else { 
              let courseTableDetailId = fromCourseTableItem.courseTableDetailId;
              courseTableDetailIdes.push(courseTableDetailId);
            }   
            let toCourseTableItem = yield ctx.service.courseTableItem.getById(toCourseTableItemId);
            let fromCourseTableDetailes = [];
            let fromCourseTableDetailes1 = [];
            for (let item of courseTableDetailIdes) { 
              let fromCourseTableDetail = yield ctx.service.courseTableDetail.getById(item);
              let fromCourseTableDetail1 = yield ctx.service.courseTableDetail.getById(item);
              fromCourseTableDetail.leaveNum+=1;
              fromCourseTableDetail1.makeUpNum+=1;
              fromCourseTableDetailes.push(fromCourseTableDetail);
              fromCourseTableDetailes1.push(fromCourseTableDetail1);
            }
           //原来那节课要删除
            fromCourseTableItem.isDel = 1;
            yield conn.update('course_table_item', fromCourseTableItem);
            for (let item of fromCourseTableDetailes) { 
              yield conn.update('course_table_detail', item);
            }
           //更新老师请假几次，补课几次
            for (let item of fromCourseTableDetailes1) { 
              yield conn.update('course_table_detail', item);
            } 
           let courseTableItemStudentList = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(fromCourseTableItemId);
           for (let item of courseTableItemStudentList) { 
              let isStudent = yield ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(toCourseTableItemId, item.studentId);
              if (isStudent > 0) { 
                return { success: false, msg:'补课的班级学生重复' };
              }
              item.status = '请假';
              //将原来课程里的学生改为请假
              yield conn.update('course_table_item_student', item);
              item.courseTableItemId = toCourseTableItemId;
              //将所有学生转到新的课程下面
              delete item["id"];
              item.status = '正常';
             yield conn.insert('course_table_item_student', item);
             for (let itemDetail of fromCourseTableDetailes) { 
                let courseTableDetailStudent = yield ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(itemDetail.id,item.studentId);
               if (courseTableDetailStudent) { 
                  //给学生添加请假信息，不然学生不知道那节课没有他了 原因设为老师请假
                  yield conn.insert('course_table_item_leave', { courseTableDetailId: itemDetail.id, courseTableDetailItemId: fromCourseTableItemId, reason: '老师请假', studentId: item.studentId, createTime: app.moment().format('YYYY-MM-DD HH:mm:ss') });
                  //给学生添加补课信息，让学生知道那节课怎么会有他 原因设为老师请假
                  yield conn.insert('course_table_item_change_class', { courseTableDetailId: itemDetail.id, courseTableDetailItemId: toCourseTableItemId, reason: '老师请假', studentId: item.studentId, createTime: app.moment().format('YYYY-MM-DD HH:mm:ss'), one: 0 }); 
                }
              }
           }
           //因为调课的信息是补课所以要将这节课作废
            if (courseTableItemChangeClasses.length > 0) { 
              for (let item of courseTableItemChangeClasses) { 
                item.one = 0;
                yield conn.update('course_table_item_change_class', item);    
              }
            }  
            let now = new Date();
            for (let item of courseTableItemStudentList) {
              for (let itemDetail of fromCourseTableDetailes) {
                let courseTableDetailStudent = yield ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(itemDetail.id, item.studentId);
                //给老师添加补课信息
                if (courseTableDetailStudent) {
                  const result = yield conn.insert('course_table_item_change_class', {
                    courseTableDetailItemId: toCourseTableItemId,
                    courseTableDetailId: itemDetail.id,
                    one: 1,
                    reason: reason,
                    studentId: courseTableDetailStudent.studentId,
                    createTime: now,
                    teacherId: teacherId
                  });
                  const result1 = yield conn.insert('course_table_item_leave', {
                    courseTableDetailItemId: fromCourseTableItemId,
                    courseTableDetailId: itemDetail.id,
                    studentId: courseTableDetailStudent.studentId,
                    createTime: now,
                    teacherId: teacherId,
                    reason
                  });
                }
              }  
            }
            //给老师添加请假信息  
            
           return { success: true }
         }, this.ctx);
         if (result.success) {
           this.success();
         } else { 
           this.fail(result.msg);
         }
       }
            /*
             * 获取调课之前所要获取的信息
             */
    *
            getBeforeChangeClassDate() {
              const id = this.ctx.request.query.id;
              const nStudentId = this.ctx.request.query.nStudentId;
                    // 获取当前调的课信息
              const courseTableItem = yield this.ctx.service.courseTableItem.getById(id);
              console.log(courseTableItem);
                    // 获取当前调的课报名的信息
              const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableItem.courseTableDetailId);
                    // 获取当前能调到的课
              const courseTableItemOther = yield this.ctx.service.courseTableItem.getFreeByteacherIdForStudent(courseTableItem.courseName, courseTableItem.number, courseTableItem.duration, courseTableItem.termId, courseTableItem.level, courseTableItem.teacherId);
              const courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId2(id, nStudentId);
              let courseTableDetailStudent;
              if (courseTableItemStudent[0].teacherStatus) {
                courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(courseTableItemStudent[0].teacherStatus);
              } else {
                if (courseTableDetail) {
                  courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(courseTableDetail.id);
                  if (courseTableDetailStudent.length == 0) {
                    const courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(courseTableItem.id, nStudentId, 1);
                    courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, nStudentId);
                  } else {
                    courseTableDetailStudent = courseTableDetailStudent[0];
                  }
                } else {
                  const courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(courseTableItem.id, nStudentId, 1);
                  courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, nStudentId);
                }
              }
              for (let j = 0; j < courseTableItemOther.length; j++) {
                const day = new Date().getDay();
                const startDate = app.moment().subtract(day, 'days');
                const endDate = app.moment(startDate).add(14, 'days');
                if (new Date(startDate).getTime() < new Date(courseTableItemOther[j].date).getTime() && new Date(courseTableItemOther[j].date).getTime() < new Date(endDate).getTime()) {
                  courseTableItemOther[j].startTime = this.ctx.helper.formatTime(courseTableItemOther[j].startTime);
                  courseTableItemOther[j].endTime = this.ctx.helper.formatTime(courseTableItemOther[j].endTime);
                  courseTableItemOther[j].date = app.moment(courseTableItemOther[j].date).format('YYYY-MM-DD');
                  courseTableItemOther[j].classroomName = (yield this.service.classroom.getById(courseTableItemOther[j].classroomId)).name;
                } else {
                  courseTableItemOther.splice(j, 1);
                  j = -1;
                }
              }
              const aDay = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ];
              let dayOfWeek;
              if (courseTableDetail) {
                dayOfWeek = courseTableDetail.dayOfWeek;
              } else {
                dayOfWeek = aDay[new Date(courseTableItem.date).getDay()];
              }
              this.success({
                courseTableItem,
                courseTableItemOther,
                dayOfWeek,
                courseTableDetailStudent,
              });

            } *
            getList() {
              const pageIndex = app.lodash.parseInt(this.ctx.request.query.pageIndex) || 0;
              const termId = app.lodash.parseInt(this.ctx.request.query.termId) || 0;
              const limit = app.lodash.parseInt(this.ctx.request.query.limit) || 10;
              const data = yield this.ctx.service.courseTableChangeClassForTeacher.getList(pageIndex, termId, limit);
              for (const item of data.list) {
                item.fromCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.fromCourseTableItemId);
                item.fromCourseTableItem.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.fromCourseTableItem.courseTableDetailId);
                item.fromCourseTableItem.classroom = yield this.ctx.service.classroom.getById(item.fromCourseTableItem.classroomId);
                item.toCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.toCourseTableItemId);
                item.toCourseTableItem.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.toCourseTableItem.courseTableDetailId);
                item.toCourseTableItem.classroom = yield this.ctx.service.classroom.getById(item.toCourseTableItem.classroomId);
                item.teacher = yield this.ctx.service.teacher.getById(item.fromCourseTableItem.teacherId);
              }
              this.success(data);
            } *
            getListByTeacherIdAndtermId() {
              const { termId, teacherId } = this.ctx.request.query;
              if (!termId) {
                this.fail('学期不能为空');
                return;
              }
              if (!teacherId) {
                this.fail('教师不能为空');
                return;
              }
              const data = yield this.ctx.service.courseTableChangeClassForTeacher.getListByTeacherIdAndtermId(termId, teacherId);
              for (const item of data) {
                item.fromCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.fromCourseTableItemId);
                item.fromCourseTableItem.date = app.moment(item.fromCourseTableItem.date).format('YYYY-MM-DD');
                item.fromCourseTableItem.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.fromCourseTableItem.courseTableDetailId);
                item.fromCourseTableItem.classroom = yield this.ctx.service.classroom.getById(item.fromCourseTableItem.classroomId);
                item.toCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.toCourseTableItemId);
                item.toCourseTableItem.date = app.moment(item.toCourseTableItem.date).format('YYYY-MM-DD');
                item.toCourseTableItem.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.toCourseTableItem.courseTableDetailId);
                item.toCourseTableItem.classroom = yield this.ctx.service.classroom.getById(item.toCourseTableItem.classroomId);
                item.teacher = yield this.ctx.service.teacher.getById(item.fromCourseTableItem.teacherId);
              }
              this.success(data);
            }
             * getListByCourseTableDetailIdAndTeacherId() {
               const { courseTableDetailId = 0, teacherId=0 } = this.ctx.request.query;
               if (courseTableDetailId===0||teacherId===0) { 
                 return this.fail('参数缺少');
               }
               let teacher = yield this.ctx.service.teacher.getById(teacherId);
               let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
               courseTableDetail.courseName = yield this.ctx.service.course.getById(courseTableDetail.courseNameId);
               courseTableDetail.classroom = yield this.ctx.service.classroom.getById(courseTableDetail.classroomId);
               let courseTableItemChangeClasses = yield this.ctx.service.courseTableItemChangeCourse.getTeacherSwitchs1(courseTableDetailId, teacherId);
               for (let item of courseTableItemChangeClasses) { 
                 item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
                 console.log(item.courseTableItem.date);
                 let date = new Date(item.courseTableItem.date);
                 item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
                 item.courseTableItem.dayOfWeek ='星期'+app.cnum[date.getDay()];
                 item.courseTableItem.startTime = item.courseTableItem.startTime.substring(0, 5);
                 item.courseTableItem.endTime = item.courseTableItem.endTime.substring(0, 5);
                 item.courseTableItem.classroom = yield this.ctx.service.classroom.getById(item.courseTableItem.classroomId);
               }
               let courseTableItemLeave = yield this.ctx.service.courseTableItemLeave.getTeacherSwitchs1(courseTableDetailId,teacherId);
               for (let item of courseTableItemLeave) { 
                item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
                let date1 = new Date(item.courseTableItem.date);
                item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
                item.courseTableItem.dayOfWeek ='星期'+app.cnum[date1.getDay()];
                item.courseTableItem.startTime = item.courseTableItem.startTime.substring(0, 5);
                 item.courseTableItem.endTime = item.courseTableItem.endTime.substring(0, 5);
                 item.courseTableItem.classroom = yield this.ctx.service.classroom.getById(item.courseTableItem.classroomId); 
               }
               let result = {
                 teacher,
                 courseTableDetail,
                 courseTableItemChangeClasses,
                 courseTableItemLeave
               }
               this.success(result);
             }
    }

  return courseTableChangeClassForTeacherController;

};
