<template>
  <div>
     <div class="menu">
       <span class="menu-name">微信头像</span><span class="menu-content"><img class="menu-img" :src="editInfo.wxHead"/></span>
     </div>
     <div class="menu">
       <span class="menu-name">微信昵称</span><span class="menu-content">{{editInfo.wxName}}</span>
     </div>
     <div class="menu">
      <span class="warn" style="left:40px;">*</span><span class="menu-name">身份类别</span>
      <el-select class="menu-content" v-model="editInfo.state" :disabled="identity!==0?true:false" placeholder="请选择">
            <el-option
              v-for="item in typeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
       </div>
     <div class="menu">
       <span class="menu-name">备注</span><el-input  :rows="4" type="textarea" v-model="editInfo.remarks" class="menu-content" placeholder="请输入内容"></el-input>
     </div>
       <div class="btns"><el-button @click="back" class="btn">取 消</el-button><el-button class="btn" type="primary" @click="submit">提 交</el-button></div>
  </div>    
</template>
<script>
export default {
  name:"ldentity",
  props:["typeOption","editInfo","identity"],
  data(){
    return {
      value:"请选择",
      state:0
    }
  },
  methods:{
    submit(){
      this.$emit("typeOptionSubmit")
    },
    back(){
      this.$emit("typeOptionBack")
    },
    add(){
      this.$emit("studentList")
    }

  }
  
}
</script>
<style lang="less" scoped>
   .menu{
     margin: 20px;
   }
   .menu-name{
     margin-right: 20px;
     vertical-align: middle;
     display: inline-block;
     width: 100px;
     text-align: right;
   }
   .menu-img{
     width: 50px;
     height: 50px;
   }
   .menu-content{
     width: 300px;
     display: inline-block;
     vertical-align: middle;
   }
   .el-textarea{
     >textarea{
       height: 100px;
     }
   }
   .btns{
        margin: 20px;
        .btn{
          margin-right: 20px;
        }
   }

</style>

