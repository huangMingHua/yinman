module.exports = mongoose => {
  const upload = new mongoose.Schema({
    picPath: { type: String },
  });
  return mongoose.model('upload', upload);
};
