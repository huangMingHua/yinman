/**
 * Created by rhino on 2017-04-13.
 */
module.exports = mongoose => {
  const sendBookingCourse = new mongoose.Schema({
    curriculum: { type: String },
    studentId: { type: String },
    createTime: { type: String },
    times: { type: Array },
    state: { type: Number },
    auditing: { type: Number },
    confirmedTime: { type: String },
  });

  return mongoose.model('bookingCourse', sendBookingCourse);
};
