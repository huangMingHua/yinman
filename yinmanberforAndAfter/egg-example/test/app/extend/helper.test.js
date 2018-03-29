'use strict';

describe('test/app/extend/helper.test.js', () => {
  // it('should app auto init on setup.js', () => {
  //   // app is auto init at `test/.setup.js`
  //   assert(app);
  //   assert(mock);
  //   // mock alias
  //   assert(mm);
  //   assert(request);
  // });

  it('测试时间段是否会有冲突', () => {
    const ctx = app.mockContext();

    assert(ctx.helper.durationConflict('2017-05-01', '2017-07-01', '2017-04-01', '2017-08-01') === true);

    assert(ctx.helper.durationConflict('2017-05-01', '2017-07-01', '2017-06-01', '2017-06-11') === true);
    assert(ctx.helper.durationConflict('2017-05-01', '2017-07-01', '2017-04-01', '2017-05-02') === true);
    assert(ctx.helper.durationConflict('2017-05-01', '2017-07-01', '2017-04-01', '2017-04-30') === false);
  });
});
