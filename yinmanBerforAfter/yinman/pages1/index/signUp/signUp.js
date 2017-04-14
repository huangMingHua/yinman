// pages/signUp/signUp.js
Page({
  data: {
    array: ['请选择', '中国', '巴西', '日本'],
    arrayDay: ['每周一', '每周二', '每周三', '每周四', '每周五'],
    index: 0,
    indexDay: 0,
    time: '08:00',
    timeEnd: '08:00',
    dateArr: []
  },
  onLoad: function () {
    var date=new Date
     this.setData({timeEnd:this.addZero(date.getHours())+":"+this.addZero(date.getMinutes()),time:this.addZero(date.getHours())+":"+this.addZero(date.getMinutes())})
  },
  bindPickerChange: function (e) {
    // 改变添加的序号
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChangeDay: function (e) {
    // 改变删除的序号
    this.setData({
      indexDay: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    // 改变添加的开始的时间
    this.setData({
      time: e.detail.value
    })
  },
  bindTimeChangeEnd: function (e) {
    // 改变添加的结束的时间
    var obj = {
      timeEnd: e.detail.value
    }
    this.setData(obj)
  },
  bindPickerChangeDay: function (e) {
    // 改变报名课程
    this.setData({
      indexDay: e.detail.value
    })
  },
  bindTimeChange1: function (e) {
    //  获取删除的序号改变当前开始时间的
    var index = e.currentTarget.dataset.index
    this.data.dateArr[index].time = e.detail.value
    this.setData({
      dateArr: this.data.dateArr
    })
  },
  bindTimeChangeEnd1: function (e) {
    //  获取删除的序号改变当前结束时间
    var index = e.currentTarget.dataset.index
    this.data.dateArr[index].timeEnd = e.detail.value
    this.setData({
      dateArr: this.data.dateArr
    })
  },
  bindPickerChangeDay1: function (e) {
    //  获取删除的序号改变当前序号
    var index = e.currentTarget.dataset.index
    this.data.dateArr[index].indexDay = e.detail.value
    this.setData({
      dateArr: this.data.dateArr
    })
  },

  add: function () {
    //  添加dateArr，通过dateArr循环删除的内容，并把相关的初始值赋给dateArr
    var date = new Date
    // console.log(date.getMonth()+1)
    if (this.data.dateArr.length < 2) {
      this.data.dateArr.push({
        indexDay: 0,
        time: this.addZero(date.getHours()) + "-" + this.addZero(date.getMinutes()),
        timeEnd: this.addZero(date.getHours()) + "-" + this.addZero(date.getMinutes())
      })
      this.setData({ dateArr: this.data.dateArr })
    }
  },
  del: function (event) {
    // 删除dateArr相关一项
    var index = event.currentTarget.dataset.index
    this.data.dateArr.splice(index - 1, 1)
    this.setData({ dateArr: this.data.dateArr })
  },
  addZero: function (obj) {
    //  把获取的时间小于10改成01
    var str = ""
    return str = obj < 10 ? "0" + obj : "" + obj
  },
  submit:function(){
     wx.showToast({
        title: '报名成功',
        icon: 'success',
        duration: 2000
      })
  }
})