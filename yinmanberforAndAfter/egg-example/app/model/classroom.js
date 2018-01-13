module.exports = mongoose => {
  const dataCreation = new mongoose.Schema({
    name: { type: String },
    date: { type: Number },
  });

  return mongoose.model('classroom', dataCreation);
};
