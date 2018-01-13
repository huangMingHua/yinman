module.exports = app => {
    class courseTableItemStudent extends app.Service {
        get db() {
                return this.ctx.conn ? this.ctx.conn : this.app.mysql;
            } *
            getByCourseTableItemIdNoleave(courseTableItemId) {
                const result = yield app.mysql.query(`SELECT * FROM course_table_item_student WHERE courseTableItemId=${courseTableItemId} AND status!='请假'`)
                return result[0];
            } *
            getByCourseTableItemIdNoleave1(courseTableItemId) {
                const result = yield app.mysql.query(`SELECT * FROM course_table_item_student WHERE courseTableItemId=${courseTableItemId} AND status!='请假'`)
                return result;
            } *
            getByCourseTableItemId(id, status) {
                let where = { courseTableItemId: id };
                if (status) {
                    where = app.lodash.assign(where, { status });
                }
                const list = yield this.db.select('course_table_item_student', { where });
                return list;
            } *
            getByCourseTableItemIdAndStudentId(id, studentId, status) {
                const where = { courseTableItemId: id, studentId, status };

                const list = yield this.db.select('course_table_item_student', { where });
                return list;
            } *
            getStudentByCourseTableItemIdAndStudentId(id, studentId) {
                const where = { courseTableItemId: id, studentId };
                const list = yield this.db.select('course_table_item_student', { where });
                return list;
            } *
            getCourseTableDetailStudentByCouseTableDetailIdAndStudentId(courseTableDetailId, studentId) {
                let result = yield app.mysql.select('course_table_detail_student', { where: { courseTableDetailId, studentId } })
                return result
            }
            /**
             * 添加，并且如果人满，则将course_table_item的空闲状态置为空
             * @param {*} courseTableItemId
             * @param {*} studentId
             * @param {*} status
             */

        /**
         * 得到每节课的学生长度
         */
        *
        getLengthByCourseTableItemId(courseTableItemId) {
            let list = yield app.mysql.query(`SELECT * FROM course_table_item_student WHERE courseTableItemId=${courseTableItemId} AND (status='补课' OR status='正常') `)
            return list.length
        }

        /**
         * 某节课里面有没有当前学生
         */
        *
        getLengthByCourseTableItemIdAndStudentId(courseTableItemId, studentId) {
            let list = yield app.mysql.query(`SELECT * FROM course_table_item_student WHERE courseTableItemId=${courseTableItemId} AND studentId=${studentId} AND (status='补课' OR status='正常' OR status='停课' OR status='转课') `)
            return list.length
        }
        /**
         * 
         * 查找当前学生的每节课
         */
        *
        getByCourseTableItemIdAndStudentIdAndStatus(courseTableItemId, studentId, status) {
            let get = yield app.mysql.query(`select * FROM course_table_item_student WHERE courseTableItemId=${courseTableItemId} AND studentId=${studentId} AND  status='${status}'`)
            return get[0]
        }
        /**
         * 某节课里面有没有当前学生（条件不一样）
         */
        *
        getLengthByCourseTableItemIdAndStudentId1(courseTableItemId, studentId) {
            let list = yield app.mysql.query(`SELECT * FROM course_table_item_student WHERE courseTableItemId=${courseTableItemId} AND studentId=${studentId} AND status!='请假'`)
            return list.length
        } *
        getLengthByCourseTableItemIdAndStudentId2(courseTableItemId, studentId) {
            let list = yield app.mysql.query(`SELECT * FROM course_table_item_student WHERE courseTableItemId=${courseTableItemId} AND studentId=${studentId} AND status!='请假'`)
            return list
        } *
        getByCourseTableItemIdAndStudentId1(courseTableItemId, studentId) {
            let list = yield app.mysql.query(`SELECT * FROM course_table_item_student WHERE courseTableItemId=${courseTableItemId} AND studentId=${studentId} AND status='正常'`)
            return list
        } *
        add(courseTableItemId, studentId, status, termId, teacherStatus) {
            let now = app.moment().format('YYYY-MM-DD HH:mm:ss');
            const result = yield this.db.insert('course_table_item_student', {
                courseTableItemId,
                studentId,
                status,
                termId,
                updateTime: now,
                createTime: now,
                teacherStatus
            });
            const id = result.insertId;
            yield this.autoUpdateStatus(courseTableItemId);
        }

        *
        autoUpdateStatus(courseTableItemId) {
            const toCourseTableItem = yield this.service.courseTableItem.getById(courseTableItemId);
            let toCourseTableItemStudents = yield this.service.courseTableItemStudent.getByCourseTableItemId(courseTableItemId, '正常');
            let toCourseTableItemStudents1 = yield this.service.courseTableItemStudent.getByCourseTableItemId(courseTableItemId, '补课');
            if (toCourseTableItemStudents1.length > 0) {
                toCourseTableItemStudents.push(toCourseTableItemStudents1)
            }
            // console.log(toCourseTableItemStudents.length, toCourseTableItem.number);
            if (toCourseTableItemStudents.length >= toCourseTableItem.number) { // 如果人数满了，则把状态置为空
                toCourseTableItem.status = '';
            } else {
                toCourseTableItem.status = '空闲';
            }
            yield this.service.courseTableItem.update(toCourseTableItem);
        }
        /**
         *获取请假的课程
         */
        *
        getLevelByCourseTableItemIdAndStudentId(courseTableItemId, studentId) {
            let result = yield app.mysql.get('course_table_item_student', { courseTableItemId, studentId, status: '请假' })
            return result
        } *
        update(info) {
            info.updateTime = app.moment().format('YYYY-MM-DD HH:mm:ss');
            const result = yield this.db.update('course_table_item_student', info);
            const updateSuccess = result.affectedRows === 1;
            return updateSuccess;
        } *
        deleteByCourseTableItemIdAndStudentIdAndStatus(courseTableItemId, studentId) {
            const result = yield app.mysql.delete('course_table_item_student', { courseTableItemId, studentId, status: '补课' })
            return result
        } *
        delete(courseTableItemId, studentId) {
            // const result = yield this.db.delete('course_table_item_student', {
            //     courseTableItemId,
            //     studentId,
            // });
            const result = app.mysql.query(`DELETE FROM  course_table_item_student WHERE courseTableItemId=${courseTableItemId} AND studentId=${studentId} AND status!='补课'`)
            yield this.autoUpdateStatus(courseTableItemId);
        }
    }
    return courseTableItemStudent;
};