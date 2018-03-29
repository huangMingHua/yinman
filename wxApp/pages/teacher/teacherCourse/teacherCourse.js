// pages/teacher/teacherCourse/teacherCourse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classTableInfo: [
      // { 
      //   times:[
      //     {
      //       startTime:'08:30',
      //       endTime: '12.00'
      //     }, 
      //     {
      //       startTime: '12:30',
      //       endTime: '13.00'
      //     }
      //   ],
      //   number: [
      //     {
      //       signUpNum: 3,
      //       totalNum: 12
      //     },
      //     {
      //       signUpNum: 3,
      //       totalNum: 12
      //     }
      //   ]         
      // },
      // {
      //   times: [

      //   ],
      //   number: [

      //   ]
      // },
      // {
      //   times: [
      //     {
      //       startTime: '08:30',
      //       endTime: '12.00'
      //     },
      //     {
      //       startTime: '12:30',
      //       endTime: '13.00'
      //     }
      //   ],
      //   number: [
      //     {
      //       signUpNum: 3,
      //       totalNum: 12
      //     },
      //     {
      //       signUpNum: 3,
      //       totalNum: 12
      //     }
      //   ]
      // },
    ],
    courseTableItem: {},
    courseTableItems: [],
    index: 0,
    weekNum: '',
    weekIndex: '',
    cnum: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    wStartDate: '',
    wEndDate: '',
    newStartDate: '',
    courseTableDetailId: '',
    useNum: 0,
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
    ],
    teacherName:'',
    user: {},
    semesterArr:[],
    semesterIndex:0,
    terms: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let termId = options.termId;
    let teacherId = wx.getStorageSync('teacherId') 
    var appInstance = getApp();
    appInstance.ajax("/teacher/getTeamsByTeacherId", { teacherId: teacherId }, "get", (res) => {
      if (res.data.code === 1) {
        for (let i = 0; i < res.data.data.length; i++) {
          this.data.semesterArr[i] = res.data.data[i].name;
          if (termId == res.data.data[i].id) {
            this.data.semesterIndex = i;
            this.setData({ semesterIndex: this.data.semesterIndex })
          }
        }
        if (this.data.semesterArr.length === 0) {
          this.data.isShow = 0;
        } else {
          this.data.DateSatartEnd = res.data.data[this.data.semesterIndex].startDate + '~' + res.data.data[this.data.semesterIndex].endDate
          this.setData({ semesterArr: this.data.semesterArr, DateSatartEnd: this.data.DateSatartEnd, terms: res.data.data})
          this.getWeekClass(res.data.data[this.data.semesterIndex].startDate, res.data.data[this.data.semesterIndex].endDate); 
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '学期出错',
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
  //算出当前的第几周
  getWeekClass(startDate, endDate) {
    let sDate = new Date(startDate);
    let eDate = new Date(endDate);
    let sWeekDay = sDate.getDay();
    let eWeekDay = eDate.getDay();
    //如果sWeekDay是0是星期天把他改为7
    if (sWeekDay === 0 || eWeekDay === 0) {
      sWeekDay = 7;
      eWeekDay = 7;
    }
    //这一周第一天
    let sMon = (sWeekDay - 1) * 24 * 3600 * 1000;
    let eMon = (eWeekDay - 1) * 24 * 3600 * 1000;
    let sevenDay = 7 * 24 * 3600 * 1000;
    let newStartDate = new Date(sDate.getTime() - sMon);
    console.log(newStartDate, 11111)
    this.setData({ newStartDate: newStartDate })
    let newEndDate = new Date(eDate.getTime() - eMon + sevenDay);
    //相差的时间
    let diffTime = newEndDate.getTime() - newStartDate.getTime();
    let days = diffTime / (24 * 3600 * 1000);
    let date = new Date();
    let nowDate = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
    if (sDate.getTime() <= nowDate.getTime() && nowDate.getTime() <= eDate.getTime()) {
      for (let i = 0; i < days; i++) {
        if (newStartDate.getTime() === nowDate.getTime()) {
          console.log('相等了')
          break
        } else {
          if (newStartDate.getDay() === 1) {
            this.data.index++
          }
        }
        newStartDate = new Date(newStartDate.getTime() + 24 * 3600 * 1000)
      }
      this.setData({ index: this.data.index, weekNum: days / 7 })
    } else {
      this.setData({ weekIndex: this.data.weekIndex, weekNum: days / 7, index: 1 })
    }
    this.getDate(this.data.newStartDate)
  },
  getDate(startDate) {
    this.data.weekIndex = '';
    let indexString = this.data.index.toString();
    for (let i = 0; i < indexString.length; i++) {
      this.data.weekIndex += this.data.cnum[indexString.charAt(i)];
    }
    let weekNumTime = (this.data.index - 1) * 7 * 24 * 3600 * 1000;
    let sevenTime = 6 * 24 * 3600 * 1000;
    //算出第几周的开始日期
    let wStartDate = new Date(startDate.getTime() + weekNumTime);
    //算出第几周的结束日期
    let wEndDate = new Date(wStartDate.getTime() + sevenTime);
    this.data.wStartDate = this.zeroFill((wStartDate.getMonth() + 1)) + '/' + this.zeroFill(wStartDate.getDate());
    this.data.wEndDate = this.zeroFill((wEndDate.getMonth() + 1)) + '/' + this.zeroFill(wEndDate.getDate());
    this.setData({ wStartDate: this.data.wStartDate, wEndDate: this.data.wEndDate, weekIndex: this.data.weekIndex })
    this.getClass(wStartDate)
  },
  //上一周
  lastWeek() {
    if (this.data.index === 1) {
      return
    }
    this.data.index--;
    this.getDate(this.data.newStartDate);
    this.setData({ index: this.data.index });
  },
  //下一周
  nextWeek() {
    if (this.data.index >= this.data.weekNum) {
      return
    }
    this.data.index++;
    this.getDate(this.data.newStartDate);
    this.setData({ index: this.data.index });
  },
  //补零
  zeroFill(num) {
    if (typeof num != 'number') {
      return
    }
    let number
    num < 10 ? number = "0" + num : number = '' + num;
    return number
  },
  //得到每周课程
  getClass(wStartDate){
    let date = new Date(wStartDate);
    let startDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    var appInstance = getApp();
    appInstance.ajax("/courseTable/getWeekItems", { teacherId: wx.getStorageSync("teacherId"), termId: this.data.terms[this.data.semesterIndex].id, startDate: startDate}, "get", (res) => {
      for (let item of res.data.list) {
        for (let i=0;i<item.list.length;i++ ) {
          item.list[i].startTime = item.list[i].startTime.substring(0,5);
          item.list[i].endTime = item.list[i].endTime.substring(0,5);
          if (item.list[i].course.name.length > 6) {
            item.list[i].course.name = item.list[i].course.name.substring(0, 4); 
          }
        }
      }
      this.setData({ classTableInfo: res.data.list, teacherName: res.data.name, user: res.data.user})
      console.log(this.data.classTableInfo)
    });
  },
  //学期切换
  semesterChange(e) {
    this.data.semesterIndex = e.detail.value
    this.data.DateSatartEnd = this.data.terms[this.data.semesterIndex].startDate + '~' + this.data.terms[this.data.semesterIndex].endDate
    this.setData({ semesterIndex: this.data.semesterIndex, DateSatartEnd: this.data.DateSatartEnd })
    this.getWeekClass(this.data.terms[this.data.semesterIndex].startDate, this.data.terms[this.data.semesterIndex].endDate); 
  },
})