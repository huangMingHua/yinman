// pages/home/home.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
        var appInstance =getApp()
        function myAsyncFunc() {
          return new Promise(function (resolve, reject) {
                appInstance.post("/","", function(res){
                      resolve(res)
                  }); 
              });
        }
       async function demo(){
               var result = await myAsyncFunc();
               console.log(result.data);
       }
       demo()
  },
  onReady: function () {
    // 页面渲染完成
     
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})