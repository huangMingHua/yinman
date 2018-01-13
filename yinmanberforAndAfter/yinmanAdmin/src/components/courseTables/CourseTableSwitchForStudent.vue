<template>
    <div >
        <div class="suspendClassShow" style="padding-left:108px;">本课程你已请假{{courseTableDetailStudent.allNumberOfChangeClass-courseTableDetailStudent.numberOfleave}}次，剩余{{courseTableDetailStudent.numberOfleave}}次，补课{{courseTableDetailStudent.allNumberOfChangeClass-courseTableDetailStudent.numberOfChangeClass}}次，剩余{{courseTableDetailStudent.numberOfChangeClass}}次</div>
        <div class="suspendClassShow" style="padding-left:107px;font-size:12px;color:red">(注：1次调课 = 1次请假 + 1次补课)</div>
        <el-form  label-width="190px" :model="newItem"  :rules="rules">
            <el-form-item label="学生姓名："   class="suspendClassShow">
                {{ sStudentName }}
            </el-form-item>
            <el-form-item label="课程名称："   class="suspendClassShow">
                {{ info.courseName }}
            </el-form-item>
            <el-form-item label="时长：" class="suspendClassShow">
                {{ info.duration }}分钟
            </el-form-item>
            <el-form-item label="时间：" class="suspendClassShow">
               {{ info.date | viewDate }} {{ info.dayOfWeek }} {{ info.startTime | viewHouAndSec }} ~ {{ info.endTime | viewHouAndSec }}
            </el-form-item>
            <el-form-item label="教师：" class="suspendClassShow" prop="teacherId">
                <el-select v-model="newItem.teacherId" @change="fChangeTeacher">
                    <el-option v-for="item in data" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
           <el-form-item label="请选择补课时间：" prop="toCourseTableItemId">
                <el-select v-model="newItem.toCourseTableItemId" style="width:100%;" placeholder="请选择">
                    <el-option v-for="item in aChangeClass"  :key="item.id" 
                       :label=" (item.date +' '+item.dayOfWeek+' '+item.startTime + '-' +item.endTime )" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="调课原因：" prop="reason">
                <el-input v-model="newItem.reason"></el-input>
            </el-form-item>
            <el-form-item style="text-align:left;">
                <el-button @click="cancel()" style="margin-left:40px">取消</el-button>
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
    },
    data() {
        return {
            data: {},
            info:{},
            newItem: { 
                toCourseTableItemId:'',
                reason:'',
                teacherId: '',
            },
            rules: {
                teacherId: [
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
            aChangeClass:[],
            courseTableDetailStudent:{}
            
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
            this.$http.get('/api/courseTableChangeClass/getChangeClassDataForStudent?id='+ this.id+'&studentId='+this.studentId).then((res) =>{
                var data = res.data;
                this.data = data.teachers;
                this.sStudentName=data.student.name
                this.info = data.info;
                this.courseTableDetailStudent=data.courseTableDetailStudent
            });
        },
        saveAdd(){
            this.newItem.fromCourseTableItemId = this.id;
            this.newItem.studentId = this.studentId;
            if(!this.newItem.teacherId){
                this.$message({
                            message: '请选择教师',
                            type: 'error'
                        });
              return
            }
            if(!this.newItem.toCourseTableItemId){
                this.$message({
                            message: '请选择补课时间',
                            type: 'error'
                        });
              return
            }
            
            this.$http.post('/api/courseTableChangeClass/addChangeClass', this.newItem).then((res)=>{
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
        },
        fChangeTeacher(){
            this.$http.post('/api/courseTableChangeClass/getChangeClassDataForStudentByTeacherId',{id:this.id,studentId:this.studentId,teacherId:this.newItem.teacherId}).then((res) =>{
                console.log(res)
                if(res.data.code=1){
                   this.aChangeClass=res.data.data
                }else{
                   console.log(res.data.msg) 
                }
                // var data = res.data;
                // this.data = data.teachers;
                // this.info = data.info;
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
  .suspendClassShow{
      text-align: left;
  }
</style>
