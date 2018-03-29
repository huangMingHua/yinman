module.exports = app => {
  class curriculum extends app.Service {
    * add(body) {
      console.log(body);
      const curriculumNames = body.name;
      const n = yield app.mysql.select('curriculum', { where: { name: curriculumNames } });
      if (n.length == 0) {
        const newDate = app.moment();
        yield app.mysql.insert('curriculum', { name: curriculumNames, date: newDate.format('YYYY-MM-DD hh:mm:ss') });
        var result = {
          message: '添加成功',
          boff: true,
        };
      } else {
        var result = {
          message: '已经存在了',
          boff: false,
        };
      }
      return result;
    }
    * getById(id) {
      return yield app.mysql.get('curriculum', { id });
    }
    *
      getAll() {
        const result = yield app.mysql.select('curriculum');
        return result;
      } *
      getPaging(page, limit) {
        const list = yield app.mysql.select('curriculum', { limit: Number(limit), offset: (page - 1) * limit });
        const count = yield app.mysql.query('select count(*) from curriculum');
        const result = {
          list,
          pages: Math.ceil(count[0]['count(*)'] / limit),
        };
        return result;
      } *
      delete(id) {
        const result = yield app.mysql.delete('curriculum', { id });
        return result;
      // return result;
      //     const date = this.ctx.request.body.date
      // var delCurriculum = yield this.ctx.model.curriculum.remove({ 'date': date })
      // if (delCurriculum.result.n > 0) {
      //     this.ctx.response.body = {
      //         msg: "删除成功",
      //         boff: true
      //     }
      // } else {
      //     this.ctx.response.body = {
      //         msg: "删除失败",
      //         boff: false
      //     }
      // }
      } *
      query(name) {
        const result = yield app.mysql.select('curriculum', { where: { name } });
        return result;
      }
  }
  return curriculum;
};
