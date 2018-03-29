// pages/student/myCourse/myCourse.js
Page({
    data: {
      semesterArr:[],
      semesterIndex:0,
      semesterArrJson:[],
      DateSatartEnd:'',
      termClass: [],
      classTimeClass: [],
      isShow:1,
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
        },
      ]
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
          title: "课程与请假"
        })
        let {studentId} = options
        if (studentId){
          wx.setStorageSync("studentId", studentId)
        }
        var appInstance = getApp()
        //获取学期
        appInstance.ajax("/courseTable/getCourTableDetailBystudentId", { studentId: wx.getStorageSync('studentId')}, "get", (res) => {
          if (res.data.code) {
            for (let i = 0; i < res.data.data.length;i++) {
              this.data.semesterArr[i] = res.data.data[i].name;
            }
            if (this.data.semesterArr.length===0){
              this.data.isShow = 0;
            }else{
              this.data.semesterArrJson = res.data.data
              this.data.DateSatartEnd = res.data.data[this.data.semesterIndex].startDate + '~' + res.data.data[this.data.semesterIndex].endDate
              this.getClass(this.data.semesterArrJson[this.data.semesterIndex].id)
            }
            this.setData({
              semesterArr: this.data.semesterArr,
              semesterArrJson: this.data.semesterArrJson,
              DateSatartEnd: this.data.DateSatartEnd,
              isShow: this.data.isShow
            })
            //初始化数据
          }else{
            wx.showToast({
              icon: 'none',
              title: '数据出错',
            })
          }
        })
    },
    onReady: function() {

        // 页面渲染完成
    },
    onShow: function(options) {
       

    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    semesterChange(e){
       this.data.semesterIndex = e.detail.value
       this.data.DateSatartEnd = this.data.semesterArrJson[this.data.semesterIndex].startDate + '~' + this.data.semesterArrJson[this.data.semesterIndex].endDate
       this.setData({ semesterIndex: this.data.semesterIndex, DateSatartEnd: this.data.DateSatartEnd})
       this.getClass(this.data.semesterArrJson[this.data.semesterIndex].id)
    },
    //得到这个学期的课程
    getClass(termId){
      this.data.termClass = [];
      this.data.classTimeClass = [];
      var appInstance = getApp()
      appInstance.ajax("/courseTable/getMyAllCourseByStudentIdAndTermId", { studentId: wx.getStorageSync('studentId'), termId }, "get", (res) => {
        if (res.data.code) {
          for (let item of res.data.data) {
            if (item.dayOfWeek){
              this.data.termClass.push(item)
            }else{
              this.data.classTimeClass.push(item)
            }
          }
          console.log(this.data.classTimeClass,"课时课")
          this.setData({ termClass: this.data.termClass, classTimeClass: this.data.classTimeClass})
        } else {
          wx.showToast({
            icon: 'none',
            title: '数据出错',
          })
        }
      })    
    }
})