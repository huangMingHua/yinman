// pages/teacher/teacherComment/teacherComment.js
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
    classroom:{},
    course:{},
    courseTableItem:{},
    student:{},
    studentUser:{},
    comment:'',
    teacher:{},
    teacherUser:{},
    commentList:[],
    commentValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let { courseTableItemId=0, studentId =0} = options;
    if (courseTableItemId===0||studentId===0){
       return
    }
    var appInstance = getApp();
    appInstance.ajax("/courseTable/getCommentDetail", { courseTableItemId: courseTableItemId, studentId: studentId }, "get", (response) => {
      let res = response.data
      if (res.code == 1) {
        this.setData({ classroom: res.data.classroom, course: res.data.course, courseTableItem: res.data.courseTableItem, student: res.data.student, studentUser: res.data.user})
        this.getCommentList()
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
  bindInputComment(e){
    this.setData({ comment: e.detail.value})
  },
  getCommentList(){
    var appInstance = getApp();
    appInstance.ajax("/student/getCommentList", { courseTableItemId: this.data.courseTableItem.id, studentId: this.data.student.id, teacherId: wx.getStorageSync('teacherId'), comment: this.data.comment, }, "get", (response) => {
      let res = response.data
      if (res.code == 1) {
        let {teacher,teacherUser,list}=res.data
        this.setData({ commentList: list, teacher: teacher, teacherUser: teacherUser})
      } else {
        wx.showToast({
          icon: 'none',
          title: '数据出错',
        })
      }
    });
  },
  addMoment(){
    var appInstance = getApp();
    if (this.data.comment===''){
      return wx.showToast({
        icon:'none',
        title: '评价不能为空'
      })
    }
    appInstance.ajax("/student/addComment", { courseTableItemId: this.data.courseTableItem.id, studentId: this.data.student.id,teacherId:wx.getStorageSync('teacherId'),comment:this.data.comment }, "post", (response) => {
      let res = response.data
      if (res.code == 1) {
        this.getCommentList();
        this.setData({ comment: '', commentValue:''})
      } else {
        wx.showToast({
          icon: 'none',
          title: '数据出错',
        })
      }
    });
  }
})