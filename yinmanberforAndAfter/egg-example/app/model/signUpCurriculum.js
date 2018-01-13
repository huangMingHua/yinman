/**
 * Created by rhino on 2017-04-13.
 */
module.exports = mongoose => {
  const signUpCurriculum = new mongoose.Schema({
    studentId: { type: String },
    curriculum: { type: String },
    userId: { type: String },
    times: { type: Array },
    state: { type: Number },
    createTime: { type: String },
  });

  return mongoose.model('signUpCurriculum', signUpCurriculum);
};
