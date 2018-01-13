/* 课程 */
module.exports = mongoose => {
  const curriculum = new mongoose.Schema({
    name: { type: String },
    date: { type: Number },
  });
  return mongoose.model('curriculum', curriculum);
};
