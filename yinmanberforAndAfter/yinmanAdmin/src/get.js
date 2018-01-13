import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
const get=function(url){
		     return axios({
		            method:"get",
		            url: url
		        })
}
export default get