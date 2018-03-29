module.exports = app => {
  class bookingCourse extends app.Service {
    *
        add(courseTableItemId, studentId, createTime, state, requirement,courseTableItem) {
          console.log(courseTableItem)
          courseTableItem.teacherName = yield this.ctx.service.teacher.getById(courseTableItem.teacherId)
          courseTableItem.classroom = yield this.ctx.service.classroom.getById(courseTableItem.classroomId)
          courseTableItem.curriculum = yield this.ctx.service.course.getByName(courseTableItem.courseName)
          courseTableItem = JSON.stringify(courseTableItem)
           const result = yield app.mysql.insert('booking_course', {
            courseTableItemId,
            studentId,
            createTime,
            state,
            requirement,
            afterCourseDeleTeSaveInfo:courseTableItem
          });
          return result.insertId;
        } *
            getBookingInfoToId(studentId) {
              const result = yield app.mysql.select('booking_course', { where: { studentId } });
              for (const item of result) {
                item.course = JSON.parse(item.afterCourseDeleTeSaveInfo);
              }
              return result;
            } *
            getByCourseTableItemId(courseTableItemId) {
              const all = yield app.mysql.query('select * from booking_course where (state="已确认" or state="待确认")');

              const aBookingInfo = [];
              for (const item of all) {
                if (item.confirmedId && item.confirmedId == courseTableItemId) {
                  aBookingInfo.push(item);
                } else if (item.courseTableItemId == courseTableItemId && !item.confirmedId) {
                  aBookingInfo.push(item);
                }
              }
              return aBookingInfo;
            } *
            getByCourseTableItemId1(courseTableItemId) {
              const all = yield app.mysql.query('select * from booking_course where state="已确认"');
              const aBookingInfo = [];
              for (const item of all) {
                if (item.confirmedId && item.confirmedId == courseTableItemId) {
                  aBookingInfo.push(item);
                } else if (item.courseTableItemId == courseTableItemId && !item.confirmedId) {
                  aBookingInfo.push(item);
                }
              }
              return aBookingInfo;
            } *
            getById(id) {
              const result = yield app.mysql.get('booking_course', { id });
              return result;
            } *
            getAll(page, limit, state) {
              let curriculums = [];
              let totalCount = 0;
              if (state) {
                    // curriculums = yield app.mysql.select("booking_course", {
                    //     where: { state },
                    //     orders: [
                    //         ['state', 'desc']
                    //     ],
                    //     limit: Number(limit),
                    //     offset: (page - 1) * Number(limit),
                    // });
                curriculums = yield app.mysql.query(`SELECt * FROM booking_course  where state = '${state}' ORDER BY state = '待确认' DESC ,id DESC LIMIt ${Number(limit)} OFFSET ${(page - 1) * Number(limit)} `);
                totalCount = yield app.mysql.query(`select count(*) from booking_course  where state = '${state}'`);
                totalCount = totalCount[0]['count(*)'];
              } else {
                    // curriculums = yield app.mysql.select("booking_course", {
                    //     orders: [
                    //         ['state', 'desc']
                    //     ],
                    //     limit: Number(limit),
                    //     offset: (page - 1) * Number(limit)
                    // })
                curriculums = yield app.mysql.query(`SELECt * FROM booking_course ORDER BY state = '待确认' DESC ,id DESC LIMIt ${Number(limit)}  OFFSET ${(page - 1) * Number(limit)} `);
                totalCount = yield app.mysql.count('booking_course');
              }

              const list = [];
              for (let i = 0; i < curriculums.length; i++) {
                curriculums[i].course = yield this.ctx.service.courseTableItem.getById(curriculums[i].courseTableItemId);
                curriculums[i].afterCourseDeleTeSaveInfo = JSON.parse(curriculums[i].afterCourseDeleTeSaveInfo);
                curriculums[i].afterCourseDeleTeSaveInfo.startTime = curriculums[i].afterCourseDeleTeSaveInfo.startTime.substring(0, 5);
                curriculums[i].afterCourseDeleTeSaveInfo.endTime = curriculums[i].afterCourseDeleTeSaveInfo.endTime.substring(0, 5);
                if (curriculums[i].course) {
                  curriculums[i].course.teacherName = yield this.ctx.service.teacher.getById(curriculums[i].course.teacherId);
                  curriculums[i].course.classroom = yield this.ctx.service.classroom.getById(curriculums[i].course.classroomId);
                  curriculums[i].course.date = app.moment(curriculums[i].course.date).format('YYYY-MM-DD');
                  curriculums[i].course.startTime = curriculums[i].course.startTime.substring(0, 5);
                  curriculums[i].course.endTime = curriculums[i].course.endTime.substring(0, 5);
                }
                if (curriculums[i].confirmedId) {
                  curriculums[i].confirmedTime = yield this.ctx.service.courseTableItem.getById(curriculums[i].confirmedId);
                  if (curriculums[i].confirmedTime) {
                    curriculums[i].confirmedTime.date = app.moment(curriculums[i].confirmedTime.date).format('YYYY-MM-DD');
                  }
                }
                const student = yield this.ctx.service.student.getById(curriculums[i].studentId);
                const user = yield this.ctx.service.user.getById(student.userId);
                list.push({
                  curriculum: curriculums[i],
                  student,
                  user,
                });
              }
              const result = {
                list,
                totalCount,
              };

              return result;

            } *
            getQueryList(studentName, parentName, page, limit) {
              let where = {};
              if (studentName) {
                where = app.lodash.assign(where, { name: studentName });
              }
              if (parentName) {
                where = app.lodash.assign(where, { parentName });
              }
              const student = yield app.mysql.select('student', { where });
              const curriculums = yield app.mysql.select('booking_course', { where, limit, offset: (page - 1) * limit });
              console.log(curriculums);
              const totalCount = yield app.mysql.count('booking_course', where);
              const list = [];
              for (let i = 0; i < curriculums.length; i++) {
                const times = yield this.ctx.service.bookingCourseTime.getList(curriculums[i].id);
                const timeArray = [];
                for (let j = 0; j < times.length; j++) {
                  const time = times[j].time.split(',');
                  timeArray.push({ date: time[0], time: time[1] });
                }
                curriculums[i].times = timeArray;
                const student = yield this.ctx.service.student.getById(curriculums[i].studentId);
                const user = yield this.ctx.service.user.getById(student.userId);
                list.push({
                  curriculum: curriculums[i],
                  student,
                  user,
                });
              }
              const result = {
                list,
                totalCount,
              };

              return result;
            } *
            delete(curriculumId) {
              const result = yield app.mysql.update('booking_course', { id: curriculumId, delete: 0 });
              return result;
            }

    *
        update(info) {
          yield app.mysql.update('booking_course', { id: info.id, studentId: info.studentId, createTime: info.createTime, state: info.state, confirmedId: info.confirmedId, courseTableItemId: info.courseTableItemId, remarks: info.remarks });
        }
            /**
             * 取学生的预约报课信息，不包括已取消的
             * @param {Number} studentId
             */
    *
            getByStudentId(studentId) {
              const list = yield app.mysql.query('select * from booking_course where studentId = ? and state != ? and state != ?', [ studentId, '已取消', '已拒绝' ]);
              if (list.length == 0) {
                return null;
              }
              return list[0];
            }

    *  countByCurriculum(curriculum) {
          const count = yield app.mysql.query('select count(*) from booking_course where curriculum = ?', [ curriculum ]);
          return count[0]['count(*)'];
        }
    * getBookingCourse(courseTableItemId, studentId) {
        let result
        result = yield app.mysql.get('booking_course', { courseTableItemId, studentId, state: '待审核' });
        if (!result) { 
          result = yield app.mysql.get('booking_course', { courseTableItemId, studentId, state: '已确认' });  
        }
        return result;  
    }
    }
  return bookingCourse;
};
