<template>
       <div class="box">
             <com-user :userId="singleUser.oUser.id"></com-user>
             <div class="box-row" style="border-top:1px solid #c1c1c1">
                <span>宝宝姓名：</span>
                <em>{{singleUser.oStudent.name}}</em>
             </div> 
              <div class="box-row">
                <span>报名课程：</span>
                <em v-if="singleUser.oCourse">{{singleUser.oCourse.courseName}} （等级：{{singleUser.oCourse.level}}）</em>
                <em v-else>{{singleUser.afterCourseDeleTeSaveInfo.courseName}} （等级：{{singleUser.afterCourseDeleTeSaveInfo.level}}）</em>
             </div class="box-row">
             <div class="box-row">
                <span>教师姓名：</span>
                <em v-if="singleUser.oCourse">{{singleUser.oCourse.oTeacher.name}}</em>
                <em v-else>{{singleUser.afterCourseDeleTeSaveInfo.oTeacher.name}}</em>
             </div> 
             <div class="box-row">
                <span>课程周期：</span>
                <em v-if="singleUser.oCourse">{{singleUser.oCourse.startDate | viewDate}}至{{singleUser.oCourse.endDate | viewDate}}</em>
                <em v-else>{{singleUser.afterCourseDeleTeSaveInfo.startDate | viewDate}}至{{singleUser.afterCourseDeleTeSaveInfo.endDate | viewDate}}</em>
             </div> 
             <div class="box-row">
                <span>课程时间：</span>
                <em v-if="singleUser.oCourse">{{singleUser.oCourse.dayOfWeek}} {{singleUser.oCourse.startTime}}~{{singleUser.oCourse.endTime}}</em>
                <em v-else>{{singleUser.afterCourseDeleTeSaveInfo.dayOfWeek}} {{singleUser.afterCourseDeleTeSaveInfo.startTime}}~{{singleUser.afterCourseDeleTeSaveInfo.endTime}}</em>
             </div> 
             <div class="box-row">
                <span>教室：</span>
                <em v-if="singleUser.oCourse">{{singleUser.oCourse.oClassroom.name}}</em>
                <em v-else>{{singleUser.afterCourseDeleTeSaveInfo.oClassroom.name}}</em>
             </div>
             <div class="box-row">
                <span>人数：</span>
                <em v-if="singleUser.oCourse">{{singleUser.oCourse.number}}</em>
                <em v-else>{{singleUser.afterCourseDeleTeSaveInfo.number}}</em>
             </div>
             <div class="box-row" style="border-bottom:1px solid #c1c1c1;padding-bottom: 20px;" >
              <span style="vertical-align: top;">特殊要求：</span>
              <em style="display:inline-block;width:650px;">{{singleUser.specialRequirements}}</em>
            </div>
             <div class="box-row">
               <strong class="warn" style="top:8px;left:50px">*</strong>
               <span>审核操作：</span>
               <el-radio-group @change="radioFn" v-model="iRadio" :disabled="singleChecked">
                <el-radio class="radio"  label="确认">确认</el-radio>
                <el-radio class="radio"  label="拒绝">拒绝</el-radio>
                <el-radio class="radio"  label="更改时间">更改课程时间</el-radio>
               </el-radio-group>
               <el-select v-model="singleUser.changeCurriculumId" v-if="index>0" :disabled="changeCourseChecked" class='changeCourseChecked' @change="changeCurriculum" placeholder="请选择">
                    <el-option
                      v-for="item in aOptions"
                      :key="item.id"
                      :label="item.teacher.name+' '+item.dayOfWeek+' '+item.startDate+'~'+item.endDate+' '+item.startTime+'~'+item.endTime+'  '+item.number+'人，'+item.level"
                      :value="item.id">
                    </el-option>
              </el-select>
            </div>
            <div class="box-row red">
                <span>说明：</span>
                <em>时间可更改为该课程下相同人数（人数分为：1人或多人）的其它空余课程时间</em>
             </div>
              <div class="box-row">
                <span>更改课程开始日期：</span>
                <el-checkbox v-model="checked" :disabled="checkedStartDate1" @change="getWeekItem"></el-checkbox>
                <el-select v-model="nStartWeekId" class='changeWeek' @change="changeWeek" placeholder="请选择" :disabled='startCourseTableItemShow'>
                    <el-option
                      v-for="item in aStartWeek"
                      :key="item.id"
                      :label="item.date+' 已有'+item.length+'人'"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </div>
              <!-- <div class="box-row" >
                <span>更改课程开始日期：</span>
                  
              </div> -->
              <!-- <div class="box-row" v-if="checked">
                  <span>更改结束周期：</span>
                  <el-select v-model="nEndWeekId"  @change="changeWeek" placeholder="请选择">
                    <el-option
                      v-for="item in aEndweek"
                      :key="item.id"
                      :label="item.date"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </div> -->
              <div class="box-row">
                <strong class="warn" style="top:0px;left:50px">*</strong>
                <span>支付方式：</span>
                <el-radio-group  v-model="singleUser.paymentMethod" :disabled="singleChecked">
                <el-radio class="radio" :disabled='disabled' label="现金">现金</el-radio>
                <el-radio class="radio" :disabled='disabled' label="刷卡">刷卡</el-radio>
                <el-radio class="radio" :disabled='disabled' label="网银转账">网银转账</el-radio>
                <el-radio class="radio" :disabled='disabled' label="支付宝">支付宝</el-radio>
                <el-radio class="radio" :disabled='disabled' label="微信">微信</el-radio>
               </el-radio-group>
             </div>
             <div class="box-row">
                <strong class="warn" style="top:38px;left:50px">*</strong>
                <span>审核备注：</span>
                <el-input
                  class="input"
                  type="textarea"
                  :disabled="checkedStartDate"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="singleUser.reviewRemarks">
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
             aStartWeek:[],
             aEndweek:[],
             checked:false,
             nStartWeekId:null,
             nEndWeekId:null,
             disabled:false,
             changeCourseChecked:true,
             specialRequirements:'',
             checkedStartDate:true,
             index: 1,
             startCourseTableItemShow: true,
             timer:null,
             checkedStartDate1:true,
             num:0
           }
       },
       created() {
         if(this.singleUser.specialRequirements){
               this.specialRequirements=this.singleUser.specialRequirements.substring(0,10)+"..."
             }else{
               this.specialRequirements=this.singleUser.specialRequirements
             }
         if(this.singleUser.changeCurriculumId&&this.singleUser.oChangeCourse){
            this.index=0
            this.iRadio='更改时间'
            this.radioFn()
         }else if(this.singleUser.state=='已确认'||this.singleUser.state=='已取消'){
             this.num=1
             this.iRadio='确认'
             this.checkedStartDate1 = true
             this.checkedStartDate = true
             this.startCourseTableItemShow=true
         }else if(this.singleUser.state=='已拒绝'){
            this.num=1
            this.iRadio='拒绝'
            this.checkedStartDate=true
            this.checkedStartDate1=true
         }
         if(this.singleChecked){
            this.changeCourseChecked=true
         }
         if (this.singleUser.startCourseTableItem) {
            this.checked = true
            this.startCourseTableItemShow=true
            this.nStartWeekId = this.singleUser.startCourseTableItemId
            this.aStartWeek[0]=this.singleUser.startCourseTableItem
         }
       },
       computed:{
         
            // confirmedTime:function(){
            //   return this.singleUser.curriculum.confirmedTime
            // }
       },
      methods:{
        submit(){
          if(!this.iRadio){
            this.$message("审核操作必选")
                        return
          }
          if(this.iRadio!='拒绝'){
            if(!this.singleUser.paymentMethod){
                this.$message("请选择支付方式")
                return
            }
            if(!this.singleUser.reviewRemarks){
                this.$message("请输入审核备注")
                return
            }
          }
              this.$confirm('时间确认后不可修改，是否继续？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  if(this.iRadio=='更改时间'){
                    if(this.checked){
                          if(!this.nStartWeekId){
                              this.$message('开始周期不能为空')
                              return
                          }
                       }
                     if(_.trim(this.singleUser.changeCurriculumId)==""){
                        this.$message("上课时间不能为空")
                        return
                     } else{
                //this.singleUser.curriculum.state='已确认'
                this.$http.post('/api/signUpCurriculum/confirm', {
                   id: this.singleUser.id,
                   changeCurriculumId: this.singleUser.changeCurriculumId,
                   checked:this.checked,
                   nStartWeekId:this.nStartWeekId,
                   nEndWeekId:this.nEndWeekId,
                   reviewRemarks: this.singleUser.reviewRemarks,
                   paymentMethod: this.singleUser.paymentMethod
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
                       if(this.checked){
                          if(!this.nStartWeekId){
                              this.$message('开始周期不能为空')
                              return
                          }
                       }
                         this.$http.post('/api/signUpCurriculum/changeState', {
                            id: this.singleUser.id,
                            state: this.iRadio,
                            checked:this.checked,
                            nStartWeekId:this.nStartWeekId,
                            nEndWeekId:this.nEndWeekId,
                            reviewRemarks: this.singleUser.reviewRemarks,
                            paymentMethod: this.singleUser.paymentMethod
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
        btnBack() {
              this.iRadio=''
              this.aOptions=[]
              this.aStartWeek=[]
              this.aEndweek=[]
              this.checked=false
              this.nStartWeekId=null
              this.nEndWeekId = null
              this.$emit('btnBack')
        },
        radioFn() {
          console.log(this.singleUser,11)
           this.checkedStartDate = this.disabled = false
           if(this.num!=1){
             this.checkedStartDate1=false            
           }else{
             this.checkedStartDate1=true
           }
           this.checkedStartDate=false
           this.getWeekItem()
          if (this.iRadio == '更改时间' && !this.singleUser.changeCurriculumId) {
               this.checkedStartDate=true
               this.changeCourseChecked = false
               this.checked = false
               this.nStartWeekId=''
               this.$http.get('/api/signUpCurriculum/getSignUpCourseOtherTime?id='+this.singleUser.curriculumId).then((res) => {
                  if(res.data.code==1){
                       this.aOptions=res.data.data
                       if(this.aOptions.length==0){
                            this.singleUser.changeCurriculumId='' 
                       }
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
              } else if (this.iRadio == '拒绝') {
                this.singleUser.changeCurriculumId='' 
                this.singleUser.paymentMethod=""
                this.disabled = true
                setTimeout(() => {
                  if(this.num!=1){
                    this.checkedStartDate=false           
                  }else{
                    this.checkedStartDate=true
                  }
                  this.checkedStartDate1=true
                })
                
                this.changeCourseChecked = true
                this.startCourseTableItemShow = true
                this.checked = false
                this.nStartWeekId=''
              } else if (this.iRadio == '更改时间' && this.singleUser.changeCurriculumId) {
                 this.disabled=true
                 this.checkedStartDate=true
                 this.changeCourseChecked=true
                 this.checkedStartDate1=true
                 this.$http.get('/api/courseTable/getByDetailId?id='+this.singleUser.changeCurriculumId).then((res) => {
                  if(res.data.code==1){
                       let startDate=new Date(res.data.data.startDate)
                       let endDate=new Date(res.data.data.endDate)
                       res.data.data.startDate=startDate.getFullYear()+"-"+(startDate.getMonth()+1)+'-'+startDate.getDate()
                       res.data.data.endDate=endDate.getFullYear()+"-"+(endDate.getMonth()+1)+'-'+endDate.getDate()
                       console.log(res.data.data)
                       this.aOptions[0]=res.data.data
                       this.index=1
                       this.singleUser.changeCurriculumId=this.singleUser.changeCurriculumId
                       if(this.aOptions.length==0){
                            this.singleUser.changeCurriculumId='' 
                       }
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
              } else {
                this.singleUser.changeCurriculumId = ''
                this.changeCourseChecked = true
                this.checked = false
                this.nStartWeekId=''
              }
              
        },
        changeWeek(){
             if(this.nStartWeekId&&this.nEndWeekId&&this.nStartWeekId>this.nEndWeekId){
                this.$message('开始周期不能大于结束周期')
                this.nEndWeekId=null
             }
        },
        getWeekItem() {
              if (this.checked) {
                this.startCourseTableItemShow=false
                let id = 0
                if(this.singleUser.changeCurriculumId&&this.iRadio=='更改时间'){
                    id=this.singleUser.changeCurriculumId
                }else{
                    id=this.singleUser.curriculumId
                }
                this.$http.get('/api/signUpCurriculum/getWeekById?id='+id).then((res) => {
                  if(res.data.code==1){
                      this.aStartWeek=res.data.data.aCourseItem
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
        } else {
          this.startCourseTableItemShow = true
          this.nStartWeekId = ''
          this.aStartWeek=[]
        }
        // change(){
        //      this.$emit('changes',this.confirmedTime)
        // }
        },
        changeCurriculum() {
          this.checkedStartDate=false
          this.getWeekItem()
        }
      },
      components:{
        comUser,
      },
      watch:{
         singleUser(newD, oldD) {
           if (newD) {
             this.num=0
             this.index=0
             setTimeout(() => {
                    this.checkedStartDate=true
              })
             if(this.singleUser.specialRequirements){
               this.specialRequirements=this.singleUser.specialRequirements.substring(0,10)+"..."
             }else{
               this.specialRequirements=this.singleUser.specialRequirements
             }
              this.iRadio=''
              this.aOptions=[]
              this.aStartWeek=[]
              this.aEndweek=[]
              this.checked=false
              this.nStartWeekId=null
              this.nEndWeekId=null
              this.changeCourseChecked = true
                if(this.singleUser.changeCurriculumId&&this.singleUser.oChangeCourse){
                    this.iRadio='更改时间'
                    this.radioFn()
                }else if(this.singleUser.state=='已确认'||this.singleUser.state=='已取消'){
                    this.iRadio='确认'
                    setTimeout(() => {
                      this.num=1
                      this.checkedStartDate1 = true
                      this.startCourseTableItemShow=true
                      this.checkedStartDate=true
                    });
                }else if(this.singleUser.state=='已拒绝'){
                    this.num=1
                    this.iRadio='拒绝'
                    this.checkedStartDate=true
                    this.checkedStartDate1=true
                }
                if(this.singleChecked){
                    this.changeCourseChecked=true
                }
                if (this.singleUser.startCourseTableItem) {
                  clearTimeout(this.timer)
                  this.startCourseTableItemShow = true
                  this.aStartWeek[0] = this.singleUser.startCourseTableItem
                 this.timer=setTimeout(() => {
                    this.checked = true
                    this.nStartWeekId = this.singleUser.startCourseTableItemId
                  })
              }
           } 
         }
      }

   }
</script>
<style>
   .el-dialog--small{
     width: auto !important;
   }
</style>
<style lang="less" scoped>
  .box{
    //  width:952px;
    .red{
      color:red;
      font-size: 12px;
    }
    .box-row{
      text-align: left;
      margin:0 10px;
      // width: 850px;
      margin-bottom: 20px;
      position: relative;
      .warn{
        position: absolute;
        // top:0;
        // bottom: 0;
        // margin: auto;
        // line-height: 36px;
      }
      .changeCourseChecked{
        width: 490px;
      }
      span{
        display: inline-block;
        width: 130px;
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