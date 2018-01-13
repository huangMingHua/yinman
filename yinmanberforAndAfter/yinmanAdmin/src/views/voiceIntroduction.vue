<template>
    <div class="wrap">
     <ueditor :content="content" @get="change" ></ueditor>
     <el-button type="primary" @click="submit"   style="margin-top:50px;width:100px;">提交</el-button>
    </div>
</template>

<script>
import auth from '../auth'
import menus from '../nav-config'
import post from '../post'
import get from '../get'
import ueditor from '../components/ueditor/ueditor'
  export default {
      name:"introduce",
      data(){
      	return {
          content:"",
           id:""
        }
      },
      created () {
          this.initialCurriculum()
	    },
    methods:{
      initialCurriculum(){
          get('/api/voiceIntroduction/get').then((response) => { 
                 if (response.data.res) {
                    this.content=response.data.res.content
                    this.id=response.data.res.id
                }
           })
      },
      submit() {
           console.log(this.id)
      	    post('/api/voiceIntroduction/saveOrUpdatevoiceIntroductionInfo',
              {id:this.id,content:this.content
                    }).then((response) => { 
                    this.$message('提交成功');
           })
      },
     change(val){
            this.content=val
      },
  
    },
   components:{
     ueditor
   }
    
   }
</script>
<style lang="less" scoped>
     .wrap{
       margin:50px;
     }
</style>

