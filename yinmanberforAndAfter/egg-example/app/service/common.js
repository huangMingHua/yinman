module.exports = app => {
  class common extends app.Service {
    *
        query(sql, body) {
          const result = yield app.mysql.select(sql, { where: body });
          return result;
        }

    }
  return common;
};
