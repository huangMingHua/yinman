module.exports = app => {
  class schoolTransferCourse extends app.Service {
    *
        createCourseInfo(nTermId, iClassSchedulingTime, iMakeupTime, iReason) {
          const createTime = new Date();
          const result = yield app.mysql.insert('school_transfer_course', {
            nTermId,
            iClassSchedulingTime,
            iMakeupTime,
            iReason,
            createTime: createTime.getFullYear() + '-' + (createTime.getMonth() + 1) + '-' + createTime.getDate() + ' ' + createTime.getHours() + ':' + createTime.getMinutes() + ':' + createTime.getSeconds(),
          });
          return result;
        } *
            getAll(nTermId) {
              const result = yield app.mysql.select('school_transfer_course', {
                where: { nTermId },
                orders: [
                        [ 'id', 'desc' ],
                ],
              });
              for (const item of result) {
                const date = new Date(item.createTime);
                item.createTime = app.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
              }
              return result;
            }
    }
  return schoolTransferCourse;
};
