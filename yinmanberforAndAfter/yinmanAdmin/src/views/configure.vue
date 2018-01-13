<template>
   <p-layout>
      <el-form ref="ruleForm" label-width="43%" class="demo-ruleForm">
        <el-form-item  class="input" :label="config.key" v-for="(config, index) in list" :key="config.key">
          <el-input v-model="config.value"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
   </p-layout>
</template>
<script>
export default {
    name:"introduce",
    data(){
      return {
          list:[]
      }
    },
    created () {
        this.init()
    },
    methods:{
      init() {
        this.$http.get("/api/config/getAll").then((res) => {
          this.list = res.data
        })
      },
      submitForm() {
        this.$http.post('/api/config/update', { data: this.list }).then((res)=>{
          this.$message('更新成功')
        })
      }
    },
    watch:{
    }
  }
</script>
<style lang="less" scoped>
     .demo-ruleForm{
       margin-top: 30px;
       .input{
         margin: 20px 
       }
       .submit{
         margin-top: 50px;
       }
       .explanation-times{
         height: 50px;
         border-bottom: 1px solid #333;
         text-indent: -8.5em;
       }
     }
</style>
