module.exports = app => {
    class courseTableDetailStudent extends app.Service {
        get db() {
                return this.ctx.conn ? this.ctx.conn : this.app.mysql;
            }
            /**
             * 添加，并且如果人满，则将course_table_item的空闲状态置为空
             * @param {Int} studentId
             * @param {Int} courseTableDetailId
             * @param {String} status
             */
            *
            add(studentId, courseTableDetailId, status, termId, signUpCurriculumId = null, startCourseTableItemId, numberOfChangeClass, allNumberOfChangeClass, numberOfleave, numberOfChangeClassForTeacher, allNumberOfChangeClassForTeacher) {
                console.log(studentId, courseTableDetailId, status, termId)
                    // console.log('==================test dev=====================');
                const result = yield this.db.insert('course_table_detail_student', {
                    studentId,
                    courseTableDetailId,
                    status,
                    termId,
                    signUpCurriculumId,
                    numberOfChangeClass,
                    allNumberOfChangeClass,
                    numberOfleave,
                    startCourseTableItemId,
                    numberOfChangeClassForTeacher,
                    allNumberOfChangeClassForTeacher,
                });

                yield this.autoUpdateStatus(courseTableDetailId);
                return result
            } *
            classTransferAdd(studentId, courseTableDetailId, status, termId, originalCourseTableDetailId, startCourseTableItemId) {
                // console.log('==================test dev=====================');
                const result = yield this.db.insert('course_table_detail_student', {
                    studentId,
                    courseTableDetailId,
                    status,
                    termId,
                    originalCourseTableDetailId,
                    startCourseTableItemId,
                    numberOfChangeClass: parseInt((yield this.ctx.service.config.getByKey('学生调课次数')).value),
                    allNumberOfChangeClass: parseInt((yield this.ctx.service.config.getByKey('学生调课次数')).value),
                    numberOfleave: parseInt((yield this.ctx.service.config.getByKey('学生调课次数')).value),
                    numberOfChangeClassForTeacher: parseInt((yield this.ctx.service.config.getByKey('教师调课次数')).value),
                    allNumberOfChangeClassForTeacher: parseInt((yield this.ctx.service.config.getByKey('教师调课次数')).value),
                });
                yield this.autoUpdateStatus(courseTableDetailId);
            } *
            autoUpdateStatus(courseTableDetailId) {
                const courseTableDetail = yield this.service.courseTableDetail.findById(courseTableDetailId);
                const students = yield this.getByCourseTableDetailId(courseTableDetailId, '正常');
                // console.log(students.length, courseTableDetail.number);
                if (students.length === courseTableDetail.number) {
                    courseTableDetail.status = '';
                } else {
                    courseTableDetail.status = '空闲';
                }
                yield this.service.courseTableDetail.update(courseTableDetail);
            }

        /**
         * 
         * @param {Number} id 
         * @param {string|null} status
         */
        *
        getByCourseTableDetailId(id, status) {
            let where = { courseTableDetailId: id };
            if (status) {
                where = app.lodash.assign(where, { status });
            }
            const list = yield this.db.select('course_table_detail_student', { where });
            return list;
        } *
        getByCourseTableDetailIdAndStatus(courseTableDetailId, status) {

            const result = yield app.mysql.get('course_table_detail_student', { courseTableDetailId, status });
            return result;
        }
        /**
         * 用户是否已经报名
         * @param {Number} courseTableDetailId 
         * @param {Number} studentId 
         */
        *
        hasSignUp(courseTableDetailId, studentId) {
            const info = yield this.get(courseTableDetailId, studentId);

            return info != null;
        }

        *
        get(courseTableDetailId, studentId) {
                const info = yield this.db.get('course_table_detail_student', { courseTableDetailId, studentId, status: '正常' });
                return info;
            } *
            getByCourseTableDetailIdAndStudentId(courseTableDetailId, studentId) {
                const info = yield this.db.get('course_table_detail_student', { courseTableDetailId, studentId });
                return info;
            } *
            delete(courseTableDetailId, studentId) {
                // this.ctx.logger.info(this.ctx.conn, this.db);
                const result = yield this.db.delete('course_table_detail_student', {
                    courseTableDetailId,
                    studentId,
                });

                yield this.autoUpdateStatus(courseTableDetailId);
            }

        *
        getTermIds(studentId) {
            const result = yield this.db.query('select DISTINCT(termId) from course_table_detail_student where studentId = ?', [studentId]);
            return this.app.lodash.map(result, 'termId');
        }

        *
        getList(termId, studentId) {
            const list = yield this.db.select('course_table_detail_student', { where: { termId: termId, studentId: studentId } });
            return list;
        }

        /**
         * 获取某学期老师的学生信息
         * @param {*} termId 
         * @param {*} teacherId 
         */
        *
        getStudents(termId, teacherId) {
            const list = yield this.db.query('select s.* from course_table_detail_student as s left join course_table_detail as d on s.courseTableDetailId = d.id \
          where (s.`status` = "正常" or s.`status` = "停课" or s.`status` = "转课" ) and s.termId = ? and d.teacherId = ?', [termId, teacherId]);
            return list;
        } *
        suspendClasses(data) {
            let result = yield app.mysql.update('course_table_detail_student', data)
            return result
        } *
        getById(id) {
            let result = yield app.mysql.get('course_table_detail_student', { id })
            return result
        } *
        update(info) {
            let result = yield app.mysql.update('course_table_detail_student', info)
            return result
        } *
        getAllSuspensionAndClasstransfer(page, termId, limit) {
            const list = yield app.mysql.query(`
            SELECT
            *
            FROM  course_table_detail_student
            LEFT JOIN student ON course_table_detail_student.studentId=student.id 
            WHERE course_table_detail_student.termId=? AND status!="正常" LIMIT ${Number(limit)} OFFSET ${(page - 1) * Number(limit)}`, [termId]);
            var count = yield app.mysql.query("select count(*) from course_table_detail_student  WHERE termId=? AND status!='正常'", [termId])
            console.log(list)
            var result = {
                list: list,
                total: count[0]['count(*)']
            };
            return result;
        }
    }
    return courseTableDetailStudent;
};