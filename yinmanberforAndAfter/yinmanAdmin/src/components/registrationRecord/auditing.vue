<template>
       <div class="box" v-if="detail.user">
             <com-user :userId="detail.user.id"></com-user>
             <div class="box-row" style="border-top:1px solid #c1c1c1">
                <span>宝宝姓名：</span>
                <em>{{detail.student.name}}</em>
             </div> 
              <div class="box-row">
                <span>报名课程：</span>
                <em >{{detail.courseTableDetail.course.name}} （等级：{{detail.courseTableDetail.level}}）</em>
             </div class="box-row">
             <div class="box-row">
                <span>教师姓名：</span>
                <em >{{detail.courseTableDetail.teacher.name}}</em>
             </div> 
             <div class="box-row" v-if="detail.courseTableDetail.dayOfWeek">
                <span>课程周期：</span>
                <em>{{detail.courseTableDetail.startDate}}至{{detail.courseTableDetail.endDate}}</em>
             </div> 
             <div class="box-row" v-if="detail.courseTableDetail.dayOfWeek">
                <span>课程时间：</span>
                <em >{{detail.courseTableDetail.dayOfWeek}} {{detail.courseTableDetail.startTime}}~{{detail.courseTableDetail.endTime}}</em>
             </div> 
             <div class="box-row" v-if="!detail.courseTableDetail.dayOfWeek">
                <span>课程时间：</span>
                <em >{{detail.courseTableDetail.startTime}}</em>
             </div> 
             <div class="box-row" v-if="!detail.courseTableDetail.dayOfWeek">
                <span>时长：</span>
                <em >{{detail.courseTableDetail.duration}}分钟</em>
             </div> 
             <div class="box-row" v-if="!detail.courseTableDetail.dayOfWeek">
                <span>课时数：</span>
                <em >{{detail.classTimeNum}}</em>
             </div> 
             <div class="box-row">
                <span>教室：</span>
                <em>{{detail.courseTableDetail.classroom.name}}</em>
             </div>
             <div class="box-row">
                <span>人数：</span>
                <em >{{detail.courseTableDetail.number}}</em>
             </div>
             <div class="box-row" style="border-bottom:1px solid #c1c1c1;padding-bottom: 20px;" >
              <span style="vertical-align: top;">特殊要求：</span>
              <em style="display:inline-block;width:650px;">{{detail.specialRequirements}}</em>
            </div>
            <!-- //学期课 -->
            <div class="box-row" v-if="detail.courseTableDetail.dayOfWeek">
              <strong class="warn" style="top:8px;left:50px">*</strong>
              <span>审核操作：</span>
              <el-radio-group @change = "radioFn" :disabled="radioDisabled" v-model="radio">
                <el-radio class="radio"  label="确认">确认</el-radio>
                <el-radio class="radio"  label="拒绝">拒绝</el-radio>
                <el-radio class="radio"  label="更改时间">更改课程时间</el-radio>
              </el-radio-group>
              <el-select v-model="changeCurriculumId" v-if="isCurriculum&&detail.courseTableDetail.dayOfWeek" :disabled="curriculumDisabled" class='changeCourseChecked' @change="changeCurriculumFn" placeholder="请选择">
                    <el-option
                      v-for="item in curriculumArray"
                      :key="item.id"
                      :label="item.teacher.name+' '+item.dayOfWeek+' '+item.startDate+'~'+item.endDate+' '+item.startTime+'~'+item.endTime+'  '+item.number+'人，'+item.level"
                      :value="item.id">
                    </el-option>
              </el-select>
            </div>
            <!-- 课时课 -->
            <div class="box-row" v-if="!detail.courseTableDetail.dayOfWeek">
              <strong class="warn" style="top:8px;left:50px">*</strong>
              <span>审核操作：</span>
              <el-radio-group @change = "radioFn" :disabled="radioDisabled" v-model="radio">
                <el-radio class="radio"  label="确认">确认</el-radio>
                <el-radio class="radio"  label="拒绝">拒绝</el-radio>
                <el-radio class="radio"  label="更改时间">更改课程</el-radio>
              </el-radio-group>
              <el-select v-model="changeCurriculumId" v-if="isCurriculum" :disabled="curriculumDisabled" class='changeCourseChecked' @change="changeCurriculumFn" placeholder="请选择">
                    <el-option
                      v-for="item in curriculumArray"
                      :key="item.id"
                      :label="item.teacher.name+' '+item.course.name+' '+item.duration+' '+item.level"
                      :value="item.id">
                    </el-option>
              </el-select>
            </div>
            <div class="box-row red" v-if="detail.courseTableDetail.dayOfWeek">
              <span>*更改课程时间条件：</span>
              <em>课程名相同即可更改课程，调课后请主动与学生再确认。</em>
            </div>
            <div class="box-row red" v-if="!detail.courseTableDetail.dayOfWeek">
              <span>*更改课程时间条件：</span>
              <em>课程和时长相同的空余课程时间</em>
            </div>
            <div class="box-row" v-if="detail.courseTableDetail.dayOfWeek">
              <span>更改课程开始日期：</span>
              <el-checkbox v-model="changeStateDateCkecked" :disabled="stateDateCkeckedDisabled" @change="changeStateDateFn"></el-checkbox>
              <el-select v-model="changeStateDateId" :disabled="startDateDisabled" class='changeWeek' @change="stateDateFn" placeholder="请选择" >
                <el-option
                  v-for="item in startDateArray"
                  :key="item.id"
                  :label="item.date"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
              <div class="box-row">
                <strong class="warn" style="top:0px;left:50px">*</strong>
                <span>支付方式：</span>
                <el-radio-group  v-model="paymentMethod" :disabled="paymentMethodDisabled">
                  <el-radio class="radio"  label="现金">现金</el-radio>
                  <el-radio class="radio"  label="刷卡">刷卡</el-radio>
                  <el-radio class="radio"  label="网银转账">网银转账</el-radio>
                  <el-radio class="radio"  label="支付宝">支付宝</el-radio>
                  <el-radio class="radio"  label="微信">微信</el-radio>
               </el-radio-group>
              </div>
              <div class="box-row">
                <strong class="warn" style="top:38px;left:50px">*</strong>
                <span>审核备注：</span>
                <el-input
                  class="input"
                  type="textarea"
                  :rows="4"
                  :disabled="reviewRemarksDisabled"
                  v-model="reviewRemarks"
                  placeholder="请输入内容"
                >
                </el-input>
              </div>
              <div class="btns">
                <el-button @click="goBack">取消</el-button>
                <el-button type="primary"  @click="submit">提交</el-button>
              </div>  
            </div>
