'use strict';

module.exports = app => {
  class SignUpCurriculumController extends app.Controller {
    *
            saveCurriculum() {
              const body = this.ctx.request.body;
              if (!body.studentId) {
                this.fail('学生不能为空');
                return;
              }
              if (!body.curriculumId) {
                this.fail('课程不能为空');
                return;
              }
              const student = yield this.ctx.service.student.getById(body.studentId);
              const user = yield this.ctx.service.user.findById(student.userId);
              if (body.num) {
                      // 课时课
                student.sign_up = 1;
                yield this.ctx.service.student.update(student);
                const result = yield this.ctx.service.signUpCurriculum.addClassTimeClass(body.studentId, body.curriculumId, user.id, '待确认', app.moment().format('YYYY-MM-DD HH:mm'), body.requirements, body.num);
                this.success();
              } else {
                        // 学期课
                const isSignUp = yield this.ctx.service.signUpCurriculum.getByStudentIdAndState(body.studentId);
                for (const item of isSignUp) {
                  if (item.curriculumId === body.curriculumId) {
                    return this.fail('已经报过当前课程');
                  }
                }
                student.sign_up = 1;
                yield this.ctx.service.student.update(student);
                const result = yield this.ctx.service.signUpCurriculum.saveCurriculum(body.studentId, body.curriculumId, user.id, '待确认', app.moment().format('YYYY-MM-DD HH:mm'), body.specialRequirements);
                const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(body.curriculumId);
                this.success();
              }
            }
                // 报名课时课
    * addClassTimeClass() {
      const { studentId, curriculumId, classTimeClass } = this.ctx.request.body;
      if (!studentId) {
        this.fail('学生不能为空');
        return;
      }
      if (!curriculumId) {
        this.fail('课程不能为空');
        return;
      }
      const student = yield this.ctx.service.student.getById(studentId);
      const user = yield this.ctx.service.user.findById(student.userId);
      const result = yield this.ctx.service.signUpCurriculum.addClassTimeClass(studentId, curriculumId, user.id, '待确认', app.moment().format('YYYY-MM-DD HH:mm'), '', classTimeClass);
      const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(body.curriculumId);
      courseTableDetail.course = yield this.ctx.service.course.getById(courseTableDetail.courseNameId)
      const classTime = app.moment(courseTableDetail.startDate).format('YYYY.MM.DD') + '至' + app.moment(courseTableDetail.endDate).format('YYYY.MM.DD') + ' ' + courseTableDetail.dayOfWeek + ' ' + courseTableDetail.startTime + '-' + courseTableDetail.endTime;
      if (result != 1 && result != 2) {
        if (user.publicOpenId) {
          yield this.ctx.service.wechat.signUpSuccess(student.name, courseTableDetail.course.name, classTime, user.publicOpenId, student.id);
        }
        for (const item of app.config.admins) {
          if (item.publicOpenId) {
            if (item.isEnabled === 1) {
              yield this.ctx.service.wechat.signUpSuccessAdmin(courseTableDetail.course.name, student.name, student.address, app.moment().format('YYYY.MM.DD HH:mm'), item.publicOpenId, student.telephone);
            }
          }
        }
        this.success();
      } else {
        if (result == 1) {
          this.fail('已经报过相关课程了');
        } else if (result == 2) {
          this.fail('时间有冲突，请换其他课程');
        }
      }
      console.log(this.ctx.request.body);
    } *
                getStudentCurriculum() {
                  const result = yield this.ctx.service.signUpCurriculum.getStudentCurriculum(this.ctx.request.query.studentId);
                  for (const item of result) {
                    item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.changeCurriculumId);
                    item.courseTableDetail.startTime = item.courseTableDetail.startTime.substring(0, 5);
                    item.courseTableDetail.endTime = item.courseTableDetail.endTime.substring(0, 5);
                    item.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
                  }
                  this.success(result);
                } *
                getAll() {
                  const { pageIndex, limit, state, termId } = this.ctx.request.query;
                  const result = yield this.ctx.service.signUpCurriculum.getAll(pageIndex, limit, state, termId);
                  let data = [];
                  for (const item of result.aCurriculum) {
                    if (item.curriculumId !== item.changeCurriculumId) {
                      item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.changeCurriculumId);
                      if (termId == item.courseTableDetail.termId) {
                        data.push(item);
                      }
                    } else {
                      item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.curriculumId);
                      if (termId == item.courseTableDetail.termId) {
                        data.push(item);
                      }
                    }
                  }
                  data = data.slice((pageIndex - 1) * limit, pageIndex * limit);
                  result.aCurriculum = data;
                  result.nTotalCount = data.length;
                  for (const item of result.aCurriculum) {
                    item.oStudent = yield this.ctx.service.student.getById(item.studentId);
                    item.oUser = yield this.ctx.service.user.getById(item.userId);
                    item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.curriculumId);
                    item.courseTableDetail.oTeacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
                    item.courseTableDetail.oClassroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
                    item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
                  }
                  this.success(result);
                } *
                getEnrolmentInfo() {
                  const result = yield this.ctx.service.signUpCurriculum.getEnrolmentInfo(this.ctx.request.query.studentId);
                  this.ctx.body = result;
                } *
                  getSignCurriculum() {
                  let { studentId,termId}=this.ctx.request.query
                  const result = yield this.ctx.service.signUpCurriculum.getSignCurriculum(studentId,termId);
                  for (const item of result) {
                    if (item.startCourseTableItemId) {
                      item.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.startCourseTableItemId);
                      item.startCourseTableItem.date = app.moment(item.startCourseTableItem.date).format('YYYY-MM-DD');
                      item.startCourseTableItem.length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.startCourseTableItemId);
                    }
                    item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.curriculumId);
                    item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
                  }
                  let result1 = result.filter((item) => { 
                    if (item.courseTableDetail.termId==termId) { 
                      return item;
                    }
                  })
                  this.success(result1)
                } *
                check() {
                  const id = this.ctx.request.body.id || 0;
                  const v = this.ctx.request.body.v;

                  const info = yield this.service.signUpCurriculum.getById(id);
                  if (info == null) {
                    this.fail('未找到对象');
                    return;
                  }


                  if (v) {
                    info.state = 2;
                  } else {
                    info.state = 0;
                  }
                  yield this.service.signUpCurriculum.changeState(this.ctx.request.body.id, info.state);
                  this.success();
                } *
                saveBackstageStudent() {
                  const req = this.ctx.request.body;
                  console.log(req);
                  const date = new Date(this.ctx.request.body.student.dateOfBirth);
                  const timeStart = new Date(this.ctx.request.body.student.time[0]);
                  const timeEnd = new Date(this.ctx.request.body.student.time[1]);
                  this.ctx.request.body.student.dateOfBirth = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                  yield this.ctx.model.student.create(req.student).then(res => {
                    const week = [ '每周一', '每周二', '每周三', '每周四', '每周五' ];
                    const times = [];
                    let indexDay = '';
                    for (let i = 0; i < week.length; i++) {
                      if (this.ctx.request.body.student.day == week[i]) {
                        indexDay = i;
                      }
                    }
                    const createTime = new Date();
                    this.ctx.model.user.update({ _id: req.student.userId }, { $set: { state: 1 } });
                    times.push({ arrayDay: this.ctx.request.body.student.day, indexDay, timeStart: timeStart.getHours() + ':' + timeStart.getMinutes(), timeEnd: timeEnd.getHours() + ':' + timeEnd.getMinutes() });
                    this.ctx.model.signUpCurriculum.create({ curriculum: req.student.curriculum, studentId: res._id, userId: req.student.userId, state: 1, times, createTime: createTime.getFullYear() + ':' + (createTime.getMonth() + 1) + ':' + createTime.getDate() + ' ' + createTime.getHours() + ':' + createTime.getMinutes() }).then(res => {});
                    this.ctx.body = res;
                  });

                }
                // 学期课id
    *
                getById() {
                  const result = yield this.ctx.service.signUpCurriculum.getById(this.ctx.request.query.id);
                  result.student = yield this.ctx.service.student.getById(result.studentId);
                  result.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(result.curriculumId);
                  result.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(result.startCourseTableItemId);
                  result.courseTableDetail.course = yield this.ctx.service.course.getById(result.courseTableDetail.courseNameId);
                  result.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(result.courseTableDetail.classroomId);
                  result.courseTableDetail.startTime = result.courseTableDetail.startTime.substring(0, 5);
                  result.courseTableDetail.endTime = result.courseTableDetail.endTime.substring(0, 5);
                  result.courseTableDetail.startDate = app.moment(result.courseTableDetail.startDate).format('YYYY.MM.DD');
                  result.courseTableDetail.endDate = app.moment(result.courseTableDetail.endDate).format('YYYY.MM.DD');
                  result.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(result.courseTableDetail.teacherId);
                  result.user = yield this.ctx.service.user.getById(result.courseTableDetail.teacher.userId);
                    // 改变课程
                  if (result.curriculumId !== result.changeCurriculumId) {
                    result.changeCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(result.changeCurriculumId);
                    result.changeCourseTableDetail.course = yield this.ctx.service.course.getById(result.changeCourseTableDetail.courseNameId);
                    result.changeCourseTableDetail.classroom = yield this.ctx.service.classroom.getById(result.changeCourseTableDetail.classroomId);
                    result.changeCourseTableDetail.startTime = result.changeCourseTableDetail.startTime.substring(0, 5);
                    result.changeCourseTableDetail.endTime = result.changeCourseTableDetail.endTime.substring(0, 5);
                    result.changeCourseTableDetail.startDate = app.moment(result.changeCourseTableDetail.startDate).format('YYYY.MM.DD');
                    result.changeCourseTableDetail.endDate = app.moment(result.changeCourseTableDetail.endDate).format('YYYY.MM.DD');
                    result.changeCourseTableDetail.teacher = yield this.ctx.service.teacher.getById(result.changeCourseTableDetail.teacherId);
                  }
                  this.success(result);
                }
                // 课时课id
    * getClassById() {
      const result = yield this.ctx.service.signUpCurriculum.getById(this.ctx.request.query.id);
      result.student = yield this.ctx.service.student.getById(result.studentId);
      result.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(result.curriculumId);
      result.courseTableDetail.course = yield this.ctx.service.course.getById(result.courseTableDetail.courseNameId);
      result.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(result.courseTableDetail.teacherId);
      result.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(result.courseTableDetail.classroomId);
      result.user = yield this.ctx.service.user.getById(result.courseTableDetail.teacher.userId);
      result.courseTableDetail.term = yield this.ctx.service.term.getById(result.courseTableDetail.termId);
      result.courseTableDetail.term.startDate = app.moment(result.courseTableDetail.term.startDate).format('YYYY.MM.DD');
      result.courseTableDetail.term.endDate = app.moment(result.courseTableDetail.term.endDate).format('YYYY.MM.DD');
      if (result.curriculumId !== result.changeCurriculumId) {
        result.changeCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(result.changeCurriculumId);
        result.changeCourseTableDetail.course = yield this.ctx.service.course.getById(result.changeCourseTableDetail.courseNameId);
        result.changeCourseTableDetail.classroom = yield this.ctx.service.classroom.getById(result.changeCourseTableDetail.classroomId);
        result.changeCourseTableDetail.term = yield this.ctx.service.term.getById(result.changeCourseTableDetail.termId);
        result.changeCourseTableDetail.term.startDate = app.moment(result.changeCourseTableDetail.term.startDate).format('YYYY.MM.DD');
        result.changeCourseTableDetail.term.endDate = app.moment(result.changeCourseTableDetail.term.endDate).format('YYYY.MM.DD');
      }
      this.success(result);
    }
    * changeState() {
      const { id, state, checked, nStartWeekId, reviewRemarks, paymentMethod } = this.ctx.request.body;
      if (checked) {
        if (!nStartWeekId) {
          return this.fail('开始周期不能为空');
        }
      }
      const info = yield app.mysql.get('sign_up_curriculum', { id });
      info.state = '已' + state;
      info.reviewRemarks = reviewRemarks;
      info.paymentMethod = paymentMethod;
      info.startCourseTableItemId = nStartWeekId;
      const course = yield this.ctx.service.courseTableDetail.getById(info.curriculumId);
      course.course = yield this.ctx.service.course.getById(course.courseNameId);
      const student = yield this.ctx.service.student.getById(info.studentId);
      const studentUser = yield this.ctx.service.user.getById(student.userId);
      if (state == '确认') {
        const classroom = yield this.ctx.service.classroom.getById(course.classroomId);
        const teacher = yield this.ctx.service.teacher.getById(course.teacherId);
        const teacherUser = yield this.ctx.service.user.getById(teacher.userId);
        const aCourseItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(info.curriculumId);
        if (checked) {
          for (const item of aCourseItem) {
            if (nStartWeekId <= item.id&&item.isDel===0) {
              const length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, info.studentId);
              if (length > 0) {
                this.fail('当前课程已有该学生的课');
                return;
              }
              const length1 = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.id);
              if (length1 >= item.number) {
                this.fail('当前课程的某节课人数已满，请更改课程开始日期');
                return;
              }
            }
          }
          const aCourseItem1 = [];
          for (const item of aCourseItem) {
            if (nStartWeekId <= item.id) {
              aCourseItem1.push(nStartWeekId);
            }
          }
          const classTimeNum = info.classTimeNum;
          const studentLeave = course.totalLeave;
          const teacherLeave = 1000;
          yield this.ctx.service.courseTableDetailStudent.add(info.studentId, info.curriculumId, '正常', course.termId, id, nStartWeekId, studentLeave, studentLeave, studentLeave, teacherLeave, teacherLeave, classTimeNum);
          const courseTableItem = yield this.ctx.service.courseTableItem.getById(nStartWeekId);
          courseTableItem.course = yield this.ctx.service.course.getById(courseTableItem.courseName);
          const classTime = app.moment(courseTableItem.date).format('YYYY.MM.DD') + '至' + app.moment(course.endDate).format('YYYY.MM.DD') + ' ' + course.dayOfWeek + ' ' + course.startTime + '-' + course.endTime;
          if (courseTableItem.date&&course.endDate) { 
            yield this.ctx.service.wechat.signUpAuditingSuccess(student.name, teacher.name, course.course.name, classTime, classroom.name, studentUser.publicOpenId, teacherUser.publicOpenId, student.id);
          }
          for (const item of aCourseItem) {
            if (nStartWeekId <= item.id && item.isDel===0) {
              item.status = '';
              yield this.ctx.service.courseTableItem.update(item);
              yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId);
            }
          }
          yield this.ctx.service.courseTableDetail.resetCurriculumCycle(info.curriculumId, info.studentId, nStartWeekId, aCourseItem[aCourseItem.length - 1].id);
        } else {
          for (const item of aCourseItem) {
            const length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, info.studentId);
            if (length > 0) {
              this.fail('当前课程已有该学生的课');
              return;
            }
            const length1 = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.id);
            if (length1 >= item.number) {
              this.fail('当前课程的某节课人数已满，请更改课程开始日期');
              return;
            }
          }
          const classTimeNum = info.classTimeNum;
          const studentLeave = course.totalLeave;
          const teacherLeave = 1000;
          const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.add(info.studentId, info.curriculumId, '正常', course.termId, id, null, studentLeave, studentLeave, studentLeave, teacherLeave, teacherLeave, classTimeNum);
          const classTime = app.moment(course.startDate).format('YYYY.MM.DD') + '至' + app.moment(course.endDate).format('YYYY.MM.DD') + ' ' + course.dayOfWeek + ' ' + course.startTime + '-' + course.endTime;
          yield this.ctx.service.wechat.signUpAuditingSuccess(student.name, teacher.name, course.course.name, classTime, classroom.name, studentUser.publicOpenId, teacherUser.publicOpenId, student.id);
          yield this.ctx.service.signUpWechat.add(courseTableDetailStudent.insertId);
          for (const item of aCourseItem) {
            if (item.isDel===0) { 
              item.status = '';
              yield this.ctx.service.courseTableItem.update(item);
              yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId);
            }
          }
        }
        student.sign_up = 1;
        yield this.service.student.update(student);
      } else {
        const classTime = app.moment(course.startDate).format('YYYY.MM.DD') + '至' + app.moment(course.endDate).format('YYYY.MM.DD') + ' ' + course.dayOfWeek + ' ' + course.startTime + '-' + course.endTime;
        if (state == '取消') {
          for (const item of app.config.admins) {
            if (item.publicOpenId) {
              if (item.isEnabled === 1) {
                yield this.ctx.service.wechat.signUpCacleFailToAdmin(student.name, course.course.name, item.publicOpenId);
              }
            }
          }
          const list = yield this.ctx.service.signUpCurriculum.getByStudentIdAndState1(info.studentId);
          if (list.length < 2) {
            student.sign_up = 1;
            yield this.service.student.update(student);
          }
          yield this.ctx.service.wechat.signUpCacleFail(student.name, course.course.name, classTime, studentUser.publicOpenId, student.id);
        } else if (state == '拒绝') {
          yield this.ctx.service.wechat.signUpAuditingFail(student.name, course.course.name, classTime, studentUser.publicOpenId, student.id);
        } else {
          this.fail('出错');
          return;
        }
      }
      yield this.service.signUpCurriculum.update(info);
      this.success();
    } *
                getSignUpCourseOtherTime() {
                  const result = yield this.ctx.service.courseTableDetail.getSignUpCourseOtherTime(this.ctx.request.query.id);
                  for (const item of result) {
                    item.teacher = yield this.ctx.service.teacher.getById(item.teacherId);
                  }
                  this.success(result);
                }
    * getSignUpCourseOtherClassTime() {
      const result = yield this.ctx.service.courseTableDetail.getSignUpCourseOtherClassTime(this.ctx.request.query.id);
      for (const item of result) {
        item.teacher = yield this.ctx.service.teacher.getById(item.teacherId);
        item.course = yield this.ctx.service.course.getById(item.courseNameId);
      }
      this.success(result);
    }
    *
                confirm() {
                  const { id, changeCurriculumId, checked, nStartWeekId, nEndWeekId, reviewRemarks, paymentMethod } = this.ctx.request.body;
                  if (checked) {
                    if (!nStartWeekId) {
                      return this.fail('开始周期不能为空');
                    }
                  }
                  const info = yield app.mysql.get('sign_up_curriculum', { id });
                    // if (info.state != '待确认') {
                    //     this.fail('当前状态不是待确认状态');
                    //     return;
                    // }
                  info.state = '已确认';
                  info.changeCurriculumId = changeCurriculumId;
                  info.reviewRemarks = reviewRemarks;
                  info.paymentMethod = paymentMethod;
                  info.startCourseTableItemId = nStartWeekId;
                  if (!changeCurriculumId) {
                    this.fail('更改时间不能为空');
                    return;
                  }
                  const course = yield this.ctx.service.courseTableDetail.getById(changeCurriculumId);
                  const student = yield this.ctx.service.student.getById(info.studentId);
                  const classroom = yield this.ctx.service.classroom.getById(course.classroomId);
                  const teacher = yield this.ctx.service.teacher.getById(course.teacherId);
                  const studentUser = yield this.ctx.service.user.getById(student.userId);
                  const teacherUser = yield this.ctx.service.user.getById(teacher.userId);
                  const aCourseItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(changeCurriculumId);
                  const studentLeave = course.totalLeave;
                  const teacherLeave = 1000;
                  if (checked) {
                    yield this.ctx.service.courseTableDetailStudent.add(info.studentId, changeCurriculumId, '正常', course.termId, id, nStartWeekId, studentLeave, studentLeave, studentLeave, teacherLeave, teacherLeave);
                    for (const item of aCourseItem) {
                      if (nStartWeekId <= item.id&&item.isDel === 0) {
                        const length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, info.studentId);
                        if (length > 0) {
                          this.fail('当前课程已有该学生的课');
                          return;
                        }
                        const length1 = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.id);
                        if (length1 >= item.number) {
                          this.fail('当前课程的某节课人数已满，请更改课程开始日期');
                          return;
                        }
                      }
                    }
                    for (const item of aCourseItem) {
                      if (nStartWeekId <= item.id&&item.isDel === 0) {
                        yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId);
                        item.status = '';
                        yield this.ctx.service.courseTableItem.update(item);
                      }
                    }
                    const courseTableItem = yield this.ctx.service.courseTableItem.getById(nStartWeekId);
                    const classTime = app.moment(courseTableItem.date).format('YYYY.MM.DD') + '至' + app.moment(course.endDate).format('YYYY.MM.DD') + ' ' + course.dayOfWeek + ' ' + course.startTime + '-' + course.endTime;
                    yield this.ctx.service.wechat.signUpAuditingSuccess(student.name, teacher.name, course.courseName, classTime, classroom.name, studentUser.publicOpenId, teacherUser.publicOpenId, student.id);
                    yield this.ctx.service.courseTableDetail.resetCurriculumCycle(changeCurriculumId, info.studentId, nStartWeekId, aCourseItem[aCourseItem.length - 1].id);
                  } else {
                    for (const item of aCourseItem) {
                      const length = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemIdAndStudentId(item.id, info.studentId);
                      if (length > 0) {
                        this.fail('当前课程已有该学生的课');
                        return;
                      }
                      const length1 = yield this.ctx.service.courseTableItemStudent.getLengthByCourseTableItemId(item.id);
                      if (length1 >= item.number) {
                        this.fail('当前课程的某节课人数已满，请更改课程开始日期');
                        return;
                      }
                            // yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId)
                            // item.status = ""
                            // yield this.ctx.service.courseTableItem.update(item)
                    }
                    for (const item of aCourseItem) {
                      item.status = '';
                      yield this.ctx.service.courseTableItem.update(item);
                      yield this.ctx.service.courseTableItemStudent.add(item.id, info.studentId, '正常', item.termId);
                    }
                    yield this.ctx.service.courseTableDetailStudent.add(info.studentId, changeCurriculumId, '正常', course.termId, id, null, studentLeave, studentLeave, studentLeave, teacherLeave, teacherLeave);
                    const classTime = app.moment(course.startDate).format('YYYY.MM.DD') + '至' + app.moment(course.endDate).format('YYYY.MM.DD') + ' ' + course.dayOfWeek + ' ' + course.startTime + '-' + course.endTime;
                    yield this.ctx.service.wechat.signUpAuditingSuccess(student.name, teacher.name, course.courseName, classTime, classroom.name, studentUser.publicOpenId, teacherUser.publicOpenId, student.id);
                  }
                  student.sign_up = 1;
                  yield this.service.student.update(student);
                  yield this.service.signUpCurriculum.update(info);
                  this.success();
                }
                // 更改开始日期
    * getWeekById() {
      const { id } = this.ctx.request.query;
      const aCourseItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(id);
      for (let i = 0; i < aCourseItem.length; i++) {
        aCourseItem[i].date = app.moment(aCourseItem[i].date).format('YYYY-MM-DD');
      }
      this.success(aCourseItem);
    } *
                backEndCancel() {
                  const oSignUp = yield app.mysql.get('sign_up_curriculum', { id: this.ctx.request.body.id });
                  oSignUp.state = '已取消';
                  const courseTableDetailId = oSignUp.changeCurriculumId || oSignUp.curriculumId;
                  yield this.ctx.service.courseTableDetailStudent.delete(courseTableDetailId, oSignUp.studentId);
                  const aCourseItem = yield this.ctx.service.courseTableItem.getByCourseTableDetailId(courseTableDetailId);
                  for (const item of aCourseItem) {
                    yield this.ctx.service.courseTableItemStudent.delete(item.id, oSignUp.studentId);
                  }
                  const student = yield this.ctx.service.student.getById(oSignUp.studentId);
                  yield this.ctx.service.courseTableDetail.deleteByCourseTableDetailIdAndStudentId(courseTableDetailId, oSignUp.studentId);
                  student.sign_up = 0;
                  yield this.service.student.update(student);
                  yield this.ctx.service.signUpCurriculum.update(oSignUp);
                  this.success();
                }
    * getByState() {
      const body = this.ctx.request.body;
      const result = yield this.ctx.service.signUpCurriculum.getByState(body.state, body.pageIndex, body.limit);
      this.success(result);
    }
        }
        // * get
  return SignUpCurriculumController;
};
