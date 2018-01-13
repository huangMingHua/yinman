<template>
    <div class="p-search">
     <div class="p-search-wrap">
        <div class="p-search-table">
            <table>
                <thead>
                    <tr> 
                        <th>id</th><th>学生姓名</th><th>学生性别</th><th>出生日期</th><th>预约课程</th><th>预约时间</th><th>头像</th><th>昵称</th><th>家长姓名</th><th>联系电话</th><th>关注时间</th><th>最后交互</th><th>审核备注</th><th>状态</th><th>操作</th>    
                    </tr>
                    <tr> 
                        <th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th>
                           <el-select @change="query" style="margin-top:-20px;" v-model="state" placeholder="请选择">
                                  <el-option
                                    v-for="item in typeOption"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.label">
                                  </el-option>
                            </el-select>
                          </th><th></th>    
                    </tr>
                    <!-- <tr> 
                        <th></th><th><el-input @change="query" v-model="studentName" placeholder="查询：请输入学生姓名"></el-input></th><th></th><th></th><th></th><th></th><th></th><th></th><th><el-input @change="query" v-model="parentName" placeholder="查询：请输入家长姓名"></el-input></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>    
                    </tr> -->
                </thead> 
                 <tbody>
                    <tr v-for="(item,index) in userInfo">
                      <td>
                        {{item.curriculum.id}}
                      </td>
                      <td>
                        <a :href="'/#/studentInfo?userId='+item.user.id+'&studentId='+item.student.id+'&activeName=user'">{{item.student.name}}</a>
                      </td> 
                      <td>
                        {{item.student.sex}}
                      </td> 
                      <td>
                        {{item.student.dateOfBirth | viewDate}}
                      </td> 
                      <td>
                        {{item.curriculum.afterCourseDeleTeSaveInfo.courseName}}
                      </td> 
                      <td>
                        <span v-if="!item.curriculum.confirmedId&&item.curriculum.course">{{item.curriculum.course.date}} {{item.curriculum.course.startTime |viewHouAndSec}}~{{item.curriculum.course.endTime|viewHouAndSec}}</span>
                        <span v-else-if="!item.curriculum.confirmedId&&!item.curriculum.course">{{item.curriculum.afterCourseDeleTeSaveInfo.date|viewDate}} {{item.curriculum.afterCourseDeleTeSaveInfo.startTime |viewHouAndSec}}~{{item.curriculum.afterCourseDeleTeSaveInfo.endTime|viewHouAndSec}}</span>
                        <span v-else-if="item.curriculum.confirmedId&&!item.curriculum.confirmedTime">{{item.curriculum.afterCourseDeleTeSaveInfo.date|viewDate}} {{item.curriculum.afterCourseDeleTeSaveInfo.startTime |viewHouAndSec}}~{{item.curriculum.afterCourseDeleTeSaveInfo.endTime|viewHouAndSec}}</span>
                        <span v-else>{{item.curriculum.confirmedTime.date}} {{item.curriculum.confirmedTime.startTime|viewHouAndSec}}~{{item.curriculum.confirmedTime.endTime|viewHouAndSec}}</span>
                      </td> 
                      <td>
                         <img :src="item.user.wxHead" style="width:30px;height:30px;" />
                      </td> 
                      <td>
                         {{item.user.wxName}}
                      </td> 
                      <td>
                        {{item.student.parentName}}
                      </td> 
                       
                      <td>
                        {{item.student.telephone}}
                      </td> 
                      <td>
                        {{item.user.attentionTime}}
                      </td> 
                      <td>
                        {{item.user.lastInteraction}}
                      </td> 
                      <td>
                        {{item.curriculum.remarks}}
                      </td> 
                      <td>
                        <el-tag :type="stateClass(item.curriculum.state)" close-transition>{{item.curriculum.state}}</el-tag>
                      </td>
                      <td>
                         <el-button type="text" @click="details(index,item)" >审核</el-button><br />
                         <el-button type="text" v-if="item.curriculum.state=='已确认'" @click="cancel(index,item)" >取消试听</el-button>
                         <el-checkbox v-model="item.curriculum.checked" :disabled="item.curriculum.disabled" @change="updateState(item.curriculum,index)">未试课</el-checkbox>
                      </td>   
                    </tr>
              </tbody>
            </table> 
        </div>
        <div >
              <el-pagination
                @current-change="currentChange"
                class="pagination"
                layout="prev, pager, next"
                :total="page">
              </el-pagination>
        </div>
        <el-dialog title="预约试课审核"  :visible.sync="dialogFormVisible" :close-on-click-modal="false">
          <booking-info :singleUser="singleUser" :singleChecked='singleChecked' @changes="change()" @btnBack="btnBack" @success="initBrfer"></booking-info>
        </el-dialog>
      </div>  
 </div> 
</template>

