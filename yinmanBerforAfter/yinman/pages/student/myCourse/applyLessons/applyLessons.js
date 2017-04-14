// pages/student/myCourse/applyLessons/applyLessons.js
Page({
  data:{
    //教室下拉框数据
   array: ['请选择','美国', '中国', '巴西', '日本'],
   //日期初始的虚拟号
   index: 0,
   //日期选择
   arrDate:["2016-09-01","2016-09-01"],
    //时间选择
   arrTime:["12:01","12:01"],
   //温馨提示内容
   prompt:["1、每学期每节课因私原因仅限调课2次，本课程你已调课0次， 剩余2次。","2、请提前2天调课，2天内的课程不允许调课"]
  },
    //教室下拉框时间
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
    //时间选择下拉框事件
  bindTimeChange: function(e) {
      this.data.arrTime[e.currentTarget.dataset.index]=e.detail.value
    this.setData({arrTime:this.data.arrTime})
  },
     //日期选择下拉框事件
  bindDateChange: function(e) {
     this.data.arrDate[e.currentTarget.dataset.index]=e.detail.value
      this.setData({
        arrDate:this.data.arrDate
      })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //提交事件
   submit:function(){
      wx.showToast({
        title:"调课成功"
      })

  }
})