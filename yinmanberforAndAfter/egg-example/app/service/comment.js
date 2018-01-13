module.exports = app => {
    class Comment extends app.Service { *
        add(teacherId, courseDetailId, studentId, comment, createTime) {
                const result = yield app.mysql.insert("student_comment", {
                    teacherId,
                    courseDetailId,
                    studentId,
                    comment,
                    createTime
                });
                return result.insertId;
            } *
            getList(studentId, courseDetailId) {
                const result = yield app.mysql.select("student_comment", {
                    where: {
                        studentId: studentId,
                        courseDetailId: courseDetailId
                    }
                });
                return result
            } *
            getShowStudentLIst(studentId, teacherId, courseDetailId) {
                const result = yield app.mysql.select("student_comment", {
                    where: {
                        studentId: studentId,
                        teacherId: teacherId,
                        courseDetailId: courseDetailId
                    }
                });
                return result
            }
    }
    return Comment;
}