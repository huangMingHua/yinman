module.exports = function(app) {
  app.role.use('isAdmin', function() {
    const username = this.cookies.get('adminname', {
      encrypt: true,
    });
    return !!username;
  });


  app.role.failureHandler = function(action) {
    this.body = { code: 2, msg: '请先登陆' };
        // if (this.acceptJSON) {
        // this.body = { target: loginURL, stat: 'deny' };
        // } else {
        // this.realStatus = 200;
        // this.redirect(loginURL);
        // }
  };
};
