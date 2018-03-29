<template>
    <div class="body">
        <div class="teacher"><span>教师：</span><span>{{courseTableItem.teacher.name}}</span> </div>
        <div class="table">
          <div class="table-head">原课程信息</div>
          <div class="table-body">
            <div><span>课程：</span><em>{{courseTableItem.course.name}}</em></div>
            <div><span>类型：</span><em>学期课</em></div>
            <div><span>请假时间：</span><em>{{courseTableItem.date}} 星期{{courseTableItem.dayOfWeek}} {{courseTableItem.startTime}}~{{courseTableItem.endTime}}</em></div>
            <div><span>满员人数：</span><em>{{courseTableItem.number}}</em></div>
            <div><span>等级：</span><em>{{courseTableItem.level}}</em></div>
            <div><span>教室：</span><em>{{courseTableItem.classroom.name}}</em></div>
          </div>
        </div>
        <div class="table">
          <div class="table-head">请假信息</div>
          <div class="table-body">
            <div>
                <span><strong>*</strong>请假原因：</span>
                <el-input
                    type="textarea"
                    class="frame"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="reason">
                </el-input>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['changeClassId'],
    name:'CourseTableSwitchItemForTeacher',
    data(){
        return {
                courseTableItem:{},
                reason: '',
            }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
            this.reason = "";
            this.$http.get('/api/courseTable/getClassTimeLeaveInfo',{params:{courseTableItemId:this.changeClassId}}).then((response)=>{
               let res = response.data;
                if(res.code === 1){
                    this.courseTableItem = res.data.courseTableItem;
                }else{
                    this.$message('数据出错');
                }
            })   
        },
        submit(){
            this.$http.post('/api/courseTableLeave/addClassTimeLeave',{fromCourseTableItemId:this.courseTableItem.id, reason:this.reason, teacherId:this.courseTableItem.teacher.id}).then((response)=>{
                let res = response.data;
                if (res.code) {
                    this.$message('成功');
                    this.$emit('classTimeLeaveCancelFn');
                }else{
                    this.$message(res.msg)
                }
            })
            
        }
    },
    watch:{
        changeClassId(newData){
            if(newData!==0){
               this.init();
            }
        } 
    }
}

</script>
<style lang="less" scoped>
    .body {
      text-align:left;
      .teacher{
          margin-bottom:18px;
          font-size:16px;
          font-weight:bold;
      }
      .table{
          border:1px solid #dfe6ec;
          margin-bottom: 10px;
          .table-head{
              height:42px;
              line-height:42px;
              text-indent: 18px;
              background-color:#eef1f6;
          }
          .table-body{
              padding: 10px;
              div{
                  margin:10px 0;
                  font-size: 12px;
                  lign-height: 32px;
                  span{
                      vertical-align:top;
                      strong{
                         color:red;
                      }
                      display:inline-block;
                      width: 80px;
                      text-align:right;
                  }
                  em{
                      font-style:normal;
                      color:#c0c0c0;
                  }
                  .frame{
                      margin:0;
                      width: 300px;
                  }
              }
          }
      }
    }
</style>
