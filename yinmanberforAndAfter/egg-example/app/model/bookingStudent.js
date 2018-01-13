/**
 * Created by rhino on 2017-04-13.
 */
module.exports = mongoose => {
  const bookingStudentCourse = new mongoose.Schema({
    name: { type: String },
    sex: { type: String },
    dateOfBirth: { type: String },
    school: { type: String },
    parentName: { type: String },
    telephone: { type: String },
    address: { type: String },
    basics: { type: String },
    introduceBaby: { type: String },
    userId: { type: String },
  });

  return mongoose.model('bookingStudent', bookingStudentCourse);
};
