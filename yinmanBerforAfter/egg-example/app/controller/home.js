'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    * getSign() {
        const sign=yield this.ctx.model.home.find({ userId:"003bbpRh2HOJSE0T4sRh2xF5Rh2bbpRu"})
        console.log(sign[0].sign)
        this.ctx.body=sign[0].sign
    }
  }
  return HomeController;
};
