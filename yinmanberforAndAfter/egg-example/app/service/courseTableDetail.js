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
                let where = { termId };
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
        *
        getByTermId(termId) {

            let result = yield app.mysql.get('course_table_detail', { termId })
            return result
        } *
        add(termId, teacherId, courseName, level, number, duration, classroomId, dayOfWeek, startTime, endTime, status, startDate, endDate, openEnrollment, remarks, belowClass, numberOfRequests1, numberOfRequests2, teacherBelowClass, teacherNumberOfRequests1, teacherNumberOfRequests2) {
            const info = yield this.db.insert('course_table_detail', {
                termId,
                teacherId,
                courseName,
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
                clearCourse: '',
                openEnrollment,
                remarks,
                belowClass,
                numberOfRequests1,
                numberOfRequests2,
                teacherBelowClass,
                teacherNumberOfRequests1,
                teacherNumberOfRequests2
            });
            const id = info.insertId;
            if (id > 0) {
                return yield this.findById(id);
            }
            return null;
        }

        *
        findById(id) {
            //let info = yield this.ctx.model.courseTable.findOne({ _id: id });
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
        *
        getByIds(ids) {
            const list = yield this.db.query('SELECT * FROM course_table_detail WHERE id in (' + ids.join(',') + ')');
            return list;
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
                and duration >= ? and termId=? and teacherId = ?', [courseName, duration, termId, teacherId]);
                return info;
            } else {
                const info = yield this.app.mysql.query('select * from course_table_detail where number > 1 and courseName = ? \
                    and duration >= ? and termId=? AND teacherId = ?', [courseName, duration, termId, teacherId]);
                return info;
            }
        }

        *
        getListByClassroomId(classroomId) {
            return yield app.mysql.select('course_table_detail', { where: { classroomId: classroomId } });
        } *
        getListByCourseName(courseName) {
            return yield app.mysql.select('course_table_detail', { where: { courseName: courseName } });
        } *
        getApplicableCourse() {
            let result = yield app.mysql.query('select * from course_table_detail where TO_DAYS(endDate)-TO_DAYS(NOW())>=1 AND openEnrollment="是" ')
            for (let i = 0; i < result.length; i++) {
                let signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id)
                console.log(result[i].id, signUpCourse.length)
                if (result[i].number == signUpCourse.length) {
                    result.splice(i, 1)
                    i = -1
                }
            }
            for (let item of result) {
                // if (item.number==1){ 
                //     let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStatus(item.id, '停课')
                // }
                item.startDate = app.moment(item.startDate).format('YYYY-MM-DD')
                item.endDate = app.moment(item.endDate).format('YYYY-MM-DD')
            }
            // return app.lodash.uniqBy(result, 'courseName')
            return app.lodash.uniqBy(result, 'startDate', 'endDate')
        } *
        getApplicableCourseByCourseNameAndTermId(courseName, termId) {
            let result = yield app.mysql.query(`select * from course_table_detail where  openEnrollment="是" AND courseName='${courseName}' AND termId = ${termId}`)
            for (let i = 0; i < result.length; i++) {
                let signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id)
                if (result[i].number == signUpCourse.length) {
                    result.splice(i, 1)
                    i = -1
                }
            }
            for (let item of result) {
                item.teacherName = yield this.ctx.service.teacher.getById(item.teacherId)
                item.course = yield this.ctx.service.course.getByName(item.courseName)
            }
            return app.lodash.uniqBy(result, 'teacherId')
        } *
        getApplicableCourseByCourseNameAndTeacherNameAndTermId(courseName, teacherName, termId, studentId) {
            let teacher = yield this.ctx.service.teacher.getById(teacherName)
            let result = yield app.mysql.query(`select * from course_table_detail where  openEnrollment="是" AND courseName='${courseName}' AND teacherId = ${teacher.id} AND termId = ${termId}`)
            for (let i = 0; i < result.length; i++) {
                let signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id)
                if (result[i].number == signUpCourse.length) {
                    result.splice(i, 1)
                    i = -1
                }
            }
            for (let i = 0; i < result.length; i++) {
                let signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id)
                for (let j = 0; j < signUpCourse.length; j++) {
                    if (studentId == signUpCourse[j].studentId) {
                        result.splice(i, 1)
                        i = -1
                        break
                    }
                }
            }
            for (let item of result) {
                // if (item.number==1){ 
                //     let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStatus(item.id, '停课')
                // }
                item.startDate = app.moment(item.startDate).format('YYYY-MM-DD')
                item.endDate = app.moment(item.endDate).format('YYYY-MM-DD')
                item.classroom = yield this.ctx.service.classroom.getById(item.classroomId)
            }
            result.sort(function(a, b) {
                let getTime1 = new Date(a.startDate + " " + a.startTime).getTime()
                let getTime2 = new Date(b.startDate + " " + b.startTime).getTime()
                return getTime1 - getTime2
            })
            return result
        } *
        getApplicableCourseByTermIdAndCourseNameAndTercherNameAndWeek(courseName, teacherName, termId, week) {
            let aWeek = week.split(' ')
            let aTime = aWeek[1].split('~')
            let teacher = yield this.ctx.service.teacher.getById(teacherName)
            let result = yield app.mysql.query(`select * from course_table_detail where  openEnrollment="是" AND courseName='${courseName}' AND teacherId = ${teacher.id} AND termId = ${termId} AND dayOfWeek = '${aWeek[0]}' AND startTime = '${aTime[0]}' AND endTime = '${aTime[1]}'`)
            for (let i = 0; i < result.length; i++) {
                let signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id)
                if (result[i].number == signUpCourse.length) {
                    result.splice(i, 1)
                    i = -1
                }
            }
            for (let item of result) {
                // if (item.number==1){ 
                //     let courseTableDetailStudent = yield this.ctx.service.courseTableDetailStudent.getByCourseTableDetailIdAndStatus(item.id, '停课')
                // }
                item.startDate = app.moment(item.startDate).format('YYYY-MM-DD')
                item.endDate = app.moment(item.endDate).format('YYYY-MM-DD')
                item.classroom = yield this.ctx.service.classroom.getById(item.classroomId)
            }
            return result
        } *
        getApplicableCourseByTermId(termId, studentId) {
            let result = yield app.mysql.query(`select * from course_table_detail where  openEnrollment="是" AND  termId = ${termId}`)
            for (let i = 0; i < result.length; i++) {
                let signUpCourse = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(result[i].id)
                if (Number(result[i].number) == signUpCourse.length) {
                    result.splice(i, 1)
                    i = -1
                }
            }
            console.log(result)
            for (let i = 0; i < result.length; i++) {
                let student = yield this.ctx.service.signUpCurriculum.getByStudentIdAndState(studentId)
                    // console.log(student)
                for (var j = 0; j < student.length; j++) {
                    if (student[j].changeCurriculumId && student[j].changeCurriculumId == result[i].id) {
                        result.splice(i, 1)
                        i = -1
                        break
                    } else if (result[i].id == student[j].curriculumId && !student[j].changeCurriculumId) {
                        result.splice(i, 1)
                        i = -1
                        break
                    }
                }
            }
            for (let item of result) {
                item.startDate = app.moment(item.startDate).format('YYYY-MM-DD')
                item.endDate = app.moment(item.endDate).format('YYYY-MM-DD')
                item.classroom = yield this.ctx.service.classroom.getById(item.classroomId)
            }
            console.log(result)
            return app.lodash.uniqBy(result, 'courseName')
        } *
        changeOpen(id, openEnrollment) {
            let course = yield this.ctx.service.courseTableDetail.getById(id);
            course.openEnrollment = openEnrollment
            let changeData = yield this.ctx.service.courseTableDetail.update(course)
            return changeData
        } *
        getSignUpCourseOtherTime(id) {
            let oCourse = yield this.ctx.service.courseTableDetail.getById(id)
            let aOtherCourse
            if (oCourse.number > 1) {
                aOtherCourse = yield app.mysql.query(`select * from course_table_detail where id!=${id} AND courseName= '${oCourse.courseName}' AND number!=1 AND openEnrollment='是' AND endDate > now()`)
            } else {
                aOtherCourse = yield app.mysql.query(`select * from course_table_detail where id!=${id} AND courseName= '${oCourse.courseName}' AND number=1 AND openEnrollment='是' AND endDate > now()`)
            }
            for (let i = 0; i < aOtherCourse.length; i++) {
                let aSignUp = yield this.ctx.service.signUpCurriculum.getsignUpCurriculumByCurriculumId(aOtherCourse[i].id)
                aOtherCourse[i].startDate = app.moment(aOtherCourse[i].startDate).format('YYYY-MM-DD')
                aOtherCourse[i].endDate = app.moment(aOtherCourse[i].endDate).format('YYYY-MM-DD')
                if (aSignUp.length >= aOtherCourse[i].number) {
                    aOtherCourse.splice(i, 1)
                    i = -1
                }
            }
            aOtherCourse.sort(function(a, b) {
                let getTime1 = new Date(a.startDate + " " + a.startTime).getTime()
                let getTime2 = new Date(b.startDate + " " + b.startTime).getTime()
                return getTime1 - getTime2
            })
            return aOtherCourse
        } *
        resetCurriculumCycle(courseTableDetailId, studentId, startDateId, endDateId) {
            let result = yield app.mysql.insert('reset_curriculum_cycle', { courseTableDetailId, studentId, startDateId, endDateId })
            return result
        } *
        getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId) {
            let result = yield app.mysql.get('reset_curriculum_cycle', { courseTableDetailId, studentId })
            return result
        } *
        deleteByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId) {
            let result = yield app.mysql.delete('reset_curriculum_cycle', { courseTableDetailId, studentId })
            return result
        }
    }

    return CourseTableDetail;
};