<template>
    <div >
        <div class="suspendClassShow" style="padding-left:108px;margin-bottom:20px;">本课程你已调课{{data.courseTableDetailStudent.numberOfChangeClassForTeacher-data.courseTableDetailStudent.allNumberOfChangeClassForTeacher}}次，剩余{{data.courseTableDetailStudent.allNumberOfChangeClassForTeacher}}次</div>
        <el-form  label-width="190px" :model="newItem" :rules="rules" :show-message='false'>
            <el-form-item label="课程名称：" class="suspendClassShow">
                {{ data.courseTableItem.courseName }}
            </el-form-item>
            <el-form-item label="时长：" class="suspendClassShow">
                {{ data.courseTableItem.duration }}分钟
            </el-form-item>
            <el-form-item label="时间：" class="suspendClassShow">
               {{ data.courseTableItem.date | viewDate }} {{ data.dayOfWeek }} {{ data.courseTableItem.startTime | viewHouAndSec }} ~ {{ data.courseTableItem.endTime | viewHouAndSec }}
            </el-form-item>
           <el-form-item label="请选择补课时间：" prop='toCourseTableItemId'>
                <el-select v-model="newItem.toCourseTableItemId" style="width:100%;" placeholder="请选择">
                    <el-option v-for="item in data.courseTableItemOther" :key="item.id" 
                       :label=" (item.date +' '+item.startTime + '-' +item.endTime )" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请假原因：" prop='reason'>
                <el-input v-model="newItem.reason"></el-input>
            </el-form-item>
            <el-form-item class="suspendClassShow">
                <el-button @click="cancel()" style="margin-left:40px;">取消</el-button>
                <el-button type="primary" @click="saveAdd()">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'course-table-switch',
    props: ['id','nStudentId'],
    data() {
        return {
            data: {
                
            },
            newItem: { toCourseTableItemId:'',reason:'' },
            rules: {
                toCourseTableItemId: [
                    { required: true, message: '请选择补课时间',trigger: 'blur' },
                ],
                reason: [
                    { required: true, message: '请假原因不能为空' ,trigger: 'blur'}
                ]
            }
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
            this.$http.get('/api/courseTableChangeClassForTeacher/getBeforeChangeClassDate?id='+ this.id+'&nStudentId='+this.nStudentId).then((res) =>{
                if (res.data.code == 1) {
                    console.log(res.data.data)
                     this.data=res.data.data
                } else {
                    console.log(`${res}获取老师调课信息后台报错`)
                }
            });
        },
        saveAdd(){
            this.newItem.fromCourseTableItemId = this.id;
            this.newItem.teacherId = this.data.courseTableItem.teacherId;
            if(!this.newItem.toCourseTableItemId){
                this.$message({
                            message:'请选择补课时间',
                            type: 'error'
                        });
                        return
            }
             if(!this.newItem.reason){
                this.$message({
                            message: '请假原因不能为空',
                            type: 'error'
                        });
                        return
            }
            this.$http.post('/api/courseTableChangeClassForTeacher/addChangeClass', this.newItem).then((res)=>{
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
            this.newItem= { 
              toCourseTableItemId:'',
              reason:'' 
            }
        }
    },
    components:{
    }
}
</script>
<style lang="less" scoped>
 
</style>
