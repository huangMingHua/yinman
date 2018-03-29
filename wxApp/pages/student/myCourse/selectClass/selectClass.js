// pages/student/myCourse/selectClass/selectClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftShow: 1,
    rightShow: 1,
    classTableInfo:[
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
    user: {},
    term: {},
    teacher: {},
    courese: {},
    courseTableItem: {},
    courseTableItems:[],
    index: 0,
    weekNum: '',
    weekIndex:'',
    cnum : ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    wStartDate: '',
    wEndDate: '',
    newStartDate:'',
    courseTableDetailId: '',
    useNum:0,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let courseTableDetailId = options.courseTableId;
    var appInstance = getApp()
    appInstance.ajax("/courseTable/getSelectClass", { courseTableDetailId: courseTableDetailId,studentId: wx.getStorageSync('studentId') }, "get", (res) => {
      if (res.data.code) {
        let { user, teacher, course, courseTableItem, courseTableDetailStudent ,courseTableItems, term} = res.data.data; 
        console.log(courseTableDetailStudent);
        this.data.useNum=courseTableDetailStudent.classTimeNum -courseTableDetailStudent.selectNum
        this.setData({ user: user, courseTableDetailId: courseTableDetailId, teacher: teacher, course: course, courseTableItem: courseTableItem, courseTableItems: courseTableItems, term: term, useNum: this.data.useNum})
        this.getWeekClass(term.startDate, term.endDate);
      }else{
        wx.showToast({
          icon:'none',
          title: '数据出错',
        })
      }
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
  //算出当前的第几周
  getWeekClass(startDate,endDate){
     let sDate = new Date(startDate);
     let eDate = new Date(endDate);
     let sWeekDay = sDate.getDay();
     let eWeekDay = eDate.getDay();
     //如果sWeekDay是0是星期天把他改为7
     if (sWeekDay === 0 || eWeekDay===0){
       sWeekDay = 7;
       eWeekDay = 7;
     }
     //这一周第一天
     let sMon = (sWeekDay-1)*24 * 3600 * 1000;
     let eMon = (eWeekDay-1)* 24 * 3600 * 1000;
     let sevenDay = 7 * 24 * 3600 * 1000;
     let newStartDate = new Date(sDate.getTime() - sMon);
     console.log(newStartDate,11111)
     this.setData({ newStartDate: newStartDate})
     let newEndDate = new Date(eDate.getTime() - eMon + sevenDay);
     //相差的时间
     let diffTime = newEndDate.getTime() - newStartDate.getTime();
     let days = diffTime / (24 * 3600 * 1000);
     let date = new Date();
     let nowDate = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
     if (sDate.getTime() <= nowDate.getTime() && nowDate.getTime() <= eDate.getTime()){
       for (let i = 0; i < days;i++){
         if (newStartDate.getTime() === nowDate.getTime()){
           console.log('相等了')
            break
         }else{
           if (newStartDate.getDay() === 1) {
             this.data.index++
           }
         }
         newStartDate = new Date(newStartDate.getTime() + 24 * 3600 * 1000)
       }
       this.setData({ index: this.data.index, weekNum: days / 7})
     }else{
        this.setData({ weekIndex: this.data.weekIndex, weekNum: days / 7,index:1})
     }
     this.getDate(this.data.newStartDate)
  },
  //根据开始日期第几周算出显示第几周的日期
  getDate(startDate){
    this.data.weekIndex='';
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
    this.setData({ wStartDate: this.data.wStartDate, wEndDate: this.data.wEndDate,weekIndex: this.data.weekIndex })
    this.getClassTimeClass(wStartDate, wEndDate)
  },
  //上一周
  lastWeek(){
    if (this.data.index===1) {
      return
    }
    this.data.index--;
    this.getDate(this.data.newStartDate);
    this.setData({ index: this.data.index });
  },
  //下一周
  nextWeek(){
    if(this.data.index>=this.data.weekNum){
      return  
    }
    this.data.index++;
    this.getDate(this.data.newStartDate);
    this.setData({index:this.data.index});
  },
  //补零
  zeroFill(num){
    if(typeof num!='number'){
      return
    }
    let number
    num < 10 ? number = "0" + num : number=''+num;
    return number
  },
  //算出当前课程在不在当前周内
  getClassTimeClass(startDate, endDate){
    let classTableInfo = [] ;
    let startDate1 = startDate
    let endDateToString = startDate1.getFullYear() + '/' + (startDate1.getMonth() + 1) + '/' + (startDate1.getDate() + 1)
    let endDate1 = new Date(endDateToString)
    for (let i = 0; i < 7; i++) {
      let classTime={
        times:[],
        number:[]
      }
      for (let item of this.data.courseTableItems) {
        let time={
        }
        let num = {
        }
        let date = new Date(item.date);
        //判断课程时间与每一天对比
        console.log(startDate1, date, endDate1)
        if (startDate1.getTime() <= date.getTime() && date.getTime() < endDate1.getTime()) {
          time.id = item.id;
          time.index = item.index;
          time.startTime = item.startTime.substring(0,5);
          time.endTime = item.endTime.substring(0, 5);
          num.signUpNum = item.signUpNum;
          num.totalNum = item.number;
          classTime.times.push(time);
          classTime.number.push(num);
        }
      }
      this.setData({classTableInfo: classTableInfo})
      classTableInfo.push(classTime)
      //每次加一天
      startDate1 = endDate1
      let endDateToString = startDate1.getFullYear() + '/' + (startDate1.getMonth() + 1) + '/' + (startDate1.getDate() + 1)
      endDate1 = new Date(endDateToString)
    } 
  },
  //选择课程
  selectCalss(e){
    let id = e.currentTarget.dataset.id
    for (let item of this.data.classTableInfo){
      for (let it of item.times){
        if (it.id === id){
          if (it.index ===0){
            it.index = 1 ;
            this.data.useNum--;
            if (this.data.useNum == -1) {
              it.index = 0;
              this.data.useNum++;
              return wx.showToast({
                title: '你报名的次数用完',
                icon: 'none'
              })
            }
            this.setData({ useNum: this.data.useNum})
          }else if(it.index===1){
            it.index = 0 ;
            this.data.useNum++;
            this.setData({ useNum: this.data.useNum })
          }else{
            console.log('不做处理')
          }
        }
      }
    }
    this.setData({ classTableInfo: this.data.classTableInfo})
  },
  submit () {
    let courseTableItems=[]
    for (let item of this.data.classTableInfo) {
      for (let it of item.times) {
        if (it.index === 1) {
          courseTableItems.push(it.id)
        } 
      }
    }
    if (courseTableItems.length===0) {
       return wx.showToast({
         icon: 'none',
         title: '请选择课程',
       })   
    }
    var appInstance = getApp()
    appInstance.ajax("/courseTable/signUpClassTimeClass", { courseTableItems: courseTableItems, courseTableDetailId: this.data.courseTableDetailId ,studentId: wx.getStorageSync('studentId') }, "post", (res) => {
      if (res.data.code) {
        wx.showToast({
          icon: 'none',
          title: '提交成功',
          duration:5000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        },5000)
      }
    })
  }
})
