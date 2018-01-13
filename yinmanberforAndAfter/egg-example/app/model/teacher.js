/**
 * Created by rhino on 2017-04-13.
 */
module.exports = mongoose => {
  const teacher = new mongoose.Schema({
    identityCategory: { type: String },
    teacherName: { type: String },
    sex: { type: String },
    dateOfBirth: { type: String },
    phoneNumber: { type: Number },
    userId: { type: String },
  });

  return mongoose.model('teacher', teacher);
};
