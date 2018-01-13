module.exports = app => {
    let configs = null;
    class Config extends app.Service {
        * getAll() {
            if(configs == null){
                const list = yield app.mysql.select('config');
                configs = list;
            }
            return configs;
        }

        *
        update(info) {
            const result = yield app.mysql.update('config', info);
            return result.affectedRows === 1;
        }

        *
        getByKey(key) {
            const list = yield this.getAll();
            return app.lodash.find(list, { key: key });
        }
    }

    return Config;
};