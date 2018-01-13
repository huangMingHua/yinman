<template>
 <div class="box">
      <com-edit-user :userInfo='editInfo' :typeOption='typeOption' :identity='identity'></com-edit-user>
      <div class="btns">
            <el-button @click="back">取消</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
      </div> 
</div>       
</template>
<script>

 import comEditUser from '../common/editUserInfo'
export default {
    props:['editInfo','typeOption','identity'],
    data(){
        return {
            
            
        }
    },
    methods:{
       submit(){
        this.$emit("typeOptionSubmit")
       },
       back(){
         this.$emit("typeOptionBack")
        },
    },
    components:{
        comEditUser,
    }
}
</script>
<style lang="less" scoped> 
   .el-dialog__body{
       padding: 30px 0 !important;
   }
   .box{
       
   }
</style>


