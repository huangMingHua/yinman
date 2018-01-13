module.exports = app => {
    return class bookingCourseTime extends app.Service { 
        * add(bookingCourseId, time){
            yield app.mysql.insert('booking_course_time',{
                bookingCourseId:bookingCourseId,
                time:time
            });
        }

        * getList(bookingCourseId){
            let times = yield app.mysql.select("booking_course_time", { where: { bookingCourseId: bookingCourseId } });
            return times;
        }
    }
}