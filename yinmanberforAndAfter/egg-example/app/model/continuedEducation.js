module.exports = mongoose => {
  const dataCreation = new mongoose.Schema({
    	name: { type: String },
    type: { type: String },
    teacher: { type: String },
    curriculum: { type: String },
    originalClassroom: { type: String },
    originalTime: { type: String },
    date2: { type: String },
    date3: { type: String },
    timeType: { type: String },
    newTime: { type: String },
    newClassroom: { type: String },
    weekArray: { type: Array },
    studetnId: { type: String },
    teacherId: { type: String },
  });

  return mongoose.model('continuedEducation', dataCreation);
};
