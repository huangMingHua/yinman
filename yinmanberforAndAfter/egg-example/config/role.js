module.exports = function(app) {
  app.role.use('isAdmin', function() {
    const username = this.cookies.get('adminname', {
      encrypt: true,
    });
    return !!username;
  });
  app.role.failureHandler = function(action) {
    this.body = { code: 2, msg: '请先登陆' };
  };
};
