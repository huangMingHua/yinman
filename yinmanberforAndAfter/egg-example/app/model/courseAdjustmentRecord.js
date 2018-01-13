module.exports = mongoose => {
  const dataCreation = new mongoose.Schema({
    name: { type: String },
    curriculum: { type: String },
    originalTeacher: { type: String },
    originalTime: { type: String },
    originalClassroom: { type: String },
    leaveTime: { type: String },
    newTeacher: { type: String },
    newTime: { type: String },
    classroom: { type: String },
    reason: { type: String },
    studetnId: { type: String },
    teacherId: { type: String },
    number: { type: Number },
  });

  return mongoose.model('courseAdjustmentRecord', dataCreation);
};
