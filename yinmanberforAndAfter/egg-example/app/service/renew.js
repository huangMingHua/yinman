module.exports = app => {
    /**
     * 续课
     */
  class renew extends app.Service {
    get db() {
      return this.ctx.conn ? this.ctx.conn : this.app.mysql;
    }

    *
        add(termId, courseDetailId, studentId, times) {
            // dayOfWeek, startTime, endTime,
          const now = app.moment().format('YYYY-MM-DD HH:mm:ss');
          const result = yield this.db.insert('renew', {
            termId,
            courseDetailId,
            studentId,
            times: JSON.stringify(times),
            state: '待审核',
            updateTime: now,
            createTime: now,
          });
        }

    *
        update(info) {
          yield this.db.update('renew', info);
        }

    *
        getById(id) {
          return yield this.db.get('renew', { id });
        }

    *
        get(courseDetailId, studentId) {
          const info = yield this.db.get('renew', { courseDetailId, studentId });
          if (info != null) {
            info.times = JSON.parse(info.times);
          }
          return info;
        }

    *
        getList(page, limit, termId, studentId = 0) {
          let where = { termId };
          if (studentId > 0) {
            where = Object.assign(where, { studentId });
          }
          const list = yield this.db.select('renew', {
            where,
            orders: [
                    [ 'id', 'desc' ],
            ],
            limit,
            offset: (page - 1) * limit,
          });
          const count = yield this.db.query('select count(*) from renew');
          return {
            total: count[0]['count(*)'],
            list,
          };
        }
    }
  return renew;
};
