// pages/student/signUpTeacherList/signUpTeacherList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    terms: [],
    termIndex: 0,
    termArray: [],
    teacherCourse: [],
    isShow: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "报名"
    })
    //全局ajax
    let appInstance = getApp();
    //获取学期
    new Promise((resolve, reject)=>{
      appInstance.ajax("/courseTable/getTerm", {studentId:wx.getStorageSync('studentId')}, "get", (res) => {
        if (res.data.code) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.data.terms[i] = res.data.data[i].name
            this.data.termArray[i] = {
              id: res.data.data[i].id,
              name: res.data.data[i].name
            }
          }
          resolve(this.data.terms, this.data.termArray)
          this.setData({ terms: this.data.terms, termArray: this.data.termArray })
        } else {
          wx.showToast({
            title: '数据出错',
            icon: 'success',
            duration: 5000
          })
        }
      });
    }).then(()=>{
      ///小程序获取教师列表 规则小程序显示的刚进去显示的内容 必须这个学期有课这个学期显示开始时间最晚的那个
      appInstance.ajax("/term/getTeacherList", {studentId:wx.getStorageSync('studentId')}, "get", (res) => {
        if (res.data.code) {
          if (res.data.data.length===0){
             this.setData({isShow:0});
             return
          }
          for (let i = 0; i < this.data.termArray.length; i++) {
              if (res.data.data[0].id === this.data.termArray[i].id) {
                this.data.termIndex = i;
                this.setData({ termIndex: this.data.termIndex })
                this.bindTermsChange()
                return
            }
          }
        } else {
          wx.showToast({
            title: '数据出错',
            icon: 'success',
            duration: 5000
          })
        }
      });
    })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindTermsChange(e){
    let appInstance = getApp();
    //修改学期
    if (!!e){
       this.setData({
         termIndex: e.detail.value
       })
    }
    let studentId = 0
    if (wx.getStorageSync("studentId")) {
      console.log(wx.getStorageSync("studentId"))
      studentId = wx.getStorageSync("studentId")
    }
    appInstance.ajax("/courseTable/getListBytermIdAndOpenEnrollment", { termId: this.data.termArray[this.data.termIndex].id, studentId: studentId}, "get", (res) => {
      if (res.data.code) {
        console.log(res.data.data)
        this.setData({ teacherCourse: res.data.data })
      } else {
        wx.showToast({
          title: '数据出错',
          icon: 'success',
          duration: 5000
        })
      }
    });
    
  },
  //跳转页面
  clickButton(e){
    wx.navigateTo({
      url: `/pages/student/signUpTeacher/signUpTeacher?teacherId=${e.target.dataset.teacher}&termId=${this.data.termArray[this.data.termIndex].id}`
    })
  }
})