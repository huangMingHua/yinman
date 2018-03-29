module.exports = app => {
  class CourseTableDetailController extends app.Controller {
    *
        addDetail() {
          console.log(this.ctx.request.body);
          const { termId = 0,
                teacherId = 0,
                courseNameId = 0,
                level,
                startTime,
                duration = 0,
                endTime, classroomId,
                number = 0,
                dayOfWeek,
                totalLeave } = this.ctx.request.body;
          const term = yield this.ctx.service.term.getById(termId);
          const startDate = term.startDate;
          const endDate = term.endDate;
          if (term == null) {
            this.fail('学期不存在');
            return;
          }
          const teacher = yield this.ctx.service.teacher.getById(teacherId);
          if (teacher == null) {
            this.fail('教师不存在');
            return;
          }
          const classroom = yield this.ctx.service.classroom.getById(classroomId);
          if (classroom == null) {
            this.fail('教室不存在');
            return;
          }
          const course = yield this.ctx.service.course.getById(courseNameId);
          if (course == null) {
            this.fail('课程不存在');
            return;
          }
          if (number < 1) {
            this.fail('学生数量至少为1');
            return;
          }
          if (duration < 10) {
            this.fail('课程时间需大于10分钟');
            return;
          }
          if (app.lodash.trim(startTime) == '') {
            this.fail('开始时间不能为空');
            return;
          }
          if (app.lodash.trim(endTime) == '') {
            this.fail('结束时间不能为空');
            return;
          }
          const ctx = this.ctx;
          const result = yield app.mysql.beginTransactionScope(function* (conn) {
            ctx.conn = conn;
            const list = yield ctx.service.courseTableDetail.getList(termId, teacherId);
            for (const _detail of list) {
              const _startTime = `2017-01-01 ${_detail.startTime}`;
              const _endTime = `2017-01-01 ${_detail.endTime}`;
              const _startTime1 = `2017-01-01 ${startTime}`;
              const _endTime1 = `2017-01-01 ${endTime}`;
                        // 判断报名课程时间有没有冲突
              if (_detail.dayOfWeek == dayOfWeek) {
                const timeStamp1 = new Date(_detail.endDate).getTime();
                const timeStamp2 = new Date(startDate).getTime();
                if (timeStamp1 >= timeStamp2 && ctx.helper.durationConflict(_startTime, _endTime, _startTime1, _endTime1)) {
                  return {
                    code: 0,
                    msg: '时间有冲突，请选择其他时间',
                  };
                }
              }
            }
            let tempDate1 = app.moment(startDate);
                    // 判断跟不跟时间补课 预约课程有没有冲突
            while (tempDate1 <= app.moment(endDate)) {
              const dayOfWeekTemp = app.moment.weekdays(tempDate1.day());
              if (dayOfWeekTemp == dayOfWeek) {
                const list = yield ctx.service.courseTableItem.getListByTeacherIdNOType(teacherId);
                for (const item of list) {
                  const _startTime = `2017-01-01 ${item.startTime}`;
                  const _endTime = `2017-01-01 ${item.endTime}`;
                  const _startTime1 = `2017-01-01 ${startTime}`;
                  const _endTime1 = `2017-01-01 ${endTime}`;
                  console.log(app.moment(tempDate1).format('YYYY-MM-DD') == app.moment(item.date).format('YYYY-MM-DD'));
                  if (app.moment(tempDate1).format('YYYY-MM-DD') == app.moment(item.date).format('YYYY-MM-DD') && ctx.helper.durationConflict(_startTime, _endTime, _startTime1, _endTime1)) {
                    return {
                      code: 0,
                      msg: '时间有冲突，请选择其他时间',
                    };
                  }
                }
              }
              tempDate1 = tempDate1.add(1, 'days');
            }
                    // 判断相同时间内有没有其他老师用这个教室
            let tempDate2 = app.moment(startDate);
            while (tempDate2 <= app.moment(endDate)) {
              const dayOfWeekTemp = app.moment.weekdays(tempDate2.day());
              if (dayOfWeekTemp == dayOfWeek) {
                const list = yield ctx.service.courseTableItem.getListByClassroomId(classroomId);
                for (const item of list) {
                  const _startTime = `2017-01-01 ${item.startTime}`;
                  const _endTime = `2017-01-01 ${item.endTime}`;
                  const _startTime1 = `2017-01-01 ${startTime}`;
                  const _endTime1 = `2017-01-01 ${endTime}`;
                  if (app.moment(tempDate2).format('YYYY-MM-DD') == app.moment(item.date).format('YYYY-MM-DD') && ctx.helper.durationConflict(_startTime, _endTime, _startTime1, _endTime1)) {
                    return {
                      code: 0,
                      msg: '该时间段内教室已被使用。',
                    };
                  }
                }
              }
              tempDate2 = tempDate2.add(1, 'days');
            }
                    // //判断相同时间段内老师有没有课程
            let tempDate3 = app.moment(startDate);
            while (tempDate3 <= app.moment(endDate)) {
              const dayOfWeekTemp = app.moment.weekdays(tempDate3.day());
              if (dayOfWeekTemp == dayOfWeek) {
                const list = yield ctx.service.courseTableItem.getByTeacherId(teacherId);
                for (const item of list) {
                  const _startTime = `2017-01-01 ${item.startTime}`;
                  const _endTime = `2017-01-01 ${item.endTime}`;
                  const _startTime1 = `2017-01-01 ${startTime}`;
                  const _endTime1 = `2017-01-01 ${endTime}`;
                  if (app.moment(tempDate3).format('YYYY-MM-DD') == app.moment(item.date).format('YYYY-MM-DD') && ctx.helper.durationConflict(_startTime, _endTime, _startTime1, _endTime1)) {
                    return {
                      code: 0,
                      msg: '该时间段内老师已有课程。',
                    };
                  }
                }
              }
              tempDate3 = tempDate3.add(1, 'days');
            }
                    // 添加到报名表
            const detail = yield ctx.service.courseTableDetail.add(
                        termId,
                        teacherId,
                        courseNameId,
                        level,
                        number,
                        duration,
                        classroomId,
                        dayOfWeek,
                        startTime,
                        endTime,
                        '空闲',
                        app.moment(startDate).format('YYYY-MM-DD'),
                        app.moment(endDate).format('YYYY-MM-DD'),
                        '否',
                        totalLeave
                    );
            let tempDate = app.moment(detail.startDate);
            let num = 0;
                    // 创建周课表
            while (tempDate <= app.moment(detail.endDate)) {
              const dayOfWeekTemp = app.moment.weekdays(tempDate.day());
              if (dayOfWeekTemp == detail.dayOfWeek) {
                num++;
                yield ctx.service.courseTableItem.add(
                                detail.id,
                                detail.teacherId,
                                app.moment(tempDate).format('YYYY-MM-DD'),
                                detail.startTime,
                                detail.endTime,
                                detail.classroomId,
                                detail.courseNameId,
                                detail.number,
                                detail.duration,
                                detail.level,
                                '空闲',
                                '正式课程',
                                detail.termId
                            );
              }
              tempDate = tempDate.add(1, 'days');
            }
            if (num === 0) {
              yield ctx.service.courseTableDetail.delete(detail.id);
              return { code: 0, msg: '创建的周期内不包含' + dayOfWeek };
            }
            return { code: 1 };
          }, this.ctx);
          this.ctx.body = result;
        }

    *
            getById() {
              const result = yield this.ctx.service.courseTableDetail.getById(this.ctx.request.query.id);
              result.startDate = app.moment(result.startDate).format('YYYY.MM.DD');
              result.endDate = app.moment(result.endDate).format('YYYY.MM.DD');
              result.startTime = result.startTime.substring(0, 5);
              result.endTime = result.endTime.substring(0, 5);
              result.teacher = yield this.ctx.service.teacher.getById(result.teacherId);
              result.user = yield this.ctx.service.user.getById(result.teacher.userId);
              result.course = yield this.ctx.service.course.getById(result.courseNameId);
              result.classroom = yield this.ctx.service.classroom.getById(result.classroomId);
              result.students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(result.id, '正常');
              for (let item of result.students) { 
                item.student = yield this.ctx.service.student.getById(item.studentId);  
              } 
              this.success(result);
            }
    *
            delete() {
              const id = this.ctx.request.body.id || 0;
              const info = yield this.ctx.service.courseTableDetail.getById(id);
              if (info == null) {
                this.fail('未找到数据,请刷新页面重试');
                return;
              }

              const students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(id);
              const signList = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(id);
              if (students.length > 0 || signList.length > 0) {
                    // this.ctx.body = { result:false, msg:'当前课程下有学生，无法删除'};
                this.fail('当前课程下有学生，无法删除');
                return;
              }
              const ctx = this.ctx;
              yield app.mysql.beginTransactionScope(function* (conn) {
                ctx.conn = conn;
                info.isDel = 1;
                yield ctx.service.courseTableDetail.update(info);
                const courseTableItem = yield ctx.service.courseTableItem.getByCourseTableDetailId(id);
                for (const item of courseTableItem) {
                  item.isDel = 1;
                  yield ctx.service.courseTableItem.update(item);
                }
              }, ctx);

              this.success();
            }

        /**
         * 获取老师的某学期排课信息
         */
    *
        getNumberOfChangeClassByCourseTableDetailIdAndStudentId() {
          const { courseTableDetailId, studentId } = this.ctx.request.query;
          const o = yield this.ctx.service.courseTableDetailStudent.get(courseTableDetailId, studentId);
          this.success(o);
    }
    //获取停课之前弹框的信息
    *    getBeforeSuspendClassInfoByCourseTableDetailStudentId() {
              const { courseTableDetailStudentId } = this.ctx.request.query;
              let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(courseTableDetailStudentId); 
              let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailStudent.courseTableDetailId);
              courseTableDetail.teacher = yield this.ctx.service.teacher.getById(courseTableDetail.teacherId);
              courseTableDetail.course = yield this.ctx.service.course.getById(courseTableDetail.courseNameId); 
              let courseTableItemChangeClasses = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailIdAndStudentIdAndOne(courseTableDetail.id, courseTableDetailStudent.studentId, 1);
              let courseTableItems = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailStudent.courseTableDetailId);
              let filterCourseTableItems = [];
              //判断学生有没有这堂课
              for (let item of courseTableItems) {
                let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId2(item.id,courseTableDetailStudent.studentId);
                if (courseTableItemStudent.length > 0) { 
                  item.date = app.moment(item.date).format("YYYY-MM-DD");
                  item.startTime = item.startTime.substring(0, 5);
                  item.endTime = item.endTime.substring(0, 5);
                  filterCourseTableItems.push(item);
                } 
              }
              //他的补课也要提取出来算进去
              for (let item of courseTableItemChangeClasses) { 
                let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId2(item.courseTableDetailItemId, courseTableDetailStudent.studentId);
                if (courseTableItemStudent.length>0) { 
                  let courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
                  courseTableItem.date = app.moment(courseTableItem.date).format("YYYY-MM-DD");
                  courseTableItem.startTime = courseTableItem.startTime.substring(0, 5);
                  courseTableItem.endTime = courseTableItem.endTime.substring(0, 5);
                  filterCourseTableItems.push(courseTableItem);
                }
              }
              let filterCourseTableItems1 = [filterCourseTableItems[0]];
              //排序从小到大
              filterCourseTableItems.sort((item1,item2) => { 
                  let date1 = new Date(item1.date);
                  let date2 = new Date(item2.date);
                  return date1.getTime() - date2.getTime();
              })
              for (let item of filterCourseTableItems) {
                  let isRepeat = false;
                  for (let i of filterCourseTableItems1) { 
                      if (item.id==i.id) { 
                        isRepeat = true;
                        break
                      }
                  }
                  if (!isRepeat) {
                    filterCourseTableItems1.push(item);
                  }
              }  
              let result = {
                filterCourseTableItems:filterCourseTableItems1,
                courseTableDetail
              }
              this.success(result);  
            } *
            getInfo() {
              const termId = this.ctx.request.query.termId || 0;
              const teacherId = this.ctx.request.query.teacherId || 0;
              const term = yield this.ctx.service.term.getById(termId);
                // var courseTable = yield this.ctx.service.courseTable.getByTermIdAndTeacherId(termId, teacherId);
              const canEdit = true;
                // if(term.endDate > app.moment() && courseTable == null){
                //     canEdit = true;
                // }
              const details = yield this.ctx.service.courseTableDetail.getList(termId, teacherId);

              const details1 = [];
              for (let index = 1; index <= 7; index++) {
                const dayOfWeek = app.moment.weekdays()[index % 7];
                const obj = {
                  dayOfWeek,
                  list: [],
                };
                const list = app.lodash.filter(details, { dayOfWeek });
                for (let j = 0; j < list.length; j++) {
                  const item = list[j];
                        // item.startTime = app.moment(item.startTime)._d;
                        // var course = yield this.ctx.service.course.getById(item.courseId);
                        // if (course) {
                        //     item.courseName = course.name;
                        // }
                  const classroom = yield this.ctx.service.classroom.getById(item.classroomId);
                  if (classroom) {
                    item.classroomName = classroom.name;
                  }
                  const students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(item.id);


                  item.students = [];
                        // if(canEdit){
                        //     canEdit = !(students.length>0);
                        // }

                  for (let k = 0; k < students.length; k++) {
                    const ss = yield this.ctx.service.student.getById(students[k].studentId);
                    item.students.push(ss);
                  }
                  obj.list.push(item);
                }
                details1.push(obj);
              }
              this.ctx.body = {
                data: {
                  canEdit,
                  details: details1,
                },
              };
            }
            // 小程序跳到报名页获取老师报名数据
    * getListByTeacherIdAndTermId() {
      const { termId, teacherId, studentId = 0 } = this.ctx.request.body;
      const courseDetail = {
        termCourse: [],
        classTimeClass: [],
      };
      courseDetail.term = yield this.ctx.service.term.getById(termId);
      courseDetail.term.startDate = app.moment(courseDetail.term.startDate).format('YYYY.MM.DD');
      courseDetail.term.endDate = app.moment(courseDetail.term.endDate).format('YYYY.MM.DD');
      courseDetail.teacher = yield this.ctx.service.teacher.getById(teacherId);
      courseDetail.user = yield this.ctx.service.user.getById(courseDetail.teacher.userId);
      const list = yield this.service.courseTableDetail.getListByTeacherIdAndTermId(teacherId, termId);
      const canUse = [];
      for (const item of list) {
        const sign = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(item.id);
        if (sign.length < item.number) {
          let num = -1;
          for (let i = 0; i < sign.length; i++) {
            if (sign[i].studentId == studentId) {
              num = i;
            }
          }
          if (num == -1) {
            canUse.push(item);
          }
        }
      }
      for (const item of canUse) {
        item.course = yield this.ctx.service.course.getById(item.courseNameId);
        item.startTime = item.startTime.substring(0, 5);
        item.endTime = item.endTime.substring(0, 5);
        if (item.date) {
          courseDetail.classTimeClass.push(item);
        } else {
          courseDetail.termCourse.push(item);
        }
      }
      this.success(courseDetail);
    }
            /**
             * 获取老师排课列表
             */
    *
            getListByTeacherId() {
              const teacherId = this.ctx.request.query.teacherId || 0;
              const teacher = yield this.service.teacher.findById(teacherId);
              if (!teacher) {
                this.fail('老师不存在');
                return;
              }
              const details = yield this.service.courseTableDetail.getListByTeacherId(teacherId);

              const details1 = app.lodash.groupBy(details, 'termId');
              const list = [];
              for (const termId in details1) {
                const term = yield this.service.term.getById(termId);
                const minStartDate = app.lodash.maxBy(details1[termId], function(o) {
                  return o.startDate;
                }).startDate;
                const maxEndDate = app.lodash.minBy(details1[termId], function(o) {
                  return o.endDate;
                }).endDate;

                list.push({
                  term,
                  minStartDate,
                  maxEndDate,
                });
              }
              this.success(list);
            } *
            getApplicableCourse() {
              if (!this.ctx.query.courseName) {
                return this.fail('课程不能为空');
              }
              const result = yield this.ctx.service.courseTableDetail.getApplicableCourse();
              this.ctx.body = result;
            } *
            getApplicableCourseByCourseNameAndTermId() {
              if (!this.ctx.query.courseName) {
                return this.fail('课程不能为空');
              }
              if (!this.ctx.query.termId) {
                return this.fail('学期不能为空');
              }
              const result = yield this.ctx.service.courseTableDetail.getApplicableCourseByCourseNameAndTermId(this.ctx.query.courseName, this.ctx.query.termId);
              this.success(result);
            } *
            getApplicableCourseByCourseNameAndTeacherNameAndTermId() {
              if (!this.ctx.query.courseName) {
                return this.fail('课程不能为空');
              }
              if (!this.ctx.query.teacherName) {
                return this.fail('教师姓名不能为空');
              }
              if (!this.ctx.query.termId) {
                return this.fail('学期不能为空');
              }
              const result = yield this.ctx.service.courseTableDetail.getApplicableCourseByCourseNameAndTeacherNameAndTermId(this.ctx.query.courseName, this.ctx.query.teacherName, this.ctx.query.termId, this.ctx.query.studentId);
              this.success(result);
            } * getApplicableCourseByTermIdAndCourseNameAndTercherNameAndWeek() {
              if (!this.ctx.query.courseName) {
                return this.fail('课程不能为空');
              }
              if (!this.ctx.query.teacherName) {
                return this.fail('教师姓名不能为空');
              }
              if (!this.ctx.query.termId) {
                return this.fail('学期不能为空');
              }
              if (!this.ctx.query.week) {
                return this.fail('星期不能为空');
              }
              const result = yield this.ctx.service.courseTableDetail.getApplicableCourseByTermIdAndCourseNameAndTercherNameAndWeek(this.ctx.query.courseName, this.ctx.query.teacherName, this.ctx.query.termId, this.ctx.query.week);
              this.success(result);
            }
    * getTerm() {
      const { studentId } = this.ctx.request.query;
      const result = yield this.ctx.service.term.getAll();
      const terms = [];
      for (const item of result) {
        const courseTableDetails = yield this.ctx.service.courseTableDetail.getByTermIdAndOpenEnrollment(item.id);
        const signUpList = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByState();
        for (let i = 0; i < courseTableDetails.length; i++) {
          for (let j = 0; j < signUpList.length; j++) {
            if (courseTableDetails[i] && courseTableDetails[i].id === signUpList[j].changeCurriculumId) {
              if (signUpList[j].studentId == studentId) {
                courseTableDetails.splice(i, 1);
                i = -1;
              }
            }
          }
        }
        if (courseTableDetails.length > 0) {
          terms.push(item);
        }
      }
      this.success(terms);
    }
    * getApplicableCourseByTermId() {
      const result = yield this.ctx.service.courseTableDetail.getApplicableCourseByTermId(this.ctx.query.termId, this.ctx.query.studentId);
      this.success(result);
    }
    * changeOpen() {

      const signUpCurriculum = yield this.ctx.service.signUpCurriculum.getListByState(this.ctx.request.body.id, '待确认');
      if (signUpCurriculum.length > 0) {
        this.fail('该课程有学生报名待审核，无法取消');
        return;
      }
      yield this.ctx.service.courseTableDetail.changeOpen(this.ctx.request.body.id, this.ctx.request.body.openEnrollment);
      this.success();
    } *
            suspendClasses() {
                let { courseTableDetailStudentId=0, courseTableItemId = 0, reason = '' } = this.ctx.request.body
                if (!courseTableItemId) { 
                    return this.fail('请选择课程结束日期'); 
                } 
                if (!reason) { 
                    return this.fail('请输入课程结束原因'); 
                }
                if (!courseTableDetailStudentId) { 
                    return this.fail('参数缺失');  
                }
                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(courseTableDetailStudentId);
                courseTableDetailStudent.student = yield this.ctx.service.student.getById(courseTableDetailStudent.studentId);
                courseTableDetailStudent.studentUser = yield this.ctx.service.user.getById(courseTableDetailStudent.student.userId);
                courseTableDetailStudent.endCourseTableItemId = courseTableItemId;
                courseTableDetailStudent.reasonsForSuspension = reason;
                let courseTableItems = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailStudent.courseTableDetailId); 
                let suspendClassItem = yield this.ctx.service.courseTableItem.getById(courseTableItemId);
                suspendClassItem.teacher = yield this.ctx.service.teacher.getById(suspendClasses.teacherId);
                suspendClassItem.teacherUser = yield this.ctx.service.user.getById(suspendClassItem.teacher.userId);
                suspendClassItem.course = yield this.ctx.service.course.getById(suspendClasses.teacherId);
                let courseTableItemChangeClasses = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailIdAndStudentIdAndOne(courseTableDetailStudent.courseTableDetailId, courseTableDetailStudent.studentId, 1);
                //他的补课也要提取出来算进去
                for (let item of courseTableItemChangeClasses) { 
                  let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId2(item.courseTableDetailItemId, courseTableDetailStudent.studentId);
                  if (courseTableItemStudent.length>0) { 
                      let courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
                      courseTableItems.push(courseTableItem);
                  }
                }
                console.log(suspendClassItem.date + ' ' + suspendClassItem.startTime)
                let suspendClassDateTime = new Date(app.moment(suspendClassItem.date).format('YYYY-MM-DD')+' '+suspendClassItem.startTime);
                let deleteClassItems = [];
                for (let item of courseTableItems) {  
                   let dateTime = new Date(app.moment(item.date).format('YYYY-MM-DD')+' '+item.startTime);
                  console.log(dateTime.getTime() , suspendClassDateTime.getTime()) 
                  if (dateTime.getTime() > suspendClassDateTime.getTime()) { 
                       deleteClassItems.push(item);                   
                   } 
                }
                for (let item of deleteClassItems) {  
                    yield this.ctx.service.courseTableItemStudent.delete( item.id, courseTableDetailStudent.studentId);
                }
                let suspendClassesTime = app.moment(suspendClassItem.date).format('YYYY-MM-DD')+' '+suspendClassItem.startTime.substring(0,5)+'~'+suspendClassItem.endTime.substring(0,5);  
                if (courseTableDetailStudent.studentUser.publicOpenId&&suspendClassItem.teacherUser.publicOpenId) { 
                   yield this.ctx.service.wechat.suspendClasses(courseTableDetailStudent.student.name, suspendClassItem.teacher.name, suspendClassItem.course.name, suspendClassesTime, reason, courseTableDetailStudent.studentUser.publicOpenId, suspendClassItem.teacherUser.publicOpenId, courseTableDetailStudent.student.id);  
                }
                yield this.ctx.service.courseTableDetailStudent.update(courseTableDetailStudent);
                this.success();
    }
        * getSuspendClassesInfoByCourseTableDetailStudentId() {
                let { courseTableDetailStudentId = 0 } = this.ctx.request.query;
                let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(courseTableDetailStudentId);
                courseTableDetailStudent.student = yield this.ctx.service.student.getById(courseTableDetailStudent.studentId);
                let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailStudent.courseTableDetailId);
                let courseTableItemChangeClasses = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailIdAndStudentIdAndOne(courseTableDetail.id, courseTableDetailStudent.studentId, 1);
                courseTableDetail.course = yield this.ctx.service.course.getById(courseTableDetail.courseNameId);
                courseTableDetailStudent.endCourseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableDetailStudent.endCourseTableItemId);
                courseTableDetailStudent.endCourseTableItem.date = app.moment(courseTableDetailStudent.endCourseTableItem.date).format("YYYY-MM-DD");   
                let courseTableItems = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailStudent.courseTableDetailId);
                let filterCourseTableItems = [];
                //判断学生有没有这堂课
                for (let item of courseTableItems) {
                  let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId2(item.id,courseTableDetailStudent.studentId);
                  if (courseTableItemStudent.length > 0) { 
                    item.date = app.moment(item.date).format("YYYY-MM-DD");
                    item.startTime = item.startTime.substring(0, 5);
                    item.endTime = item.endTime.substring(0, 5);
                    filterCourseTableItems.push(item);
                  } 
                }
                //他的补课也要提取出来算进去
                for (let item of courseTableItemChangeClasses) { 
                  let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId2(item.courseTableDetailItemId, courseTableDetailStudent.studentId);
                  if (courseTableItemStudent.length>0) { 
                    let courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
                    courseTableItem.date = app.moment(courseTableItem.date).format("YYYY-MM-DD");
                    courseTableItem.startTime = courseTableItem.startTime.substring(0, 5);
                    courseTableItem.endTime = courseTableItem.endTime.substring(0, 5);
                    filterCourseTableItems.push(item);
                  }
                }
                let result = {
                   courseTableDetailStudent,
                   courseTableDetail,
                   filterCourseTableItems
                } 
                this.success(result);
            }
    *
            transferTheClass() {
              const admin = this.ctx.cookies.get('adminname', {
                encrypt: true, // 加密传输
              });
              const body = this.ctx.request.body;
              if (!body.originalCourseTableDetailStudentId) {
                this.fail('原课程周期不能为空');
                return;
              }
              if (!body.studentId) {
                this.fail('学生不能为空');
                return;
              }
              if (!body.courseTableDetailId) {
                this.fail('更改课程周期不能为空');
                return;
              }
              if (!body.reason) {
                this.fail('更改课程周期不能为空');
                return;
              }
              if (!body.courseTableItemId) {
                this.fail('请选择课程开始日期');
                return;
              }
              const student = yield this.ctx.service.student.getById(body.studentId);
              const user = yield this.ctx.service.user.findById(student.userId);
              const result = yield this.ctx.service.signUpCurriculum.saveCurriculum(body.studentId, body.courseTableDetailId, user.id, '已确认', app.moment().format('YYYY-MM-DD HH:mm'), body.specialRequirements);
              if (result) {
                const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(body.originalCourseTableDetailStudentId);
                courseTableDetailStudent.classTransferCourseTableDetailId = body.courseTableDetailId;
                courseTableDetailStudent.status = '转课';
                courseTableDetailStudent.shiftReasons = body.reason;
                courseTableDetailStudent.shiftStartDate = JSON.stringify(yield this.ctx.service.courseTableItem.getById(body.courseTableItemId));
                yield this.ctx.service.courseTableDetailStudent.update(courseTableDetailStudent);
                const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(body.courseTableDetailId);
                yield this.ctx.service.courseTableDetailStudent.classTransferAdd(body.studentId, body.courseTableDetailId, '正常', courseTableDetail.termId, body.originalCourseTableDetailStudentId, body.courseTableItemId);
                const courseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(body.courseTableDetailId);
                yield this.ctx.service.courseTableDetail.resetCurriculumCycle(body.courseTableDetailId, body.studentId, body.courseTableItemId, courseTableItem[courseTableItem.length - 1].id);
                for (const item of courseTableItem) {
                  if (item.id >= body.courseTableItemId) {
                    yield this.ctx.service.courseTableItemStudent.add(item.id, body.studentId, '正常', item.termId);
                  }
                }
                const aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailStudent.courseTableDetailId);
                for (const item of aCourseTableItem) {
                  const courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentId(item.id, courseTableDetailStudent.studentId, '停课');
                  if (courseTableItemStudent.length != 0) {
                    courseTableItemStudent[0].status = '转课';
                    yield this.ctx.service.courseTableItemStudent.update(courseTableItemStudent[0]);
                  }
                }
                const originalCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailStudent.courseTableDetailId);
                const student = yield this.ctx.service.student.getById(courseTableDetailStudent.studentId);
                const originalCourseInformation = originalCourseTableDetail.courseName + ' ' + app.moment(originalCourseTableDetail.startDate).format('YYYY.MM.DD') + '~' + app.moment(originalCourseTableDetail.endDate).format('YYYY.MM.DD') + ' ' + originalCourseTableDetail.dayOfWeek + ' ' + originalCourseTableDetail.startTime + '-' + originalCourseTableDetail.endTime;
                const nowCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(body.courseTableDetailId);
                const nowCourseInformation = nowCourseTableDetail.courseName + ' ' + app.moment(nowCourseTableDetail.startDate).format('YYYY.MM.DD') + '~' + app.moment(nowCourseTableDetail.endDate).format('YYYY.MM.DD') + ' ' + nowCourseTableDetail.dayOfWeek + ' ' + nowCourseTableDetail.startTime + '-' + nowCourseTableDetail.endTime;
                const studentUser = yield this.ctx.service.user.getById(student.userId);
                const teacher = yield this.ctx.service.teacher.getById(nowCourseTableDetail.teacherId);
                const teacherUser = yield this.ctx.service.user.getById(teacher.userId);
                yield this.ctx.service.wechat.transferTheClass(student.name, originalCourseInformation, nowCourseInformation, studentUser.publicOpenId, teacher.name, admin, teacherUser.publicOpenId, student.id);
                this.success();
              } else {
                this.fail('已经报过相关课程了');
                return;
              }

            } *
            getSuspension() {
              const coursrTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getById(this.ctx.request.body.id);
              const suspensionDate = JSON.parse(coursrTableDetailStudent.courseTableItem);
              const aCousrTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(coursrTableDetailStudent.courseTableDetailId);
              const aCousrTableItems = [];
              for (const item of aCousrTableItem) {
                const time1 = new Date(item.date).getTime();
                const time2 = new Date(suspensionDate.date).getTime();
                if (time1 >= time2) {
                  item.date = app.moment(item.date).format('YYYY-MM-DD');
                  aCousrTableItems.push(item);
                }
              }
              const result = {
                suspensionDate,
                aCousrTableItems,
              };
              this.success(result);
            } *
            getAllSuspensionAndClasstransfer() {
              const { pageIndex, limit, termId } = this.ctx.request.query;
              const list = yield this.ctx.service.courseTableDetailStudent.getAllSuspensionAndClasstransfer(pageIndex, termId, limit);
              for (const item of list.list) {
                item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.endCourseTableItemId);
                item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
                item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
                item.classTransferCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.classTransferCourseTableDetailId);
              }
              this.success(list);
            }

    *
        clearCourse() {
          if (!this.ctx.request.body.id) {
            this.fail('清空开始日期不能为空');
            return;
          }
          if (!this.ctx.request.body.studentId) {
            this.fail('学生不存在');
            return;
          }
          const courseTableItem = yield this.ctx.service.courseTableItem.getById(this.ctx.request.body.id);
          const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableItem.courseTableDetailId);
          courseTableDetail.endDate = app.moment(courseTableItem.date).subtract(1, 'days');
          courseTableDetail.endDate = app.moment(courseTableDetail.endDate).format('YYYY-MM-DD');
          courseTableDetail.clearCourse = '是';
          const aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetail.id);
          const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableItem.courseTableDetailId, this.ctx.request.body.studentId);
          const aCourseTableChangeClassForTeacher = yield this.ctx.service.courseTableChangeClassForTeacher.getByCourseTableDetailStudentId(courseTableDetailStudent.id);
          for (const item of aCourseTableChangeClassForTeacher) {
            yield this.ctx.service.courseTableChangeClassForTeacher.deleteById(item.id);
          }
          for (let i = 0; i < aCourseTableItem.length; i++) {
            if (aCourseTableItem[i].id >= this.ctx.request.body.id && aCourseTableItem[i].courseTableDetailId != 0) {
              yield this.ctx.service.courseTableItem.deleteById(aCourseTableItem[i].id);
              const aCourseTableItemLeave = yield this.ctx.service.courseTableItemLeave.getByCourseTableItemId(aCourseTableItem[i].id);
              const aCourseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getListByCourseTableDetailItemId(aCourseTableItem[i].id);
              for (const item of aCourseTableItemLeave) {
                courseTableDetailStudent.numberOfleave++;
                yield this.ctx.service.courseTableDetailStudent.update(courseTableDetailStudent);
                yield this.ctx.service.courseTableItemLeave.deleteId(item.id);
              }
              for (const item of aCourseTableItemChangeCourse) {
                yield this.ctx.service.courseTableItemChangeCourse.deleteId(item.id);
              }
            }
          }
          yield this.ctx.service.courseTableDetail.update(courseTableDetail);
          yield this.ctx.service.courseTableItem.deleteById(this.ctx.request.body.id);
          this.success();
        }
            // 通过学期和是否开放报名
    * getListBytermIdAndOpenEnrollment() {
      const { termId, studentId = 0 } = this.ctx.request.query;
                // 获取学期课和课时课
      const list = yield this.ctx.service.courseTableDetail.getListBytermIdAndOpenEnrollment(termId, '是');
      const signUpList = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByState();
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < signUpList.length; j++) {
          if (list[i] && list[i].id === signUpList[j].changeCurriculumId && signUpList[j].studentId == studentId) {
            list.splice(i, 1);
            i = -1;
          }
        }
      }
      const canUse = [];
      for (const item of list) {
        const sign = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(item.id);
        if (!item.dayOfWeek) {
          canUse.push(item);
          continue;
        }

        if (sign.length < item.number) {
          console.log(sign, item.number);
          let num = -1;
          for (let i = 0; i < sign.length; i++) {
            console.log(sign[i].studentId, studentId);
            if (sign[i].studentId == studentId) {
              console.log(sign, item);
              num = i;
            }
          }
          if (num == -1) {
            canUse.push(item);
          }
        }
      }
      const teachers = [];
                // 合并，相同的老师合在一起
      for (let i = 0; i < canUse.length; i++) {
        canUse[i].course = yield this.ctx.service.course.getById(canUse[i].courseNameId);
        if (teachers.length === 0) {
          teachers[i] = {
            teacherId: canUse[i].teacherId,
            courses: [ canUse[i] ],
          };
        } else {
          let num = -1;
          for (let j = 0; j < teachers.length; j++) {
            if (teachers[j].teacherId === canUse[i].teacherId) {
              num = j;
              teachers[j].courses.push(canUse[i]);
            }
          }
          if (num < 0) {
            teachers[teachers.length] = {
              teacherId: canUse[i].teacherId,
              courses: [ canUse[i] ],
            };
          }
        }
      }
      for (const item of teachers) {
        item.teacher = yield this.ctx.service.teacher.getById(item.teacherId);
        item.user = yield this.ctx.service.user.getById(item.teacher.userId);
      }
      this.success(teachers);
    }
    *
            getnLeaveLengthAndnChangeClassLengthBycourseTableItemId() {
              const courseTableItem = yield this.ctx.service.courseTableItem.getById(this.ctx.request.query.courseTableItemId);
              const aCourseTableItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableItem.courseTableDetailId);
              const aLeave = [];
              const aChangeClass = [];
              for (const item of aCourseTableItem) {
                if (item.id >= this.ctx.request.query.courseTableItemId) {
                  const aCourseTableItemLeave = yield this.ctx.service.courseTableItemLeave.getByCourseTableItemId(item.id);
                  const aCourseTableItemChangeCourse = yield this.ctx.service.courseTableItemChangeCourse.getListByCourseTableDetailItemId(item.id);
                  for (const i of aCourseTableItemLeave) {
                    aLeave.push(i);
                  }
                  for (const i of aCourseTableItemChangeCourse) {
                    aChangeClass.push(i);
                  }
                }
              }
              this.success({
                aLeave,
                aChangeClass,
              });
            }
            // 小程序获取课时课的详情页报名信息
    * getClassTimeClassById() {
      const { id } = this.ctx.request.query;
      const result = yield this.ctx.service.courseTableDetail.getClassTimeClassById(id);
      result.course = yield this.ctx.service.course.getById(result.courseNameId);
      result.teacher = yield this.ctx.service.teacher.getById(result.teacherId);
      result.user = yield this.ctx.service.user.getById(result.teacher.userId);
      result.term = yield this.ctx.service.term.getById(result.termId);
      console.log(result.term);
      result.term.startDate = app.moment(result.term.startDate).format('YYYY.MM.DD');
      result.term.endDate = app.moment(result.term.endDate).format('YYYY.MM.DD');
      this.success(result);
    }
            // 学生我的课程筛选几个学期有课可以显示
    * getCourTableDetailBystudentId() {
      const { studentId } = this.ctx.request.query;
      const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getTermIds(studentId);
      const terms = yield this.ctx.service.term.getAll();
      const result = [];
      for (let i = 0; i < courseTableDetailStudent.length; i++) {
        for (let j = 0; j < terms.length; j++) {
          if (courseTableDetailStudent[i] == terms[j].id) {
            result.push({
              id: terms[j].id,
              name: terms[j].name,
              startDate: app.moment(terms[j].startDate).format('YYYY.MM.DD'),
              endDate: app.moment(terms[j].endDate).format('YYYY.MM.DD'),
            });
          }
        }
      }
      return this.success(result);
    }
            // 这个学期下的我的所有课程
    * getMyAllCourseByStudentIdAndTermId() {
      const { studentId, termId } = this.ctx.request.query;
      const result = yield this.ctx.service.courseTableDetailStudent.getMyAllCourseByStudentIdAndTermId(studentId, termId);
      for (const item of result) {
        if (item.courseTableItemId > 0) {
          item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableItemId);
          const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
          item.courseTableItem.dayOfWeek = week[app.moment(item.courseTableItem.date).format('d')];
        }
      }
      this.success(result);
    }
    //选课信息
    *getSelectClass () { 
      let { courseTableDetailId = 0,studentId = 0 } = this.ctx.request.query
      let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
      if (!courseTableDetail) { 
        return this.fail('数据不存在');
      }
      const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId);
      let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableDetail.courseTableItemId);
      if (!courseTableItem) { 
        return this.fail('数据不存在');
      }
      let courseNameId = courseTableItem.courseName;
      let teacherId = courseTableItem.teacherId;
      let duration = courseTableItem.duration;
      let level = courseTableItem.level;
      let termId = courseTableItem.termId;
      let number = courseTableItem.number;
      let courseTableItems = yield this.ctx.service.courseTableItem.getSameClassByCourseNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumber(courseNameId,teacherId,duration,level,termId,number)
      //判断某节课是否已经报了名
      for (let item of courseTableItems) { 
        item.length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, studentId);
        item.signUpNum = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.id);
        if (item.length > 0) {
          item.index = 2;
        } else { 
          item.index = 0;
        }
      }
      courseTableItems.sort((a, b) => { 
        let date1 = new Date(app.moment(a.date).format('YYYY-MM-DD') + ' ' + a.startTime).getTime();
        let date2 = new Date(app.moment(b.date).format('YYYY-MM-DD') + ' ' + b.startTime).getTime();
        return date1-date2
      })
      let term = yield this.ctx.service.term.getById(termId);
      term.startDate = app.moment(term.startDate).format("YYYY/MM/DD");
      term.endDate = app.moment(term.endDate).format("YYYY/MM/DD");
      let teacher = yield this.ctx.service.teacher.getById(teacherId);
      let course = yield this.ctx.service.course.getById(courseNameId);
      let user = yield this.ctx.service.user.getById(teacher.userId);
      let result = {
        term,
        teacher,
        courseTableItem,
        user,
        course,
        courseTableItems,
        courseTableDetailStudent
      }
      this.success(result);
    }
     //选课信息
     *getSelectClassRecord () { 
      let { courseTableDetailId = 0,studentId = 0 } = this.ctx.request.query
      let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
      if (!courseTableDetail) { 
        return this.fail('数据不存在');
      }
      let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableDetail.courseTableItemId);
      if (!courseTableItem) { 
        return this.fail('数据不存在');
      }
      let courseNameId = courseTableItem.courseName;
      let teacherId = courseTableItem.teacherId;
      let duration = courseTableItem.duration;
      let level = courseTableItem.level;
      let termId = courseTableItem.termId;
      let number = courseTableItem.number;
      let courseTableItems = yield this.ctx.service.courseTableItem.getSameClassByCourseNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumber(courseNameId,teacherId,duration,level,termId,number)
      //判断某节课是否已经报了名
      let records = [];
      for (let item of courseTableItems) { 
        let record = yield this.ctx.service.courseTableItemStudent.getListByCourseTableItemIdAndStudentId(item.id, studentId);
        if (record.length > 0) {
          for (let i = 0; i < record.length;i++) { 
            let courseTableItem = yield this.ctx.service.courseTableItem.getById(record[i].courseTableItemId);
            courseTableItem.date = app.moment(courseTableItem.date).format('YYYY-MM-DD');
            courseTableItem.startTime = courseTableItem.startTime.substring(0, 5);
            courseTableItem.endTime = courseTableItem.endTime.substring(0, 5);
            courseTableItem.teacher = yield this.ctx.service.teacher.getById(courseTableItem.teacherId);
            courseTableItem.classroom = yield this.ctx.service.classroom.getById(courseTableItem.classroomId);
            records.push(courseTableItem)
          }
        } 
      }
      this.success(records);
     }
    *getClassTimeClassLeave() { 
      let { courseTableDetailId = 0, studentId = 0 } = this.ctx.request.query;
      let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
      if (!courseTableDetail) { 
        return this.fail('数据不存在');
      }
      let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetailId,studentId)
      let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableDetail.courseTableItemId);
      let courseNameId = courseTableItem.courseName;
      let teacherId = courseTableItem.teacherId;
      let duration = courseTableItem.duration;
      let level = courseTableItem.level;
      let termId = courseTableItem.termId;
      let number = courseTableItem.number;
      let courseTableItems = yield this.ctx.service.courseTableItem.getSameClassByCourseNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumber(courseNameId,teacherId,duration,level,termId,number)
      let courseTableItemStudents = [];
      for (let item of courseTableItems) { 
        let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getListByCourseTableItemIdAndStudentId(item.id, studentId);
        let date = new Date(item.date);
        if (courseTableItemStudent.length > 0&&date.getTime()>new Date().getTime()) {
          for (let i = 0; i < courseTableItemStudent.length;i++) { 
            let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableItemStudent[i].courseTableItemId);
            courseTableItem.date = app.moment(courseTableItem.date).format('YYYY-MM-DD');
            courseTableItem.startTime = courseTableItem.startTime.substring(0, 5);
            courseTableItem.endTime = courseTableItem.endTime.substring(0, 5);
            courseTableItem.teacher = yield this.ctx.service.teacher.getById(courseTableItem.teacherId);
            courseTableItem.classroom = yield this.ctx.service.classroom.getById(courseTableItem.classroomId);
            courseTableItemStudents.push(courseTableItem)
          }
        } 
      }
      courseTableDetail.teacher = yield this.ctx.service.teacher.getById(courseTableDetail.teacherId);
      courseTableDetail.course = yield this.ctx.service.course.getById(courseTableDetail.courseNameId);
      let result = {
        courseTableDetail,
        courseTableDetailStudent,
        courseTableItemStudents
      }
      this.success(result);
    }
    //得到学期课考勤记录
    *getTermTimeTag() { 
      let { courseTableDetailId } = this.ctx.request.query;
      let courseTableItems = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailId);
      let timeTags = [];
      for (let item of courseTableItems) { 
        if (item.isChecked === 1) { 
          timeTags.push(item);        
        }
      }
      for (let item of timeTags) { 
        let goClass = [], notGoClass = [];
        item.courseTableItemStudents = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(item.id);
        for (let i = 0; i < item.courseTableItemStudents.length; i++) { 
          item.courseTableItemStudents[i].student = yield this.ctx.service.student.getById(item.courseTableItemStudents[i].studentId);   
          if (item.courseTableItemStudents[i].isGoClass === 1) {
            goClass.push(item.courseTableItemStudents[i])
          } else { 
            notGoClass.push(item.courseTableItemStudents[i])
          }
        }
        timeTags.sort((item1,item2) => { 
          let date1 = new Date(item1.date);
          let date2 = new Date(item2.date);
          return date1-date2
        })
        let date = new Date(item.date); 
        item.date = app.moment(item.date).format('YYYY-MM-DD'); 
        item.dayOfWeek = date.getDay();
        item.startTime = item.startTime.substring(0, 5);
        item.endTime = item.endTime.substring(0, 5);
        item.goClass = goClass;
        item.notGoClass = notGoClass;
      }
      return this.success(timeTags);
    }
    //得到课时课考勤记录
    *getClassTimeTimeTag() { 
      let { courseTableDetailId } = this.ctx.request.query;
      let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
      let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableDetail.courseTableItemId);
      let { courseName, teacherId, duration, level, termId, number } = courseTableItem
      let courseTableItems = yield this.ctx.service.courseTableItem.getSameClassByCourseNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumber(courseName,teacherId,duration,level,termId,number);
      let timeTags = [];
      for (let item of courseTableItems) { 
        if (item.isChecked === 1) { 
          timeTags.push(item);        
        }
      }
      for (let item of timeTags) { 
        let goClass = [], notGoClass = [];
        item.courseTableItemStudents = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdNoleave1(item.id);
        for (let i = 0; i < item.courseTableItemStudents.length; i++) { 
          item.courseTableItemStudents[i].student = yield this.ctx.service.student.getById(item.courseTableItemStudents[i].studentId);   
          if (item.courseTableItemStudents[i].isGoClass === 1) {
            goClass.push(item.courseTableItemStudents[i])
          } else { 
            notGoClass.push(item.courseTableItemStudents[i])
          }
        }
        timeTags.sort((item1,item2) => { 
          let date1 = new Date(item1.date);
          let date2 = new Date(item2.date);
          return date1-date2
        })
        let date = new Date(item.date); 
        item.date = app.moment(item.date).format('YYYY-MM-DD'); 
        item.dayOfWeek = date.getDay();
        item.startTime = item.startTime.substring(0, 5);
        item.endTime = item.endTime.substring(0, 5);
        item.goClass = goClass;
        item.notGoClass = notGoClass;
      }
      return this.success(timeTags);
    }
    //得到转班信息条件不受控制人数不满
    *getTeacherForClassTranceByOpenEnrollmentAndIsDelAndCourseTableItemId() { 
        let courseTableDetails = yield this.ctx.service.courseTableDetail.getTeacherForClassTranceByOpenEnrollmentAndIsDelAndCourseTableItemId();
        // let filterCourseTableDetails = [];
        // for (let item of list) { 
        //     let courseTableDetailStudents = yield this.ctx.service.courseTableDetailStudent.getBy  
        //     if (courseTableDetailStudents.length<item.number) { 
        //       filterCourseTableDetails.push(item);
        //       break
        //     }
        //     for (let it of courseTableDetailStudents) { 
        //         if (courseTableDetailStudents.length==item.number&&it.endCourseTableItemId>) { 

        //         }          
        //     }
        // } 
    }
    //后台可以转班的课程
    * getCourseTableDetailByFilter() { 
      let { termId = 0 } = this.ctx.request.query;
        if (!termId) { 
            return this.fail('请选择学期');
        } 
        let courseTableDetails = yield this.ctx.service.courseTableDetail.getByTermIdAndOpenEnrollmentAndIsDelAndCourseTableItemId(termId);
        for (let item of courseTableDetails) { 
            item.startDate = app.moment(item.startDate).format('YYYY-MM-DD');
            item.endDate = app.moment(item.endDate).format('YYYY-MM-DD');
            item.startTime = item.startTime.substring(0, 5);
            item.endTime = item.endTime.substring(0, 5);
            item.course = yield this.ctx.service.course.getById(item.courseNameId);
            item.teacher = yield this.ctx.service.teacher.getById(item.teacherId);
        }
        this.success(courseTableDetails);     
    }
    //得到学生所某节课的信息
    * getCourseTableDetailStudentByCourseTabledetailIdAndStudentId() { 
        let { courseTableDetailId, studentId } = this.ctx.request.query;
        if (!courseTableDetailId||!studentId) { 
            return this.fail('参数缺少'); 
        }
        let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
        courseTableDetail.startDate = app.moment(courseTableDetail.startDate).format("YYYY-MM-DD");
        courseTableDetail.endDate = app.moment(courseTableDetail.endDate).format("YYYY-MM-DD");
        courseTableDetail.startTime = courseTableDetail.startTime.substring(0, 5);
        courseTableDetail.endTime = courseTableDetail.endTime.substring(0,5);
        let teacher = yield this.ctx.service.teacher.getById(courseTableDetail.teacherId); 
        let course = yield this.ctx.service.course.getById(courseTableDetail.courseNameId); 
        let student = yield this.ctx.service.student.getById(studentId);
        let classroom = yield this.ctx.service.classroom.getById(courseTableDetail.classroomId);
        let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.get(courseTableDetailId, studentId);
        let suspendClass = yield this.ctx.service.courseTableItem.getById(courseTableDetailStudent.endCourseTableItemId);
        suspendClass.date = app.moment(suspendClass.date).format('YYYY-MM-DD');
        let result = {
            courseTableDetail,
            teacher,
            student,
            course,
            classroom,
            courseTableDetailStudent,
            suspendClass
        }  
        this.success(result);
    }
    //后台得到课时课转班的信息
    * getClassTimeClasstransfer() {
        let { courseTableDetailId, studentId } = this.ctx.request.query;
        let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailId);
        let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.get(courseTableDetailId, studentId);
        let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableDetail.courseTableItemId);
        let classroom = yield this.ctx.service.classroom.getById(courseTableDetail.classroomId);
        let course = yield this.ctx.service.course.getById(courseTableDetail.courseNameId);
        let teacher = yield this.ctx.service.teacher.getById(courseTableDetail.teacherId);
        let student = yield this.ctx.service.student.getById(studentId);
        let result = {
          courseTableDetail,
          courseTableDetailStudent,
          classroom,
          course,
          teacher,
          student,
          courseTableItem
        }
        this.success(result);
    }
    //课时课后台通过学期筛选可以转班的课时课
    *getClassTimeClasstransferByTermId() { 
      let { courseTableDetailId=0, termId=0 } = this.ctx.request.query;
      if (!courseTableDetailId||!termId) { 
         return this.fail('参数不全')
      }
      let courseTableDetails = yield this.ctx.service.courseTableDetail.getByTermIdAndOpenEnrollmentAndIsDelAndCourseTableItemId1(termId);
      let courseTableDetails1 = [];
      for (let item of courseTableDetails) { 
        if (item.id != courseTableDetailId) {
          courseTableDetails1.push(item)
        }
      }
      let courseTableDetails2 = [courseTableDetails1[0]];
      for (let item of courseTableDetails1) { 
          let isHas = false
          for (let it of courseTableDetails2) { 
              if (item.courseNameId == it.courseNameId) { 
                isHas=true
              }        
          }
          if (!isHas) {
            courseTableDetails2.push(item)
          }
      }
      for (let item of courseTableDetails2) { 
          item.course = yield this.ctx.service.course.getById(item.courseNameId);
          item.classroom = yield this.ctx.service.classroom.getById(item.classroomId);
          item.teacher = yield this.ctx.service.teacher.getById(item.teacherId);
          item.startTime = item.startTime.substring(0, 5);
      }
      let result = {
        courseTableDetails:courseTableDetails2
      }
      this.success(result);
    }
    //课时课转班提交
    * classTimeClassTransfer () { 
      let { courseTableDetailId=0, studentId=0, classTransferCourseTableDetailId=0, reason='' } = this.ctx.request.body;
      if (!courseTableDetailId||!studentId) { 
          return this.fail('参数不全');
      }
      if (!classTransferCourseTableDetailId) { 
        return this.fail('请选择转班课程');
      }
      if (!reason) { 
        return this.fail('请输入转班原因');
      }
      let classTransferCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(classTransferCourseTableDetailId);
      let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.get(courseTableDetailId, studentId);
      let ctx = this.ctx
      let result = yield app.mysql.beginTransactionScope(function* (conn) {
        let classTimeNum = courseTableDetailStudent.classTimeNum;
        courseTableDetailStudent.classTimeNum = 0;
        courseTableDetailStudent.status = '转班'
        courseTableDetailStudent.classTransferCourseTableDetailId = classTransferCourseTableDetailId;
        courseTableDetailStudent.shiftReasons = reason;
        conn.update('course_table_detail_student', courseTableDetailStudent);
        conn.insert('course_table_detail_student', {studentId,
          courseTableDetailId: classTransferCourseTableDetailId,
          status: '正常',
          termId: classTransferCourseTableDetail.termId,
          numberOfChangeClass:0,
          allNumberOfChangeClass:0,
          numberOfleave:0,
          numberOfChangeClassForTeacher:1000,
          allNumberOfChangeClassForTeacher:1000,
          classTimeNum: classTimeNum
        })
        return {success:true}
      }, ctx)
      if (result.success) {
        this.success()
      } else { 
        this.fail('error')
      }
    }
  }
  return CourseTableDetailController;
};
