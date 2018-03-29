'use strict';

module.exports = app => {
  class TeacherController extends app.Controller {
    *
        update() {
          const teacherInfo = this.ctx.request.body.teacherInfo;
          if (app.lodash.trim(teacherInfo.name) == '') {
            this.fail('教师姓名不能为空');
            return;
          }
          if (app.lodash.trim(teacherInfo.sex) == '') {
            this.fail('性别不能为空');
            return;
          }
          if (app.lodash.trim(teacherInfo.dateOfBirth) == '') {
            this.fail('出生日期不能空');
            return;
          }
          if (!this.ctx.helper.isMobile(teacherInfo.phoneNumber)) {
            this.fail('请输入正确的手机号码');
            return;
          }
          const teacher = yield this.ctx.service.teacher.getById(teacherInfo.id);
          if (!teacher.id) {
            this.fail('老师不存在');
            return;
          }
          console.log(app.moment(teacherInfo.createTime).format('YYYY-MM-DD HH:mm:ss'));
          teacher.name = teacherInfo.name;
          teacher.sex = teacherInfo.sex;
          teacher.dateOfBirth = teacherInfo.dateOfBirth;
          teacher.phoneNumber = teacherInfo.phoneNumber;
          teacher.createTime = app.moment(teacherInfo.createTime).format('YYYY-MM-DD HH:mm:ss');
          teacher.upDateTime = app.moment().format('YYYY-MM-DD HH:mm:ss');
            // teacher.updateTime = new Date();
          yield this.ctx.service.teacher.update(teacher);
          this.success();
    }
        // 请假补课记录
        * getleaveAndMakeUpRecord() {
        const { courseTableDetailId, id } = this.ctx.request.query;
        const leavesRecord = yield this.ctx.service.courseTableItemLeave.getleaveByCourseTableAndTeacherId(courseTableDetailId, id);
        for (const item of leavesRecord) {
          item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
          item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
          item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
          item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
          item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
          item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
        }
        const makeUpRecord = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailIdAndTeacherId(courseTableDetailId, id);
        for (const item of makeUpRecord) {
          item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
          item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
          item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
          item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
          item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
          item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
        }
        const result = {
          leavesRecord,
          makeUpRecord,
        };
        this.success(result);
      }
      // 周课表请假补课记录
      * getleaveAndMakeUpRecord1() {
      const { courseTableItemId=0, id=0 } = this.ctx.request.query;
      if (!courseTableItemId||!id) { 
        return this.fail('缺少参数');
      }
      let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableItemId);
      let courseTableDetailId  
      if (courseTableItem.courseTableDetailId) {
        courseTableDetailId = courseTableItem.courseTableDetailId
      } else { 
       let courseTableItemChangeClass =yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndTeacherIdAndOne(courseTableItemId, id, 1) 
        console.log(courseTableItemChangeClass);
        courseTableDetailId = courseTableItemChangeClass.courseTableDetailId
      }
      if (!courseTableDetailId) { 
        return this.fail('数据不存在'); 
      }
      const leavesRecord = yield this.ctx.service.courseTableItemLeave.getleaveByCourseTableAndTeacherId(courseTableDetailId, id);
      for (const item of leavesRecord) {
        item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
        item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
        item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
        item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
        item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
        item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
      }
      const makeUpRecord = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailIdAndTeacherId(courseTableDetailId, id);
      for (const item of makeUpRecord) {
        item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
        item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
        item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
        item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
        item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
        item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
      }
      const result = {
        leavesRecord,
        makeUpRecord,
      };
      this.success(result);
    }
    *
        getAll() {
          const teachers = yield this.ctx.service.teacher.getAll();
          const result = [];
          for (let i = 0; i < teachers.length; i++) {
            const user = yield this.ctx.service.user.getById(teachers[i].userId);
            result.push({ teacher: teachers[i], user });
          }
          this.ctx.body = result;
        } *
            getList() {
              const result = yield this.ctx.service.teacher.getList(this.ctx.request.query.page, this.ctx.request.query.limit);
              this.ctx.body = result;
            } *
            getById() {
              const teacher = yield this.ctx.service.teacher.getById(this.ctx.request.query.id);

              if (teacher) {
                teacher.professorCourse = teacher.professorCourse || '';
                this.ctx.body = teacher;
              } else {
                this.ctx.body = '没有当前老师';
              }

            } *
            query() {
              console.log(this.ctx.request.body);
              const body = this.ctx.request.body;
              const result = yield this.ctx.service.teacher.query(body.teacherName, body.professorCourse, body.telephone, body.pageIndex, body.limit);
              this.ctx.body = result;
            } *
            getByUserId() {
              const info = yield this.ctx.service.teacher.getByUserId(this.ctx.request.query.userId);
              if (!info) {
                this.fail('未找到老师');
                return;
              }
              this.success(info);
            }

        /**
         * 获取老师有排课的学期列表
         */
    *
        getTerms() {
          const teacherId = this.ctx.request.query.teacherId || 0;
          const teacher = yield this.service.teacher.findById(teacherId);
          if (!teacher) {
            this.fail('老师不存在');
            return;
          }
          const details = yield this.service.courseTableDetail.getListByTeacherId(teacherId);
         
          const details1 = app.lodash.groupBy(details, 'termId');
          const list = [];
          const now = app.moment().hours(0).minutes(0).seconds(0).millisecond(0);
          for (const termId in details1) {
            const term = yield this.service.term.getById(termId);
            const minStartDate = app.lodash.maxBy(details1[termId], function(o) {
              return o.startDate;
            }).startDate;
            const maxEndDate = app.lodash.minBy(details1[termId], function(o) {
              return o.endDate;
            }).endDate;

            const startDate = app.moment(term.startDate);
            const endDate = app.moment(term.endDate);

            let tempDate = app.moment(startDate);
            const days = app.moment(term.endDate).diff(term.startDate, 'days');
            let index = 0;
            const weeks = [];
            for (let i = 0; i <= days; i++) {
              tempDate = app.moment(startDate).add(i, 'day');
              if (tempDate.format('YYYY-MM-DD') == startDate.format('YYYY-MM-DD') || tempDate.weekday() == 0) {
                index++;
                let endDate = app.moment(tempDate).weekday(6);
                if (endDate > endDate) {
                  endDate = app.moment(endDate);
                }
                        // console.log(now, tempDate, endDate);
                weeks.push({
                  lable: '第' + index + '周',
                  startDate: this.ctx.helper.formatDate(tempDate),
                  endDate: this.ctx.helper.formatDate(endDate),
                  current: now >= tempDate && now <= endDate,
                });
              }
            }

            list.push({
              id: term.id,
              name: term.name,
              startDate: this.ctx.helper.formatDate(term.startDate),
              endDate: this.ctx.helper.formatDate(term.endDate),
              minStartDate: this.ctx.helper.formatDate(minStartDate),
              maxEndDate: this.ctx.helper.formatDate(maxEndDate),
              weeks,
            });
          }
          this.success(list);
        }

        /**
         * 根据学期获取老师调课信息
         */
    *
        getCourseSwitch() {
          const termId = this.ctx.request.query.termId;
          const teacherId = this.ctx.request.query.teacherId;
          const list = yield this.service.courseTableChangeClassForTeacher.getListByTeacherIdAndtermId(termId, teacherId);
          for (const info of list) {
            if (info == null) {
              this.fail('数据不存在');
              return;
            }
            info.fromCourseTableItem = yield this.ctx.service.courseTableItem.findById(info.fromCourseTableItemId);
            info.fromCourseTableItem.teacherName = (yield this.ctx.service.teacher.findById(info.fromCourseTableItem.teacherId)).name;
            info.fromCourseTableItem.classroomName = (yield this.ctx.service.classroom.getById(info.fromCourseTableItem.classroomId)).name;
            info.toCourseTableItem = yield this.ctx.service.courseTableItem.findById(info.toCourseTableItemId);
            info.toCourseTableItem.teacherName = (yield this.ctx.service.teacher.findById(info.toCourseTableItem.teacherId)).name;
            info.toCourseTableItem.classroomName = (yield this.ctx.service.classroom.getById(info.toCourseTableItem.classroomId)).name;
            info.fromCourseTableItem.date = app.moment(info.fromCourseTableItem.date).format('YYYY-MM-DD');
            info.toCourseTableItem.date = app.moment(info.toCourseTableItem.date).format('YYYY-MM-DD');
            if (info.studentId > 0) {
              info.student = yield this.ctx.service.student.getById(info.studentId);
            }
            if (info.teacherId > 0) {
              info.teacher = yield this.ctx.service.teacher.findById(info.teacherId);
            }
          }
          this.success(list);
        }

        /**
         * 获取老师的某学期排课信息
         */
    *
        getCourseDetails() {
          const termId = this.ctx.request.query.termId || 0;
          const teacherId = this.ctx.request.query.teacherId || 0;
          const term = yield this.ctx.service.term.getById(termId);
            // var courseTable = yield this.ctx.service.courseTable.getByTermIdAndTeacherId(termId, teacherId);
          const canEdit = true;
            // if(term.endDate > app.moment() && courseTable == null){
            //     canEdit = true;
            // }
          const details = yield this.ctx.service.courseTableDetail.getList(termId, teacherId);
            // 课时课
          const classTimeClassEs = yield this.ctx.service.courseTableItem.getListByTypeAndTeacherIdAndTermId('课时课', teacherId, termId);
          const newDate = new Date();
          const weekStartDate = app.moment(newDate).weekday(-newDate.getDay() + 2);
            // 算出当前课时课在不在当周
          for (let i = 0; i < 7; i++) {
            for (let j = 0; j < classTimeClassEs.length; j++) {
              if (app.moment(weekStartDate).weekday(i).format('YYYY-MM-DD') === app.moment(classTimeClassEs[j].date).format('YYYY-MM-DD')) {
                classTimeClassEs[j].dayOfWeek = app.moment.weekdays()[i + 1];
                classTimeClassEs[j].courseNameId = classTimeClassEs[j].courseName;
                details.push(classTimeClassEs[j]);
              }
            }
          }
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
              if (!item.type) {
                item.type = '正常上班';
              }
              const classroom = yield this.ctx.service.classroom.getById(item.classroomId);
              if (classroom) {
                item.classroomName = classroom.name;
              }
              const students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(item.id);


              item.students = [];

              for (let k = 0; k < students.length; k++) {
                const ss = yield this.ctx.service.student.getById(students[k].studentId);
                item.students.push(ss);
              }
              item.course = yield this.ctx.service.course.getById(item.courseNameId);
              const aSignUpInfo = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumIdAndState(item.id);
              item.aSignUpStudent = [];
              item.courseTableDetailStudent = [];
              for (const it of aSignUpInfo) {
                const student = yield this.ctx.service.student.getById(it.studentId);
                const resetCurriculumCycle = yield this.ctx.service.courseTableDetail.getByCourseTableDetailIdAndStudentId(item.id, it.studentId);
                const courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getCourseTableDetailStudentByCouseTableDetailIdAndStudentId(item.id, it.studentId);
                item.courseTableDetailStudent.push(courseTableItemStudent[0]);
                if (resetCurriculumCycle) {
                  const startDate = yield this.ctx.service.courseTableItem.getById(resetCurriculumCycle.startDateId);
                  let endDate;
                  endDate = yield this.ctx.service.courseTableItem.getById(resetCurriculumCycle.endDateId);
                  console.log(startDate);
                  if (!endDate) {
                    const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(startDate.courseTableDetailId);
                    item.aSignUpStudent.push({ studentId: student.id, name: student.name, startDate: startDate.date, endDate: courseTableDetail.endDate });
                  } else {
                    item.aSignUpStudent.push({ studentId: student.id, name: student.name, startDate: startDate.date, endDate: endDate.date });
                  }

                } else {
                  item.aSignUpStudent.push({ studentId: student.id, name: student.name, startDate: '', endDate: '' });
                }
              }
              obj.list.push(item);
            }
            obj.list.sort(function(a, b) {
              const getTime1 = new Date(app.moment().format('YYYY-MM-DD') + ' ' + a.startTime).getTime();
              const getTime2 = new Date(app.moment().format('YYYY-MM-DD') + ' ' + b.startTime).getTime();
              return getTime1 - getTime2;
            });
            details1.push(obj);
          }

          this.ctx.body = {
            data: {
              canEdit,
              details: details1,
            },
          };
        }
        /**
         * 获取某学期老师的学生信息
         */
    *
        getStudents() {
          const termId = this.ctx.request.query.termId || 0;
          const teacherId = this.ctx.request.query.teacherId || 0;
          const term = yield this.ctx.service.term.getById(termId);
          const list = yield this.service.courseTableDetailStudent.getStudents(termId, teacherId);
          console.log(list);
          const result = [];
          for (const detailStudent of list) {
            const detail = yield this.service.courseTableDetail.getById(detailStudent.courseTableDetailId);
            detail.classroomName = (yield this.service.classroom.getById(detail.classroomId)).name;
            detail.startDate = this.ctx.helper.formatDate(detail.startDate);
            detail.endDate = this.ctx.helper.formatDate(detail.endDate);
            detail.startTime = this.ctx.helper.formatTime(detail.startTime);
            detail.endTime = this.ctx.helper.formatTime(detail.endTime);
            detail.courseTableItem = yield this.ctx.service.courseTableItem.getById(detailStudent.courseTableItemId);
            detail.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(detailStudent.startCourseTableItemId);
            detail.courseTableDetail = yield this.service.courseTableDetail.getById(detailStudent.classTransferCourseTableDetailId);
            if (detailStudent.courseTableItem) {
              detail.courseTableItem = JSON.parse(detailStudent.courseTableItem);
              detail.courseTableItem.date = app.moment(detail.courseTableItem.date).format('YYYY-MM-DD');
            }
            if (detail.startCourseTableItem) {
              detail.startCourseTableItem.date = this.ctx.helper.formatDate(detail.startCourseTableItem.date);
            }
            if (detail.courseTableDetail) {
              if (detailStudent.shiftStartDate) {
                detail.courseTableDetail.startDate = app.moment(JSON.parse(detailStudent.shiftStartDate).date).format('YYYY-MM-DD');
              } else {
                detail.courseTableDetail.startDate = this.ctx.helper.formatDate(detail.courseTableDetail.startDate);
              }
              detail.courseTableDetail.endDate = this.ctx.helper.formatDate(detail.courseTableDetail.endDate);
              detail.courseTableDetail.startTime = this.ctx.helper.formatTime(detail.courseTableDetail.startTime);
              detail.courseTableDetail.endTime = this.ctx.helper.formatTime(detail.courseTableDetail.endTime);
            }
            const student = yield this.service.student.getById(detailStudent.studentId);
            student.wxHead = (yield this.service.user.getById(student.userId)).wxHead;
            student.courseDetail = detail;
            student.status = detailStudent.status;
            student.comments = yield this.service.comment.getList(student.id, detail.id);
            student.comments.forEach(comment => {
              comment.createTime = app.moment(comment.createTime).format('YYYY-MM-DD hh:mm:ss');
            });
            result.push(student);
          }
          this.success(result);
        }

    *
        getStudentsByDetailId() {
          const detailId = this.ctx.request.query.detailId || 0;

          const detail = yield this.service.courseTableDetail.getById(detailId);
          if (detail == null) {
            this.fail('课程信息不存在');
            return;
          }
          detail.startDate = this.ctx.helper.formatDate(detail.startDate);
          detail.endDate = this.ctx.helper.formatDate(detail.endDate);
          detail.startTime = this.ctx.helper.formatTime(detail.startTime);
          detail.endTime = this.ctx.helper.formatTime(detail.endTime);
          detail.classroomName = (yield this.service.classroom.getById(detail.classroomId)).name;

          const detailStudents = yield this.service.courseTableDetailStudent.getByCourseTableDetailId(detailId, '正常');

          const students = [];
          for (const item of detailStudents) {
            const student = yield this.service.student.getById(item.studentId);
            if (student == null) continue;
            const user = yield this.service.user.getById(student.userId);

            students.push({
              id: student.id,
              name: student.name,
              wxHead: user.wxHead,
            });
          }

          this.success({
            detail,
            students,
          });
        }
            /**
             * 获取某节课的信息
             */
    *
            getStudentsByItemId() {
              const detailId = this.ctx.request.query.itemId || 0;

              const detail = yield this.service.courseTableItem.getById(detailId);
              if (detail == null) {
                this.fail('课程信息不存在');
                return;
              }
              const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(detail.courseTableDetailId);
              detail.date = this.ctx.helper.formatDate(detail.date);
              if (courseTableDetail) {
                detail.startDate = this.ctx.helper.formatDate(courseTableDetail.startDate);
                detail.endDate = this.ctx.helper.formatDate(courseTableDetail.endDate);
              }
              detail.startTime = this.ctx.helper.formatTime(detail.startTime);
              detail.endTime = this.ctx.helper.formatTime(detail.endTime);
              detail.classroomName = (yield this.service.classroom.getById(detail.classroomId)).name;
              const teacher = yield this.service.teacher.getById(detail.teacherId);
              detail.teacherName = teacher.name;
              const teacherUser = yield this.service.user.getById(teacher.userId);
              detail.teacherWxHead = teacherUser.wxHead;

              let itemsStudents = yield this.service.courseTableItemStudent.getByCourseTableItemId(detailId, '正常');
              const itemsStudents1 = yield this.service.courseTableItemStudent.getByCourseTableItemId(detailId, '补课');
              const itemsStudents2 = yield this.service.courseTableItemStudent.getByCourseTableItemId(detailId, '停课');
              const itemsStudents3 = yield this.service.courseTableItemStudent.getByCourseTableItemId(detailId, '转课');
              let itemsStudents4 = [];
              if (detail.type == '预约试课') {
                itemsStudents4 = yield this.ctx.service.bookingCourse.getByCourseTableItemId1(detail.id);
              }
              itemsStudents = itemsStudents.concat(itemsStudents1, itemsStudents2, itemsStudents3, itemsStudents4);
              console.log(itemsStudents, 1111);
              const students = [];
              for (const item of itemsStudents) {
                const student = yield this.service.student.getById(item.studentId);
                if (student == null) continue;
                const user = yield this.service.user.getById(student.userId);
                students.push({
                  id: student.id,
                  name: student.name,
                  wxHead: user.wxHead,
                  status: item.status,
                });
              }
              this.success({
                detail,
                students,
              });
    }
    //得到学期，查看这个学期里老师里面有没有排课
    * getTeamsByTeacherId () { 
      const teacherId = this.ctx.request.query.teacherId || 0;
      if (teacherId===0) { 
        return this.fail('缺少参数')
      }
      let terms = yield this.ctx.service.term.getAll();
      let terms1 = [];
      for (let item of terms) { 
        let courseTableItems = yield this.ctx.service.courseTableItem.getListByTermIdAndTeacherId(item.id,teacherId)
        if (courseTableItems.length > 0) { 
          item.startDate = app.moment(item.startDate).format('YYYY/MM/DD');
          item.endDate = app.moment(item.endDate).format('YYYY/MM/DD');
          terms1.push(item);
        }
      }
      this.success(terms1)
    }
    //小程序教师端获取学期课和课时课的信息
    *getTermClassAndClassTime() { 
      let { teacherId = 0, termId = 0 } = this.ctx.request.query;
      if (teacherId===0||termId===0) { 
        return this.fail('缺少参数');
      }
      let teacher = yield this.ctx.service.teacher.getById(teacherId);
      let user = yield this.ctx.service.user.getById(teacher.userId);
      let list = yield this.ctx.service.courseTableDetail.getListByTeacherIdAndTermId1(teacherId, termId)
      let termClass = [];
      let classTime = [];
      for (let item of list) {
        item.course = yield this.ctx.service.course.getById(item.courseNameId);
        if (item.dayOfWeek) {
          item.courseTableItemChangeClass = yield this.ctx.service.courseTableItemChangeCourse.getTeacherSwitchs1(item.id, item.teacherId);
          item.classroom = yield this.ctx.service.classroom.getById(item.classroomId);
          termClass.push(item);
        } else { 
          console.log(item.id, item.teacherId)
          item.courseTableItemChangeClass = yield this.ctx.service.courseTableItemChangeCourse.getTeacherSwitchs1(item.id, item.teacherId);
          classTime.push(item);
        }
      }
      let result = {
        termClass,
        classTime,
        teacher,
        user
      }
      this.success(result)
    }
  }
  return TeacherController;
};
