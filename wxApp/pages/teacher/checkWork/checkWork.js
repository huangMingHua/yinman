// pages/teacher/checkWork/checkWork.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cnum: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    levels: [
      {
        id: 1,
        name: '无等级'
      },
      {
        id: 2,
        name: 'A'
      },
      {
        id: 3,
        name: 'B'
      },
      {
        id: 4,
        name: 'C'
      },
      {
        id: 5,
        name: 'D'
      }
    ],
    classroom: {},
    teacher: {},
    teacherUser: {},
    courseName: {},
    courseTableItem: {},
    courseTableItemStudents:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.courseTableItemId);
  },
  getData(courseTableItemId){
    var appInstance = getApp();
    appInstance.ajax("/courseTable/checkWork", { courseTableItemId: courseTableItemId, teacherId: wx.getStorageSync('teacherId') }, "get", (response) => {
      let res = response.data
      if (res.code == 1) {
        let { classroom, teacher, teacherUser, courseName, courseTableItem, courseTableItemStudents } = res.data
        for (let item of courseTableItemStudents){
          if (courseTableItem.isChecked===0){
             item.isGoClass=1
          }
        }
        this.setData({ classroom: classroom, teacherUser: teacherUser, teacher: teacher, courseName: courseName, courseTableItem: courseTableItem, courseTableItemStudents: courseTableItemStudents })
      } else {
        wx.showToast({
          icon: 'none',
          title: '数据出错',
        })
      }
    });
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
  select(e){
    for (let item of this.data.courseTableItemStudents){
      if (item.id === e.currentTarget.dataset.id){
        item.isGoClass === 1 ? item.isGoClass = 0 : item.isGoClass=1;
       }
    }
    this.setData({ courseTableItemStudents: this.data.courseTableItemStudents})
  },
  submit(){
    var appInstance = getApp();
    wx.showModal({
      title: '确认考勤',
      content: '确认考勤之后无法修改',
      success:  (res)=> {
        if (res.confirm) {
          appInstance.ajax("/courseTable/checkWorkSubmit", { courseTableItemId: this.data.courseTableItem.id, courseTableItemStudents: this.data.courseTableItemStudents }, "post", (response) => {
            this.getData(this.data.courseTableItem.id);
          }); 
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
     
  }
})