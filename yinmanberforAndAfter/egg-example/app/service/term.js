module.exports = app => {
  let terms = null;
  class Term extends app.Service {
        /*
         * 获取当前活跃的学期
         */
    *
        getCurrentId() {
          const info = yield this.getCurrent();
          if (info) {
            return info.id;
          }
          return 0;
        }

    *
        getCurrent() {
            // const termId = yield this.getCurrentId();
            // return yield this.getById(termId);
          const list = yield this.getAll();
          const now = app.moment().hours(0).minutes(0).seconds(0).millisecond(0);
          for (const term of list) {
            if (term.startDate <= now && term.endDate >= now) {
              return term;
            }
          }
          return yield this.getNext();
            // return app.lodash.maxBy(list, 'startDate');
        }

    *
        getNext() {
          const list = yield this.getAll();
          const now = app.moment().hours(0).minutes(0).seconds(0).millisecond(0);
          const term = app.lodash.minBy(app.lodash.filter(list, function(i) {
            return app.moment(i.startDate).unix() > app.moment(now).unix();
          }), 'startDate');
          return term;
            // return app.lodash.maxBy(list, 'startDate');
        }

    *
        getById(id) {
                // const info = yield app.mysql.get('term', { id });
                // return info;
          id = parseInt(id);
          const list = yield this.getAll();
          const info = app.lodash.find(list, { id });
          if (info) {
            return info;
          }
          return null;
        }
            /**
             *
             * @param {array} ids
             */
    *
            getTerms(ids) {
                // const result = yield app.mysql.query('select * from term where id in (?) order by startDate DESC', [ids.join(',')]);
                // return result;
              const list = yield this.getAll();
              return app.lodash.orderBy(app.lodash.filter(list, function(item) {
                return app.lodash.includes(ids, item.id);
              }), [ 'startDate' ], [ 'desc' ]);
            }

    *
        getAll() {
          const list = yield app.mysql.query('select * from term WHERE isDelete=0 order by startDate ASC');
          terms = list;
          return JSON.parse(JSON.stringify(terms));
        } *
            getList(page, limit) {
              const list = yield app.mysql.query(`select * from term WHERE isDelete=0 order by startDate DESC limit  ${(page - 1) * limit} ,${Number(limit)}`);
              let totalCount = yield app.mysql.query('select count(*) from term   WHERE isDelete=0 order by startDate DESC');
              totalCount = totalCount[0]['count(*)'];
              const result = {
                list,
                totalCount,
              };
              return result;
            } *
            add(name, startDate, endDate, belowClass1, belowClass2, numberOfRequests1, numberOfRequests2, numberOfRequests3, registrationNotes, noticeOfReservation) {
              yield app.mysql.insert('term', { name, startDate, endDate, belowClass1, belowClass2, numberOfRequests1, numberOfRequests2, numberOfRequests3, registrationNotes, noticeOfReservation });
              terms = null;
            } *
            update(body) {
              const term = yield app.mysql.update('term', body);
              terms = null;
              return term;
            }
    * getTeacherList() {
      const result = yield app.mysql.query('SELECT term.id,course_table_detail.id As courseTableDetailId FROM term LEFT JOIN course_table_detail ON term.id = course_table_detail.termId WHERE course_table_detail.openEnrollment="是" AND course_table_detail.isDel = 0 ORDER BY term.startDate DESC');
      return result;
    }
    }
  return Term;
};
