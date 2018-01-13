module.exports = mongoose => {
  const dataCreation = new mongoose.Schema({
    courseTableId: { type: String },
    courseTableDetailId: { type: String },
    teacherId: { type: String },
    date: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    classroomId: { type: String },
    courseId: { type: String },
  });

  return mongoose.model('courseTableItem', dataCreation);
};
