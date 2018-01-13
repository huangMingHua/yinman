module.exports = mongoose => {
  const dataCreation = new mongoose.Schema({
    studentId: { type: String },
    teacherId: { type: String },
    courseTableDetailId: { type: String },
    status: { type: String },
  });

  return mongoose.model('studentRelatedCourse', dataCreation);
};