</template>
<script>
 import comUser from '../common/userInfo'
   export default {
        props:['id','type'],
        data(){
          return {
            //课程信息  
            detail: {},
            //审核操作
            radio: "",
            //是否选择更改课程开始日期操作
            changeStateDateCkecked: false,
            //更改开始日期的id
            changeStateDateId: '',
            startDateArray: [],
            //支付方式
            paymentMethod: '',
            reviewRemarks: '',
            changeCurriculumId: '',
            curriculumArray: [],
            isCurriculum: false,
            startDateDisabled: true,
            curriculumId: this.id,
            radioDisabled: false,
            stateDateCkeckedDisabled: false,
            paymentMethodDisabled: false,
            reviewRemarksDisabled: false,
            curriculumDisabled:false,
            //禁止事件
            mothod:false,
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
        created() {
          //初始化
          if(this.id){
            this.init()
          }else{
            this.$message('id不存在')
          }
        },
        computed:{
          
            // confirmedTime:function(){
            //   return this.singleUser.curriculum.confirmedTime
  
        },
        methods:{
          init(){
            if (this.type) {
              this.$http.get(`/api/signUpCurriculum/getClassById?id=${this.id}`).then((response) => {
                if (response.data.code) {
                  //课时课审核操作
                  this.mothod = true;
                  this.changeCurriculumId='';
                  response.data.data.courseTableDetail.level = this.levels[response.data.data.courseTableDetail.level-1].name;
                  this.detail = response.data.data;
                  if (this.detail.state === '已确认') {
                    //已确认规则 radio选择确认 付款设置 备注设置 其他全部禁用
                    this.radio = '确认';
                    this.paymentMethod = this.detail.paymentMethod;
                    this.reviewRemarks = this.detail.reviewRemarks;
                    if (this.detail.changeCourseTableDetail){
                      //更改时间设置 adio选择更改时间 付款设置 备注设置 其他全部禁用 更改时间展示 内容更改
                      console.log(this.detail.changeCourseTableDetail)
                      this.radio = '更改时间';
                      this.isCurriculum=true;
                      this.curriculumDisabled=true
                      this.changeCurriculumId=this.detail.courseTableDetail.teacher.name+' '+this.detail.changeCourseTableDetail.course.name+' '+this.detail.changeCourseTableDetail.duration+' '+this.detail.changeCourseTableDetail.level
                    }
                    //更改开始时间
                    if (this.detail.startCourseTableItemId) {
                      this.changeStateDateCkecked = true;
                      this.changeStateDateId = this.$moment(this.detail.startCourseTableItem.date).format('YYYY-MM-DD')
                    }else{
                      this.changeStateDateCkecked = false;
                      this.changeStateDateId = ''
                    }
                    this.reviewRemarksDisabled = this.radioDisabled = this.stateDateCkeckedDisabled = this.paymentMethodDisabled = true
                  }
                  if (this.detail.state === '待确认') {
                    //待确认全部初始化
                    this.mothod = false
                    this.radio = ""
                    //是否选择更改课程开始日期操作
                    this.changeStateDateCkecked = false,
                    //更改开始日期的id
                    this.changeStateDateId = '',
                    this.startDateArray = [],
                    //支付方式
                    this.paymentMethod = '',
                    this.reviewRemarks = '',
                    this.changeCurriculumId = '';
                    this.curriculumArray = [];
                    this.isCurriculum = false;
                    this.startDateDisabled = true;
                    this.curriculumId = this.id;
                    this.radioDisabled = false;
                    this.stateDateCkeckedDisabled = false;
                    this.paymentMethodDisabled = false;
                    this.reviewRemarksDisabled = false;
                  }
                  if (this.detail.state === '已拒绝') {
                    //拒绝全部禁用
                    this.radio = "拒绝";
                    this.reviewRemarksDisabled=this.radioDisabled = this.stateDateCkeckedDisabled = this.paymentMethodDisabled = true
                  }
                }else{
                  this.$message('数据出错')
                }
              })
            }else{
              this.$http.get(`/api/signUpCurriculum/getById?id=${this.id}`).then((response) => {
                if (response.data.code) {
                  //学期课审核操作
                  this.mothod = true
                  response.data.data.courseTableDetail.level = this.levels[response.data.data.courseTableDetail.level-1].name;
                  this.detail = response.data.data;
                  if (this.detail.state === '已确认') {
                    //已确认规则 radio选择确认 付款设置 备注设置 其他全部禁用
                    this.radio = '确认';
                    this.changeCurriculumId='';
                    this.isCurriculum = false;
                    this.paymentMethod = this.detail.paymentMethod;
                    this.reviewRemarks = this.detail.reviewRemarks;
                    if (this.detail.changeCourseTableDetail){
                      //更改时间设置 adio选择更改时间 付款设置 备注设置 其他全部禁用 更改时间展示 内容更改
                      this.radio = '更改时间';
                      this.changeCurriculumId = '';
                      this.isCurriculum = true;
                      this.curriculumDisabled = true
                      this.changeCurriculumId = this.detail.changeCourseTableDetail.teacher.name+' '+this.detail.changeCourseTableDetail.dayOfWeek+' '+this.detail.changeCourseTableDetail.startDate+'~'+this.detail.changeCourseTableDetail.endDate+' '+this.detail.changeCourseTableDetail.startTime+'~'+this.detail.changeCourseTableDetail.endTime+'  '+this.detail.changeCourseTableDetail.number+'人，'+this.detail.changeCourseTableDetail.level
                    }
                    //更改开始时间
                    if (this.detail.startCourseTableItemId) {
                      this.changeStateDateCkecked = true;
                      this.changeStateDateId = this.$moment(this.detail.startCourseTableItem.date).format('YYYY-MM-DD')
                    }else{
                      this.changeStateDateCkecked = false;
                      this.changeStateDateId = ''
                    }
                    this.reviewRemarksDisabled = this.radioDisabled = this.stateDateCkeckedDisabled = this.paymentMethodDisabled = true
                  }
                  if (this.detail.state === '待确认') {
                    //待确认全部初始化
                    this.mothod = false
                    this.radio = ""
                    //是否选择更改课程开始日期操作
                    this.changeStateDateCkecked = false,
                    //更改开始日期的id
                    this.changeStateDateId = '',
                    this.startDateArray = [],
                    //支付方式
                    this.paymentMethod = '',
                    this.reviewRemarks = '',
                    this.changeCurriculumId = '';
                    this.curriculumArray = [];
                    this.isCurriculum = false;
                    this.startDateDisabled = true;
                    this.curriculumId = this.id;
                    this.radioDisabled = false;
                    this.stateDateCkeckedDisabled = false;
                    this.paymentMethodDisabled = false;
                    this.reviewRemarksDisabled = false;
                  }
                  if (this.detail.state === '已拒绝') {
                    //拒绝全部禁用
                    this.radio = "拒绝";
                    this.reviewRemarksDisabled=this.radioDisabled = this.stateDateCkeckedDisabled = this.paymentMethodDisabled = true
                  }
                }else{
                  this.$message('数据出错')
                }
              })
            }
          },
          //单选框选择 如果是更改时间就显示
          radioFn(radio){
            //禁止事件
            if(this.mothod){
               return
            }
            if (radio === '更改时间') {
              //更改课程展示
              this.isCurriculum = true;
              if(this.detail.courseTableDetail.dayOfWeek){
                //获取更改课程的内容 //学期课
                this.$http.get('/api/signUpCurriculum/getSignUpCourseOtherTime?id='+this.detail.courseTableDetail.id).then((res) => {
                  if (res.data.code==1) {
                    for (let item of res.data.data) {
                      item.level = this.levels[item.level-1].name; 
                    }
                    console.log(this.curriculumArray)
                    this.curriculumArray = res.data.data
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
              }else{
                //获取更改课程的内容 //课时课
                this.$http.get('/api/signUpCurriculum/getSignUpCourseOtherClassTime?id='+this.detail.courseTableDetail.id).then((res) => {
                  if (res.data.code==1) {
                    console.log(res)
                    this.curriculumArray = res.data.data;
                  }
                  else{
                    this.$message(res.data.msg);
                  }
                })
              }
            }else{
              //其他条件下更改课程学期，开始日期，开始日期选择框开始选择内容都为默认值
              this.changeStateDateCkecked = false;
              this.startDateArray = [];
              this.startDateDisabled = true;
              this.isCurriculum = false;
              this.changeStateDateId = '';
              this.changeCurriculumId = '';
              this.curriculumArray = [];
              this.curriculumId = this.id;
              this.paymentMethod = '';
              this.reviewRemarks = '';
            }
            if (radio === '拒绝') {
              this.reviewRemarksDisabled = this.stateDateCkeckedDisabled = this.paymentMethodDisabled = true
            }else{
              this.reviewRemarksDisabled = this.stateDateCkeckedDisabled = this.paymentMethodDisabled = false
            }          
          },
          stateDateFn(){
            
          },
          changeCurriculumFn(){
            this.curriculumId = this.changeStateDateId;
          },
          //更改课程开始时间
          changeStateDateFn(){
            //禁止事件
            if(this.mothod){
               return
            }
            if (!this.radio) {
              this.changeStateDateCkecked = false;
              return this.$message('请选择审核操作')
            }
            if (this.radio === '拒绝') {
              this.changeStateDateCkecked = false;
              return this.$message('不能选择更改课程时间')
            }
            if(this.changeStateDateCkecked){
              this.startDateDisabled = false;
              //获取可以更改的课程时间
              this.$http.get('/api/signUpCurriculum/getWeekById?id='+this.detail.courseTableDetail.id).then((res) => {
              if(res.data.code==1){
                this.startDateArray=res.data.data
              }
              else{
                this.$message(res.data.msg);
              }
              })
            }else{
              this.startDateDisabled = true;
              this.startDateArray = [];
              this.changeStateDateId = ''
            }
            
          },
          goBack(){
            this.$emit('goBack');
          },
          submit(){
            console.log(this.curriculumId)
            if (!this.radio) {
              return this.$message("审核操作必选")
            }
            if(this.radio!='拒绝'){
              if (!this.paymentMethod) {
                this.$message("请选择支付方式")
                return
              }
              if (!this.reviewRemarks) {
                this.$message("请输入审核备注")
                return
              }
            }
            this.$confirm('时间确认后不可修改，是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.radio=='更改时间'){
                if (this.changeStateDateCkecked) {
                  if(!this.changeStateDateId){
                    return this.$message('开始周期不能为空')
                  }
                }
                  if(_.trim(this.changeCurriculumId)==""){
                    return this.$message("上课时间不能为空")
                  } else{
                    this.$http.post('/api/signUpCurriculum/confirm', {
                       id: this.id,
                       changeCurriculumId: this.changeCurriculumId,
                       checked: this.changeStateDateCkecked,
                       nStartWeekId: this.changeStateDateId,
                       reviewRemarks: this.reviewRemarks,
                       paymentMethod: this.paymentMethod
                    }).then((res) => {
                      if(res.data.code==1){
                        this.$emit('success');
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
                  if(!this.changeStateDateId){
                    return this.$message('开始周期不能为空')
                  }
                }
                this.$http.post('/api/signUpCurriculum/changeState', {
                  id: this.id,
                  state: this.radio,
                  checked:this.changeStateDateCkecked,
                  nStartWeekId:this.changeStateDateId,
                  reviewRemarks: this.reviewRemarks,
                  paymentMethod: this.paymentMethod
                }).then((res) => {
                  if(res.data.code==1){
                    this.$emit('success');
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
          }
        },
        components:{
          comUser,
        },
        watch:{
          id(newId){
            if (newId) {
              this.init();
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