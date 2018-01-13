module.exports = mongoose => {
  const rhythmCourse = new mongoose.Schema({
    name: { type: String },
    time: { type: String },
    category: { type: String },
    courseIntroduction: { type: String },
    picId: { type: String },
    creatTime: { type: String },
    updateTime: { type: String },
  });

  return mongoose.model('rhythmCourse', rhythmCourse);
};
