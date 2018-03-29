module.exports = app => {
  class CourseTableItemController extends app.Controller {
    *
        addItem() {
          const date = app.moment(this.ctx.request.body.date).format('YYYY-MM-DD');
          const classroomId = this.ctx.request.body.classroomId;
          const startTime = this.ctx.request.body.startTime;
                // let endTime = this.ctx.request.body.endTime;
          const courseName = this.ctx.request.body.courseNameId;
          const number = this.ctx.request.body.number;
          const duration = this.ctx.request.body.duration;
          const level = this.ctx.request.body.level;
          const type = this.ctx.request.body.type;
          const status = '空闲';
          const teacherId = this.ctx.request.body.teacherId || 0;
          const termId = this.ctx.request.body.termId || 0;
          const id = this.ctx.request.body.id || 0;
          const endTime = app.moment('2017-01-01 ' + startTime).add(duration, 'minutes');
          const students = this.ctx.request.body.students || [];
          const list = yield this.service.courseTableItem.getList1(termId, teacherId, date);
          for (const _item of list) {
            const _startTime = `2017-01-01 ${_item.startTime}`;
            const _endTime = `2017-01-01 ${_item.endTime}`;
            const _startTime1 = `2017-01-01 ${startTime}`;
            const _endTime1 = endTime;
            if (_item.id != id && this.ctx.helper.durationConflict(_startTime, _endTime, _startTime1, _endTime1)) {
              this.fail('时间有冲突，请选择其他时间');
              return;
            }
          }
          if (id > 0) {
            const info = yield this.ctx.service.courseTableItem.getById(id);
            if (info == null) {
              this.fail('数据不存在');
              return;
            }
            info.type = type;
            info.classroomId = classroomId;
            info.duration = duration;
            info.endTime = endTime.format('HH:mm');
            if (info.number > 1) {
              info.number = number;
            }
            yield this.ctx.service.courseTableItem.update(info);
          } else {
            const ctx=this.ctx
            const result = yield app.mysql.beginTransactionScope(function* (conn) {
                  const info = yield ctx.service.courseTableItem.add(0, teacherId, date,
                  startTime, endTime.format('HH:mm'), classroomId, courseName, number, duration, level, status, type, termId);
                  if (type === '课时课') {
                    //找出一样的课时课 规则是条件相同的课程不添加
                    let isSameClass = yield ctx.service.courseTableDetail.getSameClassByClassNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumber(courseName, teacherId, duration, level, termId,number);
                    if (isSameClass.length > 0) {
                      console.log('已经有相同的课程');
                    } else { 
                      const detail = yield ctx.service.courseTableDetail.add(
                          termId,
                          teacherId,
                          courseName,
                          level,
                          number,
                          duration,
                          classroomId,
                          '',
                          startTime,
                          endTime,
                          '空闲',
                          null,
                          null,
                          '是',
                          0,
                          date,
                          info.id
                      );
                    }
                  }
                  return { success: true };
            },ctx); 
            if (students.length > 0) {
              for (const item of students) {
                if (item.isSelect) {
                  const oUser = yield this.ctx.service.user.getById(item.userId);
                  const teacher = yield this.ctx.service.teacher.getById(teacherId);
                  const classroom = yield this.ctx.service.classroom.getById(classroomId);
                  yield this.ctx.service.wechat.remedialNotice(item.name, courseName, date + ' ' + startTime + '-' + endTime, startTime + '-' + endTime, teacher.name, classroom.name, oUser.publicOpenId, item.id);
                }
              }
            }
          }
          this.success();
        }
    * update() {
      const { id, courseName, number, duration, classroomName, level, startTime, endTime } = this.ctx.request.body;
      console.log(id);
      if (!id) {
        return this.fail('id不存在');
      }
      if (!duration) {
        return this.fail('时长不能为空');
      }
      const courseTableItem = yield this.ctx.service.courseTableItem.getById(id);
      courseTableItem.duration = duration;
      courseTableItem.classroomId = classroomName;
      courseTableItem.endTime = endTime;
      yield this.ctx.service.courseTableItem.update(courseTableItem);
      this.success();
    }
    *
            getBookingCourseTeacher() {
              const result = yield this.ctx.service.courseTableItem.getBookingCourseTeacher(this.ctx.request.query.courseName, this.ctx.request.query.date);
              this.success(result);
            } *
            getBookingCourse() {
              const result = yield this.ctx.service.courseTableItem.getBookingCourse();
              this.success(result);
            } *
            getBookingCourseTime() {
              const result = yield this.ctx.service.courseTableItem.getBookingCourseTime(this.ctx.request.query.courseName);
              this.success(result);
            } *
            getById() {
              const result = yield this.ctx.service.courseTableItem.getById(this.ctx.request.query.id);
              let courseTableItemStudents = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(result.id);
              let students = [];
              for (let item of courseTableItemStudents) { 
                let student = yield this.ctx.service.student.getById(item.studentId);
                students.push(student);
              }
              result.students = students;
              result.course = yield this.ctx.service.course.getById(result.courseName);
              result.classroom = yield this.ctx.service.classroom.getById(result.classroomId);
              this.success(result);
            } *
            getBookingCourseOtherTime() {
              const result = yield this.ctx.service.courseTableItem.getBookingCourseOtherTime(this.ctx.request.query.id);
              this.success(result);
            }
            /**
             * 获取转班的开始日期通过课程id
             */
    *
            getWeekById() {
              const result = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(this.ctx.request.query.courseTableDetailId);
              this.success(result);
            } *
            deleteItem() {
              const id = this.ctx.request.body.id;
              const courseTableItem = yield this.ctx.service.courseTableItem.getById(id);
              const students = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(id);
              const aBookingStudent = yield this.ctx.service.bookingCourse.getByCourseTableItemId(id);
              if (courseTableItem.type === '课时课') {
                const courseTableDetail = yield this.ctx.service.courseTableDetail.getByCourseTableItemId(courseTableItem.id);
                courseTableDetail.isDel = 1;
                yield this.ctx.service.courseTableDetail.update(courseTableDetail);
              }
              if (students.length > 0 || aBookingStudent.length > 0) {
                    // this.ctx.body = { result:false, msg:'当前课程下有学生，无法删除'};
                this.fail('当前课程下有学生，无法删除');
                return;
              }
              yield this.ctx.service.courseTableItem.deleteById(id);
              this.success();
                // this.ctx.body = { result: true };
            }
            /* 获取一周的课程表 */
    *
            getWeekItems() {
              const termId = this.ctx.request.query.termId;
              const teacherId = this.ctx.request.query.teacherId;
              const term = yield this.ctx.service.term.getById(termId);
              const startDate = app.moment(this.ctx.request.query.startDate).day(1);
              const endDate = app.moment(startDate).day(7);
                // var courseTable = yield this.ctx.service.courseTable.findById(id);
              const teacher = yield this.ctx.service.teacher.findById(teacherId);
              const user = yield this.ctx.service.user.getById(teacher.userId);
                // courseTable.teacherName = teacher.name;
              const lists = yield this.ctx.service.courseTableItem.find(termId, teacherId, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
              for (const item of lists) {
                item.course = yield this.ctx.service.course.getById(item.courseName);
              }
                // this.ctx.logger.info(lists);
              const result = yield this.generateItemJson(startDate, lists);
              for (const item of result) {
                for (const i of item.list) {
                  i.remarks = JSON.parse(i.remarks);
                }
              }
              this.ctx.body = { list: result, startDate: term.startDate, endDate: term.endDate, name: teacher.name,user };
            }
            /**
             * 获取请假用户长度
             */
    *
            levelLength() {
              const { courseTableDetailId, studentId } = this.ctx.request.query;
              const courseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailId);
              const aCourseTableItemStudent = [];
                    // for (let item of courseTableItem) {
                    //     let result = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(item.id, '补课')
                    //     console.log(item.id, result)
                    //     if (result) {
                    //         aCourseTableItemStudent.push(result)
                    //     }
                    // }
              for (const item of courseTableItem) {
                let courseTableItemId = item.id;
                while (courseTableItemId) {
                  const result = yield this.ctx.service.courseTableItemSwitch.getByToCourseTableItemIdAndStudentId(courseTableItemId, studentId);
                  if (result) {
                    aCourseTableItemStudent.push(result);
                    courseTableItemId = result.toCourseTableItemId;
                  } else {
                    courseTableItemId = 0;
                  }
                }
              }
              this.success(aCourseTableItemStudent);
            }
            /* 获取一周的课程表 */
    *
            getWeekItemsForStudent() {

                // id, startDate
              const termId = this.ctx.request.query.termId;
              const studentId = this.ctx.request.query.studentId;
              const startDate = app.moment(this.ctx.request.query.startDate).day(1);
              const endDate = app.moment(startDate).day(7);

              const term = yield this.ctx.service.term.getById(termId);
              const student = yield this.service.student.getById(studentId);
              const lists = yield this.ctx.service.courseTableItem.getList(termId, studentId, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
                // this.ctx.logger.info(lists);

              const result = yield this.generateItemJson(startDate, lists);
              this.ctx.body = { list: result, startDate: term.startDate, endDate: term.endDate, name: student.name };
            }
            /**
             * 根据参数生成客户端可用的json数据
             * @param {Date} startDate
             * @param {Array} lists courseTableItem集合
             */
    *
            getClassBerforsuspendClasses() {
              const { suspensionDateId, studentId } = this.ctx.request.query;
              const courseTableItem = yield this.ctx.service.courseTableItem.getById(suspensionDateId);

              const aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableItem.courseTableDetailId);
              const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItem.courseTableDetailId, studentId);
              const classBerforsuspendClasses = [];
              for (const item of aCourseTableItem) {
                const courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId1(item.id, studentId);
                if (item.id < suspensionDateId && courseTableItemStudent.length > 0) {
                  classBerforsuspendClasses.push(item);
                }
              }
              const aCourseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getChangeClassByCourseTableDetailIdAndStudentId(courseTableItem.courseTableDetailId, studentId);
              for (const item of aCourseTableItemChangeCourse) {
                const courseTableItem1 = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
                const date1 = new Date(courseTableItem.date);
                const date2 = new Date(courseTableItem1.date);
                const time1 = new Date(date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()).getTime();
                const time2 = new Date(date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()).getTime();
                if (date2 < date1) {
                  classBerforsuspendClasses.push(courseTableItem1);
                }
              }
                // if (classBerforsuspendClasses.length == 0) {
              const courseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByCourseTableDetailStudentIdAndOne(courseTableDetailStudent.id, 1);
              for (const item of courseTableChangeClassForTeacher) {
                let fromCourseTableItem = item.fromCourseTableItemId;
                const toCourseTableItem = item.toCourseTableItemId;
                let endCourseTableItem;
                let endToCourseTableItem;
                while (fromCourseTableItem) {
                  const courseTableChangeClassForTeacher1 = yield this.ctx.service.courseTableChangeClassForTeacher.getByCourseTableDetailStudentIdAndToCourseTableItemIdAndOne(courseTableDetailStudent.id, fromCourseTableItem, 0);
                  if (courseTableChangeClassForTeacher1) {
                    fromCourseTableItem = courseTableChangeClassForTeacher1.fromCourseTableItemId;
                  } else {
                    endCourseTableItem = fromCourseTableItem;
                    fromCourseTableItem = 0;
                  }
                }
                if (endCourseTableItem < suspensionDateId) {
                  endToCourseTableItem = yield this.ctx.service.courseTableItem.getById(endCourseTableItem);
                  classBerforsuspendClasses.push(endToCourseTableItem);
                }
              }
              this.success(classBerforsuspendClasses);
            } *
            generateItemJson(startDate, lists) {
              const result = [];
              for (let index = 1; index <= 7; index++) {
                const dayOfWeek = app.moment.weekdays()[index % 7];
                var obj = {
                  date: app.moment(startDate).add(index - 1, 'days'),
                  dayOfWeek,
                  list: [],
                };
                const list = app.lodash.filter(lists, function(ii) {
                  return app.moment(ii.date).format('YYYY-MM-DD') == app.moment(obj.date).format('YYYY-MM-DD');
                });
                for (let j = 0; j < list.length; j++) {

                  const item = list[j];
                        // item.startTime = app.moment(item.startTime);
                  const course = yield this.ctx.service.course.getById(item.courseId);
                  if (course) {
                    item.course = {
                      name: course.name,
                      type: course.type,
                      time: course.time,
                    };
                  }
                  const classroom = yield this.ctx.service.classroom.getById(item.classroomId);
                  if (classroom) {
                    item.classroomName = classroom.name;
                  }
                        // const switchs = yield this.ctx.service.courseTableItemSwitch.getByToCourseTableItemId(item.id);
                  const students = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(item.id);
                        // const switchTo = yield this.ctx.service.courseTableItemSwitch.getByFromCourseTableItemId(item.id);
                  item.students = [];
                  for (let k = 0; k < students.length; k++) {
                    console.log(list, students,111);
                    if (students[k].status != '正常' && students[k].status != '停课'  && students[k].status != '转课') continue;
                    const ss = yield this.ctx.service.student.getById(students[k].studentId);
                    const courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getCourseTableDetailStudentByCouseTableDetailIdAndStudentId(item.courseTableDetailId, students[k].studentId);
                    const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
                    let numberOfleave;
                    let allNumberOfChangeClassForTeacher;
                    // if (students[k].status === '补课' && !students[k].teacherStatus) {
                    //   const courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(students[k].courseTableItemId, students[k].studentId, 1);
                    //   const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, students[k].studentId);
                    //   numberOfleave = courseTableDetailStudent.numberOfleave;
                    //   allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher;
                    // } else if (students[k].status === '正常' && students[k].teacherStatus) {
                    //   const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(Number(students[k].teacherStatus));
                    //   numberOfleave = courseTableDetailStudent.numberOfleave;
                    //   allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher;
                    // } else if (students[k].status === '补课' && students[k].teacherStatus) {
                    //   const courseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(students[k].courseTableItemId, students[k].studentId, 1);
                    //   const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItemChangeCourse.courseTableDetailId, students[k].studentId);
                    //   numberOfleave = courseTableDetailStudent.numberOfleave;
                    //   allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher;
                    // } else {
                    //   const courseTableItem = yield this.ctx.service.courseTableItem.getById(students[k].courseTableItemId);
                    //   const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItem.courseTableDetailId, students[k].studentId);
                    //   numberOfleave = courseTableDetailStudent.numberOfleave;
                    //   allNumberOfChangeClassForTeacher = courseTableDetailStudent.allNumberOfChangeClassForTeacher;
                    // }
                            // ss.switch = app.lodash.find(switchs, { studentId: ss.id });
                            // ss.switchTo = app.lodash.find(switchTo, { studentId: ss.id });
                    item.students.push({ student: ss, status: students[k].status, teacherStatus: students[k].teacherStatus, courseTableItemStudent: courseTableItemStudent[0], courseTableDetail, numberOfleave, allNumberOfChangeClassForTeacher });
                  }
                  const teacher = yield this.service.teacher.findById(item.teacherId);
                  item.teacher = {
                    id: teacher.id,
                    name: teacher.name,
                            // switch: app.lodash.find(switchs, function(ii) { return ii.teacherId > 0; }),
                  };

                  item.aStudentName = [];
                  const courses = yield app.mysql.query('select * from  booking_course  where state =\'已确认\'');
                  for (const it of courses) {
                    if (it.confirmedId && it.confirmedId == item.id) {
                      const student = yield this.ctx.service.student.getById(it.studentId);
                      item.aStudentName.push(student);
                    } else if (!it.confirmedId && it.courseTableItemId == item.id) {
                      const student = yield this.ctx.service.student.getById(it.studentId);
                      item.aStudentName.push(student);
                    }
                  }
                  obj.list.push(item);
                }
                result.push(obj);
              }
              return result;
            }
            //小程序选课报名
            *signUpClassTimeClass() {
              let { courseTableItems, courseTableDetailId ,studentId } = this.ctx.request.body;
              const ctx = this.ctx;
              yield app.mysql.beginTransactionScope(function* (conn) {
                ctx.conn = conn;
                for (let item of courseTableItems) { 
                  let courseTableItem = yield ctx.service.courseTableItem.getById(item)
                  const courseTableDetailStudent = yield ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId);
                  courseTableDetailStudent.selectNum++;
                  yield ctx.service.courseTableDetailStudent.update(courseTableDetailStudent);
                  yield ctx.service.courseTableItemStudent.add(item, studentId, '正常', courseTableItem.termId);
                }
              }, ctx);
              this.success()
            }
          // 小程序老师端考勤页面
          *checkWork() { 
            let { courseTableItemId, teacherId } = this.ctx.request.query;
            let teacher = yield this.ctx.service.teacher.getById(teacherId);
            let teacherUser = yield this.ctx.service.user.getById(teacher.userId);
            let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableItemId);
            let date = new Date(courseTableItem.date);
            courseTableItem.date = app.moment(courseTableItem.date).format('YYYY.MM.DD');
            courseTableItem.dayOfWeek = date.getDay();
            courseTableItem.startTime = courseTableItem.startTime.substring(0, 5);
            courseTableItem.endTime =  courseTableItem.endTime.substring(0, 5);
            let courseTableItemStudents = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(courseTableItemId);
            let courseName = yield this.ctx.service.course.getById(courseTableItem.courseName);
            let classroom = yield this.ctx.service.classroom.getById(courseTableItem.classroomId);
            for (let item of courseTableItemStudents) { 
              item.student = yield this.ctx.service.student.getById(item.studentId);
              item.user = yield this.ctx.service.user.getById(item.student.userId);
            }
            let result = {
              teacher,
              courseTableItem,
              courseName,
              classroom,
              teacherUser,
              courseTableItemStudents
            }
            this.success(result);
          }
          //小程序老师端考勤确认
          *checkWorkSubmit() { 
            let { courseTableItemId, courseTableItemStudents } = this.ctx.request.body;
            console.log(courseTableItemId, courseTableItemStudents)
            let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableItemId);
            courseTableItem.isChecked = 1;
            for (let item of courseTableItemStudents) { 
              let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getById(item.id);  
              courseTableItemStudent.isGoClass = item.isGoClass;
              yield this.ctx.service.courseTableItemStudent.update(courseTableItemStudent);  
            }
            yield this.ctx.service.courseTableItem.update(courseTableItem);
            return this.success();
          }
         //小程序老师端评论信息
        *getCommentDetail() { 
          let { courseTableItemId = 0, studentId = 0 } = this.ctx.request.query;
          if (courseTableItemId===0||studentId===0) { 
             return
          }
          let student = yield this.ctx.service.student.getById(studentId);
          let user = yield this.ctx.service.user.getById(student.userId);
          let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableItemId); 
          let course = yield this.ctx.service.course.getById(courseTableItem.courseName);
          let classroom = yield this.ctx.service.classroom.getById(courseTableItem.classroomId);
          let date = new Date(courseTableItem.date);
          courseTableItem.dayOfWeek = date.getDay();
          courseTableItem.date = app.moment(courseTableItem.date).format('YYYY.MM.DD');
          courseTableItem.startTime = courseTableItem.startTime.substring(0, 5);
          courseTableItem.endTime = courseTableItem.endTime.substring(0,5);
          let result = {
            student,
            user,
            courseTableItem,
            course,
            classroom
          }
          this.success(result)
        }
        //后台老师获取调课信息
      *getChangeClassInfo() { 
        let { courseTableItemId=0 } = this.ctx.request.query;
        if (courseTableItemId===0) { 
          return this.fail('参数不对');
        }
        let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableItemId); 
        courseTableItem.date = app.moment(courseTableItem.date).format('YYYY-MM-DD');
        let date = new Date();
        courseTableItem.dayOfWeek = app.cnum[date.getDay()];
        courseTableItem.startTime = courseTableItem.startTime.substring(0, 5);
        courseTableItem.endTime = courseTableItem.endTime.substring(0, 5);
        courseTableItem.course = yield this.ctx.service.course.getById(courseTableItem.courseName);
        courseTableItem.classroom = yield this.ctx.service.classroom.getById(courseTableItem.classroomId);
        courseTableItem.teacher = yield this.ctx.service.teacher.getById(courseTableItem.teacherId);
        //查询当前课下有几个学生
        let courseTableItemStudents = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(courseTableItem.id);
        //查询可以调课的老师信息
        let courseTableItems = yield this.ctx.service.courseTableItem.getSameClassByCourseNameIdAndDurationAndLevelAndTermIdAndNumber(courseTableItem.courseName,courseTableItem.duration,courseTableItem.level,courseTableItem.termId,courseTableItem.number);
        let changeClass = [];
        for (let item of courseTableItems) {
          let courseTableItemStudents1 = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(item.id);
          let index = 0
          for (let it of courseTableItemStudents) {
            for (let i of courseTableItemStudents1) { 
              if (it.studentId===i.studentId) { 
                index++
              }
            }
          }
          if (index>0) { 
            continue
          }
          let students = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(item.id);
              if (courseTableItemStudents.length + students.length <= item.number && item.isDel === 0 && item.id != courseTableItemId) { 
                item.classroom = yield this.ctx.service.classroom.getById(item.classroomId);
                item.date = app.moment(item.date).format('YYYY-MM-DD');
                let date = new Date();
                item.dayOfWeek = app.cnum[date.getDay()];
                item.startTime = item.startTime.substring(0, 5);
                item.endTime = item.endTime.substring(0, 5);
                changeClass.push(item);
              }
        }
        changeClass.sort((item1, item2) => { 
          let date1 = new Date(item1.date + " " + item1.startTime); 
          let date2 = new Date(item2.date+" "+item2.startTime); 
          return  date1.getTime() - date2.getTime();
        })
        const courseTableItemsGroup = app.lodash.groupBy(changeClass, 'teacherId');
        let courseTableItemsGroup1 = [];
        for (let key in courseTableItemsGroup) { 
          let teacher = yield this.ctx.service.teacher.getById(key); 
          courseTableItemsGroup1.push({teacher,courseTableItemsGroup:courseTableItemsGroup[key]})
        }
        courseTableItem.level = app.levels[courseTableItem.level - 1].name;
        let result = { 
          courseTableItem,
          courseTableItemsGroup1
        }
        return this.success(result);
      }
      //后台老师获取调课信息
      *getClassTimeLeaveInfo() { 
        let { courseTableItemId=0 } = this.ctx.request.query;
        if (courseTableItemId===0) { 
          return this.fail('参数不对');
        }
        let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableItemId); 
        courseTableItem.date = app.moment(courseTableItem.date).format('YYYY-MM-DD');
        let date = new Date();
        courseTableItem.dayOfWeek = app.cnum[date.getDay()];
        courseTableItem.startTime = courseTableItem.startTime.substring(0, 5);
        courseTableItem.endTime = courseTableItem.endTime.substring(0, 5);
        courseTableItem.course = yield this.ctx.service.course.getById(courseTableItem.courseName);
        courseTableItem.classroom = yield this.ctx.service.classroom.getById(courseTableItem.classroomId);
        courseTableItem.teacher = yield this.ctx.service.teacher.getById(courseTableItem.teacherId);
        let result = { 
          courseTableItem,
        }
        return this.success(result);
      }
      //得到该大表下的所有课程
      *getListEvenClassDetail() { 
          let { courseTableDetailId = 0 } = this.ctx.request.query;
          if (!courseTableDetailId) { 
              return this.fail('请选择课程'); 
          }   
          let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
          let courseTableItems = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailId);
          for (let item of courseTableItems) { 
              item.courseTableItemStudents = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemId(item.id,'正常') 
              item.teacher = yield this.ctx.service.teacher.getById(item.teacherId);
              let date = new Date(item.date);
              item.date = app.moment(item.date).format("YYYY-MM-DD");
              item.startTime = item.startTime.substring(0, 5);
              item.endTime = item.endTime.substring(0, 5);
              item.course = yield this.ctx.service.course.getById(item.courseName);
          }
          this.success(courseTableItems);
      }
      //转班
      *classTransfer() { 
          let { courseTableDetailId = 0, classTransferCourseTableDetailId = 0, studentId = 0, shiftCourseTableItemId=0, reason=''} = this.ctx.request.body;
          if (!courseTableDetailId||!studentId) { 
              return this.fail('参数不全');
          }
          if (!classTransferCourseTableDetailId) { 
            return this.fail('请选择转班课程');
          }
          if (!shiftCourseTableItemId) { 
            return this.fail('请选择开始时间');
          }
          if (!reason) { 
            return this.fail('请输入转班原因');
          }
          let classTransferCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(classTransferCourseTableDetailId);
          let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.get(courseTableDetailId,studentId)
          let courseTableItems = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(classTransferCourseTableDetailId); 
          let ctx = this.ctx
          let result = yield app.mysql.beginTransactionScope(function* (conn) { 
              conn.insert('course_table_detail_student', {
                  studentId,
                  courseTableDetailId: classTransferCourseTableDetailId,
                  status: '正常',
                  originalCourseTableDetailId: courseTableDetailId,
                  termId: classTransferCourseTableDetail.termId,
                  signUpCurriculumId: 0,
                  numberOfChangeClass: classTransferCourseTableDetail.totalLeave,
                  allNumberOfChangeClass:classTransferCourseTableDetail.totalLeave,
                  numberOfleave:classTransferCourseTableDetail.totalLeave,
                  startCourseTableItemId:shiftCourseTableItemId,
                  numberOfChangeClassForTeacher:1000,
                  allNumberOfChangeClassForTeacher:1000,
                  classTimeNum:0,
              })
              courseTableDetailStudent.classTransferCourseTableDetailId = classTransferCourseTableDetailId;
              courseTableDetailStudent.shiftStartCourseTableItemId = shiftCourseTableItemId;
              courseTableDetailStudent.shiftReasons = reason;
              courseTableDetailStudent.status = '转班';
              conn.update('course_table_detail_student', courseTableDetailStudent);
              for (let item of courseTableItems) { 
                  if (item.id >= shiftCourseTableItemId) { 
                      conn.insert('course_table_item_student', {
                        courseTableItemId:item.id,
                          studentId,
                          status:"正常",
                          termId: classTransferCourseTableDetail.termId,
                          updateTime: new Date(),
                          createTime: new Date(),
                      })
                  } 
              }
            return {success:true}
        }, this.ctx) 
        if (result.success) {
          this.success()
        } else { 
          this.fail('数据出错');
        }
      }
    //课时课请假
    *classTimeLeave() { 
       
    }
      //得到课时课请假的记录
      * getClassTimeLeaveRecord () { 
          let { courseTableDetailId=0, studentId=0 } = this.ctx.request.query;
          if (!courseTableDetailId||!studentId) { 
            return this.fail('参数缺少');
          }
          let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
          if (!courseTableDetail) { 
            return this.fail('数据不存在');  
          }
          courseTableDetail.course = yield this.ctx.service.course.getById(courseTableDetail.courseNameId);
          courseTableDetail.teacher = yield this.ctx.service.teacher.getById(courseTableDetail.teacherId);
          courseTableDetail.classroom = yield this.ctx.service.classroom.getById(courseTableDetail.classroomId);
          let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.get(courseTableDetailId, studentId) 
          let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableDetail.courseTableItemId);
          let sameCourseTableItems = yield this.ctx.service.courseTableItem.getSameClassByCourseNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumberAndIsDel(courseTableItem.courseName,courseTableItem.teacherId,courseTableItem.duration,courseTableItem.level,courseTableItem.termId,courseTableItem.number)
          let courseTableItems = [];
        for (let it of sameCourseTableItems) {
              console.log(it,studentId)
              let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(it.id, studentId, '请假')
              if (courseTableItemStudent) {
                it.date = app.moment(it.date).format('YYYY-MM-DD');
                it.startTime = it.startTime.substring(0, 5);
                it.endTime = it.endTime.substring(0, 5);
                it.reason = courseTableItemStudent.reason;
                it.courseTableDetail = courseTableDetail;
                courseTableItems.push(it);
              }
          }
          let result = {
            courseTableItems
          }
          this.success(result); 
      }
      //小程序获取预约课程
      *getBookingCourses () {
        let { studentId } = this.ctx.request.query
        let list = yield this.ctx.service.courseTableItem.getBookingCourse();
        let bookingCourses = [];
        let list2 = [];
        for (let item of list) { 
          let bookingCourse = yield this.ctx.service.bookingCourse.getBookingCourse(item.id, studentId);
          console.log(bookingCourse)
          if (!bookingCourse) { 
            list2.push(item);
          }
        }
        let list1 = app.lodash.groupBy(list2, 'teacherId')
        for (let key of Object.keys(list1)) { 
          let teacher = yield this.ctx.service.teacher.getById(key);
          let user = yield this.ctx.service.user.getById(teacher.userId);
            for (let item of  list1[key]) { 
              item.course = yield this.ctx.service.course.getById(item.courseName);
              let date = new Date(item.date); 
              item.date = app.moment(item.date).format('YYYY-MM-DD');
              item.dayOfWeek = app.cnum[date.getDay()];
              item.startTime = item.startTime.substring(0, 5);
              item.endTime = item.endTime.substring(0, 5);
            }
          let result={ 
            teacher,
            user,
            courseTableItem:list1[key]
          }
          bookingCourses.push(result);
        }
        this.success(bookingCourses);
      }
    //小程序预约报名的课程信息
    *getBookingCourseItem() {
      let { courseTableItemId=0 } = this.ctx.request.query;
      if (!courseTableItemId) { 
        return this.fail('参数不对');  
      }
      let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableItemId);
      let date = new Date(courseTableItem.date);
      courseTableItem.teacher = yield this.ctx.service.teacher.getById(courseTableItem.teacherId);
      courseTableItem.term = yield this.ctx.service.term.getById(courseTableItem.termId);
      courseTableItem.user = yield this.ctx.service.user.getById(courseTableItem.teacher.userId);
      courseTableItem.course = yield this.ctx.service.course.getById(courseTableItem.courseName);
      courseTableItem.classroom = yield this.ctx.service.classroom.getById(courseTableItem.classroomId);
      courseTableItem.date = app.moment(courseTableItem.date).format('YYYY-MM-DD');
      courseTableItem.dayOfWeek = app.cnum[date.getDay()];
      courseTableItem.startTime = courseTableItem.startTime.substring(0, 5);
      courseTableItem.endTime = courseTableItem.endTime.substring(0, 5);
      this.success(courseTableItem);
    }
    //预约提交
    *submitBookingCourse() { 
      let { courseTableItemId, studentId, requirement } = this.ctx.request.body;
      const student = yield this.service.student.getById(studentId);
      if (student == null) {
        this.fail('学生不存在');
        return;
      }
      let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableItemId);
      courseTableItem.course = yield this.ctx.service.course.getById(courseTableItem.courseName);
      let result = yield this.ctx.service.bookingCourse.add(courseTableItemId, studentId, new Date(), '待审核', requirement, courseTableItem)
      const user = yield this.ctx.service.user.getById(student.userId);
      const now = app.moment();
      if (user.publicOpenId) {
        yield this.ctx.service.wechat.bookingSuccess(student.name, courseTableItem.course.name, now.format('YYYY-MM-DD HH:mm:ss'), user.publicOpenId, student.id);
      }
      for (const item of app.config.admins) {
        if (item.publicOpenId) {
          if (item.isEnabled === 1) {
            yield this.ctx.service.wechat.bookingSuccessAdmin(courseTableItem.course.name, now.format('YYYY-MM-DD HH:mm:ss'), item.publicOpenId);
          }
        }
      }
      this.success() 
    }
    //获得学生下预约列表
    *getBookingCourseList() { 
      let { studentId } = this.ctx.request.query;
      let bookingCourseList = yield this.ctx.service.bookingCourse.getBookingInfoToId(studentId);
      for (let item of bookingCourseList) { 
          item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableItemId);
          item.courseTableItem.teacher = yield this.ctx.service.teacher.getById(item.courseTableItem.teacherId);
          item.courseTableItem.course = yield this.ctx.service.course.getById(item.courseTableItem.courseName);
          item.courseTableItem.classroom = yield this.ctx.service.classroom.getById(item.courseTableItem.classroomId);
          item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
          item.courseTableItem.startTime = item.courseTableItem.startTime.substring(0, 5)
          item.courseTableItem.endTime = item.courseTableItem.endTime.substring(0,5)
      }
      this.success(bookingCourseList)
    }
    *getBookingCourseById() { 
      let { id } = this.ctx.request.query
      let bookingCourse = yield this.ctx.service.bookingCourse.getById(id);
      let courseTableItem = yield this.ctx.service.courseTableItem.getById(bookingCourse.courseTableItemId);
      let date = new Date(courseTableItem.date);
      courseTableItem.teacher = yield this.ctx.service.teacher.getById(courseTableItem.teacherId);
      courseTableItem.term = yield this.ctx.service.term.getById(courseTableItem.termId);
      courseTableItem.user = yield this.ctx.service.user.getById(courseTableItem.teacher.userId);
      courseTableItem.course = yield this.ctx.service.course.getById(courseTableItem.courseName);
      courseTableItem.classroom = yield this.ctx.service.classroom.getById(courseTableItem.classroomId);
      courseTableItem.date = app.moment(courseTableItem.date).format('YYYY-MM-DD');
      courseTableItem.dayOfWeek = app.cnum[date.getDay()];
      courseTableItem.startTime = courseTableItem.startTime.substring(0, 5);
      courseTableItem.endTime = courseTableItem.endTime.substring(0, 5);
      let result = {
        bookingCourse,
        courseTableItem
      }
      this.success(result);  
    }
    *bookingCourseCaculById() { 
      let { id=0, state='' } = this.ctx.request.body
      if (!id||!state) { 
        return this.fail('参数不对'); 
      }
      let bookingCourse = yield this.ctx.service.bookingCourse.getById(id);
      bookingCourse.state = state;
      yield this.ctx.service.bookingCourse.update(bookingCourse);
      this.success()
    }
  }
  return CourseTableItemController;
};
