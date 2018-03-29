module.exports = () => {
  return function* errorHandler(next) {
    try {
      console.log(this.originalUrl);
            // console.log(this.body);
      yield next;
            // console.log(this.body);
    } catch (err) {
      this.app.emit('error', err, this);

      this.body = {
        code: 0,
        msg: err.message,
      };
    }
  };
};
