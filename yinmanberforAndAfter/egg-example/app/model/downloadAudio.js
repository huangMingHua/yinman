module.exports = mongoose => {
  const downloadAudio = new mongoose.Schema({
    title: { type: String },
    explain: { type: String },
    picId: { type: String },
    creatTime: { type: String },
    updateTime: { type: String },
  });

  return mongoose.model('downloadAudio', downloadAudio);
};
