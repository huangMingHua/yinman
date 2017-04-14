// pages/class/class.js
Page({
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    index: 0,
    dateData:{
      date: '2016-09-01',
      time: '12:01',
    },
    dateArr:[
    ]
  },
  onLoad: function () {
    var date=new Date
    // console.log(date.getMonth()+1)
    this.setData({"dateData.date":date.getFullYear()+"-"+this.addZero(date.getMonth()+1)+"-"+this.addZero(date.getDate())})
     this.setData({"dateData.time":this.addZero(date.getHours())+"-"+this.addZero(date.getMinutes())})
  },
   bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      "dateData.date": e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      "dateData.time": e.detail.value
    })
  },
  bindDateChange1: function (e) {
       var index = e.currentTarget.dataset.index
       this.data.dateArr[index].date=e.detail.value
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateArr: this.data.dateArr
    })
  },
  bindTimeChange1: function (e) {
     var index = e.currentTarget.dataset.index
     this.data.dateArr[index].time=e.detail.value
    this.setData({
      dateArr: this.data.dateArr
    })
  },
  add: function (event) {
     var date=new Date
    // console.log(date.getMonth()+1)
    if (this.data.dateArr.length < 2) {
      this.data.index++
      this.data.dateArr.push( {
      date: date.getFullYear()+"-"+this.addZero(date.getMonth()+1)+"-"+this.addZero(date.getDate()),
      time: this.addZero(date.getHours())+"-"+this.addZero(date.getMinutes()),
    })
      this.setData({ dateArr: this.data.dateArr })
    }
  },
  del: function (event) {
     var index=event.currentTarget.dataset.index
     this.data.dateArr.splice(index-1,1)
     this.setData({ dateArr: this.data.dateArr })
  },
   formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  addZero:function(obj){
    console.log(obj)
     var str=""
     return str=obj<10?"0"+obj:""+obj
  },
  submit:function(){
      var appInstance=getApp();
      


      // function myAsyncFun(){
      //   return  new Promise(function(resolve,reject){
      //        appInstance.ajax("/sendBookingCourse",)
      //   })

      // }


      wx.showToast({
        title:"提交成功"
      })

  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  }
})