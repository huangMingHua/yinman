module.exports = app => {
  return class honorRoll extends app.Service {
    * add(name, introduce, createTime, updateTime, path) {
      yield app.mysql.insert('honor_roll', {
        name,
        introduce,
        createTime,
        updateTime,
        path,
      });
    }

    * update(info) {
      yield app.mysql.update('honor_roll', info);
    }

    * getById(id) {
      return yield app.mysql.get('honor_roll', { id });
    }

    * delete(id) {
      yield app.mysql.delete('honor_roll', { id });
    }
    };
};
