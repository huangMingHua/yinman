'use strict';

module.exports = app => {
  class continuedEducationController extends app.Controller {
    * fun() {
      if (this.ctx.request.body.state == 0) {
        	console.log(this.ctx.request.body);
        yield this.ctx.model.continuedEducation.create(this.ctx.request.body);

      }


    }
    * get() {


    }
  }
  return continuedEducationController;
};
