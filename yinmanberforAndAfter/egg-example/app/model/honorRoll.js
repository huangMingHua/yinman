module.exports = mongoose => {
  const honorRoll = new mongoose.Schema({
    name: { type: String },
    introduce: { type: String },
    picId: { type: String },
    creatTime: { type: String },
    updateTime: { type: String },
  });

  return mongoose.model('honorRoll', honorRoll);
};
