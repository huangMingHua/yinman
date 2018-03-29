'use strict';
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/courseTable.courseTableChangeClass.test.js', () => {
  it('should GET /courseTableChangeClass/getChangeClassDataForStudent', () => {
    return app.httpRequest()
      .get('/courseTableChangeClass/getChangeClassDataForStudent')
      .expect('{code:0,msg:"缺少参数"}')
      .expect(200);
  });
  it('should GET /courseTableChangeClass/getChangeClassDataForStudent', () => {
    return app.httpRequest()
      .get('/courseTableChangeClass/getChangeClassDataForStudent?courseTableItemId=dasafd&studentId=dsfd')
      .expect('{code:0,msg:"传入的参数不是数字"}')
      .expect(200);
  });
  it('should GET /courseTableChangeClass/getChangeClassDataForStudent', () => {
    return app.httpRequest()
      .get('/courseTableChangeClass/getChangeClassDataForStudent?courseTableItemId=12&12')
      .expect('{code:0,msg:"数据不存在"}')
      .expect(200);
  });
});
