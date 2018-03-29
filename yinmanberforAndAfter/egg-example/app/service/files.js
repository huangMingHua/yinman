module.exports = app => {
  return class files extends app.Service {
    * add(title, explain, path, createTime, updateTime, mimeType) {
      yield app.mysql.insert('downloadpic', {
        title,
        explain,
        path,
        createTime,
        updateTime,
        mimeType,
      });
    }

    * update(info) {
      yield app.mysql.update('downloadpic', info);
    }

    * getById(id) {
      return yield app.mysql.get('downloadpic', { id });
    }

    * getList(pageIndex, limit, types) {
      const list = yield app.mysql.select('downloadpic', {
        where: { mimeType: types },
        limit: Number(limit),
        offset: (pageIndex - 1) * limit,
      });
      const count = yield app.mysql.query('select count(*) from downloadpic where mimeType in (?)', types.join(','));
      return {
        list,
        totalCount: count[0]['count(*)'],
      };
    }

    * delete(id) {
      yield app.mysql.delete('downloadpic', { id });
    }
    };
};
