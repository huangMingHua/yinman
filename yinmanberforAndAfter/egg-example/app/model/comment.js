/**
 * Created by rhino on 2017-04-13.
 */
module.exports = mongoose => {
  const getSignSchema = new mongoose.Schema({
    creatTime: { type: String },
    teacherId: { type: String },
    teacherName: { type: String },
    currlumnId: { type: String },
    input: { type: String },
  });

  return mongoose.model('comment', getSignSchema);
};
