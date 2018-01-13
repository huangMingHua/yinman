import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
const post=function(url,data){
		     return axios({
		            method:"post",
		            url: url,
		            data:data
		        })
}
export default post
