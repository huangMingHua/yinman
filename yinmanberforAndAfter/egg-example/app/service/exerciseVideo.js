module.exports = app => {
  return class exerciseVideo extends app.Service {
    * add(title, name, path, createTime, updateTime) {
      yield app.mysql.insert('exercise_video', {
        title,
        name,
        path,
        createTime,
        updateTime,
      });
    }

    * update(info) {
      yield app.mysql.update('exercise_video', info);
    }

    * getById(id) {
      return yield app.mysql.get('exercise_video', { id });
    }

    * delete(id) {
      yield app.mysql.delete('exercise_video', { id });
    }
    };
};
