module.exports = app => {
  class Course extends app.Service {
    *
        getAll(page) {
                // const result = yield this.ctx.model.course.find();
          const result = yield app.mysql.select('course', { where: { isDel: 0 } });
          return result;
        } *
            getPaging(page, limit) {
              console.log(page, limit);
              const list = yield app.mysql.select('course', { where: { isDel: 0 }, limit: Number(limit), offset: (page - 1) * limit });
              const count = yield app.mysql.query('select count(*) from course');
              const result = {
                list,
                pages: Math.ceil(count[0]['count(*)'] / limit),
              };
              return result;
            } *
            getById(id) {
                // console.log(id);
              const list = yield this.getAll();
                // console.log(list);
              const result = app.lodash.find(list, function(ii) {
                return ii.id == id;
              });
              return result;
            } *
            add(name, color, courseDescription) {
              const result = yield app.mysql.insert('course', { name, courseDescription, color });
              return result;
            } *
            modify(body) {
              const result = yield app.mysql.update('course', body.makeCouseCreate);
              return result;
            }
    * update(info) {
      const result = yield app.mysql.update('course', info);
      return result;
    }
    *
            getByName(name) {
              const info = yield app.mysql.get('course', { name,isDel:0 });
              return info;
            }
    }
  return Course;
};
