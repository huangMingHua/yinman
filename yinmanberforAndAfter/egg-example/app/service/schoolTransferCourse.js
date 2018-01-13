module.exports = app => {
    class schoolTransferCourse extends app.Service { *
        createCourseInfo(nTermId, iClassSchedulingTime, iMakeupTime, iReason) {
                let createTime = new Date()
                let result = yield app.mysql.insert('school_transfer_course', {
                    nTermId,
                    iClassSchedulingTime,
                    iMakeupTime,
                    iReason,
                    createTime: createTime.getFullYear() + "-" + (createTime.getMonth() + 1) + "-" + createTime.getDate() + " " + createTime.getHours() + ":" + createTime.getMinutes() + ":" + createTime.getSeconds()
                })
                return result
            } *
            getAll(nTermId) {
                let result = yield app.mysql.select('school_transfer_course', {
                    where: { nTermId },
                    orders: [
                        ['id', 'desc']
                    ]
                })
                for (let item of result) {
                    let date = new Date(item.createTime)
                    item.createTime = app.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                }
                return result
            }
    }
    return schoolTransferCourse;
};