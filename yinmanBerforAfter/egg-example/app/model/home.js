/**
 * Created by rhino on 2017-04-13.
 */
module.exports = mongoose => {
    const getSignSchema = new mongoose.Schema({
        userId: { type: String  },
        sign: { type: String  }
    });

    return mongoose.model('getSign', getSignSchema);
}