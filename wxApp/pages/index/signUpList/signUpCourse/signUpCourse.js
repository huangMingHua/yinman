// pages/index/signUpList/signUpCourse/signUpCourse.js
var WxParse = require('../../../../wxParse/wxParse.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
      tabBarIndex: 0,  
      termIndex: 0,
      terms: ['请选择'],
      objectTerms: [{id:0,name:'请选择'}],
      courseIndex: 0,
      courses: ['请选择'],
      teacherIndex: 0,
      teacheres:['请选择'],
      weekIndex: 0,
      weeks: ['请选择'],
      cycleIndex: 0,
      cycles: ['请选择'],
      appInstance: getApp()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "我要报名"
        })
        this.init()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    //tabBar切换
    tabBarSwitch1() {
      
    },
    tabBarSwitch2() {
      console.log(2)
    },
    //固定课程初始化学期数据
    init() {
      let appInstance = getApp();
      appInstance.ajax("/courseTable/getTerm", '', "get", (res) => {
        if (res.data.code == 1) {
          for (let [index, item] of res.data.data.entries()) {
            this.data.terms[index + 1] = item.name;
            this.data.objectTerms[index + 1] = {
                id: item.id,
                name: item.name
            }
          };
          this.setData({ 
            terms: this.data.terms,
            objectTerms: this.data.objectTerms,
            aTermData: res.data.data });
        }
      });
    },
    //学期的改变
    bindTermChange(e){
      this.setData({termIndex: e.detail.value});
      if (Number(e.detail.value)) {
        let appInstance = getApp();
        appInstance.ajax("/courseTable/getApplicableCourseByTermId", { termId: this.data.objectTerms[this.data.termIndex].id, studentId: wx.getStorageSync('studentId') }, "get", (res) => {
          if (res.data.code == 1) {
            console.log(res)
          }
        })

      }
    },
    //课程的改变
    bindCourseChange(){

    },
    bindTeacherChange(){

    },
    bindWeekChange(){

    },
    bindCycleChange(){

    },

})