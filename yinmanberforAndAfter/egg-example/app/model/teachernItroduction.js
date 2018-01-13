module.exports = mongoose => {
  const teachernItroductionCreation = new mongoose.Schema({
    name: { type: String },
    sex: { type: String },
    education: { type: String },
    major: { type: String },
    school: { type: String },
    teachingSubjects: { type: String },
    professionalExperience: { type: String },
    picId: { type: String },
    creatTime: { type: String },
    updateTime: { type: String },
  });

  return mongoose.model('teachernItroduction', teachernItroductionCreation);
};
