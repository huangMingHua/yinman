// pages/student/myCourse/applyLessons/applyLessons.js
Page({
    data: {
        //教室下拉框数据
        leaveTime: ['请选择'],
        result: "",
        studentName: '',
        prompt:'',
        courseTableDetail:{},
        courseTableItemStudents: [],
        leaveIndex: 0,
        reason: "",
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "申请请假"
        })
        var appInstance = getApp()
        //获取学生
        this.getStudent();
        this.getLeave(options.courseTableId);
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    getStudent(){
      var appInstance = getApp();
      appInstance.ajax("/student/getById", { id: wx.getStorageSync('studentId') }, 'get', (res) => {
        this.setData({ studentName: res.data.name })
      })
    },
    getLeave(courseTableDetailId){
      var appInstance = getApp();
      appInstance.ajax("/courseTable/getClassTimeClassLeave", { courseTableDetailId: courseTableDetailId,studentId: wx.getStorageSync('studentId') }, 'get', (res) => {
        if (res.data.code) {
          if (res.data.data) {
            let { courseTableDetailStudent, courseTableItemStudents, courseTableDetail} = res.data.data
            //注意事项
            this.data.prompt = ['注意事项', `1、本课程你总共请假${Math.abs(courseTableDetailStudent.numberOfleave)}次`, '2、请提前两天请假，2天内的课程请假算作旷课，不算请假']
            //请假时间下拉框
            for (let item of courseTableItemStudents){
               let dateTime = item.date+" "+item.startTime+"~"+item.endTime
               this.data.leaveTime.push(dateTime)
            }
            this.setData({ prompt: this.data.prompt, courseTableDetail: courseTableDetail, courseTableItemStudents: courseTableItemStudents, leaveTime: this.data.leaveTime})
          }   
        }
      })
    },
    leaveChange: function(e) {
       console.log(e)
       let index=e.detail.value
       this.setData({leaveIndex:index})
    },
    bindKeyInput(e){
      this.setData({
        reason: e.detail.value
      })
    },
    //提交事件
    formSubmit: function(e) {
      if (this.data.leaveIndex===0) {
        wx.showToast({
          title: '请选择请假时间',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      if (!this.data.reason) {
        wx.showToast({
          title: '请假原因',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      var appInstance = getApp()
      let selectId = this.data.courseTableItemStudents[this.data.leaveIndex-1].id 
      appInstance.ajax("/courseTable/addClassLeave", {
        courseTableDetailId: this.data.courseTableDetail.id,
        courseTableItemId: selectId,
        reason: this.data.reason,
        studentId: wx.getStorageSync('studentId')
      }, "post", (res) => {
        if (res.data.code == 1) {
          wx.showToast({
            title: '请假成功',
            icon: 'none',
            duration: 5000,
          })
          setTimeout(() => {
            wx.navigateBack({
              url: '/pages/student/myCourse/myCourse',
            })
          }, 5000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 5000
          })
        }
      }) 
    }
})