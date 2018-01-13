module.exports = mongoose => {
  const dataCreation = new mongoose.Schema({
    name: { type: String },
    type: { type: String },
    time: { type: String },
  });

  return mongoose.model('course', dataCreation);
};
