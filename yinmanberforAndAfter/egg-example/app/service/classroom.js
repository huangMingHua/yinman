module.exports = app => {
    class Classroom extends app.Service { *
        getAll(page, limit) {
                // <<<<<<< HEAD
                //                 const list = yield app.mysql.select('classroom', { limit: 10, offset: (page - 1) * 10 });
                //                 const pages = yield app.mysql.select('classroom');
                //                 const result = {
                //                     list: list,
                //                     pages: Math.ceil(pages.length / 10)
                // =======
                // const list = yield app.mysql.select('classroom', { limit: 10, offset: page - 1 });
                // const pages = yield app.mysql.select('classroom');
                // const result = {
                //     list: list,
                //     pages: Math.ceil(pages.length / 10)
                // }
                // return result;
                const list = yield app.mysql.select('classroom');
                if (page) {
                    const list1 = app.lodash.take(app.lodash.slice(list, (page - 1) * limit), limit);
                    return {
                        list: list1,
                        pages: Math.ceil(list.length / limit),
                    };
                    //   6e54e6f200987ac4131576d695a5e8327bc740f5
                }
                return list;

            } *
            getById(id) {
                // var list = yield this.getAll();
                // var result = app.lodash.find(list, function(ii) {
                //     return ii.id == id;
                // });
                const info = yield app.mysql.get('classroom', { id });
                return info;
            } *
            add(body) {
                const date = new Date().getTime();
                const result = yield app.mysql.insert('classroom', { name: body.classroom, isPiano: body.isPiano, date });
                return result;
            } *
            delete(id) {
                const ERR_OK = yield app.mysql.delete('classroom', { id: id });
                return ERR_OK.affectedRows == 1;
            } *
            getByName(name) {
                return yield app.mysql.get('classroom', { name: name });
            } *
            updates(id, name, isPiano) {
                console.log(111)
                const result = yield app.mysql.update('classroom', { id, name, isPiano });
                return
            }
    }
    return Classroom;
};