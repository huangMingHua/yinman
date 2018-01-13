module.exports = mongoose => {
  const exerciseVideo = new mongoose.Schema({
    title: { type: String },
    name: { type: String },
    picId: { type: String },
    creatTime: { type: String },
    updateTime: { type: String },
  });

  return mongoose.model('exerciseVideo', exerciseVideo);
};
