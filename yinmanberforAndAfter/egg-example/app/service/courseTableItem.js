module.exports = app => {
  class CourseTableItem extends app.Service {
    get db() {
      return this.ctx.conn ? this.ctx.conn : this.app.mysql;
    }

        /**
         *
         * @param {Number} courseTableDetailId
         * @param {*} teacherId
         * @param {*} date
         * @param {*} startTime
         * @param {*} endTime
         * @param {*} classroomId
         * @param {*} courseName
         * @param {*} number
         * @param {*} duration
         * @param {*} level
         * @param {*} status
         * @param {*} type
         * @param {*} termId
         */
    *
        add(courseTableDetailId, teacherId, date, startTime, endTime,
            classroomId, courseName, number, duration, level, status, type, termId) {
          const now = app.moment().format('YYYY-MM-DD HH:mm:ss');
          const info = yield this.db.insert('course_table_item', {
            courseTableDetailId,
            teacherId,
            date,
            startTime,
            endTime,
            classroomId,
            courseName,
            number,
            duration,
            level,
            status,
            type,
            termId,
            updateTime: now,
            createTime: now,
          });

          const id = info.insertId;
          if (id > 0) {
            return yield this.getById(id);
          }
          return null;
        } *
        findById(id) {
          return yield this.getById(id);
        } *
        getById(id) {
          const info = yield app.mysql.get('course_table_item', { id });
          return info;
        } *
        getAll() {
          const result = yield app.mysql.select('course_table_item');
          return result;
        }*
        getBookingCourseTeacher(courseName, dates) {
          const date = JSON.parse(dates);
          const list = yield app.mysql.select('course_table_item', { where: { type: '预约试课', courseName, date: date.date, startTime: date.startTime, endTime: date.endTime } });
          console.log(list, date.date, date.startTime, date.endTime);
          const aIdx = [];
          for (const [ index, item ] of list.entries()) {
            const bookingCourse = yield app.mysql.query(`select * from  booking_course  where courseTableItemId = ${item.id} and state !='已取消' and ISNULL(confirmedId)  and state !='已拒绝'`);
            const booking = yield app.mysql.query(`select * from  booking_course  where confirmedId = ${item.id} and state !='已取消'  and state !='已拒绝'`);
            for (const [ i, it ] of booking.entries()) {
              bookingCourse.push(booking[i]);
            }
            if (item.number == bookingCourse.length) {
              aIdx.push(index);
            }
          }
          for (let i = 0; i < aIdx.length; i++) {
            list.splice(aIdx[i], 1, '');
          }

          for (let i = 0; i < list.length; i++) {
            if (list[i] == '') {
              list.splice(i, 1);
              i = -1;
            }
          }

          const teachers = [];
          for (const item of list) {
            const teacher = yield this.ctx.service.teacher.getById(item.teacherId);
            teachers.push(teacher);
          }
          return app.lodash.uniqBy(teachers, 'name');
        } *
        getListByTeacherIdNOType(teacherId) {
          const list = yield app.mysql.query(`SELECT * from course_table_item  WHERE type != '正式课程' AND teacherId=${teacherId}`);
          return list;
        } *
        getListByClassroomId(classroomId) {
          const list = yield app.mysql.query(`SELECT * from course_table_item  WHERE classroomId=${classroomId} AND isDel=0`);
          return list;
        } *
        getBookingCourse() {
          const list = yield app.mysql.query('SELECT * from course_table_item  WHERE type = \'预约试课\' AND date > now()');
          return list;
        } *
        getBookingCourseTime(courseName) {
          const list = yield app.mysql.query(`SELECT * from course_table_item  WHERE type = '预约试课' AND date > now() AND courseName='${courseName}'`);
          const aIdx = [];
          for (const [ index, item ] of list.entries()) {
            const bookingCourse = yield app.mysql.query(`select * from  booking_course  where courseTableItemId = ${item.id} and state !='已取消' and ISNULL(confirmedId)  and state !='已拒绝'`);
            const booking = yield app.mysql.query(`select * from  booking_course  where confirmedId = ${item.id} and state !='已取消'  and state !='已拒绝'`);
            for (const [ i, it ] of booking.entries()) {
              bookingCourse.push(booking[i]);
            }

            if (item.number == bookingCourse.length) {
              aIdx.push(index);
            }
          }
          for (let i = 0; i < aIdx.length; i++) {
            list.splice(aIdx[i], 1, '');
          }
          for (let i = 0; i < list.length; i++) {
            if (!list[i]) {
              list.splice(i, 1);
              i = -1;
            }
          }
          for (const item of list) {
            item.course = yield this.ctx.service.course.getByName(item.courseName);
            item.classroom = yield this.ctx.service.classroom.getById(item.classroomId);
            item.date = app.moment(item.date).format('YYYY-MM-DD');
            item.startTime = item.startTime.substring(0, 5);
            item.endTime = item.endTime.substring(0, 5);
          }
          return list;
        } *
        getBookingCourseOtherTime(id) {
          const course = yield app.mysql.get('course_table_item', { id });
                // let list = yield app.mysql.query(`select * from course_table_item where id = ${id} and type = 预约试课 and teacherId = ${course.teacherId} and courseName = ${course.courseName}`)
          const list = yield app.mysql.query(`select * from  course_table_item  where id != ${id} and type = '预约试课'  and courseName = '${course.courseName}' AND date > now()`);
          const aIdx = [];
          for (const [ index, item ] of list.entries()) {
            const bookingCourse = yield app.mysql.query(`select * from  booking_course  where courseTableItemId = ${item.id} and state !='已取消' and ISNULL(confirmedId)  and state !='已拒绝'`);
            const booking = yield app.mysql.query(`select * from  booking_course  where confirmedId = ${item.id} and state !='已取消'  and state !='已拒绝'`);
            for (const [ i, it ] of booking.entries()) {
              bookingCourse.push(booking[i]);
            }

            if (item.number == bookingCourse.length) {
              aIdx.push(index);
            }
          }
          for (let i = 0; i < aIdx.length; i++) {
            list.splice(aIdx[i], 1, '');
          }
          for (let i = 0; i < list.length; i++) {
            if (!list[i]) {
              list.splice(i, 1);
            }
          }
          for (const item of list) {
            item.date = app.moment(item.date).format('YYYY-MM-DD');
            item.startTime = item.startTime.substring(0, 5);
            item.endTime = item.endTime.substring(0, 5);
          }
          return list;
        } *
        find(termId, teacherId, startDate, endDate) {
          const list = yield app.mysql.query('select * from `course_table_item` where termId = ? AND teacherId = ? AND date >= ? and date<= ? AND isDel=?', [ termId, teacherId, startDate, endDate, 0 ]);
          return list;
        }

    *
        deleteById(id) {
          const result = yield this.db.delete('course_table_item', { id });

          return result;
        } *
        deleteByCourseTableDetailId(courseTableDetailId) {
          const result = yield this.db.delete('course_table_item', { courseTableDetailId });

          return result;
        }

    *
        getFree(termId, courseName, number, duration) {
          const now = new Date();
          now.setDate(now.getDate() + 2);
          console.log(termId, courseName, number, duration);
                // const list = yield this.app.mysql.select('course_table_item', {
                //     where: {
                //         termId,
                //         courseName,
                //         number,
                //         duration,
                //         status: '空闲',
                //     },
                // });
          const list = yield this.app.mysql.query('select * from course_table_item where number = ? and status ="空闲" and date > ? and courseName = ? and duration >= ? and termId=? ', [ number, now, courseName, duration, termId ]);
          return list;
        } *
        getFreeForStudent(courseName, number, duration, termId, level) {
          const now = new Date();
          now.setDate(now.getDate() + 2);
          if (number == 1) {
            const list = yield this.app.mysql.query('select * from course_table_item where number = 1 and status ="空闲" and date > ? and courseName = ? and duration >= ? and termId=? and level=? and type!="预约试课"', [ now, courseName, duration, termId, level ]);
            const list1 = yield this.getOpenEnrollmentList(list);
            return list1;
          }
          const list = yield this.app.mysql.query('select * from course_table_item where number > 1 and status ="空闲" and date > ? and courseName = ? and duration >= ? and termId=? and level=? and type!="预约试课"', [ now, courseName, duration, termId, level ]);
          const list1 = yield this.getOpenEnrollmentList(list);
          return list1;
        } *
        getFreeByteacherIdForStudent(courseName, number, duration, termId, level, teacherId) {
          const now = new Date();
          now.setDate(now.getDate() + 2);
          if (number == 1) {
            const list = yield this.app.mysql.query('select * from course_table_item where number = 1 and status ="空闲" and date > ? and courseName = ? and duration >= ? and termId=? and level=? and teacherId=? and type!="预约试课"', [ now, courseName, duration, termId, level, teacherId ]);
            const list1 = yield this.getOpenEnrollmentList(list);
            return list1;
          }
          const list = yield this.app.mysql.query('select * from course_table_item where number > 1 and status ="空闲" and date > ? and courseName = ? and duration >= ? and termId=? and level=? and teacherId=? and type!="预约试课"', [ now, courseName, duration, termId, level, teacherId ]);
          const list1 = yield this.getOpenEnrollmentList(list);
          return list1;
        }
    * getByTeacherId(teacherId) {
      const list = yield this.app.mysql.select('course_table_item', { where: { teacherId, isDel: 0 } });
      return list;
    }
    *
        getEachCycle(courseTableId) {
          const result = yield app.mysql.select('course_table_item', { where: { courseTableId } });

          return result;
        } *
        getStudentAll(teacherId) {
          const table = yield app.mysql.get('course_table', { teacherId });
          const tableDetail = yield app.mysql.select('course_table_detail', { courseTableId: table.id });

            // var studentArray = []
          for (var i = 0; i < tableDetail.length; i++) {
            const classroom = yield app.mysql.get('classroom', { id: tableDetail[i].classroomId });
                // studentArray.push({ student:student, })
            tableDetail[i].classroom = classroom.name;
          }
          const studentArray = [];
          for (var i = 0; i < tableDetail.length; i++) {
            const student = yield app.mysql.select('course_table_detail_student', { courseTableDetailId: tableDetail[i].id });
                // studentArray.push({ student:student,courseInfo:tableDetail[i]})
            for (let j = 0; j < student.length; j++) {
              const studentInfo = yield app.mysql.get('student', { id: student[j].studentId });
              studentArray.push({ student: studentInfo, courseInfo: tableDetail[i] });
            }
          }
          for (var i = 0; i < studentArray.length; i++) {
            const userInfo = yield app.mysql.get('user', { id: studentArray[i].student.userId });
            studentArray[i].userInfo = userInfo;
            table.startDate = app.moment(table.startDate).format('YYYY.MM.DD');
            table.endDate = app.moment(table.endDate).format('YYYY.MM.DD');
            studentArray[i].table = table;
          }

          return studentArray;
        }

    *
        getStudent(tableItemId) {
          const result = yield app.mysql.select('course_table_item_student', { where: { courseTableItemId: tableItemId } });
          return result;
        }

    *
        getByCourseTableDetailId(courseTableDetailId) {
          const list = yield app.mysql.select('course_table_item', { where: { courseTableDetailId } });
          return list;
        }

    *
        update(info) {
          info.updateTime = app.moment().format('YYYY-MM-DD HH:mm:ss');
          const result = yield this.db.update('course_table_item', info);
          const updateSuccess = result.affectedRows === 1;
          return updateSuccess;
        }

    *
        getList(termId, studentId, startDate, endDate) {
          const list = yield app.mysql.query('SELECT i.* FROM course_table_item as i where i.date >= ? and i.date <= ? and i.id in (select courseTableItemId from course_table_item_student as s where (s.status = "正常" or s.status = "停课" or s.status = "补课"  or s.status = "转课") and s.termId = ? and s.studentId = ?)', [ startDate, endDate, termId, studentId ]);
          return list;
        }

    *
        getList1(termId, teacherId, date) {
          const list = yield this.db.select('course_table_item', { where: { termId, teacherId, date ,isDel:0} });

          return list;
        }

        /**
         * 前台学生调课时获取学生要调哪天的课
         * @param {*} courseTableDetailId
         */
    *
        getFreeListByCourseTableDetailId(courseTableDetailId) {
          const list = yield app.mysql.query(`SELECT * FROM course_table_item WHERE courseTableDetailId=${courseTableDetailId} AND date>date_sub(CURDATE(),interval -2 day)`);
          return list;
        }
        /**
         * 统计某个教室是否被占用
         * @param {Number} classroomId
         */
    *
        countByClassroomId(classroomId) {
          const count = yield this.db.query('SELECT COUNT(*) FROM course_table_item WHERE classroomId = ?', [ classroomId ]);
          console.log(count[0]);
          return count[0]['COUNT(*)'];
        } *
        getListByCourseName(courseName) {
          const list = yield app.mysql.select('course_table_item', { where: { courseName } });
          return list;
        }
    *
        getListByTypeAndTeacherIdAndTermId(type, teacherId, termId) {
          const list = yield app.mysql.select('course_table_item', { where: { type, teacherId, termId } });
          return list;
        }
    *
        getOpenEnrollmentList(list) {
          const aDay = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ];
          for (let i = 0; i < list.length; i++) {
            list[i].dayOfWeek = aDay[app.moment(list[i].date).day()];
            const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(list[i].courseTableDetailId);
            if (courseTableDetail && courseTableDetail.openEnrollment != '是') {
              list.splice(i, 1);
              i = -1;
            }
          }
          return list;
    }
    //选课获取课程
    *getSameClassByCourseNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumber(courseName, teacherId, duration, level, termId, number) { 
      let list
      if (number>1) {
       list = yield app.mysql.query(`SELECT * FROM course_table_item WHERE courseName=${courseName} AND teacherId=${teacherId} AND duration=${duration} AND level=${level} AND termId=${termId} AND number>1 AND type="课时课" AND isDel=0`);
      } else { 
         list = yield app.mysql.query(`SELECT * FROM course_table_item WHERE courseName=${courseName} AND teacherId=${teacherId} AND duration=${duration} AND level=${level} AND termId=${termId} AND number=1 AND type="课时课" AND isDel=0`);
      }
      return list;
    }
    *getListByTermIdAndTeacherId(termId,teacherId) { 
      let list = yield app.mysql.select('course_table_item', { where: { termId, teacherId } });
      return list
    }
    //后台老师调课的获取同样的课程
    *getSameClassByCourseNameIdAndDurationAndLevelAndTermIdAndNumber(courseName, duration, level, termId,number) {
      let list
      if (number > 1) {
        list = app.mysql.query(`SELECT * FROM course_table_item WHERE  courseName=${courseName} AND duration=${duration} AND level=${level} AND termId=${termId} AND number>1 AND type!='课时课'`)
        // list = app.mysql.select('course_table_item', { where: { courseName, duration, level, termId } })
      } else { 
        list = app.mysql.query(`SELECT * FROM course_table_item WHERE  courseName=${courseName} AND duration=${duration} AND level=${level} AND termId=${termId} AND number=1`)
      }
      return list;
    }
    //获取选课的课程
    *getSameClassByCourseNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumberAndIsDel(courseName, teacherId, duration, level, termId, number) { 
      let list
      if (number>1) {
       list = yield app.mysql.query(`SELECT * FROM course_table_item WHERE courseName=${courseName} AND teacherId=${teacherId} AND duration=${duration} AND level=${level} AND termId=${termId} AND number>1 AND type="课时课"`);
      } else { 
         list = yield app.mysql.query(`SELECT * FROM course_table_item WHERE courseName=${courseName} AND teacherId=${teacherId} AND duration=${duration} AND level=${level} AND termId=${termId} AND number=1 AND type="课时课"`);
      }
      return list;
    }
  }
  return CourseTableItem;
};
