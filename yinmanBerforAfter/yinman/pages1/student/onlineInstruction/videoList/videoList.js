// pages/student/onlineInstruction/videoList/videoList.js
Page({
  data: {
    videoArr: [
      { 
        src: "/images/icon/video.jpg",
        vedioName: "蓝色多瑙河钢琴曲自弹2",
        name: "学生:王子魏",
        update: "2017.02.23  22:00上传",
        comment: "未点评"
      },
      {
        src: "/images/icon/video.jpg",
        vedioName: "蓝色多瑙河钢琴曲自弹2",
        name: "学生:王子魏",
        update: "2017.02.23  22:00上传",
        teacher:"教师:王静雪",
        comment:"已点评" 
      },
    ]

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
  }
})