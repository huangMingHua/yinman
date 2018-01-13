<template>
  <div class="p-wrap" >
              <div>
                <span class="warn" style="left:140px;">*</span>
                <span class="span" >课程名称</span>
                <el-input v-model="curriculum.name" class="input" placeholder="请输入名称"></el-input>
              </div>
              <div>
                <span class="span" >课程说明</span>
                <!-- <el-input v-model="curriculum.courseDescription" :rows='6' col class='textarea' type="textarea" placeholder="请输入内容">
                </el-input> -->
                <ueditor class="ueditor" :content="curriculum.courseDescription" @get="change" ></ueditor>
              </div>
            <div class="btns"><el-button class="btn" @click="back">取消</el-button><el-button  type="primary" @click="submit" >提交</el-button> </div>
          </div>
</template>
<script>
import ueditor from '../ueditor/ueditor'
export default {
   props:['curriculum','typeOption'],
   name:"course",
   data(){
     return{
       content:''
     }
   },
   methods:{
       back(){
         this.$emit("back")
       },
       submit(){
         this.$emit("submit")
       },
       change(val){
           this.curriculum.courseDescription=val
           if(this.curriculum.courseDescription.length>230){
                this.curriculum.courseDescription=this.curriculum.courseDescription.substr(0,210)
                this.$message('只能输入230文字')
           }
       }
   },
   components:{
      ueditor
    }
}
</script>
<style lang="less" scoped>
  .p-wrap{
    width:1000px;
      >div:nth-child(1){
        margin-bottom: 20px;
      }
      .input{
        width:300px;
      }
      .span{
        margin-left: 160px;
        display:inline-block;
        width:100px;
        text-align:left;
        vertical-align:middle;
        vertical-align: middle;
      }
      .span:nth-of-type(1){
        margin-left: 175px;
      }
      .textarea{
        width:500px;
        vertical-align: middle;
      }
      .btn{
        margin-right:20px;
      }
      .btns{
        text-align: center;
        border-top:1px solid #c3c3c3; 
        margin: 20px auto 0 auto !important;
        padding: 20px 0;
        width: 86%;
      }
      .ueditor{
        display: inline-block;
        width: 600px;
        height: 300px;
        vertical-align: middle;
      }
    }

</style>


