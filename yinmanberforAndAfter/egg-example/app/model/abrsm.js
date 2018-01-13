module.exports = mongoose => {
  const getSignSchema = new mongoose.Schema({
    content: { type: String },
  });

  return mongoose.model('abrsm', getSignSchema);
};
