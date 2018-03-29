'use strict';

module.exports = app => {
  class classTimeClassController extends app.Controller {
    addClassTimeClass() {
      console.log(this.ctx.request.body);
    }
    }
  return classTimeClassController;
};
