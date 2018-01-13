module.exports = mongoose => {
  const competitionPresentation = new mongoose.Schema({
    title: { type: String },
    place: { type: String },
    time: { type: String },
    competitionPresentation: { type: String },
    picId: { type: String },
    creatTime: { type: String },
    updateTime: { type: String },
  });

  return mongoose.model('competitionPresentation', competitionPresentation);
};
