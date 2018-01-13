/**
 * Created by rhino on 2017-04-13.
 */
module.exports = mongoose => {
  const student = new mongoose.Schema({
    name: { type: String },
    sex: { type: String },
    dateOfBirth: { type: String },
    school: { type: String },
    parentName: { type: String },
    telephone: { type: String },
    address: { type: String },
    userId: { type: String },
    createTime: { type: Date },
  });

  return mongoose.model('student', student);
};
