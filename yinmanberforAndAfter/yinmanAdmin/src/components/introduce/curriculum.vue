<template>
  <div class="p-wrap">
    <div>
      <span class="warn" style="left:40px;">*</span><span class="span">课程名称</span>
  
      <el-input v-model="form.curriculum" class="input" placeholder="请输入课程名称"></el-input>
  
    </div>
  
    <div class="btns">
       <el-button class="back"  @click="back">取消</el-button>

       <el-button  @click="submit" type="primary">提交</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: "curriculum",
    props:['form'],
    data(){
      return{
      } 
     },
    methods:{
        submit(){
          this.$emit("submit")
        },
        back(){
          this.$emit("back")
        }
    }
  }
</script>
<style lang="less" scoped>
  .p-wrap {
    text-align: center;
    .span{
      display: inline-block;
      text-align: right;
      width: 100px;
      margin-right: 20px;
    }
    .input {
      width: 300px;
    }
    .btns{
      border-top:1px solid #c3c3c3; 
      margin: 20px auto 0 auto;
      padding: 20px 0;
      width: 86%;
    }
    .back{
      margin-right: 20px;
    }
  }
</style>