module.exports = mongoose => {
  const dataCreation = new mongoose.Schema({
    number: { type: Number },
    teacherId: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
  });

  return mongoose.model('courseTable', dataCreation);
};
