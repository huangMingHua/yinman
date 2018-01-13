<template>
 <div class="box">
      <com-user :user="user.user"></com-user>
      <div class="el-dialog__header">
             <span class="el-dialog__title">学生信息</span>
      </div>
      <com-student :student="user"></com-student>
      <div class="btns">
            <el-button>取消</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
      </div> 
</div>       
</template>
<script>
 import comUser from '../common/userInfo'
 import comStudent from '../common/studentInfo'
export default {
    props:['user'],
    data(){
        return {
            
        }
    },
    methods:{
        submit(){
            this.$emit('editStudent')
        }
    },
    components:{
        comUser,
        comStudent
    }
}
</script>
<style lang="less">
   .el-dialog__body{
       padding: 30px 0 !important;
   }
   .box{
       
   }
</style>


