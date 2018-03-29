<template>
    <div>
        <div class="row"> 
            <span>姓名：</span>
            <strong class="value">{{courseTableDetailStudent.student.name}}</strong>
        </div>
        <div class="row"> 
            <span>课程：</span>
            <strong class="value">{{courseTableDetail.course.name}}</strong>
        </div>
        <div class="row"> 
            <span>类型：</span>
            <strong class="value">学期课</strong>
        </div>
        <div class="row"> 
            <span>等级：</span>
            <strong class="value">{{courseTableDetail.level}}</strong>
        </div>
        <div class="row"> 
            <span>课程结束日期：</span>
            <strong class="value">{{courseTableDetailStudent.endCourseTableItem.date}}</strong>
        </div>
        <div class="row"> 
            <span>课程结束原因：</span>
            <strong class="value">{{courseTableDetailStudent.reasonsForSuspension}}</strong>
        </div>
        <div class="row"> 
            <span>停课日期前课时数：</span>
            <strong>{{classNum}}</strong>
        </div>
        <div  class="careful">
           <img src="../../assets/images/prompt.png"/> <span>注：停课日期（含）之后的调课、请假、补课会删除</span>
        </div>
        <div class="btns">
           <el-button @click="cancel">取消</el-button><el-button type="primary" @click="submit">确定</el-button>
        </div>
    </div>
</template>
<script>
    export default{
        props: ["courseTableDetailStudentId"],
        data () {
            return {
                courseTableItems: [],
                courseTableDetail: {},
                classNum:0,
                courseTableDetailStudent:{}
            }
        },
        mounted () {
            this.init()
        },
        computed:{
            
        },
        methods :{
            init () {
                this.$http.get('/api/courseTable/getSuspendClassesInfoByCourseTableDetailStudentId',{params:{courseTableDetailStudentId:this.courseTableDetailStudentId}}).then((response)=>{
                    let res = response.data;
                    if(res.code){
                       let {courseTableDetail,courseTableDetailStudent,filterCourseTableItems} = res.data;
                        this.courseTableDetail = courseTableDetail;
                        this.courseTableDetailStudent = courseTableDetailStudent;
                        this.classNum = filterCourseTableItems.length
                    }else{
                        this.fail(res.msg)
                    }
                })
            },
            cancel () {
               this.$emit('surpenClassCancel')
            },
            submit () {
                if (!this.courseTableItemId&&!this.classNum) {
                   return this.$message('请选择课程结束日期');
                }
                if (!this.reason) {
                   return this.$message('请输入课程结束原因');
                }
                this.$http.post('/api/courseTable/suspendClasses',{courseTableDetailStudentId:this.courseTableDetailStudentId,reason: this.reason,courseTableItemId:this.courseTableItemId}).then((response)=>{
                    let res = response.data
                    if (res.code) {
                        this.cancel()
                    } else {
                      this.$message(res.msg) 
                    }
                })
            }
        }
    }
</script>
<style  lang="less" scoped>
    .row{
        padding-top: 10px;
        span {
            display: inline-block;
            width: 170px;
            height: 50px;
            text-align: right;
            vertical-align:top;    
        }
    }
    
    .value{
        width: 300px;
        vertical-align: middle;
    }
    .careful{
        display:flex;
        align-items:center;
        width: 480px;
        margin: 0 auto;
        height: 50px;
        color: red;
        border-top: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        img{
           width: 20px;
           height: 20px;
           margin-right: 10px;
        }
    }
    .btns {
        padding-top: 20px;
        display:flex;
        justify-content:center;
    }
</style>