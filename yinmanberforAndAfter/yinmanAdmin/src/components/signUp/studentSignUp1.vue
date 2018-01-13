  <template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
    <el-form-item label="学期" prop="term">
         <el-select v-model="ruleForm.term" @change="changeTerm" placeholder="请选择">
            <el-option
                v-for="item in aTerm"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
    </el-form-item>
     <el-form-item label="课程" prop="courseName">
         <el-select v-model="ruleForm.courseName" @change="changeCourseName" placeholder="请选择">
            <el-option
                v-for="item in aCourseName"
                :key="item.courseName"
                :label="item.courseName"
                :value="item.courseName">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="教师" prop="teacherName">
         <el-select v-model="ruleForm.teacherName" @change="changeTeacherName" placeholder="请选择">
            <el-option
                v-for="item in aTeacherName"
                :key="item.teacherName.id"
                :label="item.teacherName.name"
                :value="item.teacherName.id">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="星期" prop="dayOfweek">
         <el-select v-model="ruleForm.dayOfweek" @change="changeDayOfweek" placeholder="请选择">
             <el-option
                v-for="item in aDayOfWeek"
                :key="item.dayOfWeek+' '+item.startTime+'~'+item.endTime"
                :label="item.dayOfWeek+' '+item.startTime+'~'+item.endTime"
                :value="item.dayOfWeek+' '+item.startTime+'~'+item.endTime">
            </el-option> 
        </el-select>
    </el-form-item> 
    <el-form-item label="周期" prop="weekCycle">
         <el-select v-model="ruleForm.weekCycle" @change="changeWeekCycle" placeholder="请选择">
             <el-option
                v-for="item in aCycle"
                :key="item.id"
                :label="item.startDate+'~'+item.endDate"
                :value="item.id">
            </el-option> 
        </el-select>
    </el-form-item> 
    <el-form-item label="教室">
         <span>{{sClassRoom}}</span>
    </el-form-item> 
    <el-form-item label="特殊要求" >
         <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="ruleForm.specialRequirements">
         </el-input>
    </el-form-item>
    <el-form-item>
        <el-button @click="calcel" class="btn">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 认</el-button>
    </el-form-item>
</el-form>
</template>
<script>
  export default {
      props:['studentId'],
    data() {
      return {
        ruleForm: {
          term:'',
          courseName: '',
          teacherName:'',
          dayOfweek:'',
          weekCycle:'',
          specialRequirements:''
        },
        rules: {
          courseName: [
            { required: true, message: '请选择课程', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          teacherName: [
            { required: true, message: '请选择教师' },
          ],
          term:[
            { required: true, message: '请选择学期'},
          ],
          dayOfweek: [
            { required: true, message: '请选择星期'},
          ],
          weekCycle: [
            { required: true, message: '请选择周期'},
          ],
        },
        aCourseName:[],
        aTeacherName:[],
        aWeekCycle:[],
        aDayOfWeek:[],
        aTerm:[],
        sClassRoom:'',
        aCourse:[],
        remarks:"",
        aCycle:[]
      };
    },
    created(){
        this.init()
    },
    methods: {
      init(){
         this.$http.get("/api/courseTable/getTerm").then((res) => {
           if(res.data.code==1){
              this.aTerm=res.data.data
            }
         })
      },
      submitForm(formName) {
          console.log(this.ruleForm.weekCycle)
        this.$refs[formName].validate((valid) => {
          if (valid) {
             this.$http.post("/api/signUpCurriculum/saveCurriculum", { studentId:this.studentId , curriculumId:this.ruleForm.weekCycle , specialRequirements: this.ruleForm.specialRequirements}).then((res) => {
                    if (res.data.code==1) {
                        this.$emit('signUpSuccess')
                        this.$message('提交成功')
                    } else {
                        this.$message(res.data.msg)
                    }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      changeTerm(){
         this.$http.get("/api/courseTable/getApplicableCourseByTermId?termId="+this.ruleForm.term+"&studentId="+this.studentId).then((res) => {
           console.log(res)
               if (res.data.code==1){
                 this.aCourseName = res.data.data
                  console.log(this.aCourseName)
                  // this.setData({
                  //   curriculums: this.data.curriculums, 
                  //   aWeek: ['请选择'],
                  //   weekIndex: 0,
                  //   index: 0,
                  //   aTeacher: ['请选择'],
                  //   teacherIndex: 0,
                  //   aCycle: ['请选择'],
                  //   cycleIndex: 0,
                  //   iClassRoom: '' })
                }
         });   
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      changeCourseName(){
         this.$http.get("/api/courseTable/getApplicableCourseByCourseNameAndTermId?courseName="+this.ruleForm.courseName+"&termId="+this.ruleForm.term).then((res) => {
                this.aTeacherName=res.data.data
         });
      },
      changeTeacherName(){
        this.$http.get("/api/courseTable/getApplicableCourseByCourseNameAndTeacherNameAndTermId?courseName="+this.ruleForm.courseName+"&teacherName="+this.ruleForm.teacherName+"&termId="+this.ruleForm.term).then((res) => {
                console.log(res.data)
                this.aDayOfWeek=res.data.data
        });
      },
      changeDayOfweek(){
         this.$http.get("/api/courseTable/getApplicableCourseByTermIdAndCourseNameAndTercherNameAndWeek?courseName="+this.ruleForm.courseName+"&teacherName="+this.ruleForm.teacherName+"&termId="+this.ruleForm.term+"&week="+this.ruleForm.dayOfweek).then((res) => {
                if (res.data.code == 1){
                  if ( res.data.data.length > 1) {
                    this.ruleForm.weekCycle = ""
                     this.aCycle = res.data.data
                  } else if (res.data.data.length == 1) {
                      this.remarks = res.data.data[0].remarks
                      this.ruleForm.weekCycle = res.data.data[0].id
                      this.aCycle = res.data.data
                      this.sClassRoom=res.data.data[0].classroom.name
                  }
                }else{
                  console.log('出错')
                }
        });
      },
      changeWeekCycle(item){
      
         for(let it of this.aCycle){
            if(item==it.id){
              console.log(item)
              this.sClassRoom=it.classroom.name
            }
         }
      },
      calcel(){
          this.$emit('btnBack')
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-form{
    width:500px !important;
  }
  .btn{
    margin-left: 50px;
  }
</style>

