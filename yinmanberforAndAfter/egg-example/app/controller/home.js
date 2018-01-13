'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    * getSign() {
    	console.log(this.ctx.request.body);
    	 if (this.ctx.request.body.state == 1) {

    	 	 const sign = yield this.ctx.model.home.update({ oppenid: this.ctx.request.body.oppenid }, { $set: { sign: 1 } });
       return;
    	 }
      const sign = yield this.ctx.model.home.find({ oppenid: this.ctx.request.body.oppenid });
      this.ctx.body = sign[0].sign;
    }
  }
  return HomeController;
};
