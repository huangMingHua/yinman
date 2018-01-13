module.exports = mongoose => {
  const users = new mongoose.Schema({
        // state:判断有没有报名0没报过名1报过
    wxHead: { type: String },
    wxName: { type: String },
    openId: { type: String },
    state: { type: Number },
  });

  return mongoose.model('user', users);
};
