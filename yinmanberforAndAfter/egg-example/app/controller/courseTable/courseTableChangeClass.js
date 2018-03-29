module.exports = app => {
    /**
     * 调课相关方法
     */
  class CourseTableChangeClassController extends app.Controller {
        /*
         * 获取调课信息
         */
    *
        getChangeClassData() {
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
        addChangeClass() {
          const {courseTableDetailId=0, fromCourseTableItemId = 0, toCourseTableItemId = 0, reason = '', studentId = 0, currentTeacher = 0 } = this.ctx.request.body;
          const ctx = this.ctx;
          const now = new Date();
          if (app.lodash.trim(reason) == '') {
            this.fail('请假原因不能为空');
            return;
          }
          const fromCourseTableItem = yield this.ctx.service.courseTableItem.findById(fromCourseTableItemId);
          if (fromCourseTableItem == null) {
            this.fail('要调课的课程不存在');
            return;
          }
          if (app.moment(fromCourseTableItem.date).diff(now, 'days') < 2) {
            this.fail('请提前48小时请假');
            return;
          }
          let toCourseTableItem;
          let length;
          if (toCourseTableItemId != 0) {
            toCourseTableItem = yield this.ctx.service.courseTableItem.findById(toCourseTableItemId);
            if (app.moment(toCourseTableItem.date).diff(now, 'days') < 2) {
              this.fail('请提前48小时请假');
              return;
            }
            length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId1(toCourseTableItemId, studentId);
            if (length > 0) {
              this.fail('同一节课不可以有同一个人存在');
              return;
            }
          }
          const courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(fromCourseTableItemId, studentId, 1);
          const courseTableChangeClassForTeacher = yield this.ctx.service.courseTableItemChangeCourse.getByToCourseTableItemIdAndOne(fromCourseTableItemId, 1);
          console.log(courseTableItemChangeCourse,courseTableChangeClassForTeacher)
          let courseTableDetailStudent;
          if (courseTableItemChangeCourse && !courseTableChangeClassForTeacher) {
            courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, studentId);
          } else if (!courseTableItemChangeCourse && !courseTableChangeClassForTeacher) {
            courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(fromCourseTableItem.courseTableDetailId, studentId);
          } else if (!courseTableItemChangeCourse && courseTableChangeClassForTeacher) {
            courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableChangeClassForTeacher.courseTableDetailId,studentId);
          } else if (courseTableItemChangeCourse && courseTableChangeClassForTeacher) {
            courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, studentId);
          } else {
            this.fail('没有找到数据');
            return;
          }
          if (!courseTableDetailStudent.numberOfChangeClass) {
            this.fail('你的调课次数已满不可以在调');
            return;
          }
          const result = yield app.mysql.beginTransactionScope(function* (conn) {
                    // 有人请假这趟课算空闲
            fromCourseTableItem.status = '空闲';
            yield conn.update('course_table_item',fromCourseTableItem);
                    // 关于这个学生这节课算请假
            let fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '正常');
            if (fromCourseTableItemStudents.length === 0) {
              fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '停课');
            }
            if (fromCourseTableItemStudents.length === 0) {
              fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '转课');
            }
            for (let i = 0; i < fromCourseTableItemStudents.length; i++) {
              const item = fromCourseTableItemStudents[i];
              item.status = '请假';
              yield conn.update('course_table_item_student',item)
            }
            if (courseTableItemChangeCourse) {
              courseTableItemChangeCourse.one = 0;
              yield conn.update('course_table_item_change_class', courseTableItemChangeCourse)
              const fromCourseTableItemStudents = yield ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(fromCourseTableItem.id, studentId, '补课');
              fromCourseTableItemStudents[0].status = '请假';
              yield conn.update('course_table_item_student', fromCourseTableItemStudents[0]);
            }
            courseTableDetailStudent.numberOfChangeClass = courseTableDetailStudent.numberOfChangeClass - 1;
            courseTableDetailStudent.numberOfleave = courseTableDetailStudent.numberOfleave - 1;
            if (courseTableChangeClassForTeacher) {
              courseTableChangeClassForTeacher.one = 0;
              yield conn.update('course_table_item_change_class', courseTableChangeClassForTeacher);
              const now = app.moment().format('YYYY-MM-DD HH:mm:ss');
              yield conn.insert('course_table_item_student', { courseTableItemId: toCourseTableItem.id, studentId:studentId,status:'补课',termId:toCourseTableItem.termId,updateTime: now,
              createTime: now,teacherStatus:courseTableDetailStudent.id});
            } else {
              const now = app.moment().format('YYYY-MM-DD HH:mm:ss');
              yield conn.insert('course_table_item_student', { courseTableItemId: toCourseTableItem.id, studentId:studentId,status:'补课',termId:toCourseTableItem.termId,updateTime: now,
              createTime: now});
            }
                    // 添加请假记录表
            yield conn.insert('course_table_item_leave', { courseTableDetailId: courseTableDetailId, courseTableDetailItemId: fromCourseTableItem.id, studentId: studentId, reason: reason, createTime: now });
            yield conn.insert('course_table_item_change_class', { courseTableDetailId:courseTableDetailId,courseTableDetailItemId: toCourseTableItem.id, studentId:studentId,reason:reason,createTime:now,one:1});
            yield conn.update('course_table_detail_student', courseTableDetailStudent);
            const student = yield ctx.service.student.getById(studentId);
            const studentUser = yield ctx.service.user.getById(student.userId);
            const courseTableDetail = yield ctx.service.courseTableDetail.getById(courseTableDetailStudent.courseTableDetailId);
            courseTableDetail.course = yield ctx.service.course.getById(courseTableDetail.courseNameId);
            const oldClassTime = app.moment(fromCourseTableItem.date).format('YYYY.MM.DD') + ' ' + fromCourseTableItem.startTime + '-' + fromCourseTableItem.endTime;
            const newClassTime = app.moment(toCourseTableItem.date).format('YYYY.MM.DD') + ' ' + toCourseTableItem.startTime + '-' + toCourseTableItem.endTime;
            const oldTeacher = yield ctx.service.teacher.getById(fromCourseTableItem.teacherId);
            const oldTeacherUser = yield ctx.service.user.getById(oldTeacher.userId);
            const newTeacher = yield ctx.service.teacher.getById(toCourseTableItem.teacherId);
            const newTeacherUser = yield ctx.service.user.getById(newTeacher.userId);
            const newClassroom = yield ctx.service.classroom.getById(toCourseTableItem.classroomId);
            yield ctx.service.wechat.changeClass(student.name, courseTableDetail.course.name, oldClassTime, newClassTime, reason, newTeacher.name, oldTeacher.name, newClassroom.name, studentUser.publicOpenId, oldTeacherUser.publicOpenId, newTeacherUser.publicOpenId, student.id, oldTeacherUser.id);
            return { code: 1 };
          }, ctx);
          this.ctx.body = result;
          return;

        } *
            addMakeup() {
              const { courseTableDetailId = 0, toCourseTableItemId = 0, reason = '', studentId = 0, currentTeacher = 0 } = this.ctx.request.body;
              const ctx = this.ctx;
              const now = new Date();

              const toCourseTableItem = yield this.ctx.service.courseTableItem.findById(toCourseTableItemId);
              toCourseTableItem.course = yield this.ctx.service.course.getById(toCourseTableItem.courseName);
              if (app.moment(toCourseTableItem.date).diff(now, 'days') < 2) {
                this.fail('请提前48小时请假');
                return
              }
              const length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId1(toCourseTableItemId, studentId);
              if (length > 0) {
                this.fail('同一节课不可以有同一个人存在');
                return
              }
              const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId);
              console.log(courseTableDetailStudent)
              if (!courseTableDetailStudent.numberOfChangeClass) {
                this.fail('你的调课次数已满不可以在调');
                return
              }
              const result = yield app.mysql.beginTransactionScope(function* (conn) {
                    // 有人请假这趟课算空闲
                if (toCourseTableItem.number == 1) {
                  toCourseTableItem.status = '';
                  yield ctx.service.courseTableItem.update(toCourseTableItem);
                }
                courseTableDetailStudent.numberOfChangeClass = courseTableDetailStudent.numberOfChangeClass - 1;
                        // 添加请假记录表
                yield ctx.service.courseTableItemChangeCourse.add(reason, studentId, now, toCourseTableItem.id, courseTableDetailId, 1);
                yield ctx.service.courseTableDetailStudent.update(courseTableDetailStudent);
                yield ctx.service.courseTableItemStudent.add(toCourseTableItem.id, studentId, '补课', toCourseTableItem.termId);
                const student = yield ctx.service.student.getById(studentId);
                const studentUser = yield ctx.service.user.getById(student.userId);
                const classDate = app.moment(toCourseTableItem.date).format('YYYY.MM.DD');
                const classTime = toCourseTableItem.startTime + '-' + toCourseTableItem.endTime;
                const teacher = yield ctx.service.teacher.getById(toCourseTableItem.teacherId);
                const teacherUser = yield ctx.service.user.getById(teacher.userId);
                const classroom = yield ctx.service.classroom.getById(toCourseTableItem.classroomId);
                yield ctx.service.wechat.addMakeUp(student.name, classDate, classTime, teacher.name, classroom, studentUser.publicOpenId, teacherUser.publicOpenId, student.id, toCourseTableItem.course.name,toCourseTableItem.courseTableDetailId);
                return { code: 1 };
              }, ctx);
              this.ctx.body = result;
              return;

            }
            /**
             * 获取学生调课页面的初始数据
             */
    * getChangeClassDataForStudent() {
      const { courseTableItemId = 0, studentId = 0 } = this.ctx.request.query;
      if (!courseTableItemId || !studentId) {
        return this.fail('缺少参数');
      }
      if (isNaN(courseTableItemId) || isNaN(studentId)) {
        return this.fail('传入的参数不是数字');
      }
                // 请假的课
      const courseTableItem = yield this.ctx.service.courseTableItem.findById(courseTableItemId);
      if (courseTableItem == null) {
        this.fail('数据不存在');
        return
      }
      // 这个课程的集合
      const courseTableItems = yield this.ctx.service.courseTableItem.getFreeForStudent(courseTableItem.courseName, courseTableItem.number, courseTableItem.duration, courseTableItem.termId, courseTableItem.level);
      let termClass = [];
      for (let item of courseTableItems) { 
        let courseTableItemStudentLength = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, studentId);
        let courseTableItemStudentS = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(item.id, studentId);
        if (courseTableItemStudentLength == 0&&courseTableItemStudentS.length<courseTableItem.number&&item.isDel===0) { 
            item.date = app.moment(item.date).format('YYYY-MM-DD');
            termClass.push(item);
        }  
      }
        var groupList = app.lodash.groupBy(termClass, 'teacherId');
        let teachers=[]
        for (let teacherId in groupList) { 
            let teacher = yield this.ctx.service.teacher.getById(teacherId)
            let classes = groupList[teacherId];
            for (let item of classes) { 
                let classroom = yield this.ctx.service.classroom.getById(item.classroomId);
                item.classroomName = classroom.name;
            }
            teachers.push({teacher,classes})
        }
         this.ctx.body = {
            teachers,
        };
        
    
     
    }
            /**
             * 获取学生补课页面的初始数据
             */
    *
            getMakeupDataForStudent() {
              const courseTableDetailId = this.ctx.request.query.courseTableDetailId || 0;
              const studentId = this.ctx.request.query.studentId || 0;
              const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
            if (courseTableDetail == null) {
                this.fail('数据不存在');
                return
            }
            // 这个课程的集合
            const courseTableItems = yield this.ctx.service.courseTableItem.getFreeForStudent(courseTableDetail.courseNameId, courseTableDetail.number, courseTableDetail.duration, courseTableDetail.termId, courseTableDetail.level);
            console.log(courseTableItems)    
        let termClass = [];
            for (let item of courseTableItems) { 
                let courseTableItemStudentLength = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, studentId);
                let courseTableItemStudentS = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(item.id, studentId);
                if (courseTableItemStudentLength == 0&&courseTableItemStudentS.length<courseTableDetail.number) { 
                    item.date = app.moment(item.date).format('YYYY-MM-DD');
                    termClass.push(item);
                }  
            }
                var groupList = app.lodash.groupBy(termClass, 'teacherId');
                let teachers=[]
                for (let teacherId in groupList) { 
                    let teacher = yield this.ctx.service.teacher.getById(teacherId)
                    let classes = groupList[teacherId];
                    for (let item of classes) { 
                        let classroom = yield this.ctx.service.classroom.getById(item.classroomId);
                        item.classroomName = classroom.name;
                    }
                    teachers.push({teacher,classes})
                }
                this.ctx.body = {
                    teachers,
                };

            } *
            getChangeClassDataForStudentByTeacherId() {
              const { id = 0, studentId = 0, teacherId = 0 } = this.ctx.request.body;
              const item = yield this.ctx.service.courseTableItem.findById(id);
              if (item == null) {
                this.fail('数据不存在');
                return;
              }
                // 当前老师下查询空闲时间
              const list = yield this.ctx.service.courseTableItem.getFreeByteacherIdForStudent(item.courseName, item.number, item.duration, item.termId, item.level, teacherId);
              for (const [ index, it ] of list.entries()) {
                if (item.id == it.id) {
                  list.splice(index, 1);
                }
              }
              const teacher = yield this.service.teacher.getById(item.teacherId);
              const result = [];
              const groupList = app.lodash.groupBy(list, 'teacherId');
                // 筛选空闲的时间（二次筛选）
              for (const item in groupList) {
                for (var i = 0; i < groupList[item].length; i++) {
                  const length = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(groupList[item][i].id);
                  if (length >= groupList[item][i].number) {
                    groupList[item].splice(i, 1);
                    i = -1;
                  }
                }
              }

                // 筛选空闲的时间（三次筛选）
              for (const item in groupList) {
                for (var i = 0; i < groupList[item].length; i++) {
                  const isCourseTableItem = yield this.ctx.service.courseTableItemStudent.getStudentByCourseTableItemIdAndStudentId(groupList[item][i].id, studentId);
                  for (let j = 0; j < isCourseTableItem.length; j++) {
                    if (isCourseTableItem[j].status == '请假') {
                      isCourseTableItem.splice(j, 1);
                      j = -1;
                    }
                  }
                  if (isCourseTableItem.length > 0 && isCourseTableItem.length >= groupList[item][i].number) {
                    groupList[item].splice(i, 1);
                    i = -1;
                  }
                }
              }

              let courseTableItems = [];
              for (var i in groupList) {
                courseTableItems = app.lodash.sortBy(groupList[i], function(o) {
                        // console.log(o.date +' '+ o.startTime);
                  const date = app.moment(o.date).format('YYYY-MM-DD');
                  return app.moment(date + ' ' + o.startTime).unix();
                });
                for (let j = 0; j < courseTableItems.length; j++) {
                  const day = new Date().getDay();
                  const startDate = app.moment().subtract(day, 'days');
                  const endDate = app.moment(startDate).add(14, 'days');
                  if (new Date(startDate).getTime() < new Date(courseTableItems[j].date).getTime() && new Date(courseTableItems[j].date).getTime() < new Date(endDate).getTime()) {
                    courseTableItems[j].startTime = this.ctx.helper.formatTime(courseTableItems[j].startTime);
                    courseTableItems[j].endTime = this.ctx.helper.formatTime(courseTableItems[j].endTime);
                    courseTableItems[j].date = app.moment(courseTableItems[j].date).format('YYYY-MM-DD');
                    courseTableItems[j].classroomName = (yield this.service.classroom.getById(courseTableItems[j].classroomId)).name;
                  } else {
                    courseTableItems.splice(j, 1);
                    j = -1;
                  }
                }
              }
                // 筛选空闲的时间（四次筛选）
              for (let i = 0; i < courseTableItems.length; i++) {
                const isCourseTableItem = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(courseTableItems[i].id, studentId);
                if (isCourseTableItem > 0) {
                  courseTableItems.splice(i, 1);
                  courseTableItems;
                  i = -1;
                }
              }
              this.success(courseTableItems);
            } *
            getMakeupDataForStudentByTeacherId() {
              const { nCourseTableDetailId = 0, studentId = 0, teacherId = 0 } = this.ctx.request.body;
              const item = yield this.ctx.service.courseTableDetail.getById(nCourseTableDetailId);
              if (item == null) {
                this.fail('数据不存在');
                return;
              }
                // 当前老师下查询空闲时间
              const list = yield this.ctx.service.courseTableItem.getFreeByteacherIdForStudent(item.courseName, item.number, item.duration, item.termId, item.level, teacherId);
              console.log(list);
              const teacher = yield this.service.teacher.getById(item.teacherId);
              const result = [];
              const groupList = app.lodash.groupBy(list, 'teacherId');

                // 筛选空闲的时间（二次筛选）
              for (const item in groupList) {
                for (var i = 0; i < groupList[item].length; i++) {
                  const length = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(groupList[item][i].id);
                  if (length >= groupList[item][i].number) {
                    groupList[item].splice(i, 1);
                    i = -1;
                  }
                }
              }

                // 筛选空闲的时间（三次筛选）
              for (const item in groupList) {
                for (var i = 0; i < groupList[item].length; i++) {
                  const isCourseTableItem = yield this.ctx.service.courseTableItemStudent.getStudentByCourseTableItemIdAndStudentId(groupList[item][i].id, studentId);
                  for (let j = 0; j < isCourseTableItem.length; j++) {
                    if (isCourseTableItem[j].status == '请假') {
                      isCourseTableItem.splice(j, 1);
                      j = -1;
                    }
                  }
                  if (isCourseTableItem.length > 0 && isCourseTableItem.length >= groupList[item][i].number) {
                    groupList[item].splice(i, 1);
                    i = -1;
                  }
                }
              }
              let courseTableItems = [];
              for (var i in groupList) {
                courseTableItems = app.lodash.sortBy(groupList[i], function(o) {
                        // console.log(o.date +' '+ o.startTime);
                  const date = app.moment(o.date).format('YYYY-MM-DD');
                  return app.moment(date + ' ' + o.startTime).unix();
                });
                for (let j = 0; j < courseTableItems.length; j++) {
                  const day = new Date().getDay();
                  const startDate = app.moment().subtract(day, 'days');
                  const endDate = app.moment(startDate).add(14, 'days');
                  if (new Date(startDate).getTime() < new Date(courseTableItems[j].date).getTime() && new Date(courseTableItems[j].date).getTime() < new Date(endDate).getTime()) {
                    courseTableItems[j].startTime = this.ctx.helper.formatTime(courseTableItems[j].startTime);
                    courseTableItems[j].endTime = this.ctx.helper.formatTime(courseTableItems[j].endTime);
                    courseTableItems[j].date = app.moment(courseTableItems[j].date).format('YYYY-MM-DD');
                    courseTableItems[j].classroomName = (yield this.service.classroom.getById(courseTableItems[j].classroomId)).name;
                  } else {
                    courseTableItems.splice(j, 1);
                    j = -1;
                  }
                }
              }

                // 筛选空闲的时间（四次筛选）
              for (let i = 0; i < courseTableItems.length; i++) {
                console.log(courseTableItems[i].id, studentId);
                const isCourseTableItem = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(courseTableItems[i].id, studentId);
                console.log(isCourseTableItem);
                if (isCourseTableItem > 0) {
                  courseTableItems.splice(i, 1);
                  i = -1;
                }
              }
              this.success(courseTableItems);
            } *
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
            } *
            getListByTermIdAndstundetId() {
              const { termId, studentId } = this.ctx.request.query;
              if (!termId) {
                this.fail('学期不能为空');
                return;
              }
              if (!studentId) {
                this.fail('学生不能为空');
                return;
              }
              const result = yield this.ctx.service.courseTableItemChangeCourse.getListByTermIdAndstundetId(termId, studentId);
              for (const item of result) {
                item.date = app.moment(item.date).format('YYYY-MM-DD');
                item.startTime = item.startTime.substr(0, 5);
                item.endTime = item.endTime.substr(0, 5);
                item.createTime1 = app.moment(item.createTime1).format('YYYY-MM-DD HH:mm');
                item.oTeacher = yield this.ctx.service.teacher.getById(item.teacherId);
                item.oClassroom = yield this.ctx.service.classroom.getById(item.classroomId);
              }
              this.success(result);

            } *
            getList() {
              const pageIndex = app.lodash.parseInt(this.ctx.request.query.pageIndex) || 0;
              const termId = app.lodash.parseInt(this.ctx.request.query.termId) || 0;
              const limit = app.lodash.parseInt(this.ctx.request.query.limit) || 10;
              const data = yield this.ctx.service.courseTableItemChangeCourse.getList(pageIndex, termId, limit);
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
            } *
            getChangeClassByCourseTableDetailIdAndStudentId() {
              const { courseTableDetailId, studentId } = this.ctx.request.query;
              const aList = yield this.ctx.service.courseTableItemChangeCourse.getChangeClassByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId);
              for (const item of aList) {
                item.courseTableDetailItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
              }
              this.success(aList);
            }
    }

  return CourseTableChangeClassController;

};
