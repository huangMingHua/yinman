module.exports = app => {
    class studentComment extends app.Service {
          //添加教师评论
        * addComment(teacherId,courseTableItemId,studentId,comment,createTime) {
            let result=yield app.mysql.insert('student_comment', {
                teacherId,
                courseTableItemId,
                studentId,
                comment,
                createTime
            })
            return result
        }
        //得到评论列表
        *getCommentListByTeacherIdAndStudentIdAndcourseTableItemId(teacherId,studentId,courseTableItemId) { 
            let result = yield app.mysql.select('student_comment', { where: { teacherId, studentId, courseTableItemId } });
            return result;
        }
    }
    return studentComment;
};
  