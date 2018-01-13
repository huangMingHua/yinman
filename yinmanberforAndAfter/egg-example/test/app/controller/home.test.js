'use strict';
// const mm = require('egg-mock');
// const assert = require('assert');

describe('test/app/controller/home.test.js', () => {
  it('should app auto init on setup.js', () => {
    // app is auto init at `test/.setup.js`
    assert(app);
    assert(mock);
    // mock alias
    assert(mm);
    assert(request);
  });

  // let app;
  // before(() => {
  //   app = mm.app();
  //   return app.ready();
  // });

  // afterEach(mm.restore);
  // after(() => app.close());

  it('should assert', () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));
  });

  // it('should GET /', () => {
  //   return app.httpRequest()
  //     .get('/')
  //     //.expect('hi, egg')
  //     .expect(200);
  // });
});
