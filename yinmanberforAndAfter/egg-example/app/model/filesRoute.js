module.exports = mongoose => {
  const mongodb = new mongoose.Schema({
    filename: { type: String },
  });

  return mongoose.model('filesRoute', mongodb);
};
