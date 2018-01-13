<template>
  <div class="box">
        <!-- <div class="add"><el-button type="primary" @click="add">+报名课程</el-button></div>  -->
        <div class="p-wrap-table" style="overflow: auto;">
            <table style="width:1700px;">
                <thead>
                    <th>学期名称</th>
                    <th>课程周期</th>
                    <th>课程信息</th>
                    <th>请假次数</th>
                    <th>已补课次数</th>
                    <th>剩余补课次数</th>
                    <th>操作</th>
                </thead>
                <tbody>
                    <tr v-for="term in terms">
                        <td>
                            {{ term.name }}
                        </td>
                        <td style="width:160px;">
                             <div v-for="item of term.details">
                                {{ item.startDate | viewDate }} 至 {{ item.endDate | viewDate }}
                            </div>
                        </td>
                        <td style="width:350px;">
                            <div v-for="(item,index) of term.details">
                                {{item.teacherName}} {{item.courseName}} {{item.number}}人班 {{item.dayOfWeek}}{{item.startTime}}~{{item.endTime}}<span v-if='item.state=="停课"' style="color:red;cursor: pointer;" @click="suspendClassesShowFn(item.id,item,index,item.startDate,item.endDate)">（已{{item.state}}）</span>
                                <span v-if='item.state=="转课"' style="color:red;cursor: pointer;" @click="transferTheClassShowFn(item.id,item,index,item.startDate,item.endDate)">（已{{item.state==='转课'?'转班':item.state}}）</span>
                            </div>
                        </td>  
                        <td>
                            <div v-for="(item,index) of term.details">
                                {{item.allNumberOfChangeClass-item.numberOfleave}}
                            </div>
                        </td>  
                        <td>
                            <div v-for="(item,index) of term.details" >
                                {{item.allNumberOfChangeClass-item.numberOfChangeClass}} 
                            </div>
                        </td> 
                        <td style="width:160px;">
                            <div v-for="(item,index) of term.details" style="text-align:left;padding-left:50%;">
                                {{item.numberOfChangeClass-item.numberOfleave}}  <span v-if='item.allNumberOfChangeClass-item.numberOfleave-(item.allNumberOfChangeClass-item.numberOfChangeClass)' class='applyChangeCourse' @click="fApplyChangeCourse(item.courseTableDetailId)">申请补课</span>
                            </div>
                        </td>  
                        
                        <td>
                            <router-link class="el-button el-button--text el-button--small" 
                                :to="{ path: '/courseTable/viewItems', query: { termId: term.id, studentId: studentId }}">
                                查看周课表
                            </router-link>
                            <!--<el-button type="text" size="small" @click="del(term.id)">删除</el-button>-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <el-dialog title="补课" size="tiny" v-model="isMakeup" :close-on-click-modal='false' label-position="left">
            <makeup :nStudentId='nStudentId' :nCourseTableDetailId='nCourseTableDetailId' @success='makeupSuccess'></makeup>
        </el-dialog>
        <el-dialog title="停课" size="tiny" v-model="isSuspendClassShowes" :close-on-click-modal='false' label-position="left">
            <suspend-classes :name='name' :curriculum='curriculum' :level='level' :suspensionDate='suspensionDate' :reason='reason'></suspend-classes>
        </el-dialog>
        <el-dialog title="转班" size="tiny" v-model="isTransferTheClassShow" :close-on-click-modal='false' >
                       <el-form  label-width="200px" class="demo-ruleForm">
                            <el-form-item label="姓名："  class="suspendClassShow">
                                {{name}}
                            </el-form-item>
                            <el-form-item label="课程："  class="suspendClassShow">
                                {{curriculum}}
                            </el-form-item>
                            <el-form-item label="等级：" class="suspendClassShow">
                                {{level}}
                            </el-form-item>
                            <el-form-item label="课程截止日期：" prop="suspensionDate" class="suspendClassShow">
                                {{suspensionDate|viewDate}}
                            </el-form-item>
                            <el-form-item label="停课原因：" class="suspendClassShow">
                                {{reason}}
                            </el-form-item>
                            <el-form-item label="原课程周期："  class="suspendClassShow">
                                {{currentCycle}}
                            </el-form-item>
                            <el-form-item label="转班原因：" class="suspendClassShow">
                                {{sShiftReason}}
                            </el-form-item>
                            <el-form-item label="转班后课程开始日期：" class="suspendClassShow">
                                {{sShiftStartDate | viewDate}}
                            </el-form-item>
                            <el-form-item label="转班后的课程周期："  class="suspendClassShow">
                                {{classTransferCourseTableDetailDate}}
                            </el-form-item>
                      </el-form>
        </el-dialog> 
  </div>    
