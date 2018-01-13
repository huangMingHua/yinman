module.exports = mongoose => {
  const dataCreation = new mongoose.Schema({
    courseTableId: { type: String },
    teacherId: { type: String },
    courseId: { type: String },
    classroomId: { type: String },
    dayOfWeek: { type: String },

    startTime: { type: String },
    endTime: { type: String },


  });

  return mongoose.model('courseTableDetail', dataCreation);
};
