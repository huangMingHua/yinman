/**
 * 学生的课程信息
 */
module.exports = mongoose => {
  const studentCurriculum = new mongoose.Schema({
    curriculumId: { type: String },
    studentId: { type: String },
    timeSlotArray: { type: Array },
    createBy: { type: String },
    createTime: { type: Date },
  });

  return mongoose.model('studentCurriculum', studentCurriculum);
};
