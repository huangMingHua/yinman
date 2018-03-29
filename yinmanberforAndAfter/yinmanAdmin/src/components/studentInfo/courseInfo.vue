<template>
  <div class="box">
        <div class="title"><img src="./../../assets/images/termRecords.png"><span>学期课</span></div>
        <div class="p-wrap-table" style="overflow: auto;">
            <table style="width:1700px;">
                <thead>
                    <th>课程周期</th>
                    <th>课程信息</th>
                    <th>已请假/剩余请假</th>
                    <th>已补课/剩余补课</th>
                    <th>操作</th>
                </thead>
                <tbody>
                    <tr v-for="item of courseTabledetailStudents">
                        <td style="width:160px;">
                            <div>
                               <em><span v-if="item.startCourseTableItemId">{{item.startCourseTableItem.date}}</span><span v-else>{{term.startDate}}</span></em> 至<em> <span v-if="item.endCourseTableItemId" class="">{{item.endCourseTableItem.date}}</span><span v-else>{{term.endDate}}</span></em>
                            </div>
                        </td>
                        <td style="width:350px;">
                            <div>
                                {{item.courseTableDetail.teacher.name}} {{item.courseTableDetail.course.name}} {{item.courseTableDetail.number}}人班 {{item.courseTableDetail.dayOfWeek}}{{item.courseTableDetail.startTime}}~{{item.courseTableDetail.endTime}}<em style="color:red" v-if="item.endCourseTableItemId" @click="openSuspendClassesInfo(item.id)">（已停课）</em>
                            </div>
                        </td>  
                        <td>
                            <div>
                                <el-button type="text">{{item.allNumberOfChangeClass-item.numberOfleave}}</el-button>/{{item.numberOfleave}} <el-button type="text" @click="applyLeaveFn(item.courseTableDetail.id)">申请请假</el-button>
                            </div>
                        </td>  
                        <td>
                            <div >
                                <el-button type="text">{{item.allNumberOfChangeClass-item.numberOfChangeClass}}</el-button>/{{item.numberOfChangeClass}} <el-button type="text" @click="applyMakeUpFn(item.courseTableDetail.id)">申请补课</el-button>
                            </div>
                        </td> 
                        <td style="width:160px;">
                            <el-button type="text" @click="openSuspendClasses(item.id)" :disabled="item.endCourseTableItemId?true:false">停课</el-button> <el-button type="text" :disabled="item.endCourseTableItemId>0&&item.shiftStartCourseTableItemId==null?false:true" @click="classTransferFn(item.courseTableDetail.id)">转班</el-button> <el-button @click="recordFn(item.courseTableDetail.id)" type="text">请假和补课记录</el-button>  
                        </td>  
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="title"><img src="./../../assets/images/termRecords2.png"><span>课时课</span></div>
        <div class="p-wrap-table" style="overflow: auto;">
            <table style="width:1700px;">
                <thead>
                    <th>课程周期</th>
                    <th>课程信息</th>
                    <th>已请假</th>
                    <th>操作</th>
                </thead>
                <tbody>
                    <tr v-for="item of classTimeCourseTabledetailStudents">
                        <td style="width:160px;">
                            <div>
                               <em><span v-if="item.startCourseTableItemId">{{item.startCourseTableItem.date}}</span><span v-else>{{term.startDate}}</span></em> 至<em> <span v-if="item.endCourseTableItemId" class="">{{item.endCourseTableItem.date}}</span><span v-else>{{term.endDate}}</span></em>
                            </div>
                        </td>
                        <td style="width:350px;">
                            <div>
                                {{item.courseTableDetail.teacher.name}} {{item.courseTableDetail.course.name}} {{item.courseTableDetail.number}}人班 {{item.classTimeNum}}课时 等级{{levels[item.level-1].name}}
                            </div>
                        </td>  
                        <td>
                            <div v-for="it of item.courseTableItem">
                                {{it.date+' '+it.startTime+'~'+it.endTime}}
                            </div>
                        </td>  
                        <td style="width:160px;">
                            <el-button type="text" :disabled='item.status!="正常"?true:false'  @click="classTimeclassclassTransferFn(item.courseTableDetail.id)">转班</el-button> <el-button @click="classTimeRecordFn(item.courseTableDetail.id)" type="text">请假记录</el-button>  
                        </td>  
                    </tr>
                </tbody>
            </table>
        </div>
        <el-dialog title="停课" size="tiny"   :visible.sync="isSuspendClass" :close-on-click-modal='false' label-position="left">
          <suspend-classes :courseTableDetailStudentId="courseTableDetailStudentId" @surpenClassCancel="surpenClassCancel" @surpenClassSubmit="surpenClassSubmit"></suspend-classes>
        </el-dialog>
        <el-dialog title="停课" size="tiny"   :visible.sync="isSuspendClassInfo" :close-on-click-modal='false' label-position="left">
           <suspend-classes-info :courseTableDetailStudentId="courseTableDetailStudentId" ></suspend-classes-info> 
        </el-dialog>
        <el-dialog title="请假补课记录"   :visible.sync="isLeaveAndMakeUpRecord" :close-on-click-modal='false' @close="closeleaveAndMakeUpRecordFn" label-position="left">
           <leave-and-make-up-record  :courseTableDetailId="courseTableDetailId" :studentId="studentId"></leave-and-make-up-record> 
        </el-dialog>
        <el-dialog title="请假记录"   :visible.sync="isClassTimeLeaveAndMakeUpRecord" :close-on-click-modal='false' @close="closeleaveAndMakeUpRecordFn" label-position="left">
           <class-time-leave-record  :courseTableDetailId="courseTableDetailId" :studentId="studentId"></class-time-leave-record> 
        </el-dialog>
        <el-dialog title="申请请假"  size="small"  :visible.sync="isApplyLeave" :close-on-click-modal='false' @close="closeleaveAndMakeUpRecordFn" label-position="left">
           <apply-leave  :courseTableDetailId="courseTableDetailId" :studentId="studentId" @cacelApplyLeave="cacelApplyLeave"></apply-leave> 
        </el-dialog>
        <el-dialog title="申请补课"  size="small"  :visible.sync="isApplyMakeUp" :close-on-click-modal='false' @close="closeleaveAndMakeUpRecordFn" label-position="left">
           <apply-make-up  :courseTableDetailId="courseTableDetailId" :studentId="studentId" @cacelApplyMakeUp="cacelApplyMakeUp"></apply-make-up> 
        </el-dialog>
        <el-dialog title="申请转班"  size="small"  :visible.sync="isClassTimeClassTransfer" :close-on-click-modal='false' @close="closeleaveAndMakeUpRecordFn" label-position="left">
           <class-time-class-transfer  :courseTableDetailId="courseTableDetailId" :studentId="studentId" @cacelClassTimeClassTransfer="cacelClassTimeClassTransfer"></class-time-class-transfer> 
        </el-dialog>
  </div>    
