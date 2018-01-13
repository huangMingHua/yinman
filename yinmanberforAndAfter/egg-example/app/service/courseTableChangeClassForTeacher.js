module.exports = app => {
    class courseTableChangeClassForTeacher extends app.Service { *
        add(courseTableDetailStudentId, fromCourseTableItemId, toCourseTableItemId, reason, one, teacherId) {
                const result = yield app.mysql.insert('course_table_item_change_class_for_teacher', {
                    courseTableDetailStudentId,
                    fromCourseTableItemId,
                    toCourseTableItemId,
                    reason,
                    one,
                    teacherId
                });
            } *
            getByToCourseTableItemIdAndOne(toCourseTableItemId, one) {
                let result = yield app.mysql.get('course_table_item_change_class_for_teacher', { toCourseTableItemId, one })
                return result
            } *
            getByCourseTableDetailStudentIdAndOne(courseTableDetailStudentId, one) {
                let result = yield app.mysql.select('course_table_item_change_class_for_teacher', { where: { courseTableDetailStudentId, one } })
                return result
            } *
            getByCourseTableDetailStudentIdAndToCourseTableItemIdAndOne(courseTableDetailStudentId, toCourseTableItemId, one) {
                let result = yield app.mysql.get('course_table_item_change_class_for_teacher', { courseTableDetailStudentId, toCourseTableItemId, one })
                return result
            } *
            getByCourseTableDetailStudentId(courseTableDetailStudentId) {
                let result = yield app.mysql.select('course_table_item_change_class_for_teacher', { courseTableDetailStudentId })
                return result
            } *
            deleteById(id) {
                let result = yield app.mysql.delete('course_table_item_change_class_for_teacher', { id })
                return result
            } *
            update(info) {
                const result = yield app.mysql.update('course_table_item_change_class_for_teacher', info);
                return result
            } *
            getList(page, termId, limit) {
                // console.log((page - 1) * limit, limit)
                // const list = yield app.mysql.query('course_table_item_leave', {
                //     where: { termId: termId },
                //     orders: [
                //         ['id', 'desc']
                //     ],
                //     limit: limit,
                //     offset: (page - 1) * limit
                // });
                const list = yield app.mysql.query(`
                    SELECT
                    *
                    FROM  course_table_item_change_class_for_teacher
                    LEFT JOIN course_table_detail_student ON course_table_item_change_class_for_teacher.courseTableDetailStudentId=course_table_detail_student.id 
                    WHERE course_table_detail_student.termId=? LIMIT ${Number(limit)} OFFSET ${(page - 1) * Number(limit)}`, [termId]);
                var count = yield app.mysql.query("select count(*) from course_table_item_change_class_for_teacher LEFT JOIN course_table_detail_student ON course_table_item_change_class_for_teacher.courseTableDetailStudentId=course_table_detail_student.id WHERE termId=?", [termId])
                var result = {
                    list: list,
                    total: count[0]['count(*)']
                };
                return result;
            } *
            getListByTeacherIdAndtermId(termId, teacherId) {
                // console.log((page - 1) * limit, limit)
                // const list = yield app.mysql.query('course_table_item_leave', {
                //     where: { termId: termId },
                //     orders: [
                //         ['id', 'desc']
                //     ],
                //     limit: limit,
                //     offset: (page - 1) * limit
                // });
                const list = yield app.mysql.query(`
                    SELECT
                    *
                    FROM  course_table_item_change_class_for_teacher
                    LEFT JOIN course_table_detail_student ON course_table_item_change_class_for_teacher.courseTableDetailStudentId=course_table_detail_student.id 
                    WHERE course_table_detail_student.termId=? AND teacherId=?`, [termId, teacherId]);
                return list;
            }


    }
    return courseTableChangeClassForTeacher;
};