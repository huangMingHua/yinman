<template>
       <div class="box">
             <com-user :userId="singleUser.user.id"></com-user>
             <div class="box-row">
                <span>宝宝姓名：</span>
                <em>{{singleUser.student.name}}</em>
             </div> 
              <div class="box-row">
                <span>预约课程：</span>
                <em>{{singleUser.curriculum.afterCourseDeleTeSaveInfo.courseName}} （{{singleUser.curriculum.afterCourseDeleTeSaveInfo.number}}人，等级：{{singleUser.curriculum.afterCourseDeleTeSaveInfo.level}}）</em>
             </div class="box-row">
             <div class="box-row">
                <span>教师姓名：</span>
                <em>{{singleUser.curriculum.afterCourseDeleTeSaveInfo.teacherName.name}}</em>
             </div> 
              <div class="box-row">
                <span>预约时间：</span>
                <em>{{singleUser.curriculum.afterCourseDeleTeSaveInfo.date | viewDate}} {{singleUser.curriculum.afterCourseDeleTeSaveInfo.startTime}}~{{singleUser.curriculum.afterCourseDeleTeSaveInfo.endTime}}</em>
              </div> 
              <div class="box-row">
                <span>教室：</span>
                <em>{{singleUser.curriculum.afterCourseDeleTeSaveInfo.classroom.name}}</em>
              </div>
              <div class="box-row">
                <span style="vertical-align:top">其它要求：</span>
                <em style="display:inline-block;width:420px;">{{singleUser.curriculum.requirement}}</em>
              </div>
              <div class="box-row">
               <em class="warn" style="left:20px;top:10px;position:absolute">*</em>
               <span>审核操作：</span>
               <el-radio-group @change="radioFn" v-model="iRadio" :disabled="singleChecked">
                <el-radio class="radio"  label="确认">确认</el-radio>
                <el-radio class="radio"  label="拒绝">拒绝</el-radio>
                <el-radio class="radio"  label="更改时间">更改时间</el-radio>
               </el-radio-group>
               <el-select v-model="singleUser.curriculum.confirmedId" v-show="index>0" :disabled="showSelect" style="width:290px" placeholder="请选择">
                    <el-option
                      v-for="item in aOptions"
                      :key="item.id"
                      :label="item.date+' '+item.startTime+'~'+item.endTime+' '+item.number+'人 ，'+item.level"
                      :value="item.id">
                    </el-option>
                </el-select>
              </div>
               <div class="box-row" style="color:red">
                <span>说明：</span>
                <em>预约时间可更改为该课程下其它空余预约课程时间。</em>
              </div>
              <div class="box-row" >
                <span>审核备注：</span>
                <el-input
                  class="input"
                  type="textarea"
                  :disabled="singleChecked"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="singleUser.curriculum.remarks">
                </el-input>
              </div>
              <div class="btns">
                 <el-button @click="btnBack">取消</el-button>
                 <el-button type="primary" :disabled="singleChecked" @click="submit">提交</el-button>
             </div>  
      </div>
