/**
 * Created by rhino on 2017-04-14.
 */
module.exports = app => {
  class StudentController extends app.Controller {
    *
        getByStudent() {
          const students = yield this.ctx.service.student.getByUserId(this.ctx.request.query.userId);
          this.ctx.body = students;
        } *
            saveStudentInfo() {
              const { name, sex, dateOfBirth, school, parentName, telephone, address, basics, userId, introduceBaby } = this.ctx.request.body;
              if (app.lodash.trim(name) == '') {
                this.fail('学生姓名不能为空');
                return;
              }
              if (app.lodash.trim(sex) == '') {
                this.fail('宝宝性别不能为空');
                return;
              }
              if (app.lodash.trim(dateOfBirth) == '') {
                this.fail('出生日期不能空');
                return;
              }
              if (app.lodash.trim(school) == '') {
                this.fail('学校不能为空');
                return;
              }
              if (app.lodash.trim(parentName) == '') {
                this.fail('家长姓名不能为空');
                return;
              }
              if (!this.ctx.helper.isMobile(telephone)) {
                this.fail('请输入正确的手机号码');
                return;
              }
              if (app.lodash.trim(address) == '') {
                this.fail('家庭住址不能为空');
                return;
              }
              if (app.lodash.trim(basics) == '') {
                this.fail('学习经历不能为空');
                return;
              }
              const students = yield this.service.student.getByUserId(userId);
              for (const s of students) {
                if (s.name == name) {
                  this.fail('姓名重复');
                  return;
                }
              }
              const now = app.moment();
              const result = yield this.ctx.service.student.add(name, sex, school, parentName, telephone, address, basics, app.lodash.trim(introduceBaby),
                    dateOfBirth, userId, now.format('YYYY-MM-DD HH:mm:ss'), now.format('YYYY-MM-DD HH:mm:ss'), 0, 0);
              this.ctx.body = {
                code: 1,
                msg: '添加成功',
                data: result,
              };
            } *
            updateStudentInfo() {
              if (!this.ctx.request.body.userInfo) {
                this.fail('请传入数据');
                return;
              }
              let { id, name, sex, dateOfBirth, school, parentName, telephone, address, basics, introduceBaby } = this.ctx.request.body.userInfo;
              const student = yield this.ctx.service.student.getById(id);
              if (student == null) {
                this.fail('学生不存在');
                return;
              }
              if (app.lodash.trim(name) == '') {
                this.fail('学生姓名不能为空');
                return;
              }
              if (app.lodash.trim(sex) == '') {
                this.fail('宝宝性别不能为空');
                return;
              }
              if (app.lodash.trim(dateOfBirth) == '') {
                this.fail('出生日期不能空');
                return;
              }
              if (app.lodash.trim(school) == '') {
                this.fail('学校不能为空');
                return;
              }
              if (app.lodash.trim(parentName) == '') {
                this.fail('家长姓名不能为空');
                return;
              }
              if (!this.ctx.helper.isMobile(telephone)) {
                this.fail('请输入正确的手机号码');
                return;
              }
              if (app.lodash.trim(address) == '') {
                this.fail('家庭住址不能为空');
                return;
              }
              if (app.lodash.trim(basics) == '') {
                this.fail('学习经历不能为空');
                return;
              }
              const students = yield this.service.student.getByUserId(student.userId);
              for (const s of students) {
                if (s.name == name && s.id != student.id) {
                  this.fail('姓名重复');
                  return;
                }
              }
              introduceBaby = introduceBaby || '';
              Object.assign(student, { name, sex, dateOfBirth, school, parentName, telephone, address, basics, introduceBaby });
              const result = yield this.ctx.service.student.update(student);
              this.ctx.body = {
                code: 1,
                msg: '修改成功',
              };
            }
            /**
             * 获取学生报课信息
             */
    *
            getSignUpCourse() {
              const studentId = this.ctx.request.query.studentId;
              const termId = this.ctx.request.query.termId || 1;
              const term = yield this.service.term.getById(termId);
              const detailStudents = yield this.service.courseTableDetailStudent.getList(termId, studentId);
              console.log(detailStudents);
              const details = yield this.service.courseTableDetail.getByIds(app.lodash.map(detailStudents, 'courseTableDetailId'));
              const data = {
                termId: term.id,
                termName: term.name,
                teachers: [],
              };
              const teacherIds = app.lodash.union(app.lodash.map(details, 'teacherId'));
              for (const teacherId of teacherIds) {
                const teacher = yield this.service.teacher.getById(teacherId);
                const detailsForTeacher = app.lodash.sortBy(app.lodash.filter(details, { teacherId }), 'startTime');
                const user = yield this.service.user.getById(teacher.userId);
                const teacherObj = {
                  id: teacher.id,
                  name: teacher.name,
                  wxHead: user.wxHead,
                  list: [],
                };
                for (const detail of detailsForTeacher) {
                  console.log(detail, 11);
                  const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(detail.id, studentId);
                  if (courseTableDetailStudent.courseTableItem) {
                    courseTableDetailStudent.closingDate = JSON.parse(courseTableDetailStudent.courseTableItem);
                    courseTableDetailStudent.closingDate.date = app.moment(courseTableDetailStudent.closingDate.date).format('YYYY-MM-DD');
                  }
                  if (courseTableDetailStudent.shiftStartDate) {
                    courseTableDetailStudent.reStartDate = JSON.parse(courseTableDetailStudent.shiftStartDate);
                    courseTableDetailStudent.reStartDate.date = app.moment(courseTableDetailStudent.reStartDate.date).format('YYYY-MM-DD');
                    courseTableDetailStudent.reCourseTableDetail = yield this.ctx.service.courseTableDetail.getById(courseTableDetailStudent.classTransferCourseTableDetailId);
                    courseTableDetailStudent.reCourseTableDetail.term = yield this.ctx.service.term.getById(courseTableDetailStudent.reCourseTableDetail.termId);
                    courseTableDetailStudent.reCourseTableDetail.teacher = yield this.ctx.service.term.getById(courseTableDetailStudent.reCourseTableDetail.teacherId);
                    courseTableDetailStudent.reCourseTableDetail.classroom = yield this.ctx.service.classroom.getById(courseTableDetailStudent.reCourseTableDetail.classroomId);
                    courseTableDetailStudent.reCourseTableDetail.startDate = app.moment(courseTableDetailStudent.reCourseTableDetail.startDate).format('YYYY-MM-DD');
                    courseTableDetailStudent.reCourseTableDetail.endDate = app.moment(courseTableDetailStudent.reCourseTableDetail.endDate).format('YYYY-MM-DD');
                  }
                  if (courseTableDetailStudent.startCourseTableItemId) {
                    courseTableDetailStudent.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableDetailStudent.startCourseTableItemId);
                    courseTableDetailStudent.startCourseTableItem.date = app.moment(courseTableDetailStudent.startCourseTableItem.date).format('YYYY-MM-DD');
                  }
                  const classroom = yield this.service.classroom.getById(detail.classroomId);
                  const comments = yield this.service.comment.getShowStudentLIst(studentId, teacher.id, detail.id);
                  for (const item of comments) {
                    item.createTime = app.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
                  }
                  teacherObj.list.push({
                    id: detail.id,
                    dayOfWeek: detail.dayOfWeek,
                    startDate: this.ctx.helper.formatDate(detail.startDate),
                    endDate: this.ctx.helper.formatDate(detail.endDate),
                    courseName: detail.courseName,
                    startTime: detail.startTime,
                    endTime: detail.endTime,
                    number: detail.number,
                    level: detail.level,
                    classroomName: classroom.name,
                    comments,
                    courseTableDetailStudent,
                  });
                }

                data.teachers.push(teacherObj);
              }
              this.success(data);
            }

        /**
         * 获取报名的学期
         */
    *
        getSignUpTerms() {
            const { studentId = 0 } = this.ctx.request.query;
            if (studentId===0) { 
              return this.fail('缺少参数');
            }
            const termIds = yield this.ctx.service.courseTableDetailStudent.getTermIds(studentId);
            let terms = [];
            for (let item of termIds) { 
              let term = yield this.ctx.service.term.getById(item);
              term.startDate = app.moment(term.startDate).format('YYYY-MM-DD');
              term.endDate = app.moment(term.endDate).format('YYYY-MM-DD');
              terms.push(term);
            }
            terms.sort((term2, term3) => { 
                let date1 = new Date(term2.startDate);
                let date2 = new Date(term3.startDate);
                return date1.getTime() - date2.getTime();
            })
            let term1 = terms[0];
            let courseTabledetailStudents = [];
            if (terms.length>0) { 
              courseTabledetailStudents = yield this.ctx.service.courseTableDetailStudent.getMyAllCourseByStudentIdAndTermId(studentId, term1.id);
            }
            let courseTabledetailStudents1 = [];
            for (let item of courseTabledetailStudents) { 
              item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
              if (item.courseTableDetail.courseTableItemId > 0) {
                continue;
              } 
              item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
              item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
              item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
              item.courseTableDetail.startDate = app.moment(item.courseTableDetail.startDate).format('YYYY-MM-DD');
              item.courseTableDetail.startTime = item.courseTableDetail.startTime.substring(0, 5);
              item.courseTableDetail.endTime = item.courseTableDetail.endTime.substring(0, 5)
              if (item.startCourseTableItemId) { 
                item.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.startCourseTableItemId);         
                item.startCourseTableItem.date = app.moment(item.startCourseTableItem.date).format("YYYY-MM-DD");
              }
              if (item.endCourseTableItemId) { 
                item.endCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.endCourseTableItemId);         
                item.endCourseTableItem.date = app.moment(item.endCourseTableItem.date).format("YYYY-MM-DD");
              }
              courseTabledetailStudents1.push(item)
            }
            let result = {
               term1,
               courseTabledetailStudents:courseTabledetailStudents1 
            }  
            this.success(result);
        }
       *getSignUpClassTime() { 
        const { studentId = 0 } = this.ctx.request.query;
          if (studentId===0) { 
            return this.fail('缺少参数');
          }
          const termIds = yield this.ctx.service.courseTableDetailStudent.getTermIds(studentId);
          let terms = [];
          for (let item of termIds) { 
            let term = yield this.ctx.service.term.getById(item);
            term.startDate = app.moment(term.startDate).format('YYYY-MM-DD');
            term.endDate = app.moment(term.endDate).format('YYYY-MM-DD');
            terms.push(term);
          }
          terms.sort((term2, term3) => { 
              let date1 = new Date(term2.startDate);
              let date2 = new Date(term3.startDate);
              return date1.getTime() - date2.getTime();
          })
         let courseTabledetailStudents=[] 
         let term1 = terms[0];
          if (terms.length>0) { 
            courseTabledetailStudents = yield this.ctx.service.courseTableDetailStudent.getMyAllCourseByStudentIdAndTermId(studentId, term1.id);
          }
          let courseTabledetailStudents1 = [];
         for (let item of courseTabledetailStudents) { 
            item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
            if (item.classTimeNum == 0&&item.courseTableDetail.courseTableItemId==0) {
              continue;
            }  
            item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
            item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
            item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
            item.courseTableDetail.startDate = app.moment(item.courseTableDetail.startDate).format('YYYY-MM-DD');
            item.courseTableDetail.startTime = item.courseTableDetail.startTime.substring(0, 5);
            item.courseTableDetail.endTime = item.courseTableDetail.endTime.substring(0, 5)
            item.courseTableDetail.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetail.courseTableItemId);
            let sameCourseTableItems = yield this.ctx.service.courseTableItem.getSameClassByCourseNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumber(item.courseTableDetail.courseTableItem.courseName,item.courseTableDetail.courseTableItem.teacherId,item.courseTableDetail.courseTableItem.duration,item.courseTableDetail.courseTableItem.level,item.courseTableDetail.courseTableItem.termId,item.courseTableDetail.courseTableItem.number)
            let courseTableItem = [];
            for (let it of sameCourseTableItems) { 
                let courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(it.id, studentId, '请假')
                if (courseTableItemStudent) {
                  console.log(it);
                  it.date = app.moment(it.date).format('YYYY-MM-DD');
                  it.startTime = it.startTime.substring(0, 5);
                  it.endTime = it.endTime.substring(0,5);
                    courseTableItem.push(it);
                }
            }
            item.courseTableItem = courseTableItem;
            courseTabledetailStudents1.push(item)
          }
          let result = {
            term1,
            courseTabledetailStudents:courseTabledetailStudents1 
          }  
          this.success(result);  
        }
            /**
             * 根据学期获取学生调课信息
             */
    *
            getCourseSwitch() {
              const termId = this.ctx.request.query.termId;
              const studentId = this.ctx.request.query.studentId;

              const list = yield this.service.courseTableItemSwitch.getStudentSwitchs(termId, studentId);
              console.log(list);
              for (const info of list) {
                if (info == null) {
                  this.fail('数据不存在');
                  return;
                }
                info.createTime = app.moment(info.createTime).format('YYYY-MM-DD hh:mm:ss');
                info.fromCourseTableItem = yield this.service.courseTableItem.findById(info.fromCourseTableItemId);
                info.fromCourseTableItem.teacherName = (yield this.service.teacher.findById(info.fromCourseTableItem.teacherId)).name;
                info.fromCourseTableItem.classroomName = (yield this.service.classroom.getById(info.fromCourseTableItem.classroomId)).name;
                info.fromCourseTableItem.date = this.ctx.helper.formatDate(info.fromCourseTableItem.date);
                info.fromCourseTableItem.startTime = this.ctx.helper.formatTime(info.fromCourseTableItem.startTime);
                info.fromCourseTableItem.endTime = this.ctx.helper.formatTime(info.fromCourseTableItem.endTime);

                info.toCourseTableItem = yield this.service.courseTableItem.findById(info.toCourseTableItemId);
                info.toCourseTableItem.teacherName = (yield this.service.teacher.findById(info.toCourseTableItem.teacherId)).name;
                info.toCourseTableItem.classroomName = (yield this.service.classroom.getById(info.toCourseTableItem.classroomId)).name;
                info.toCourseTableItem.date = this.ctx.helper.formatDate(info.toCourseTableItem.date);
                info.toCourseTableItem.startTime = this.ctx.helper.formatTime(info.toCourseTableItem.startTime);
                info.toCourseTableItem.endTime = this.ctx.helper.formatTime(info.toCourseTableItem.endTime);
                if (info.studentId > 0) {
                  info.student = yield this.service.student.getById(info.studentId);
                }
                if (info.teacherId > 0) {
                  info.teacher = yield this.service.teacher.getById(info.teacherId);
                }
              }
              this.success(list);
            } *
            getById() {
              const result = yield this.ctx.service.student.getById(this.ctx.request.query.id);
              this.ctx.body = result;
            } *
            deleteUser() {
                // console.log(this.ctx.request.body.id);
              const id = this.ctx.request.body.id || 0;
              const student = yield this.service.student.getById(id);
              console.log(student);
              if (student.sign_up == 1) {
                this.fail('已报名成功，不能删除！');
                return;
              }
              if (student == null) {
                this.fail('学生不存在');
                return;
              }
              if (student.userId != this.userId) {
                this.fail('您没有操作权限');
                return;
              }
              yield this.ctx.service.student.deleteUser(id);
              this.success();
            } *
            getNoReserved() {
              console.log(this.ctx.request.query);
              const result = yield this.ctx.service.student.getNoReserved(this.ctx.request.query.pageIndex, this.ctx.request.query.limit);
              this.ctx.body = result;
            } *
            getNoReservedQuery() {
              console.log(this.ctx.request.body);
              const result = yield this.ctx.service.student.getNoReservedQuery(this.ctx.request.body.studentName, this.ctx.request.body.parentName, this.ctx.request.body.pageIndex, this.ctx.request.body.limit);
              this.ctx.body = result;
            }
           
            /**
             *  前台学生调课时获取学生要调哪天的课
             */
    *
            getFreeListByCourseTableDetailId() {
              const courseTableDetailId = this.ctx.request.query.courseTableDetailId || 0;
              const studentId = this.ctx.request.query.studentId || 0;
              const detail = yield this.service.courseTableDetail.getById(courseTableDetailId);
              if (detail == null) {
                this.fail('未找到要调的课程信息');
                return;
              }
              detail.startDate = this.ctx.helper.formatDate(detail.startDate);
              detail.endDate = this.ctx.helper.formatDate(detail.endDate);
              detail.startTime = this.ctx.helper.formatTime(detail.startTime);
              detail.endTime = this.ctx.helper.formatTime(detail.endTime);
              detail.course = yield this.ctx.service.course.getById(detail.courseNameId);
              detail.teacherName = (yield this.service.teacher.getById(detail.teacherId)).name;
              detail.classroom = yield this.service.classroom.getById(detail.classroomId);
                // 供学生选择的要请假的时间
              const list = yield this.service.courseTableItem.getFreeListByCourseTableDetailId(courseTableDetailId);
              const aCourseTableItemStudent = [];
              for (const item of list) {
                let courseTableItemStudent;
                const courseTableItemStudent1 = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(item.id, studentId, '正常');
                if (courseTableItemStudent1) {
                  courseTableItemStudent = courseTableItemStudent1;
                }
                const courseTableItemStudent2 = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(item.id, studentId, '停课');
                if (courseTableItemStudent2) {
                  courseTableItemStudent = courseTableItemStudent2;
                }
                const courseTableItemStudent3 = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(item.id, studentId, '转课');
                if (courseTableItemStudent3) {
                  courseTableItemStudent = courseTableItemStudent3;
                }
                if (courseTableItemStudent) {
                  aCourseTableItemStudent.push(courseTableItemStudent);
                }
              }
              const courseTableItemChangeClass = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailIdAndStudentIdAndOne(courseTableDetailId, studentId, 1);
              for (const item of courseTableItemChangeClass) {
                const courseTableItemStudent = yield this.ctx.service.courseTableItemStudent.getByCourseTableItemIdAndStudentIdAndStatus(item.courseTableDetailItemId, studentId, '补课');
                if (courseTableItemStudent) {
                  aCourseTableItemStudent.push(courseTableItemStudent);
                }
              }
              const aCourseTableItem = [];
              for (const item of aCourseTableItemStudent) {
                const oCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableItemId);
                oCourseTableItem.courseTableItemStudentStatus = item.status;
                aCourseTableItem.push(oCourseTableItem);
              }
              aCourseTableItem.forEach(item => {
                item.date = this.ctx.helper.formatDate(item.date);
                item.startTime = this.ctx.helper.formatTime(item.startTime);
                item.endTime = this.ctx.helper.formatTime(item.endTime);
              });
              aCourseTableItem.sort(function(a, b) {
                const getTime1 = new Date(a.date + ' ' + a.startTime).getTime();
                const getTime2 = new Date(b.date + ' ' + b.startTime).getTime();
                return getTime1 - getTime2;
              });
              const courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId);
              this.success({
                detail,
                courseTableItems: aCourseTableItem,
                courseTableDetailStudent,
              });
            }

        /**
         * 获取我要续课页面初始数据
         */
    *
        getRenewData() {
          const detailId = this.ctx.request.query.courseDetailId || 0;
          const studentId = this.ctx.request.query.studentId || 0;
          const detail = yield this.service.courseTableDetail.getById(detailId);
          if (detail == null) {
            this.fail('要续的课程不存在');
            return;
          }
          const nextTerm = yield this.service.term.getNext();
          console.log(nextTerm);
          if (nextTerm == null) {
            this.fail('还未创建下学期，无法续课');
            return;
          }
            // console.log(nextTerm);

          const teacher = yield this.service.teacher.getById(detail.teacherId);
          const teacherUser = yield this.service.user.getById(teacher.userId);
          detail.teacher = {
            name: teacher.name,
            wxHead: teacherUser.wxHead,
          };
          const classroom = yield this.service.classroom.getById(detail.classroomId);
          detail.classroomName = classroom.name;

          detail.startTime = this.ctx.helper.formatTime(detail.startTime);
          detail.endTime = this.ctx.helper.formatTime(detail.endTime);

          detail.startDate = this.ctx.helper.formatDate(detail.startDate);
          detail.endDate = this.ctx.helper.formatDate(detail.endDate);

          const nextDetails = yield this.service.courseTableDetail.getListForRenew(detail.courseName, detail.number, detail.duration, detail.teacherId,
                nextTerm.id);
          for (const nDetail of nextDetails) {
            nDetail.startTime = this.ctx.helper.formatTime(nDetail.startTime);
            nDetail.endTime = this.ctx.helper.formatTime(nDetail.endTime);

            nDetail.startDate = this.ctx.helper.formatDate(nDetail.startDate);
            nDetail.endDate = this.ctx.helper.formatDate(nDetail.endDate);
          }

          const renew = yield this.service.renew.get(detail.id, studentId);

          this.success({
            detail,
            details: nextDetails,
            renew,
          });
        }

        /**
         * 添加续课报名信息
         */
    *
        _addSignUp(courseDetailId, studentId) {
            // const courseDetailId = this.ctx.request.body.courseDetailId || 0;
            // const studentId = this.ctx.request.body.studentId || 0;
          const ctx = this.ctx;

          const result = yield app.mysql.beginTransactionScope(function* (conn) {
            ctx.conn = conn;
            const student = yield ctx.service.student.getById(studentId);
            if (student == null) {
              return {
                code: 0,
                msg: '学生不存在',
              };
            }
            const user = yield ctx.service.user.getById(student.userId);
            const detail = yield ctx.service.courseTableDetail.findById(courseDetailId);
            if (detail == null) {
              return {
                code: 0,
                msg: '课程不存在',
              };
            }
            const detailStudent = yield ctx.service.courseTableDetailStudent.get(detail.id, studentId);
            if (detailStudent != null) {
                    // this.ctx.body = `该老师的${detail.courseName}课已报过名`
              return {
                code: 0,
                msg: `该老师的${detail.courseName}课已报过名`,
              };
            }
                // var students = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailId(detail.id);
            if (detail.status == '') {
              const msg = `该老师的${detail.courseName}课已满`;
              return {
                code: 0,
                msg,
              };
            }
            yield ctx.service.courseTableDetailStudent.add(
                    studentId,
                    item.id,
                    '正常',
                    detail.termId);
            const items = yield ctx.service.courseTableItem.getByCourseTableDetailId(detail.id);
            for (const ii of items) {
              yield ctx.service.courseTableItemStudent.add(
                        ii.id,
                        studentId,
                        '正常',
                        detail.termId
                    );
            }
          });
          this.body = result;
        }

    *
        addRenew() {
          const courseDetailId = this.ctx.request.body.courseDetailId || 0;
          const studentId = this.ctx.request.body.studentId || 0;
          const times = this.ctx.request.body.times || '';
          if (times.length > 0) {
                // console.log(times);
                // times = JSON.parse(times);
            if (!app.lodash.isArray(times)) {
              this.fail('时间格式错误');
              return;
            }
            for (let i = 0; i < times.length; i++) {
              if (!times[i].dayOfWeek || !times[i].startTime || !times[i].endTime) {
                this.fail('时间格式错误');
                return;
              }
            }
          }

          const detail = yield this.service.courseTableDetail.findById(courseDetailId);
          if (detail == null) {
            this.fail('课程不存在');
            return;
          }
          const renew = yield this.service.renew.get(courseDetailId, studentId);
          if (renew != null) {
            this.fail('您已经报名了，无法重复报名');
            return;
          }
          const nextTerm = yield this.service.term.getNext();
          if (nextTerm == null) {
            this.fail('还未创建下学期，无法续课');
            return;
          }
          yield this.service.renew.add(nextTerm.id, courseDetailId, studentId, times);
            // item.dayOfWeek, item.startTime, item.endTime,

          this.success();


        }
        // 请假补课记录
    * getleaveAndMakeUpRecord() {
      const { courseTableDetailId, id } = this.ctx.request.query;
      const leavesRecord = yield this.ctx.service.courseTableItemLeave.getleaveByCourseTableAndstudentId(courseTableDetailId, id);
      for (const item of leavesRecord) {
        item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
        item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
        item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
        item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
        item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
        item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
      }
      const makeUpRecord = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailIdAndStudentId(courseTableDetailId, id);
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
    //周课表获取的请假补课记录
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
       let courseTableItemChangeClass =yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailItemIdAndStudentIdAndOne(courseTableItemId, id, 1) 
        console.log(courseTableItemChangeClass);
        courseTableDetailId = courseTableItemChangeClass.courseTableDetailId
      }
      if (!courseTableDetailId) { 
        return this.fail('数据不存在'); 
      }
      const leavesRecord = yield this.ctx.service.courseTableItemLeave.getleaveByCourseTableAndstudentId(courseTableDetailId, id);
      let leavesRecord1=leavesRecord.filter((item) => { 
        if (!item.teacherId) { 
          return item;
        }
      })
      for (const item of leavesRecord) {
        item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
        item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
        item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
        item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
        item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
        item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
      }
      const makeUpRecord = yield this.ctx.service.courseTableItemChangeCourse.getByCourseTableDetailIdAndStudentId(courseTableDetailId, id);
      let makeUpRecord1=makeUpRecord.filter((item) => { 
        if (!item.teacherId) {
          return item;
        }
      })
      for (const item of makeUpRecord1) {
        item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
        item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
        item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
        item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
        item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
        item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
      }
      const result = {
        leavesRecord:leavesRecord1,
        makeUpRecord:makeUpRecord1,
      };
      this.success(result);
  }
    // 请假记录
    * getClassTimeleave() {
      const { courseTableItemId, studentId } = this.ctx.request.query;
      let courseTableItem = yield this.ctx.service.courseTableItem.getById(courseTableItemId);  
      let courseTableItems = yield this.ctx.service.courseTableItem.getSameClassByCourseNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumberAndIsDel(courseTableItem.courseName, courseTableItem.teacherId, courseTableItem.duration, courseTableItem.level, courseTableItem.termId, courseTableItem.number)
        let courseTableDetail
        for (let item of courseTableItems) { 
          courseTableDetail = yield this.ctx.service.courseTableDetail.getByCourseTableItemId(item.id)
          if (courseTableDetail) {
            break
          }
        }
      console.log(courseTableDetail);
      const leavesRecord = yield this.ctx.service.courseTableItemLeave.getleaveByCourseTableAndstudentId(courseTableDetail.id, studentId);
    for (const item of leavesRecord) {
      item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
      item.courseTableItem = yield this.ctx.service.courseTableItem.getById(item.courseTableDetailItemId);
      item.courseTableItem.date = app.moment(item.courseTableItem.date).format('YYYY-MM-DD');
      item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
      item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
      item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
    }
    const result = {
      leavesRecord
    };
    this.success(result);
  }
    //小程序教师端评价添加
     *addComment() { 
       let { teacherId=0, courseTableItemId=0, studentId=0, comment='' } = this.ctx.request.body;
       if (teacherId===0||courseTableItemId===0||studentId===0) { 
           return this.fail('缺少参数')
       }
       if (comment === '') { 
         return this.fail('评论不能为空');
       }
       let date = new Date();
       let createTime = app.moment().format('YYYY-MM-DD HH-mm-ss');
       let result = yield this.ctx.service.studentComment.addComment(teacherId,courseTableItemId,studentId,comment,createTime)
       if (result.insertId > 0) {
         this.success();
       } else { 
         this.fail();
       }
     }
    //小程序教师端评价获取
    *getCommentList() { 
      let { teacherId = 0, studentId = 0, courseTableItemId = 0 } = this.ctx.request.query;
      if (teacherId===0||courseTableItemId===0||studentId===0) { 
        return this.fail('缺少参数')
      }
      let list = yield this.ctx.service.studentComment.getCommentListByTeacherIdAndStudentIdAndcourseTableItemId(teacherId, studentId, courseTableItemId);
      let teacher = yield this.ctx.service.teacher.getById(teacherId);
      let teacherUser = yield this.ctx.service.user.getById(teacher.userId);
      for (let item of list) { 
        item.createTime = app.moment(item.createTime).format('YYYY-MM-DD HH:mm')
      }
      let result = {
        teacher,
        teacherUser,
        list
      }
      return this.success(result);
    }
    //后台学生详情里面改变学期获取相关课程
    *getCourseTableDetailStudentByTermIdAndStudentId() {
        let { termId = 0, studentId = 0 } = this.ctx.request.query;
        if (termId === 0 || studentId === 0) { 
            return this.fail('缺少参数'); 
        }
        let term1 = yield this.ctx.service.term.getById(termId);
        term1.startDate = app.moment(term1.startDate).format("YYYY-MM-DD");
        term1.endDate = app.moment(term1.endDate).format("YYYY-MM-DD");
        let courseTabledetailStudents = yield this.ctx.service.courseTableDetailStudent.getMyAllCourseByStudentIdAndTermId(studentId, term1.id);
        let courseTabledetailStudents1 = [];
        for (let item of courseTabledetailStudents) { 
              if (item.classTimeNum > 0) {
                continue;
              }  
              item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(item.courseTableDetailId);
              item.courseTableDetail.course = yield this.ctx.service.course.getById(item.courseTableDetail.courseNameId);
              item.courseTableDetail.classroom = yield this.ctx.service.classroom.getById(item.courseTableDetail.classroomId);
              item.courseTableDetail.teacher = yield this.ctx.service.teacher.getById(item.courseTableDetail.teacherId);
              item.courseTableDetail.startDate = app.moment(item.courseTableDetail.startDate).format('YYYY-MM-DD');
              item.courseTableDetail.startTime = item.courseTableDetail.startTime.substring(0, 5);
              item.courseTableDetail.endTime = item.courseTableDetail.endTime.substring(0, 5)
              if (item.startCourseTableItemId) { 
                item.startCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.startCourseTableItemId);         
                item.startCourseTableItem.date = app.moment(item.startCourseTableItem.date).format("YYYY-MM-DD");
              }
              if (item.endCourseTableItemId) { 
                item.endCourseTableItem = yield this.ctx.service.courseTableItem.getById(item.endCourseTableItemId);         
                item.endCourseTableItem.date = app.moment(item.endCourseTableItem.date).format("YYYY-MM-DD");
              }
            }
        let result = {
          term1,
          courseTabledetailStudents:courseTabledetailStudents1 
        } 
        this.success(result);  
    }
  }
  return StudentController;
};