</template>
<script>
import studentSignUp from '../signUp/studentSignUp1';
import lodash from 'lodash'
import makeup from './makeup'
import suspendClasses from '../courseTables/suspendClasses'
export default {
    props:['name'],
        data(){
            return{
                    studentId: parseInt(this.$route.query.studentId || 0),
                    terms: [],
                    // showStudentSignUp:false,
                    termId: 0,
                    curriculum:'',
                    level:'',
                    suspensionDate:'',
                    reason: '',
                    currentCycle: '',
                    sShiftReason: '',
                    sShiftStartDate: '',
                    classTransferCourseTableDetailDate:'',
                    isSuspendClassShowes:false,
                    isMakeup:false,
                    nCourseTableDetailId:Number,
                    nStudentId: this.$route.query.studentId,
                    isTransferTheClassShow:false,
            }
        },
        created(){
                this.loadData();
            },
        methods:{
            loadData() {
                this.showStudentSignUp=false;
                this.$http.get("/api/student/getSignUpTerms?studentId=" + this.studentId).then((res) => {
                    for(let item of res.data){
                     item.details=lodash.uniqBy(item.details,'id')
                    }
                    this.terms = res.data
                });
            },
            add() {
                this.showStudentSignUp=true;
            },
            btnBack() {
                //this.$emit('btnBack')
                this.showStudentSignUp=false;
            },
            view(termId) {
                this.termId = termId;
                this.showStudentSignUp = true;
            },
            toSignUp(){
                this.$emit("toSignUp")
            },
            makeupSuccess(){
                 this.isMakeup=false
                 this.nStudentId=0
                 this.loadData();
            },
            suspendClassesShowFn(id,item,i,startDate='',endDate=''){
               console.log(id,item,i,startDate,endDate)
               this.reason=item.reasonsForSuspension
               this.isSuspendClassShowes=true;
               this.curriculum=item.courseName
               this.level=item.level
               this.suspensionDate=item.courseTableItem.date
            //    this.$http.get('/api/signUpCurriculum/getWeekById?id='+id+'&startDate='+startDate+'&endDate='+endDate).then((res) => {
            //       if(res.data.code==1){
            //           let index=-1
            //           for(let j=0;j<res.data.data.length;j++){
            //                if(res.data.data[j]&&res.data.data[j].id==item.courseTableItemId){
            //                   index=j
            //                }
            //           }
            //           if(index!=-1){
            //               this.suspensionDate=res.data.data[index].date   
            //           }else{
            //               this.suspensionDate=res.data.data[res.data.data.length-1].date  
            //           }
            //       }
            //       else{
            //         this.$message(res.data.msg);
            //       }
            //     })
        },
        transferTheClassShowFn(id, item, i) {
            console.log(item)
            this.isTransferTheClassShow=true
            this.level=item.level
            this.number=item.number
            this.curriculum=item.courseName
            this.reason=item.reasonsForSuspension
            let startDate=new Date(item.startDate)
            let endDate = new Date(item.endDate)
            this.suspensionDate=item.courseTableItem.date
            this.currentCycle=startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+'至'+endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate()+' '+item.dayOfWeek+' '+item.startTime+'~'+item.endTime
            this.sShiftReason = item.shiftReasons
            let startDate1 = new Date(item.classTransferCourseTableDetail.startDate)
            let endDate1=new Date(item.classTransferCourseTableDetail.endDate)
            this.classTransferCourseTableDetailDate=item.shiftStartDate+'至'+endDate1.getFullYear()+"-"+(endDate1.getMonth()+1)+"-"+endDate1.getDate()+item.classTransferCourseTableDetail.dayOfWeek+' '+item.classTransferCourseTableDetail.startTime+'~'+item.classTransferCourseTableDetail.endTime
            this.sShiftStartDate=item.shiftStartDate
           
        },
        fApplyChangeCourse(courseTableDetailId){
            this.isMakeup=true
            this.nStudentId=this.$route.query.studentId
            this.nCourseTableDetailId=courseTableDetailId
        }
        },
        watch:{
          '$route' (to, from) {
              this.studentId=this.$route.query.studentId 
                 this.loadData()
           }
        },
        components:{
            suspendClasses,
            makeup
        }
}
</script>
<style lang="less" scoped> 
    .add{
          text-align: left;
          padding: 0px 60px;
          padding-bottom: 10px;
      } 
      .to-sign-up{
          color:#20a0ff;
          cursor: pointer;
      }
    .p-wrap-table {
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background-color: #eef1f6;
        }
        th,
        td {
            border-right: 1px solid #dfe6ec;
            border-bottom: 1px solid #dfe6ec;
            width: 120px;
            height: 40px;
            font-size: 14px;
            text-align: center;
            img {
                width: 40px;
                height: 40px;
            }
            div{
                border-bottom: 1px solid black;
                height: 40px;
                line-height: 40px;
            }
        }
    }
    .applyChangeCourse{
        color:#4db3ff;
        cursor: pointer;
        margin: 10px;
    }
</style>


