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
            let now = app.moment().format('YYYY-MM-DD HH:mm:ss');
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
                createTime: now
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
            let result = yield app.mysql.select('course_table_item')
            return result
        } *
        find(termId, teacherId, startDate, endDate) {
            let list = yield app.mysql.query("select * from `course_table_item` where termId = ? AND teacherId = ? AND date >= ? and date<= ?", [termId, teacherId, startDate, endDate]);
            return list;
        } *
        getBookingCourseTeacher(courseName, dates) {
            let date = JSON.parse(dates)
            let list = yield app.mysql.select('course_table_item', { where: { type: '预约试课', courseName, date: date.date, startTime: date.startTime, endTime: date.endTime } })
            console.log(list, date.date, date.startTime, date.endTime)
            let aIdx = []
            for (let [index, item] of list.entries()) {
                let bookingCourse = yield app.mysql.query(`select * from  booking_course  where courseTableItemId = ${item.id} and state !='已取消' and ISNULL(confirmedId)  and state !='已拒绝'`)
                let booking = yield app.mysql.query(`select * from  booking_course  where confirmedId = ${item.id} and state !='已取消'  and state !='已拒绝'`)
                for (let [i, it] of booking.entries()) {
                    bookingCourse.push(booking[i])
                }
                if (item.number == bookingCourse.length) {
                    aIdx.push(index)
                }
            }
            for (let i = 0; i < aIdx.length; i++) {
                list.splice(aIdx[i], 1, '')
            }

            for (let i = 0; i < list.length; i++) {
                if (list[i] == '') {
                    list.splice(i, 1)
                    i = -1
                }
            }

            let teachers = []
            for (let item of list) {
                let teacher = yield this.ctx.service.teacher.getById(item.teacherId)
                teachers.push(teacher)
            }
            return app.lodash.uniqBy(teachers, 'name')
        } *
        getListByTeacherIdNOType(teacherId) {
            let list = yield app.mysql.query(`SELECT * from course_table_item  WHERE type != '正式课程' AND teacherId=${teacherId}`)
            return list
        } *
        getListByClassroomId(classroomId) {
            let list = yield app.mysql.query(`SELECT * from course_table_item  WHERE classroomId=${classroomId}`)
            return list
        } *
        getBookingCourse() {
            let list = yield app.mysql.query(`SELECT * from course_table_item  WHERE type = '预约试课' AND date > now()`)
            let aIdx = []
            for (let [index, item] of list.entries()) {
                let bookingCourse = yield app.mysql.query(`select * from  booking_course  where courseTableItemId = ${item.id} and state !='已取消' and ISNULL(confirmedId)  and state !='已拒绝'`)
                let booking = yield app.mysql.query(`select * from  booking_course  where confirmedId = ${item.id} and state !='已取消'  and state !='已拒绝'`)
                for (let [i, it] of booking.entries()) {
                    bookingCourse.push(booking[i])
                }
                if (item.number == bookingCourse.length) {
                    aIdx.push(index)
                }
            }
            for (let i = 0; i < aIdx.length; i++) {
                list.splice(aIdx[i], 1, '')
            }
            for (let i = 0; i < list.length; i++) {
                if (!list[i]) {
                    list.splice(i, 1)
                    i = -1
                }
            }

            return app.lodash.uniqBy(list, 'courseName')
        } *
        getBookingCourseTime(courseName) {
            let list = yield app.mysql.query(`SELECT * from course_table_item  WHERE type = '预约试课' AND date > now() AND courseName='${courseName}'`)
            let aIdx = []
            for (let [index, item] of list.entries()) {
                let bookingCourse = yield app.mysql.query(`select * from  booking_course  where courseTableItemId = ${item.id} and state !='已取消' and ISNULL(confirmedId)  and state !='已拒绝'`)
                let booking = yield app.mysql.query(`select * from  booking_course  where confirmedId = ${item.id} and state !='已取消'  and state !='已拒绝'`)
                for (let [i, it] of booking.entries()) {
                    bookingCourse.push(booking[i])
                }

                if (item.number == bookingCourse.length) {
                    aIdx.push(index)
                }
            }
            for (let i = 0; i < aIdx.length; i++) {
                list.splice(aIdx[i], 1, '')
            }
            for (let i = 0; i < list.length; i++) {
                if (!list[i]) {
                    list.splice(i, 1)
                    i = -1
                }
            }
            for (let item of list) {
                item.course = yield this.ctx.service.course.getByName(item.courseName)
                item.classroom = yield this.ctx.service.classroom.getById(item.classroomId)
                item.date = app.moment(item.date).format('YYYY-MM-DD')
                item.startTime = item.startTime.substring(0, 5)
                item.endTime = item.endTime.substring(0, 5)
            }
            return list
        } *
        getBookingCourseOtherTime(id) {
            let course = yield app.mysql.get('course_table_item', { id })
                // let list = yield app.mysql.query(`select * from course_table_item where id = ${id} and type = 预约试课 and teacherId = ${course.teacherId} and courseName = ${course.courseName}`)
            let list = yield app.mysql.query(`select * from  course_table_item  where id != ${id} and type = '预约试课'  and courseName = '${course.courseName}' AND date > now()`)
            let aIdx = []
            for (let [index, item] of list.entries()) {
                let bookingCourse = yield app.mysql.query(`select * from  booking_course  where courseTableItemId = ${item.id} and state !='已取消' and ISNULL(confirmedId)  and state !='已拒绝'`)
                let booking = yield app.mysql.query(`select * from  booking_course  where confirmedId = ${item.id} and state !='已取消'  and state !='已拒绝'`)
                for (let [i, it] of booking.entries()) {
                    bookingCourse.push(booking[i])
                }

                if (item.number == bookingCourse.length) {
                    aIdx.push(index)
                }
            }
            for (let i = 0; i < aIdx.length; i++) {
                list.splice(aIdx[i], 1, '')
            }
            for (let i = 0; i < list.length; i++) {
                if (!list[i]) {
                    list.splice(i, 1)
                }
            }
            for (let item of list) {
                item.date = app.moment(item.date).format('YYYY-MM-DD')
                item.startTime = item.startTime.substring(0, 5)
                item.endTime = item.endTime.substring(0, 5)
            }
            return list
        } *
        find(termId, teacherId, startDate, endDate) {
            const list = yield app.mysql.query('select * from `course_table_item` where termId = ? AND teacherId = ? AND date >= ? and date<= ?', [termId, teacherId, startDate, endDate]);
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
            now.setDate(now.getDate() + 2)
            console.log(termId, courseName, number, duration)
                // const list = yield this.app.mysql.select('course_table_item', {
                //     where: {
                //         termId,
                //         courseName,
                //         number,
                //         duration,
                //         status: '空闲',
                //     },
                // });
            const list = yield this.app.mysql.query('select * from course_table_item where number = ? and status ="空闲" and date > ? and courseName = ? and duration >= ? and termId=? ', [number, now, courseName, duration, termId]);
            return list;
        } *
        getFreeForStudent(courseName, number, duration, termId, level) {
            const now = new Date();
            now.setDate(now.getDate() + 2)
            if (number == 1) {
                let list = yield this.app.mysql.query('select * from course_table_item where number = 1 and status ="空闲" and date > ? and courseName = ? and duration >= ? and termId=? and level=? and type!="预约试课"', [now, courseName, duration, termId, level]);
                let list1 = yield this.getOpenEnrollmentList(list)
                return list1;
            }
            let list = yield this.app.mysql.query('select * from course_table_item where number > 1 and status ="空闲" and date > ? and courseName = ? and duration >= ? and termId=? and level=? and type!="预约试课"', [now, courseName, duration, termId, level]);
            let list1 = yield this.getOpenEnrollmentList(list)
            return list1;
        } *
        getFreeByteacherIdForStudent(courseName, number, duration, termId, level, teacherId) {
            const now = new Date();
            now.setDate(now.getDate() + 2)
            if (number == 1) {
                const list = yield this.app.mysql.query('select * from course_table_item where number = 1 and status ="空闲" and date > ? and courseName = ? and duration >= ? and termId=? and level=? and teacherId=? and type!="预约试课"', [now, courseName, duration, termId, level, teacherId]);
                let list1 = yield this.getOpenEnrollmentList(list)
                return list1;
            }
            const list = yield this.app.mysql.query('select * from course_table_item where number > 1 and status ="空闲" and date > ? and courseName = ? and duration >= ? and termId=? and level=? and teacherId=? and type!="预约试课"', [now, courseName, duration, termId, level, teacherId]);
            let list1 = yield this.getOpenEnrollmentList(list)
            return list1;
        }

        // *  delete(courseTableId, startDate, endDate) {
        //     yield this.ctx.model.courseTableItem.remove({
        //         "courseTableId": courseTableId,
        //         "date": { "$gte": startDate, "$lte": endDate }
        //     });
        // }

        // * findDateRange(courseTableId) {
        //     var minDate = yield this.ctx.model.courseTableItem.find({
        //         "courseTableId": courseTableId
        //     }).sort({ 'date': 1 }).limit(1);
        //     var maxDate = yield this.ctx.model.courseTableItem.find({
        //         "courseTableId": courseTableId
        //     }).sort({ 'date': -1 }).limit(1);
        //     console.log(minDate, maxDate.date);
        //     return { minDate: minDate[0].date, maxDate: maxDate[0].date };
        // } 
        *
        getEachCycle(courseTableId) {
            var result = yield app.mysql.select("course_table_item", { where: { courseTableId: courseTableId } })

            return result
        } *
        getStudentAll(teacherId) {
            var table = yield app.mysql.get("course_table", { teacherId: teacherId })
            var tableDetail = yield app.mysql.select("course_table_detail", { courseTableId: table.id })

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
            console.log(info, 1111)
            const result = yield this.db.update('course_table_item', info);
            const updateSuccess = result.affectedRows === 1;
            return updateSuccess;
        }

        *
        getList(termId, studentId, startDate, endDate) {
            const list = yield app.mysql.query('SELECT i.* FROM course_table_item as i where i.date >= ? and i.date <= ? and i.id in (select courseTableItemId from course_table_item_student as s where (s.status = "正常" or s.status = "停课" or s.status = "补课"  or s.status = "转课") and s.termId = ? and s.studentId = ?)', [startDate, endDate, termId, studentId]);
            return list;
        }

        *
        getList1(termId, teacherId, date) {
            const list = yield this.db.select('course_table_item', { where: { termId: termId, teacherId: teacherId, date: date } });

            return list;
        }

        /**
         * 前台学生调课时获取学生要调哪天的课
         * @param {*} courseTableDetailId 
         */
        *
        getFreeListByCourseTableDetailId(courseTableDetailId) {
            const list = yield app.mysql.query(`SELECT * FROM course_table_item WHERE courseTableDetailId=${courseTableDetailId} AND date>date_sub(CURDATE(),interval -2 day)`)
            return list
        }
        /**
         * 统计某个教室是否被占用
         * @param {Number} classroomId 
         */
        *
        countByClassroomId(classroomId) {
            const count = yield this.db.query('SELECT COUNT(*) FROM course_table_item WHERE classroomId = ?', [classroomId]);
            console.log(count[0])
            return count[0]['COUNT(*)'];
        } *
        getListByCourseName(courseName) {
            const list = yield app.mysql.select('course_table_item', { where: { courseName: courseName } })
            return list;
        } *
        getOpenEnrollmentList(list) {
            let aDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            for (let i = 0; i < list.length; i++) {
                list[i].dayOfWeek = aDay[app.moment(list[i].date).day()]
                let courseTableDetail = yield this.ctx.service.courseTableDetail.getById(list[i].courseTableDetailId)
                if (courseTableDetail && courseTableDetail.openEnrollment != '是') {
                    list.splice(i, 1)
                    i = -1
                }
            }
            return list
        }
    }
    return CourseTableItem;
};