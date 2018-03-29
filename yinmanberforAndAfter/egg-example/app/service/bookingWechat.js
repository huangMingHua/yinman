module.exports = app => {
  class bookingWechat extends app.Service {
    *
        add(bookingCourseId, sendTime) {
          const result = yield app.mysql.insert('booking_wetchat', {
            bookingCourseId,
            isSend: 0,
            sendTime,
          });
          return result.insertId;
        } *
            getListByIsSend() {
              const list = yield app.mysql.select('booking_wetchat', { where: { isSend: 0 } });
              return list;
            } *
            update(info) {
              yield app.mysql.update('booking_wetchat', info);
            }
    }
  return bookingWechat;
};
