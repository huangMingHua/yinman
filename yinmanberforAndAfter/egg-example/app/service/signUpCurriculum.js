module.exports = app => {
    class signUpCurriculum extends app.Service { *
        saveCurriculum(studentId, curriculumId, userId, state, createTime, specialRequirements) {
                let list = yield app.mysql.query(`select * from sign_up_curriculum WHERE studentId=${studentId} AND (state='待确认' OR state='已确认')`)
                for (let item of list) {
                    if (item.changeCurriculumId && item.changeCurriculumId == curriculumId) {
                        return 1
                    } else if (item.curriculumId == curriculumId && !item.changeCurriculumId) {
                        return 1
                    }
                }
                for (let item of list) {
                    let alreadyEnrolledCourse = {}
                    if (item.changeCurriculumId) {
                        alreadyEnrolledCourse = yield this.ctx.service.courseTableDetail.getById(item.changeCurriculumId)
                    } else {
                        alreadyEnrolledCourse = yield this.ctx.service.courseTableDetail.getById(item.curriculumId)
                    }
                    let signUpCourse = yield this.ctx.service.courseTableDetail.getById(curriculumId)
                    let alreadyEnrolledStartTime = new Date(alreadyEnrolledCourse.startDate).getTime()
                    let alreadyEnrolledEndTime = new Date(alreadyEnrolledCourse.endDate).getTime()
                    let signUpStartTime = new Date(signUpCourse.startDate).getTime()
                    let signUpEndTime = new Date(signUpCourse.endDate).getTime()
                    console.log(alreadyEnrolledStartTime <= signUpStartTime, signUpStartTime <= alreadyEnrolledEndTime)
                    if (alreadyEnrolledStartTime <= signUpStartTime && signUpStartTime <= alreadyEnrolledEndTime) {
                        if (alreadyEnrolledCourse.dayOfWeek == signUpCourse.dayOfWeek) {
                            let nowDate = new Date()
                            let alreadyStartTime = new Date(nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " + alreadyEnrolledCourse.startTime).getTime()
                            let alreadyEndTime = new Date(nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " + alreadyEnrolledCourse.endTime).getTime()
                            let signUpStartTime = new Date(nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " + signUpCourse.startTime).getTime()
                            if (alreadyStartTime <= signUpStartTime && signUpStartTime <= alreadyEndTime) {
                                return 2
                            }
                        }
                    }
                }
                let afterCourseDeleTeSaveInfo = yield this.ctx.service.courseTableDetail.getById(curriculumId)
                afterCourseDeleTeSaveInfo.oTeacher = yield this.ctx.service.teacher.getById(afterCourseDeleTeSaveInfo.teacherId)
                afterCourseDeleTeSaveInfo.oClassroom = yield this.ctx.service.classroom.getById(afterCourseDeleTeSaveInfo.classroomId)
                afterCourseDeleTeSaveInfo.term = yield this.ctx.service.term.getById(afterCourseDeleTeSaveInfo.termId)
                afterCourseDeleTeSaveInfo.curriculum = yield this.ctx.service.course.getByName(afterCourseDeleTeSaveInfo.courseName)
                afterCourseDeleTeSaveInfo = JSON.stringify(afterCourseDeleTeSaveInfo)
                const result = yield app.mysql.insert('sign_up_curriculum', {
                    studentId,
                    curriculumId,
                    userId,
                    state,
                    createTime,
                    specialRequirements,
                    afterCourseDeleTeSaveInfo,
                });
                return result;
            } *
            getByStudentIdAndState1(studentId) {
                let result = yield app.mysql.query(`select * from sign_up_curriculum where studentId=${studentId} and state='已确认'`);
                return result;
            } *
            getAll(page, limit, state, termDate) {
                let aCurriculum = []
                let nTotalCount = 0
                let whereInfo = {}
                if (state) {
                    aCurriculum = yield app.mysql.query(`SELECT * FROM sign_up_curriculum WHERE state='${state}' ORDER BY state='待确认' DESC,id DESC  LIMIT ${Number(limit)} OFFSET ${(page - 1) * Number(limit)}`)
                    let totalCount = yield app.mysql.query(`select count(*) from sign_up_curriculum  where state = '${state}'`);
                    nTotalCount = totalCount[0]['count(*)']
                } else {
                    aCurriculum = yield app.mysql.query(`SELECT * FROM sign_up_curriculum  ORDER BY state='待确认' DESC,id DESC LIMIT ${Number(limit)} OFFSET ${(page - 1) * Number(limit) }`)
                    nTotalCount = yield app.mysql.count("sign_up_curriculum")
                }
                for (let item of aCurriculum) {
                    item.oStudent = yield this.ctx.service.student.getById(item.studentId)
                    item.oUser = yield this.ctx.service.user.getById(item.userId)
                    item.oCourse = yield this.ctx.service.courseTableDetail.getById(item.curriculumId)
                    if (item.changeCurriculumId) {
                        item.oChangeCourse = yield this.ctx.service.courseTableDetail.getById(item.changeCurriculumId)
                    }
                    if (item.oCourse) {
                        item.oCourse.oTeacher = yield this.ctx.service.teacher.getById(item.oCourse.teacherId)
                        item.oCourse.oClassroom = yield this.ctx.service.classroom.getById(item.oCourse.classroomId)
                    }
                }
                if (termDate) {
                    let aTermDate = termDate.split("~")
                    let startDate = new Date(aTermDate[0]).getTime()
                    let endDate = new Date(aTermDate[1]).getTime()

                    for (let i = 0; i < aCurriculum.length; i++) {
                        aCurriculum[i].afterCourseDeleTeSaveInfo = JSON.parse(aCurriculum[i].afterCourseDeleTeSaveInfo)
                        if (aCurriculum[i].oChangeCourse) {
                            let courseStartDate = new Date(aCurriculum[i].oChangeCourse.startDate).getTime()
                            if (courseStartDate < startDate && courseStartDate > endDate) {
                                aCurriculum.splice(i, 1)
                                i = -1
                            }
                        } else {
                            let courseStartDate = new Date(aCurriculum[i].afterCourseDeleTeSaveInfo.startDate).getTime()
                            let courseEndDate = new Date(aCurriculum[i].afterCourseDeleTeSaveInfo.endDate).getTime()
                            if (courseEndDate <= startDate || courseStartDate >= endDate) {
                                aCurriculum.splice(i, 1)
                                i = -1
                            }
                        }
                    }
                }
                let result = {
                    aCurriculum,
                    nTotalCount
                }
                return result
            } *
            getsignUpCurriculumByCurriculumId(curriculumId) {
                let result = yield app.mysql.query(`select * from sign_up_curriculum where  (state='待确认' or state='已确认')`)
                let aData = []
                for (let i = 0; i < result.length; i++) {
                    // if (result[i].changeCurriculumId && result[i].changeCurriculumId == curriculumId) {
                    //     aData.push(result[i])
                    // } else
                    if (result[i].curriculumId == curriculumId && !result[i].changeCurriculumId) {
                        aData.push(result[i])
                    } else if (result[i].changeCurriculumId == curriculumId) {
                        aData.push(result[i])
                    }
                }
                return aData
            } *
            getsignUpCurriculumByCurriculumIdAndConfirmed(curriculumId) {
                let result = yield app.mysql.query(`select * from sign_up_curriculum where state='已确认'`)
                let aData = []
                for (let i = 0; i < result.length; i++) {
                    if (result[i].curriculumId == curriculumId && !result[i].changeCurriculumId) {
                        aData.push(result[i])
                    } else if (result[i].changeCurriculumId == curriculumId) {
                        aData.push(result[i])
                    }
                }
                return aData
            } *
            getsignUpCurriculumByCurriculumIdAndState(curriculumId) {
                let result = yield app.mysql.query(`select * from sign_up_curriculum where (state='已确认' or state='已停课' or state='已转课')`)
                let aData = []
                for (let i = 0; i < result.length; i++) {
                    if (result[i].curriculumId == curriculumId && !result[i].changeCurriculumId) {
                        aData.push(result[i])
                    } else if (result[i].changeCurriculumId == curriculumId) {
                        aData.push(result[i])
                    }
                }
                return aData
            } *
            getStudentCurriculum(studentId) {
                let result = yield app.mysql.select('sign_up_curriculum', { where: { studentId } });
                for (let item of result) {
                    item.afterCourseDeleTeSaveInfo = JSON.parse(item.afterCourseDeleTeSaveInfo)
                    item.course = yield this.ctx.service.courseTableDetail.findById(item.curriculumId)
                }
                return result;
            } *
            getByStudentIdAndState(studentId) {
                let result = yield app.mysql.query(`select * from sign_up_curriculum where studentId=${studentId} and (state='待确认' or state='已确认')`);
                return result;
            } *
            getEnrolmentInfo(studentId) {
                console.log(studentId);
                const result = yield app.mysql.query(`select * from  sign_up_curriculum  where state!=0 and studentId=${studentId}`);
                console.log(result);
                for (let i = 0; i < result.length; i++) {
                    result[i].times = yield app.mysql.select('sign_up_curriculum_time', { where: { sign_up_curriculum_id: result[i].id } });
                }
                return result;
            } *
            getById(id) {
                let result = yield app.mysql.get('sign_up_curriculum', { id });
                let nId = 0
                if (result.changeCurriculumId) {
                    result.changeCourse = yield this.ctx.service.courseTableDetail.findById(result.changeCurriculumId)
                    if (result.changeCourse) {
                        result.changeCourse.term = yield this.ctx.service.term.getById(result.changeCourse.termId)
                        result.changeCourse.startDate = app.moment(result.changeCourse.startDate).format('YYYY-MM-DD')
                        result.changeCourse.endDate = app.moment(result.changeCourse.endDate).format('YYYY-MM-DD')
                        result.changeCourse.teacher = yield this.ctx.service.teacher.getById(result.changeCourse.teacherId)
                        result.changeCourse.curriculum = yield this.ctx.service.course.getByName(result.changeCourse.courseName)
                        result.changeCourse.classroom = yield this.ctx.service.classroom.getById(result.changeCourse.classroomId)
                    }
                }
                result.course = yield this.ctx.service.courseTableDetail.findById(result.curriculumId)
                if (result.course) {
                    result.term = yield this.ctx.service.term.getById(result.course.termId)
                    result.course.startDate = app.moment(result.course.startDate).format('YYYY-MM-DD')
                    result.course.endDate = app.moment(result.course.endDate).format('YYYY-MM-DD')
                    result.teacher = yield this.ctx.service.teacher.getById(result.course.teacherId)
                    result.course.curriculum = yield this.ctx.service.course.getByName(result.course.courseName)
                    result.classroom = yield this.ctx.service.classroom.getById(result.course.classroomId)
                }
                return result;
            } *
            changeState(id, state) {
                const result = yield app.mysql.update('sign_up_curriculum', { id, state });
                return result;

            } *
            getListByState(curriculumId, state) {
                const result = yield app.mysql.select('sign_up_curriculum', { where: { curriculumId, state } });
                return result;
            } *
            getSignCurriculum(studentId) {
                const aCurriculum = yield app.mysql.query(`select * from  sign_up_curriculum  where  studentId=${studentId}`);
                for (let item of aCurriculum) {
                    let id = item.changeCurriculumId || item.curriculumId
                    item.courseTableDetail = yield this.ctx.service.courseTableDetail.getById(id)
                    item.oStudent = yield this.ctx.service.student.getById(item.studentId)
                    item.oUser = yield this.ctx.service.user.getById(item.userId)
                    item.oCourse = yield this.ctx.service.courseTableDetail.getById(item.curriculumId)
                    if (item.changeCurriculumId) {
                        item.oChangeCourse = yield this.ctx.service.courseTableDetail.getById(item.changeCurriculumId)
                    }
                    if (item.oCourse) {
                        item.oCourse.oTeacher = yield this.ctx.service.teacher.getById(item.oCourse.teacherId)
                        item.oCourse.oClassroom = yield this.ctx.service.classroom.getById(item.oCourse.classroomId)
                    } else {
                        item.oCourse = JSON.parse(item.afterCourseDeleTeSaveInfo)
                    }
                    if (!item.courseTableDetail) {
                        item.courseTableDetail = JSON.parse(item.afterCourseDeleTeSaveInfo)
                    }

                }
                return aCurriculum;
            } *
            update(info) {
                let result = yield app.mysql.update('sign_up_curriculum', info)
                return result
            } *
            getSignCurriculumByStudentIdAndCurriculumIdAndState(studentId, curriculumId, state) {
                let result = yield app.mysql.select('sign_up_curriculum', { where: { studentId, state } });
                let data = {}
                for (let item of result) {
                    if (item.changeCurriculumId && item.changeCurriculumId == curriculumId) {
                        data = item
                    } else if (item.curriculumId == curriculumId) {
                        data = item
                    }
                }
                return data
            }

    }
    return signUpCurriculum;
};