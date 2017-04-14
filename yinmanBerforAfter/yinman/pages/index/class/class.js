/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/pages/home/class/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// pages/class/class.js
Page(_defineProperty({
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    index: 0,
    dateData: {
      date: '2016-09-01',
      time: '12:01'
    },
    dateArr: []
  },
  onLoad: function onLoad() {
    var date = new Date();
    // console.log(date.getMonth()+1)
    this.setData({ "dateData.date": date.getFullYear() + "-" + this.addZero(date.getMonth() + 1) + "-" + this.addZero(date.getDate()) });
    this.setData({ "dateData.time": this.addZero(date.getHours()) + "-" + this.addZero(date.getMinutes()) });
  },
  bindPickerChange: function bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value
    });
  },
  bindDateChange: function bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      "dateData.date": e.detail.value
    });
  },
  bindTimeChange: function bindTimeChange(e) {
    this.setData({
      "dateData.time": e.detail.value
    });
  },
  bindDateChange1: function bindDateChange1(e) {
    var index = e.currentTarget.dataset.index;
    this.data.dateArr[index].date = e.detail.value;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      dateArr: this.data.dateArr
    });
  },
  bindTimeChange1: function bindTimeChange1(e) {
    var index = e.currentTarget.dataset.index;
    this.data.dateArr[index].time = e.detail.value;
    this.setData({
      dateArr: this.data.dateArr
    });
  },
  add: function add(event) {
    var date = new Date();
    // console.log(date.getMonth()+1)
    if (this.data.dateArr.length < 2) {
      this.data.index++;
      this.data.dateArr.push({
        date: date.getFullYear() + "-" + this.addZero(date.getMonth() + 1) + "-" + this.addZero(date.getDate()),
        time: this.addZero(date.getHours()) + "-" + this.addZero(date.getMinutes())
      });
      this.setData({ dateArr: this.data.dateArr });
    }
  },
  del: function del(event) {
    var index = event.currentTarget.dataset.index;
    this.data.dateArr.splice(index - 1, 1);
    this.setData({ dateArr: this.data.dateArr });
  },
  formSubmit: function formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
  },
  addZero: function addZero(obj) {
    console.log(obj);
    var str = "";
    return str = obj < 10 ? "0" + obj : "" + obj;
  },
  submit: function submit() {
    var appInstance = getApp();

    // function myAsyncFun(){
    //   return  new Promise(function(resolve,reject){
    //        appInstance.ajax("/sendBookingCourse",)
    //   })

    // }


    wx.showToast({
      title: "提交成功"
    });
  }
}, 'formSubmit', function formSubmit(e) {
  console.log('form发生了submit事件，携带数据为：', e.detail.value);
}));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);