</template>
<script>
 import comUser from '../common/userInfo'
   export default {
       props:['singleUser',"singleChecked"],
       data(){
           return {
             iRadio:'',
             aOptions:[],
             showSelect:true,
             requirement:'',
             index:0
           }
       },
       created(){
         if(this.singleUser.curriculum.requirement){
             this.requirement=this.singleUser.curriculum.requirement.substring(0,10)+'...'
          }else{
             this.requirement=this.singleUser.curriculum.requirement
          }
         if(this.singleUser.curriculum.confirmedId){
            this.iRadio='更改时间'
            this.radioFn()
         }else if(this.singleUser.curriculum.state=='已确认'||this.singleUser.curriculum.state=='已取消'){
            this.iRadio='确认'   
         }else if(this.singleUser.curriculum.state=='已拒绝'){
            this.iRadio='拒绝' 
         }
         this.index=2
       },
       computed:{
         
            // confirmedTime:function(){
            //   return this.singleUser.curriculum.confirmedTime
            // }
       },
      methods:{
        submit(){
          if(!this.iRadio){
            this.$message("请选择确认按钮")
                        return
          }
              this.$confirm('时间确认后不可修改，是否继续？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  if(this.iRadio=='更改时间'){
                     if(_.trim(this.singleUser.curriculum.confirmedId)==""){
                        this.$message("上课时间不能为空")
                        return
                     } else{
                //this.singleUser.curriculum.state='已确认'
                this.$http.post('/api/bookingCourse/confirm', {
                  id: this.singleUser.curriculum.id,
                  confirmedId: this.singleUser.curriculum.confirmedId,
                  remarks:this.singleUser.curriculum.remarks
                }).then((res) => {
                  if(res.data.code==1){
                    this.$emit('success');
                    this.iRadio='',
                    this.aOptions=[]
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消修改'
                  });          
                })
                     }
                     }else{
                         this.$http.post('/api/bookingCourse/changeState', {
                            id: this.singleUser.curriculum.id,
                            state: this.iRadio,
                            remarks:this.singleUser.curriculum.remarks
                          }).then((res) => {
                            if(res.data.code==1){
                              this.$emit('success');
                              this.iRadio='',
                              this.aOptions=[]
                            }
                            else{
                              this.$message(res.data.msg);
                            }
                          }).catch(() => {
                            this.$message({
                              type: 'info',
                              message: '已取消修改'
                            });          
                          })
                     }
                     })
              
        },
        btnBack(){
              this.iRadio=''
              this.$emit('btnBack')
        },
        radioFn(){
          console.log(this.iRadio=='更改时间'&&!this.singleUser.curriculum.confirmedId)
          if(this.iRadio=='更改时间'&&!this.singleUser.curriculum.confirmedId){
               this.$http.get('/api/courseTable/getBookingCourseOtherTime?id='+this.singleUser.curriculum.course.id).then((res) => {
                  if(res.data.code==1){
                       this.aOptions=res.data.data
                       this.showSelect=false
                       if(this.aOptions.length==0){
                            this.singleUser.curriculum.confirmedId='' 
                       }
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
            }else if(this.iRadio=='更改时间'){
                this.showSelect=true
                this.$http.get('/api/courseTable/getByDetailItemId?id='+this.singleUser.curriculum.confirmedId).then((res) => {
                  if(res.data.code==1){
                      console.log(this.iRadio=='更改时间'&&!this.singleUser.curriculum.confirmedId)
                      let date=new Date(res.data.data.date)
                      res.data.data.date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
                      this.aOptions[0]=res.data.data
                      this.index=this.aOptions.length
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
            }else{
               this.singleUser.curriculum.confirmedId=''
               this.showSelect=true
            }
        }
      },
      components:{
        comUser,
    },
    watch:{
       singleUser(){
          if(this.singleUser.curriculum.requirement){
              this.requirement=this.singleUser.curriculum.requirement.substring(0,10)+'...'
          }else{
             this.requirement=this.singleUser.curriculum.requirement
          }
          this.singleChecked=this.singleChecked
          if(this.singleUser.curriculum.confirmedId){
            this.iRadio='更改时间'
            this.radioFn()
         }else if(this.singleUser.curriculum.state=='已确认'||this.singleUser.curriculum.state=='已取消'){
            this.iRadio='确认'   
         }else if(this.singleUser.curriculum.state=='已拒绝'){
            this.iRadio='拒绝' 
         }else{
            this.iRadio='' 

         }
       }
    }
   }
</script>
<style lang="less" scoped>
  .box{
    .box-row{
      position: relative;
      text-align: left;
      margin-left: 200px;
      width: 620px;
      margin-bottom: 20px;
      span{
        display: inline-block;
        width: 100px;
        margin-right: 10px;
        text-align: right;
      }
      em{
        font-style: normal;
      }
    }
    .input{
      width:400px;
      vertical-align: middle;
    }
    .btns{
                    margin-top: 40px;
                    text-align: center;
          }
  }
</style>