<script>
  import auth from '../auth'
  import menus from '../nav-config'  
  import bookingInfo from '../components/bookingTestRecord/bookingInfo'
  import studentInfo from '../components/bookingTestRecord/studentInfo'
  
  export default {
  
    name: "introduce",
  
    data() {
      return {
        QCurriculum: "",
        page: 1,
        CPage: 1,
        limit:  10,
        userInfo: [],
        loggedIn: auth.loggedIn(),
        delCurriculum: [],
        timer: null,
        isShow: false,
        singleChecked: false,
        singleUser: {},
        backSingleUser: "",
        dialogFormVisible: false,
        student: {},
        studentName:'',
        parentName:'',
        typeOption: [
                {
                  label: '全部'
                },
                {
                  label: '待确认'
                },{
                  label: '已确认'
                }, {
                  label: '已取消'
        },{
                  label: '已拒绝'
        }],
        state:''
      }
  
    },
  
    created() {
     //初加载
      this.init(this.state,this.CPage, this.limit)
    },
    methods: {
      stateClass(state){
        switch (state) {
              case '已取消':
                return "danger"
              break;
              case '待确认':
                return ''
              break;
              case '已确认':
                return 'success'
              break;
              case '未试听':
                return "primary"
              break; 
              case '已拒绝':
                return "danger"
              break; 
             }
          return ''
      },
      initBrfer(){
        this.init(this.state,this.CPage, this.limit)

      },
     //初始化
      init(state,pageIndex,limit) {
        this.dialogFormVisible = false;
        this.$http.get(`/api/bookingCourse/getAll?pageIndex=${pageIndex}&limit=${limit}&state=${state}`).then((response) => {
          console.log(response)
          for(let item of  response.data.list){
            if(item.curriculum.state == '未试听'){
              item.curriculum.checked = true
            }
            else{
              item.curriculum.checked = false
            }
            if(item.curriculum.state=='已确认'){
              item.curriculum.disabled = false;
              if(item.curriculum.confirmedTime){
                let oldDate=new Date(item.curriculum.confirmedTime.date)
                let nowDate=new Date()
                  if(oldDate.getTime()>nowDate.getTime()){
                      item.curriculum.disabled = true;    
                  }
              }else{
                 let oldDate=new Date(item.curriculum.course.date+' '+item.curriculum.course.startTime)   
                 let nowDate=new Date()
                  if(oldDate.getTime()>nowDate.getTime()){
                      item.curriculum.disabled = true;    
                  }  
              }
                
            }
            else{
              item.curriculum.disabled = true;
            }
          }
          this.userInfo = response.data.list
          this.page=response.data.totalCount
        })
      },

      currentChange(val) {
        //分页跳转
          this.CPage=val
          this.init(this.state,this.CPage, this.limit)
      },
      details(index, val) {
        this.dialogFormVisible = true
        if(val.curriculum.state=='未试课' || val.curriculum.state=='已取消'||val.curriculum.state=='已确认'||val.curriculum.state=='已拒绝'){
          this.singleChecked=true
        }else{
          this.singleChecked=false
        }
        console.log(val)
        this.singleUser=JSON.parse(JSON.stringify(val))
        this.backSingleUser=JSON.parse(JSON.stringify(val))
      },
      btnBack() {
        this.dialogFormVisible = false
        this.singleUser = this.backSingleUser
      },
      updateState(curriculum,index){
        this.$confirm('选择未试听后状态不可更改，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          this.$http.post('/api/bookingCourse/listened', {
            id: curriculum.id,
          }).then((res) => {
            console.log(res)
            if(res.data.code==1){
              this.init(this.state,this.CPage, this.limit)
            }
          })
        }).catch(() => {
          curriculum.checked=false
          this.$message({
            type: 'info',
            message: '已取消修改'
          });          
        });
      },
      query(){
        if(this.state=='全部'){
          this.state=''
        }
         this.init(this.state,this.CPage, this.limit)
      },
      cancel(index,item){
        console.log(item)
         this.$confirm('选择已取消后状态不可更改，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/api/bookingCourse/backEndCancel', {
            id: item.curriculum.id,
          }).then((res) => {
            if(res.data.code==1){
              this.initBrfer()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });          
        });

      }
    },
    watch: {
    },
    components: {
      bookingInfo
    }
  }
</script>
<style lang="less" scoped> 
   .addCourses{
     color:#20a0ff;
   }
   .p-search{
          background-color:#f5f5f5;
          .p-search-wrap{
            background-color:white;
          }
          .p-search-table:after{
             content:"";
             display:block;
             clear:both;
          }
          .p-search-table{
            zoom:1; 
            border:1px solid #dfe6ec;
            table {  
              border-spacing:2px; border-color:grey; width:100%;
              border-collapse: collapse;
              th {
                  width:120px;
                  height:40px; 
                  font-size: 14px;
                  background-color:#eef1f6;
              }
              td{
                  border-right: 1px solid #dfe6ec;
                  border-bottom:1px solid #dfe6ec;
                  width:120px;
                  height:40px; 
                  font-size: 14px;
                  img{
                    width:40px;
                    height:40px;
                  }
              }
            }
        }
   }
</style>
