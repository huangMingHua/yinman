module.exports = app => {
  class CourseTableDetail extends app.Service {
    get db() {
      return this.ctx.conn ? this.ctx.conn : this.app.mysql;
    }
            /**
             *
             * @param {Number} termId
             * @param {Number} teacherId --可选参数
             */
    *
            getList(termId, teacherId = 0) {
              let where = { termId, isDel: 0 };
              if (teacherId > 0) {
                where = app.lodash.assign(where, { teacherId });
              }
              const list = yield this.db.select('course_table_detail', {
                where,
              });
              return list;
            }

    *
        getListByTeacherId(teacherId) {
          const list = yield this.db.select('course_table_detail', {
            where: { teacherId },
          });
          return list;
        }
    *
        getListByTeacherId(teacherId) {
          const list = yield this.db.select('course_table_detail', {
            where: { teacherId },
          });
          return list;
        }
    * getListBytermIdAndOpenEnrollment(termId, openEnrollment) {
      const list = yield this.db.select('course_table_detail', {
        where: { termId, openEnrollment, isDel: 0 },
      });
      return list;
    }
        /**
         *
         * @param {Int} courseTableId
         * @param {string} dayOfWeek
         */
        // * getByCourseTableIdAndDayOfWeek(courseTableId, dayOfWeek){
        //     var list = yield app.mysql.select('course_table_detail', {
        //         where:{
        //             courseTableId: courseTableId,
        //             dayOfWeek: dayOfWeek
        //         }
        //     });
        //     return list;
        // }
    * getByCourseTableItemId(courseTableItemId) {
      const result = yield app.mysql.get('course_table_detail', { courseTableItemId });
      return result;
    }
    *
        getByTermId(termId) {
          const result = yield app.mysql.get('course_table_detail', { termId });
          return result;
        } *
        add(termId, teacherId, courseNameId, level, number, duration, classroomId, dayOfWeek, startTime, endTime, status, startDate, endDate, openEnrollment, totalLeave, date, courseTableItemId = 0) {
          const info = yield this.db.insert('course_table_detail', {
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
            status,
            startDate,
            endDate,
            openEnrollment,
            totalLeave,
            date,
            courseTableItemId,
          });
          const id = info.insertId;
          if (id > 0) {
            return yield this.findById(id);
          }
          return null;
        }
    * getListByTeacherIdAndTermId(teacherId, termId) {
      const list = yield app.mysql.select('course_table_detail', { where: { teacherId, termId, openEnrollment: '是', isDel: 0 } });
      return list;
    }
    //没有限制是否开发
    * getListByTeacherIdAndTermId1(teacherId, termId) {
       const list = yield app.mysql.select('course_table_detail', { where: { teacherId, termId, isDel: 0 } });
       return list;
    }
    * findById(id) {
            // let info = yield this.ctx.model.courseTable.findOne({ _id: id });
          const info = yield this.db.get('course_table_detail', { id });
          return info;
        } *
        getById(id) {
          return yield this.findById(id);
        }

        /**
         *
         * @param {Array} ids
         */
    * getByIds(ids) {
          const list = yield this.db.query('SELECT * FROM course_table_detail WHERE id in (' + ids.join(',') + ')');
          return list;
        }
    * getByTermIdAndOpenEnrollment(termId) {
      const result = yield this.db.query(`SELECT * FROM course_table_detail WHERE termId =${termId} AND openEnrollment='是' AND isDel=0`);
      return result;
    }
    * getByTermIdAndOpenEnrollmentAndIsDelAndCourseTableItemId(termId) {
      const result = yield this.db.query(`SELECT * FROM course_table_detail WHERE termId =${termId} AND openEnrollment='是' AND isDel=0 AND courseTableItemId=0`);
      return result;
    }
    * getByTermIdAndOpenEnrollmentAndIsDelAndCourseTableItemId1(termId) {
      const result = yield this.db.query(`SELECT * FROM course_table_detail WHERE termId =${termId} AND openEnrollment='是' AND isDel=0 AND courseTableItemId!=0`);
      return result;
    }
    *
      update(info) {
            // console.log('==================test dev=====================');
            // console.log(this.ctx.model.courseTable);
          yield this.db.update('course_table_detail', info);
        }

    *
        delete(id) {
          const result = yield this.db.delete('course_table_detail', {
            id,
          });
        }

        /**
         * 获取某个学期相同课程的记录
         * @param {*} courseName
         * @param {*} number
         * @param {*} duration
         * @param {*} teacherId
         * @param {*} termId
         */
    *
        getListForRenew(courseName, number, duration, teacherId, termId) {
          const now = new Date();
          if (number == 1) {
            const info = yield this.app.mysql.query('select * from course_table_detail where number = 1 and courseName = ? \
                and duration >= ? and termId=? and teacherId = ?', [ courseName, duration, termId, teacherId ]);
            return info;
          }
          const info = yield this.app.mysql.query('select * from course_table_detail where number > 1 and courseName = ? \
                    and duration >= ? and termId=? AND teacherId = ?', [ courseName, duration, termId, teacherId ]);
          return info;

        }

    *
        getListByClassroomId(classroomId) {
          return yield app.mysql.select('course_table_detail', { where: { classroomId, isDel: 0 } });
        } *
        getListByCourseNameId(courseNameId) {
          return yield app.mysql.select('course_table_detail', { where: { courseNameId, isDel: 0 } });
        } *
        getApplicableCourse() {
          const result = yield app.mysql.query('select * from course_table_detail where TO_DAYS(endDate)-TO_DAYS(NOW())>=1 AND openEnrollment="是" ');
          for (let i = 0; i < result.length; i++) {
            const signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id);
            console.log(result[i].id, signUpCourse.length);
            if (result[i].number == signUpCourse.length) {
              result.splice(i, 1);
              i = -1;
            }
          }
          for (const item of result) {
                // if (item.number==1){
                //     let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStatus(item.id, '停课')
                // }
            item.startDate = app.moment(item.startDate).format('YYYY-MM-DD');
            item.endDate = app.moment(item.endDate).format('YYYY-MM-DD');
          }
            // return app.lodash.uniqBy(result, 'courseName')
          return app.lodash.uniqBy(result, 'startDate', 'endDate');
        } *
        getApplicableCourseByCourseNameAndTermId(courseName, termId) {
          const result = yield app.mysql.query(`select * from course_table_detail where  openEnrollment="是" AND courseName='${courseName}' AND termId = ${termId}`);
          for (let i = 0; i < result.length; i++) {
            const signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id);
            if (result[i].number == signUpCourse.length) {
              result.splice(i, 1);
              i = -1;
            }
          }
          for (const item of result) {
            item.teacherName = yield this.ctx.service.teacher.getById(item.teacherId);
            item.course = yield this.ctx.service.course.getByName(item.courseName);
          }
          return app.lodash.uniqBy(result, 'teacherId');
        } *
        getApplicableCourseByCourseNameAndTeacherNameAndTermId(courseName, teacherName, termId, studentId) {
          const teacher = yield this.ctx.service.teacher.getById(teacherName);
          const result = yield app.mysql.query(`select * from course_table_detail where  openEnrollment="是" AND courseName='${courseName}' AND teacherId = ${teacher.id} AND termId = ${termId}`);
          for (let i = 0; i < result.length; i++) {
            const signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id);
            if (result[i].number == signUpCourse.length) {
              result.splice(i, 1);
              i = -1;
            }
          }
          for (let i = 0; i < result.length; i++) {
            const signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id);
            for (let j = 0; j < signUpCourse.length; j++) {
              if (studentId == signUpCourse[j].studentId) {
                result.splice(i, 1);
                i = -1;
                break;
              }
            }
          }
          for (const item of result) {
                // if (item.number==1){
                //     let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStatus(item.id, '停课')
                // }
            item.startDate = app.moment(item.startDate).format('YYYY-MM-DD');
            item.endDate = app.moment(item.endDate).format('YYYY-MM-DD');
            item.classroom = yield this.ctx.service.classroom.getById(item.classroomId);
          }
          result.sort(function(a, b) {
            const getTime1 = new Date(a.startDate + ' ' + a.startTime).getTime();
            const getTime2 = new Date(b.startDate + ' ' + b.startTime).getTime();
            return getTime1 - getTime2;
          });
          return result;
        } *
        getApplicableCourseByTermIdAndCourseNameAndTercherNameAndWeek(courseName, teacherName, termId, week) {
          const aWeek = week.split(' ');
          const aTime = aWeek[1].split('~');
          const teacher = yield this.ctx.service.teacher.getById(teacherName);
          const result = yield app.mysql.query(`select * from course_table_detail where  openEnrollment="是" AND courseName='${courseName}' AND teacherId = ${teacher.id} AND termId = ${termId} AND dayOfWeek = '${aWeek[0]}' AND startTime = '${aTime[0]}' AND endTime = '${aTime[1]}'`);
          for (let i = 0; i < result.length; i++) {
            const signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id);
            if (result[i].number == signUpCourse.length) {
              result.splice(i, 1);
              i = -1;
            }
          }
          for (const item of result) {
                // if (item.number==1){
                //     let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStatus(item.id, '停课')
                // }
            item.startDate = app.moment(item.startDate).format('YYYY-MM-DD');
            item.endDate = app.moment(item.endDate).format('YYYY-MM-DD');
            item.classroom = yield this.ctx.service.classroom.getById(item.classroomId);
          }
          return result;
        } *
        getApplicableCourseByTermId(termId, studentId) {
          const result = yield app.mysql.query(`select * from course_table_detail where  openEnrollment="是" AND  termId = ${termId}`);
          for (let i = 0; i < result.length; i++) {
            const signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id);
            if (Number(result[i].number) == signUpCourse.length) {
              result.splice(i, 1);
              i = -1;
            }
          }
          console.log(result);
          for (let i = 0; i < result.length; i++) {
            const student = yield this.ctx.service.signUpCurriculum.getByStudentIdAndState(studentId);
                    // console.log(student)
            for (let j = 0; j < student.length; j++) {
              if (student[j].changeCurriculumId && student[j].changeCurriculumId == result[i].id) {
                result.splice(i, 1);
                i = -1;
                break;
              } else if (result[i].id == student[j].curriculumId && !student[j].changeCurriculumId) {
                result.splice(i, 1);
                i = -1;
                break;
              }
            }
          }
          for (const item of result) {
            item.startDate = app.moment(item.startDate).format('YYYY-MM-DD');
            item.endDate = app.moment(item.endDate).format('YYYY-MM-DD');
            item.classroom = yield this.ctx.service.classroom.getById(item.classroomId);
          }
          return app.lodash.uniqBy(result, 'courseNameId');
        } *
        changeOpen(id, openEnrollment) {
          const course = yield this.ctx.service.courseTableDetail.getById(id);
          course.openEnrollment = openEnrollment;
          const changeData = yield this.ctx.service.courseTableDetail.update(course);
          return changeData;
        } *
        getSignUpCourseOtherTime(id) {
          const oCourse = yield this.ctx.service.courseTableDetail.getById(id);
          let aOtherCourse;
          aOtherCourse = yield app.mysql.query(`select * from course_table_detail where id!=${id} AND courseNameId= '${oCourse.courseNameId}'  AND openEnrollment='是' AND endDate > now() AND termId = ${oCourse.termId}`);

          for (let i = 0; i < aOtherCourse.length; i++) {
            const aSignUp = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(aOtherCourse[i].id);
            aOtherCourse[i].startDate = app.moment(aOtherCourse[i].startDate).format('YYYY-MM-DD');
            aOtherCourse[i].endDate = app.moment(aOtherCourse[i].endDate).format('YYYY-MM-DD');
            if (aSignUp.length >= aOtherCourse[i].number) {
              aOtherCourse.splice(i, 1);
              i = -1;
            }
          }
          console.log(aOtherCourse);
          aOtherCourse.sort(function(a, b) {
            const getTime1 = new Date(a.startDate + ' ' + a.startTime).getTime();
            const getTime2 = new Date(b.startDate + ' ' + b.startTime).getTime();
            return getTime1 - getTime2;
          });
          return aOtherCourse;
        }
    * getSignUpCourseOtherClassTime(id) {
      const courseTableDetail = yield this.ctx.service.courseTableDetail.getById(id);
      const aOtherCourse = yield app.mysql.query(`select * from course_table_detail where id!=${id} AND courseNameId= '${courseTableDetail.courseNameId}' AND teacherId='${courseTableDetail.teacherId}' AND openEnrollment='是' AND termId = ${courseTableDetail.termId} AND dayOfWeek=''`);
      return aOtherCourse;
    }
    *
        resetCurriculumCycle(courseTableDetailId, studentId, startDateId, endDateId) {
          const result = yield app.mysql.insert('reset_curriculum_cycle', { courseTableDetailId, studentId, startDateId, endDateId });
          return result;
        } *
        getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId) {
          const result = yield app.mysql.get('reset_curriculum_cycle', { courseTableDetailId, studentId });
          return result;
        } *
        deleteByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId) {
          const result = yield app.mysql.delete('reset_curriculum_cycle', { courseTableDetailId, studentId });
          return result;
        }
    * getClassTimeClassById(id) {
      const result = yield app.mysql.get('course_table_detail', { id });
      return result;
    }
    * getSameClassByClassNameIdAndTeacherIdAndDurationAndLevelAndTermIdNumber(courseNameId,teacherId,duration,level,termId,number) { 
      let list = yield app.mysql.select('course_table_detail', { where: {courseNameId,teacherId,duration,level,termId,number,dayOfWeek:''}})  
      return list
    }
    * getTeacherForClassTranceByOpenEnrollmentAndIsDelAndCourseTableItemId() { 
      let list = yield app.mysql.query("SELECT * from course_table_detail WHERE openEnrollment = '是' AND isDel = 0 AND courseTableItemId = 0");
      return list;
    }
  }

  return CourseTableDetail;
};
