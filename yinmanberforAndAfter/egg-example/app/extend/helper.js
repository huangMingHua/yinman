const isConflict = require('time-range-conflict');

module.exports = {
    /**
     * 格式化时间，去掉秒
     * @param {String} time 
     */
    formatTime(time) {
        var result = this.app.moment('2017-01-01 ' + time).format('HH:mm');
        return result;
    },
    formatDate(date) {
        return this.app.moment(date).format('YYYY-MM-DD');
    },
    formatDateTime(dateTime) {
        return this.app.moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
    },
    isMobile(str) {
        if (!str) return false;
        return /^1[34578]\d{9}$/.test(str);
    },
    durationConflict(startTime, endTime, startTime1, endTime1) {
        startTime = this.app.moment(startTime);
        endTime = this.app.moment(endTime);
        startTime1 = this.app.moment(startTime1);
        endTime1 = this.app.moment(endTime1);
        console.log(startTime, endTime, startTime1, endTime1)
        let x = {
            start: startTime,
            end: endTime
        };

        let y = {
            start: startTime1,
            end: endTime1
        };
        return isConflict(x, y);

        // Range covers other ?
        // if((startTime > startTime1) && (endTime > endTime1)) {
        //     return false;
        // }
        // // Range intersects with other start ?
        // if((startTime < startTime1) && (endTime < endTime1)) {
        //     return false;
        // }
        // // Range intersects with other end ?
        // // if((startTime <= endTime1) && (endTime1 <= endTime)) {
        // //     return false;
        // // }

        // // All good
        // return true;
    }
};