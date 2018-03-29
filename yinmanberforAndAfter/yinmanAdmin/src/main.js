// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import elementUi from 'element-ui'
import routes from './router-config'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-default/index.css'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import moment from 'moment';
import momentlocale from 'moment/locale/zh-cn'
import VueHtml5Editor from 'vue-html5-editor'
import lodash from 'lodash'
console.log(process.env.NODE_ENV)
let url = '/api/upload/upload'
if (process.env.NODE_ENV == 'production') {
    url = '/upload/upload'
}
var options = {
    // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效 
    // global component name
    name: "vue-html5-editor",
    // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
    // if set true,will append module name to toolbar after icon
    showModuleName: false,
    // 自定义各个图标的class，默认使用的是font-awesome提供的图标
    // custom icon class of built-in modules,default using font-awesome
    icons: {
        text: "fa fa-pencil",
        color: "fa fa-paint-brush",
        font: "fa fa-font",
        align: "fa fa-align-justify",
        list: "fa fa-list",
        link: "fa fa-chain",
        unlink: "fa fa-chain-broken",
        tabulation: "fa fa-table",
        image: "fa fa-file-image-o",
        hr: "fa fa-minus",
        eraser: "fa fa-eraser",
        undo: "fa-undo fa",
        "full-screen": "fa fa-arrows-alt",
        info: "fa fa-info",
    },
    // 配置图片模块
    // config image module
    image: {
        // 文件最大体积，单位字节  max file size
        sizeLimit: 500 * 1024,
        // 上传参数,默认把图片转为base64而不上传
        // upload config,default null and convert image to base64
        upload: {
            url: url,
            headers: {},
            params: {},
            fieldName: {}
        },
        // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
        // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
        // set null to disable compression
        compress: null,
        // 响应数据处理,最终返回图片链接
        // handle response data，return image url
        uploadHandler(response) {
            //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
            var json = JSON.parse(response)
            console.log(response)
            if (!json.ok) {
                alert(json.msg)
            } else {
                return json.data
            }
            // return "http://ym.ipet66.com/" + json.res.picPath
        }
    },
    // 语言，内建的有英文（en-us）和中文（zh-cn）
    //default en-us, en-us and zh-cn are built-in
    language: "zh-cn",
    // 自定义语言
    i18n: {
        //specify your language here
        "zh-cn": {
            "align": "对齐方式",
            "image": "图片",
            "list": "列表",
            "link": "链接",
            "unlink": "去除链接",
            "table": "表格",
            "font": "文字",
            "full screen": "全屏",
            "text": "排版",
            "eraser": "格式清除",
            "info": "关于",
            "color": "颜色",
            "please enter a url": "请输入地址",
            "create link": "创建链接",
            "bold": "加粗",
            "italic": "倾斜",
            "underline": "下划线",
            "strike through": "删除线",
            "subscript": "上标",
            "superscript": "下标",
            "heading": "标题",
            "font name": "字体",
            "font size": "文字大小",
            "left justify": "左对齐",
            "center justify": "居中",
            "right justify": "右对齐",
            "ordered list": "有序列表",
            "unordered list": "无序列表",
            "fore color": "前景色",
            "background color": "背景色",
            "row count": "行数",
            "column count": "列数",
            "save": "确定",
            "upload": "上传",
            "progress": "进度",
            "unknown": "未知",
            "please wait": "请稍等",
            "error": "错误",
            "abort": "中断",
            "reset": "重置"
        }
    },
    // 隐藏不想要显示出来的模块
    // the modules you don't want
    hiddenModules: [],
    // 自定义要显示的模块，并控制顺序
    // keep only the modules you want and customize the order.
    // can be used with hiddenModules together
    visibleModules: [
        "color",
        // "font",
        "align",
        "image",
        "undo",
        "eraser",
        "full-screen",
    ],
    // 扩展模块，具体可以参考examples或查看源码
    // extended modules
    modules: {
        //omit,reference to source code of build-in modules
    }
}
Vue.use(VueHtml5Editor, options)

Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.use(elementUi)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(moment)

import Layout from './components/Layout'
import Search from './components/Search'
Vue.component(Layout.name, Layout)
Vue.component(Search.name, Search)

//import CourseTableDetail from './components/courseTables/CourseTableDetail';
//Vue.component(CourseTableDetail.name, CourseTableDetail);

import auth from './auth'


axios.interceptors.response.use(function(response) {
    //console.log(response);
    if (response.data.code && response.data.code == 2) {
        window.location.href = '/#/login';
    }
    return response;
}, function(error) {
    // Do something with response error
    return Promise.reject(error);
});

axios.interceptors.request.use(function(config) {
    //console.log(config)
    if (process.env.NODE_ENV === "production") {
        config.url = config.url.replace('/api/', '/')
    }
    return config;
});

moment.locale('zh-cn', {
    week: {
        dow: 1, // Monday is the first day of the week.
    }
});
/**
 * 获取某天在某个时间段內是第几周
 */
moment.getWeekIndex = function(startDate, endDate, date) {
    if (!startDate || !endDate || !date) {
        return -1;
    }
    startDate = moment(startDate);
    endDate = moment(endDate);
    date = moment(date);
    var days = endDate.diff(startDate, 'days');
    var index = 0;

    for (let i = 0; i <= days; i++) {
        let tempDate = moment(startDate).add(i, 'day');
        if (tempDate.format('YYYY-MM-DD') == startDate.format('YYYY-MM-DD') || tempDate.weekday() == 0) {
            index++;
        }
        if (tempDate.format('YYYY-MM-DD') == date.format('YYYY-MM-DD')) {
            return index;
        }
    }
    return 1;
}

//console.log(moment());
Vue.prototype.$moment = moment;
// Vue.prototype._ = lodash;

const vuex_store = new Vuex.Store({
    state: {
        curriculumNames: ""
    }

})

const router = new VueRouter({
    mode: 'hash',
    base: __dirname,
    routes
})
router.beforeEach((to, from, next) => {
    if (!auth.loggedIn() && to.name !== 'login') {
        next({
            path: "/login",
            redirect: '/login'
        })
    } else {
        next()
    }
})
Vue.filter('viewDate', date => {
    return moment(date).format('YYYY-MM-DD');
});
Vue.filter('viewFullDate', date => {
    return moment(date).format('YYYY-MM-DD HH:mm');
});
Vue.filter('viewTime', date => {
    if (typeof date == 'string' && date.length == 8) {
        date = moment('2017-01-01 ' + date);
    }
    return moment(date).format('HH:mm');
});
Vue.filter('viewShortDate', date => {
    return moment(date).format('MM-DD');
});
Vue.filter('viewHouAndSec', date => {
    if (!date) {
        return
    }
    return date = date.substr(0, 5);
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,

    store: vuex_store,
    template: '<App/>',
    components: { App },

})