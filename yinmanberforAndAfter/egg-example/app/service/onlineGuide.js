module.exports = app => {
  return class onlineGuide extends app.Service {
    * add(title, explain, path, createTime, updateTime, mimeType, studentId, content, teacherId) {
      yield app.mysql.insert('online_guide', {
        title,
        explain,
        path,
        createTime,
        updateTime,
        mimeType,
        studentId,
        content,
        teacherId,
      });
    }

    * update(info) {
      yield app.mysql.update('online_guide', info);
    }

    * getById(id) {
      return yield app.mysql.get('online_guide', { id });
    }

    * getList(pageIndex, limit, studentId) {
      let list = [];
      let count = 0;
      if (studentId > 0) {
        list = yield app.mysql.select('online_guide', {
          where: { studentId },
          limit: Number(limit),
          offset: (pageIndex - 1) * limit,
        });
        count = yield app.mysql.query('select count(*) from online_guide where studentId =?', [ studentId ]);
      } else {
        list = yield app.mysql.select('online_guide', {
          limit: Number(limit),
          offset: (pageIndex - 1) * limit,
        });
        count = yield app.mysql.query('select count(*) from online_guide');
      }
      return {
        list,
        totalCount: count[0]['count(*)'],
      };
    }

    * delete(id) {
      yield app.mysql.delete('online_guide', { id });
    }
    };
};
