<template>
    <div class="box-body-lower">
         <div class="lower-body">
            <div class="left"> 
            <div class="lower-body-row"> 
             <span class="warn">*</span>
             <h5>宝宝姓名</h5>
             <div class="input">
                 <el-input v-model="student.name"  placeholder="请输入内容"></el-input>
             </div>
            </div>
            <div class="lower-body-row">
             <span class="warn">*</span>  
             <h5>宝宝性别</h5>
             <div class="input">
                 <el-radio class="radio" v-model="student.sex" label="男">男</el-radio>
                 <el-radio class="radio" v-model="student.sex" label="女">女</el-radio>
             </div>
            </div>
            <div class="lower-body-row"> 
             <span class="warn">*</span>   
             <h5>出生日期</h5>
             <div class="input">
               <el-date-picker
                    v-model="student.dateOfBirth"
                    type="date"
                    placeholder="选择日期"
                    >
                    </el-date-picker>
             </div>
            </div>
            <div class="lower-body-row">
             <span class="warn">*</span>    
             <h5>就读学校</h5>
             <div class="input">
              <el-input v-model="student.school" placeholder="请输入内容"></el-input>
             </div>
            </div>
            <div class="lower-body-row"> 
             <span class="warn">*</span>   
             <h5>家长姓名</h5>
             <div class="input">
                <el-input v-model="student.parentName" placeholder="请输入内容"></el-input>
             </div>
            </div>
            </div>
            <div class="right">
            <div class="lower-body-row"> 
             <span class="warn">*</span>   
             <h5>联系电话</h5>
             <div class="input">
               <el-input v-model="student.telephone" placeholder="请输入内容"></el-input> 
             </div>
            </div>
            <div class="lower-body-row"> 
             <span class="warn">*</span>   
             <h5>家庭住址</h5>
             <div class="input">
             <el-input v-model="student.address" placeholder="请输入内容"></el-input> 
             </div>  
            </div>
            <div class="lower-body-row">
             <span class="warn warn1">*</span>    
             <h5>音乐学习经历</h5>
             <div class="input">
                 <div class="input">
                  <el-radio class="radio" v-model="student.basics" label="0基础">0基础</el-radio>
                  <el-radio class="radio" v-model="student.sex" label="有基础">有基础</el-radio>
               </div>
             </div>
            </div>
            <div class="lower-body-row" style="height:62px;vertical-align:bottom"> 
             <h5>宝宝介绍</h5>
             <div class="input" >
              <el-input type="textarea" :rows="4" v-model="student.introduceBaby" placeholder="请输入内容"></el-input>
             </div>
             <el-button type="primary" @click="submit" style="height:42px;vertical-align:bottom;margin:10px 0 0 10px; ">提交</el-button>
            </div>
            </div>    
         </div>   
      </div>
</template>
<script>
export default {
    props:{
        studentId: Number
    },
    data(){
        return {
            value:"",
            textarea:'',
            input:'',
            radio:'',
            student:{}
        }
    },
    created(){
      this.init()
    },
    methods:{
        init(){
            this.$http.get('/api/student/getById?id='+this.studentId).then((response)=>{
                console.log(response)
                    this.student=response.data
                    // this.$emit('getUserId',this.student.userId)
            })
        },
        submit(){
             console.log(2111)
        if(_.trim(this.student.name)==""){
              this.$message("学生姓名不能为空")
        }else if(_.trim(this.student.sex)==""){
               this.$message("宝宝性别不能为空")
        }else if(_.trim(this.student.dateOfBirth)==""){
               this.$message("出生日期不能空")
        }else if(_.trim(this.student.school)==""){
              this.$message("学校不能为空")
        }else if(_.trim(this.student.parentName)==""){
              this.$message("家长姓名不能为空")
        }else if(!(/^1[34578]\d{9}$/.test(this.student.telephone))){
              this.$message("联系电话必须是11位的纯数字")
        }else if(_.trim(this.student.address)==""){
              this.$message("家庭住址不能为空")
        }else if(_.trim(this.student.basics)==""){
               this.$message("学习经历不能为空")
        }else{
           let date=new Date(this.student.dateOfBirth)
           this.student.dateOfBirth=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
           console.log(this.student)
           this.$http.post('/api/student/updateStudentInfo',{userInfo:this.student}).then((response)=>{
                   this.$message(response.data.msg)
                   if(response.data.code==1){
                       this.init()
                   }
                })
        }
         
    },
},
    watch:{
        studentId(){
            this.init()
        }
    //   '$route' (to, from) {
    //       this.init()
    //     }
    }
  
}
</script>
<style lang="less" scoped>
  .box-body-lower{
            .lower-body{
                text-align: left;
                overflow: hidden;
                .lower-body-row{
                    display: flex;
                    margin: 10px 0;
                    height: 40px;
                    line-height: 40px;
                    .warn{
                        left:60px;
                    }
                    .warn1{
                        left:35px;
                    }
                    h5{
                        width: 120px;
                        text-align: right;
                        vertical-align: middle;
                        margin: 0;
                        margin-right: 20px;
                    }
                    div{
                        vertical-align: middle;
                        width: 300px;
                    }
                }
                .btns{
                    margin-top: 40px;
                    text-align: center;
                }
                .left{
                    float: left;
                }
                .right{
                    float: left;
                    width: 600px;
                }
            }
            .btns{
                    margin: 20px 0;
            }
     } 
</style>


