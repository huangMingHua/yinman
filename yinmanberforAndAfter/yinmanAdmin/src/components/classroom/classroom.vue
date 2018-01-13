<template>
    <div class="p-wrap">
    
        <div>
            <span class="warn" style="left:40px;">*</span>
            <span class="span">教室名称</span>
    
            <el-input v-model="form.classroom" class="input" placeholder="请输入教室名称"></el-input>
    
        </div>
        <div>
            <span class="span" style="margin-left:20px;">教室有钢琴</span>
            <el-checkbox v-model="form.checked" class="input" style="text-align:left;"></el-checkbox>
        </div>
        <div class="btns">
            <el-button @click="back">取消</el-button>
            <el-button class="btn" type="primary" @click="submit">提交</el-button>
        </div>
    
    </div>
</template>
<script>
    export default {
        name: 'classroom',
        props:["form"],
        data(){
            return {
            }
        },
        methods:{
            back(){
              this.$emit('back')
            },
            submit(){
                this.$emit('submit')
            }
        }
    
    }
</script>
<style lang="less" scoped>
 .p-wrap{
     width:600px;
      >div{
          margin:20px 0;
          text-align: center;
      }
      .input{
        width:300px;
      }
      .span{
        display:inline-block;
        width:100px;
        vertical-align:middle;
        text-align: right;
        margin-right: 20px;
      }
      .textarea{
        width:300px;
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
    }
</style>

