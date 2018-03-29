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
        <div class="table">
          <div class="table-head">补课时间</div>
          <div class="table-body">
            <div><span>教师：</span>
              <el-select class="frame" v-model="teacher" @change="changeTeacher" placeholder="请选择">
                <el-option
                v-for="(item,index) in teachers"
                :key="item.teacher.id"
                :label="item.teacher.name"
                :value="index">
                </el-option>
              </el-select>
            </div>
            <div><span>补课时间：</span>
               <el-select class="frame" v-model="makeUp" @change="changeMakeUp" placeholder="请选择">
                <el-option
                v-for="item in makeUps"
                :key="item.id"
                :label="item.date+' '+item.startTime+'~'+item.endTime"
                :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div><span>教室：</span>
              <el-input :disabled="true" v-model="classroom" class="frame" placeholder=""></el-input>
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
                teachers:[
                    
                ],
                teacher: '',
                makeUps:[
                ],
                makeUp: '',
                classroom: ''
            }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
            this.courseTableItem = {}
            this.reason = ''
            this.teachers = []
            this.teacher = ''
            this.makeUps = []
            this.makeUp = ''
            this.classroom = ''
            this.$http.get('/api/courseTable/getChangeClassInfo',{params:{courseTableItemId:this.changeClassId}}).then((response)=>{
               let res = response.data;
                if(res.code === 1){
                    this.courseTableItem = res.data.courseTableItem;
                    this.teachers = res.data.courseTableItemsGroup1;
                }else{
                    this.$message('数据出错');
                }
            })   
        },
        changeTeacher(index){
            this.makeUps = this.teachers[index].courseTableItemsGroup
        },
        changeMakeUp(id){
             this.makeUps.map((item)=>{
              if(item.id === id){
                 this.classroom = item.classroom.name
              }
            })
        },
        submit(){
            if(this.makeUp){
              this.$http.post('/api/courseTableChangeClassForTeacher/addChangeClass',{fromCourseTableItemId:this.courseTableItem.id, toCourseTableItemId:this.makeUp, reason:this.reason, teacherId:this.courseTableItem.teacher.id}).then((response)=>{
                let res = response.data;
                if (res.code) {
                    this.init();
                    this.changeClassId=0;
                    this.$message('成功');
                    this.$emit('changeClassCancelFn');
                }else{
                    this.$message(res.msg);
                }
              })
            }else{
               this.$http.post('/api/courseTableLeave/addLeaveForTeacher',{fromCourseTableItemId:this.courseTableItem.id, reason:this.reason, teacherId:this.courseTableItem.teacher.id}).then((response)=>{
                let res = response.data;
                if (res.code) {
                    this.init();
                    this.changeClassId=0;
                    this.$message('成功');
                    this.$emit('changeClassCancelFn');
                }else{
                    this.$message(res.msg)
                }
              }) 
            }
            
        }
    },
    watch:{
        changeClassId(newData){
            if (newData !==0 ) {
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
