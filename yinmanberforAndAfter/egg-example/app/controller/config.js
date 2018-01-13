'use strict';

module.exports = app => {
    class ConfigController extends app.Controller { *
        getAll() {
            const list = yield this.ctx.service.config.getAll()
            this.ctx.body = list
        }

        *
        update() {
            let configs = this.ctx.request.body.data;

            for (let config of configs) {
                let info = yield this.service.config.getByKey(config.key);
                if (!info) continue;
                info.value = config.value;
                yield this.service.config.update(info);
            }
            this.success();
        }
    }
    return ConfigController;
};