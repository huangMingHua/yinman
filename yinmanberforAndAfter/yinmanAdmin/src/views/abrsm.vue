<template>
    <div class="wrap">
     <ueditor :content="content" @get="change"></ueditor>
     <el-button type="primary" @click="submit" style="margin-top:50px;width:100px;">提交</el-button>
    </div>
</template>

<script>
  import auth from '../auth'
  
  import menus from '../nav-config'
  
  import post from '../post'
  
  import get from '../get'
  import ueditor from '../components/ueditor/ueditor' 
  export default {
  
    name: "introduce",
  
    data() {
  
      return {
        content:"",
        id:""
      }
  
    },
  
    created() {
  
      this.initialCurriculum()
  
    },
  
    methods: {
  
      initialCurriculum() {
  
        get('/api/abrsm/get').then((response) => {
          if (response.data) {
              this.content=response.data.content
              this.id=response.data.id
          }
  
        })
  
      },
  
      submit() {
        post('/api/abrsm/saveOrUpdateAbrsmInfo', {
          content: this.content,
          id:this.id
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
    margin:20px;
  }
</style>

