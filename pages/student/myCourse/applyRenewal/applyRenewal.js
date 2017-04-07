// pages/student/myCourse/applyRenewal/applyRenewal.js
Page({
  data: {
    //续课类型
    array: ['按原时间续课', '换时间续课'],
    //续课索引
    index: 0,
    //单选框索引
    radioIndex: 0,
     //温馨提示
    prompt: ["温馨提示","1、请在本学期课程到期前2周联系教务缴费，即可锁定课程时间。", ""],
    //上课时间每周索引
    daysIndex: 0,
    //上课时间时间索引
    timesIndex: 0,
    //上课时间获取到时间的数组
    times: [],
    //上课时间获取教室
    position: "",
    //其他时间添加的数据
    otherTimeAdd:{
      index:0,
      array: ["每周一", "每周二", "每周三", "每周四","每周五"],
      time1: '12:01',
      time2: '12:01',
    },
    //通过push del数据
     delArr:[],
    //单选框数据
    items: [
      { name: 1, value: '默认时间', checked: 'true' },
      { name: 2, value: '其他时间', }
    ],
    //上课时间数据
    objTime: {
      days: ["每周一", "每周二", "每周三", "每周四"],
      times: [{ day: "每周一", times: ["10:00~10:30", "11:00~12:30"] }, { day: "每周二", times: ["13:00~14:30", "15:00~15:30"] }, { day: "每周三", times: ["16:00~16:30", "17:00~17:30"] }],
      positions: [{ day: "每周一", time: "10:00~10:30", position: "二楼南" }, { day: "每周一", time: "11:00~12:30", position: "二楼北" }, { day: "每周二", time: "13:00~14:30", position: "二楼西" }, { day: "每周二", time: "15:00~15:30", position: "二楼南" }, { day: "每周三", time: "16:00~16:30", position: "一楼北" }, { day: "每周三", time: "17:00~17:30", position: "一楼南" }]
    }
  },
  //续课类型事件
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
      if(e.detail.value==0){
          this.setData.radioIndex=0
        
      }else{
          this.setData.radioIndex=1
      }

    this.setData({
      index: e.detail.value,
      radioIndex:this.setData.radioIndex
    })
  },
    //第一次进来上课时间每周的事件
  bindDayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      daysIndex: e.detail.value
    })
    this.getPositon(this.data.objTime.days[e.detail.value], this.getTimes(this.data.objTime.days[e.detail.value])[0])
  },
  //第一次进来上课时间时间的事件
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timesIndex: e.detail.value
    })
    this.getPositon(this.data.objTime.days[this.data.daysIndex], this.getTimes(this.data.objTime.days[this.data.daysIndex])[e.detail.value])
  },
  onLoad: function (options) {
    //第一次进来上课时间的默认值
    this.getPositon(this.data.objTime.days[0], this.getTimes(this.data.objTime.days[0])[0])
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
  },
  //提交事件
  submit: function () {
    wx.showToast({
      title: "续课成功"
    })
  },
  //通过objTime.days得到数组时间
  getTimes: function (day) {
    var time = ""
    for (var i = 0; i < this.data.objTime.times.length; i++) {
      if (day == this.data.objTime.times[i].day) {
        time = this.data.objTime.times[i].times
      }
    }
    this.setData({
      times: time,
    })
    return time
  },
  //通过objTime.times得到对应地点
  getPositon: function (day, time) {
    var positions = ""
    for (var i = 0; i < this.data.objTime.positions.length; i++) {
      if (day == this.data.objTime.positions[i].day && time == this.data.objTime.positions[i].time) {
        positions = this.data.objTime.positions[i].position
      }
    }
    this.setData({
      position: positions
    })
  },
  //单选框事件
  radioChange: function (e) {
      if(e.detail.value==1){
          this.data.radioIndex=1
      }else{
          this.data.radioIndex=2
      }
    this.setData({ radioIndex: this.data.radioIndex })
  },
  // 自定义事件第一个每周改变
  bindOtherTimeAddChange:function(e){
       this.data.otherTimeAdd.index=e.detail.value
       this.setData({otherTimeAdd:this.data.otherTimeAdd})
  },
  // 自定义事件第一个时间开始改变
  bindTimeStartChange:function(e){
       this.data.otherTimeAdd.time1=e.detail.value
       this.setData({otherTimeAdd:this.data.otherTimeAdd})
  },
   // 自定义事件第一个结束改变
  bindTimeEndChange:function(e){
       this.data.otherTimeAdd.time2=e.detail.value
       this.setData({otherTimeAdd:this.data.otherTimeAdd})
  },
  //添加数据节点
  add:function(){
      this.data.delArr.push({index:0,
      array: ["每周一", "每周二", "每周三", "每周四","每周五"],
      time1: '12:01',
      time2: '12:01'})
      this.setData({delArr:this.data.delArr})
      console.log(this.data.delArr)
    },
    //删除每周改变
    bindOtherTimeDelChange:function(e){
        var index = e.currentTarget.dataset.index
        this.data.delArr[index].index=e.detail.value
        this.setData({
          delArr: this.data.delArr
        })

    }
    ,
    //删除时间开始改变
   bindTimeDelStartChange:function(e){
      var index = e.currentTarget.dataset.index
      this.data.delArr[index].time1=e.detail.value
      this.setData({
        delArr: this.data.delArr
      })
   },
      //删除时间结束改变
   bindTimeDelEndChange:function(e){
      var index = e.currentTarget.dataset.index
      this.data.delArr[index].time2=e.detail.value
      this.setData({
        delArr: this.data.delArr
      })
   },
    //删除删除节点
   bindTimeDel:function(e){
         var index=e.currentTarget.dataset.index
         this.data.delArr.splice(index,1)
         this.setData({ delArr: this.data.delArr })

   }
})