<template>
    <div class="p-wrap">
    
        <div>
            <span class="warn" style="left:140px;">*</span>
            <span class="span">教师姓名</span>
    
            <el-input v-model="singleTeacher.name" class="input" placeholder="请输入教师姓名"></el-input>
    
        </div>
    
    
        <div>
            <span class="warn" style="left:170px;">*</span>
            <span class="span">性别</span>
            <div style="display:inline-block;width:300px;">
              <el-radio class="radio" v-model="singleTeacher.sex" label="男">男</el-radio>
    
              <el-radio class="radio" v-model="singleTeacher.sex" label="女">女</el-radio>
            </div>
        </div>
    
        <div>
            <span class="warn" style="left:140px;">*</span>
            <span class="span">出生年月</span>
            <el-date-picker
                class="input"
                v-model="singleTeacher.dateOfBirth"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
        </div>
        <div>
            <span class="warn" style="left:155px;">*</span>
            <span class="span">手机号</span>
            <el-input v-model="singleTeacher.phoneNumber" class="input" placeholder="请输入手机号"></el-input>
        </div>
        <div>
            <span class="warn" style="left:90px;">*</span>
            <span class="span">教授课程(可多选)</span>
             <el-select v-model="singleTeacher.professorCourse" class="input" multiple placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.name"
                :label="item.name"
                :value="item.name">
                </el-option>
            </el-select> 
        </div>    
        <div>
            <span class="span">备注</span>
            <div style="display:inline-block;width:300px;">
              {{singleUser.remarks}}
            </div>
        </div>
        <div>
            
            <el-button class="btn" @click="back">取消</el-button>
    
            <el-button type="primary" @click="submit">提交</el-button>
    
        </div>
    
    </div>
</template>
<script>
import post from '../../post'
import get from '../../get'
export default {
   props:['singleTeacher','singleUser'], 
   name:'teacher',
   data(){
      return{
          options:[]
      }
   },
   created(){
      this.initialCurriculum()
   } ,
   methods:{
    initialCurriculum(){
        get('/api/course/getAll').then((response) => { 
             this.options=response.data
        });
    },
     back(){
        this.$emit('back')
     },
     submit(){
        this.$emit('submit') 
     }
   },
   value:[],
   options:[]
}
</script>
<style lang="less" scoped>
  .p-wrap{
      text-align: center;
      >div{
          margin:20px 0;
      }
      .input{
        width:300px;
      }
      .span{
        display:inline-block;
        width:200px;
        text-align:right;
        margin-right: 20px;
        vertical-align:middle;
      }
      .textarea{
        width:300px;
      }
      .btn{
        margin-right:20px;
      }
    }
</style>


