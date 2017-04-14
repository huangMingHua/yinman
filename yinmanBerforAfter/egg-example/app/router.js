'use strict';

module.exports = app => {
  app.post('/', 'home.getSign');
  app.post('/sendBookingCourse', 'student.sendBookingCourse');
};