</template>
<script>
import leaveAndMakeUpRecord from './leaveAndMakeUpRecord';
import classTimeLeaveRecord from './classTimeLeaveRecord';
import studentSignUp from '../signUp/studentSignUp1';
import lodash from 'lodash'
import makeup from './makeup'
import suspendClasses from './suspendClasses'
import suspendClassesInfo from './suspendClassesInfo'
import applyLeave from './applyLeave'
import applyMakeUp from './applyMakeUp'
import classTimeClassTransfer from './classTimeClassTransfer'
export default {
    props:['name','termId'],
    data () {
        return {
            studentId: parseInt(this.$route.query.studentId || 0),
            curriculum: '',
            courseTabledetailStudents: [],
            level: '',
            term: {},
            suspensionDate: '',
            reason: '',
            currentCycle: '',
            sShiftReason: '',
            sShiftStartDate: '',
            courseTableDetailStudentId: 0,
            classTransferCourseTableDetailDate: '',
            isSuspendClass: false,
            isSuspendClassInfo: false,
            isMakeup: false,
            nCourseTableDetailId: Number,
            nStudentId: this.$route.query.studentId,
            isTransferTheClassShow: false,
            isLeaveAndMakeUpRecord: false,
            isClassTimeLeaveAndMakeUpRecord: false,
            courseTableDetailId: 0,
            isApplyLeave: false,
            isApplyMakeUp: false,
            isApplyClassTransfer: false,
            isClassTimeClassTransfer: false,
            classTimeCourseTabledetailStudents: [],
            levels: [
                    {
                    id: 1,
                    name: '无等级'
                    },
                    {
                    id: 2,
                    name: 'A'
                    },
                    {
                    id: 3,
                    name: 'B'
                    },
                    {
                    id: 4,
                    name: 'C'
                    },
                    {
                    id: 5,
                    name: 'D'
                    },
                ],
        }
    },
    mounted () {
        this.loadData();
    },
    methods:{
        loadData() {
            this.$http.get("/api/student/getSignUpTerms",{params:{studentId: this.studentId}}).then((response) => {
                let res = response.data;
                if (res.code) {
                    let {term1,courseTabledetailStudents} = res.data
                    this.courseTabledetailStudents = courseTabledetailStudents;
                    console.log(courseTabledetailStudents.length,111111);
                    this.term = term1;
                    if (this.courseTabledetailStudents>0) {
                       this.$emit('termFn',this.term.id);
                    }
                }else{
                    this.$message(res.msg);
                }
            }).then(()=>{
                this.$http.get("/api/student/getSignUpClassTime",{params:{studentId: this.studentId}}).then((response) => {
                    let res = response.data;
                    if (res.code) {
                        let {term1,courseTabledetailStudents} = res.data
                        this.classTimeCourseTabledetailStudents = courseTabledetailStudents;
                        this.term = term1;
                        if (this.courseTabledetailStudents==0) {
                        this.$emit('termFn',this.term.id);
                        }
                    }else{
                        this.$message(res.msg);
                    }
                });
            });
        },
        changeTerm() {
            this.$http.get("/api/student/getCourseTableDetailStudentByTermIdAndStudentId",{params:{studentId: this.studentId,termId:this.termId}}).then((response) => {
                let res = response.data;
                if (res.code) {
                    let {term1,courseTabledetailStudents} = res.data
                    this.courseTabledetailStudents = courseTabledetailStudents;
                    this.term = term1;
                }else{
                    this.$message(res.msg);
                }
            });
        },
        add() {
            this.showStudentSignUp = true;
        },
        btnBack() {
            //this.$emit('btnBack')
            this.showStudentSignUp=false;
        },
        view(termId) {
            this.termId = termId;
            this.showStudentSignUp = true;
        },
        //停课取消
        surpenClassCancel(){
            this.courseTableDetailStudentId = 0;
            this.isSuspendClass = false;   
        },
        //停课成功
        surpenClassSubmit(){
            this.isSuspendClass = false;
            this.changeTerm();          
        },
        toSignUp(){
            this.$emit("toSignUp")
        },
        makeupSuccess(){
            this.isMakeup=false
            this.nStudentId=0
            this.loadData();
        },
        classTransferFn(id){
            let studentId = this.$route.query.studentId
            this.$router.push({path:'/tableforclassTrasfer',query:{courseTableDetailId:id,studentId:studentId}})
        },
        classTimeclassclassTransferFn(id){
            this.courseTableDetailId = id;
            this.isClassTimeClassTransfer = true;
        },
        cacelClassTimeClassTransfer(){
            this.isClassTimeClassTransfer = false;
        },
        suspendClassesShowFn(id,item,i,startDate='',endDate=''){
            console.log(id,item,i,startDate,endDate)
            this.reason=item.reasonsForSuspension
            this.isSuspendClassShowes=true;
            this.curriculum=item.courseName
            this.level=item.level
            this.suspensionDate=item.courseTableItem.date
        },
        fApplyChangeCourse(courseTableDetailId){
            this.isMakeup=true
            this.nStudentId=this.$route.query.studentId
            this.nCourseTableDetailId=courseTableDetailId
        },
        
        openSuspendClasses (id) {
            this.courseTableDetailStudentId = id;
            this.isSuspendClass = true;
        },
        openSuspendClassesInfo (id) {
            this.courseTableDetailStudentId = id;
            this.isSuspendClassInfo = true;
        },
        recordFn(id){
            this.isLeaveAndMakeUpRecord = true;
            this.courseTableDetailId = id;
        },
        classTimeRecordFn(id){
            this.isClassTimeLeaveAndMakeUpRecord = true;
            this.courseTableDetailId = id;
        },
        //请假补课记录取消
        closeleaveAndMakeUpRecordFn(){
            this.courseTableDetailId = 0;
        },
        applyLeaveFn (id) {
            this.courseTableDetailId = id;
            this.isApplyLeave = true;
        },
        applyMakeUpFn(id){
            this.courseTableDetailId = id;
            this.isApplyMakeUp = true;
        },
        cacelApplyLeave(index){
            this.courseTableDetailId = 0;
            if (index == 0) {
                this.isApplyLeave = false;
            }
            if (index == 1) {
                this.isApplyLeave = false;
                this.changeTerm();
            }   
        },
        cacelApplyMakeUp(index){
            this.courseTableDetailId = 0;
            if (index == 0) {
                this.isApplyMakeUp = false;
            }
            if (index == 1) {
                this.isApplyMakeUp = false;
                this.changeTerm();
            }   
        }
    },
    watch:{
        '$route' (to, from) {
            if(this.studentId!=this.$route.query.studentId){
              this.studentId=this.$route.query.studentId ;
              this.loadData() 
            }
        },
        termId(){
            this.changeTerm()
        }
    },
    components:{
        suspendClasses,
        makeup,
        suspendClassesInfo,
        leaveAndMakeUpRecord,
        applyLeave,
        applyMakeUp,
        classTimeLeaveRecord,
        classTimeClassTransfer
    }
}
</script>
<style lang="less" scoped>
    .box{
        .title{
            padding-bottom: 10px;
            img{
                margin-right: 10px;
                width: 24px;
                height: 24px;
                vertical-align:middle;
            }
            span{
                font-size: 18px;
                vertical-align: middle;
            }
        }
    }
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
            em{
                font-style:normal;
            }
        }
    }
    .applyChangeCourse{
        color:#4db3ff;
        cursor: pointer;
        margin: 10px;
    }
</style>


