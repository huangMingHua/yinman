<template>
    <div >
        <div class="suspendClassShow" style="padding-left:94px;">本课程你已请假{{courseTableDetailStudent.allNumberOfChangeClass-courseTableDetailStudent.numberOfleave}}次，剩余{{courseTableDetailStudent.numberOfleave}}次，补课{{courseTableDetailStudent.allNumberOfChangeClass-courseTableDetailStudent.numberOfChangeClass}}次，剩余{{courseTableDetailStudent.numberOfChangeClass}}次</div>
        <div class="suspendClassShow" style="padding-left:92px;font-size:12px;color:red">(注：一次调课= 一次请假 + 一次补课)</div>
        <el-form  label-width="175px" :model="newItem"  :rules="rules">
            <el-form-item label="学生姓名："   class="suspendClassShow">
                {{ sStudentName }}
            </el-form-item>
            <el-form-item label="课程名称："   class="suspendClassShow">
                {{ info.courseName }}
            </el-form-item>
            <el-form-item label="时长：" class="suspendClassShow">
                {{ info.duration }}分钟
            </el-form-item>
            <el-form-item label="等级：" class="suspendClassShow">
                {{ info.level }}
            </el-form-item>
            <el-form-item label="人数：" class="suspendClassShow">
                {{ info.number }}
            </el-form-item>
            <el-form-item label="时间：" class="suspendClassShow">
               {{ info.date | viewDate }} {{info.dayOfWeek}} {{ info.startTime | viewHouAndSec }} ~ {{ info.endTime | viewHouAndSec }}
            </el-form-item>
            <el-form-item label="请假原因：" prop="reason">
                <el-input v-model="newItem.reason"></el-input>
            </el-form-item>
            <el-form-item class="suspendClassShow">
                <el-button @click="cancel()" style="margin-left:40px;">取消</el-button>
                <el-button type="primary" @click="saveAdd()" >提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
// import post from '../../post'
// import get from '../../get';
// import moment from 'moment';
// import momentlocale from 'moment/locale/zh-cn';
// import lodash from 'lodash';

export default {
    name: 'course-table-switch-for-student',
    props: {
        id : Number, 
        studentId: Number,
        sStatus: String,
        teacherId:Number
    },
    data() {
        return {
            data: {},
            info:{},
            newItem: { 
                reason:'',
                fromCourseTableItemId:''
            },
            rules: {
                currentTeacher: [
                    { required: true, message: '请选择教师' },
                ],
                toCourseTableItemId: [
                    { required: true, message: '请选择补课时间' }
                ],
                reason: [
                    { required: true, message: '请输入请假原因' }
                ],
            },
            sStudentName:'',
            courseTableDetailStudent:''
        }
    },
    created(){
        this.getData();
    },
    methods:{
        cancel(){
            this.$emit('cancel');
        },
        getData(){
            this.$http.get('/api/courseTableLeave/getLeaveDataForStudent?id='+ this.id+'&studentId='+this.studentId+'&teacherId='+this.teacherId).then((res) =>{
                var data = res.data;
                this.sStudentName=data.student.name
                this.info = data.info;
                let aDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                this.info.dayOfWeek=aDay[new Date(this.info.date).getDay()]
                this.courseTableDetailStudent=data.courseTableDetailStudent
            });
        },
        saveAdd(){
            this.newItem.fromCourseTableItemId = this.id;
            this.newItem.studentId = this.studentId;
            this.newItem.sStatus = this.sStatus;
            if(!this.newItem.reason){
                this.$message({
                            message: '请输入请假原因',
                            type: 'error'
                        });
              return
            }
            this.$http.post('/api/courseTableLeave/addLeave', this.newItem).then((res)=>{
                var data = res.data;
                if(data.code == 1){
                    this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                    this.$emit('success');
                }
                else{
                    this.$message({
                            message: data.msg,
                            type: 'error'
                        });
                }
            });
        }
    },
    watch:{
        id(newVal, oldVal){
            this.getData();
        }
    },
    components:{
    }
}
</script>
<style lang="less">
  .el-form .el-form-item.suspendClassShow{
      text-align: left;
      margin-bottom: 10px;
  }
</style>
