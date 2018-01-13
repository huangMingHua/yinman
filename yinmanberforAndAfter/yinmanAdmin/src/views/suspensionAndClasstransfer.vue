<template>
  <p-layout>
        <div class="p-search">
        <div class="p-search-wrap">
            <div class="term">
               <span style="margin-left:15px;">学期名称：</span><el-select v-model="term" @change='queryTerm'>
                <el-option v-for="item in terms" :key="item.id" :label="item.name" :value="item"></el-option>
              </el-select> 
              <span>课程周期：{{termDate}}</span>
            </div>
            <div class="p-search-table">
                <table>
                    <thead>
                        <tr> 
                            <th>id</th><th>姓名</th><th>课程</th><th>等级</th><th style="width:200px;">原课程周期</th><th>课程截止日期</th><th>停课原因</th><th style="width:200px;">转班后课程周期</th><th>转班原因</th>    
                        </tr>
                        
                        <!-- <tr> 
                            <th></th><th><el-input @change="query" v-model="studentName" placeholder="查询：请输入学生姓名"></el-input></th><th></th><th></th><th></th><th></th><th></th><th></th><th><el-input @change="query" v-model="parentName" placeholder="查询：请输入家长姓名"></el-input></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>    
                        </tr> -->
                    </thead> 
                    <tbody>
                        <tr v-for="(item,index) in userInfo">
                        <td>
                          <!-- {{item}} -->
                            {{item.id}}
                        </td>
                        <td>
                           {{item.name}}
                           
                        </td> 
                        <td>
                          {{item.courseTableDetail.courseName}}
                        </td> 
                        <td>
                          {{item.courseTableDetail.level}}
                        </td> 
                        <td >
                          <span>
                            {{item.courseTableDetail.startDate | viewDate}}至{{item.courseTableDetail.endDate | viewDate}}<br/>{{item.courseTableDetail.dayOfWeek}} {{item.courseTableDetail.startTime | viewHouAndSec}}~{{item.courseTableDetail.endTime | viewHouAndSec}}
                          </span>
                        </td> 
                        <td>
                          {{item.courseTableItem.date |viewDate}}
                        </td> 
                        <td>
                          {{item.reasonsForSuspension}}
                        </td>
                        
                        <td >
                          <span v-if="item.shiftStartDate">
                          {{item.shiftStartDate.date  | viewDate}}至{{item.classTransferCourseTableDetail.endDate | viewDate}}<br/>{{item.classTransferCourseTableDetail.dayOfWeek}} {{item.classTransferCourseTableDetail.startTime | viewHouAndSec}}~{{item.classTransferCourseTableDetail.endTime | viewHouAndSec}}
                          </span>
                        </td > 
                        <td >
                          <span v-if="item.shiftStartDate">
                          {{item.shiftReasons}}
                          </span>
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
             <el-dialog title="报名审核"  :visible.sync="dialogFormVisible" :close-on-click-modal="false">
                 <auditing :singleUser="singleUser" :singleChecked='singleChecked' @changes="change()" @btnBack="btnBack" @success="get"></auditing>
             </el-dialog>
        </div>  
    </div> 
 </p-layout>
</template>

<script>
  import auditing from '../components/registrationRecord/auditing'
  import nowTerm from '../commonJs/nowTerm';
  export default {
  
    name: "introduce",
  
    data() {
      return {
        QCurriculum: "",
        page: 1,
        CPage: 1,
        limit:  10,
        userInfo: [],
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
        state:'',
        aSpecialRequirements:[],
        terms:[],
        term:'',
        termDate:''
      }
    },
  
    created() {
     //初加载
      this.termInit()
      this.get()
    },
    methods: {
      get(){
        if(this.term.id){
          this.init(this.CPage, this.limit,this.term.id)
        }
      },
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
              case '已停课':
                return "danger"
              break; 
             }
          return ''
      },
     //初始化
      init(pageIndex,limit,termId) {
        this.dialogFormVisible = false
        this.$http.get(`/api/courseTable/getAllSuspensionAndClasstransfer?pageIndex=${pageIndex}&limit=${limit}&termId=${termId}`).then((response) => {
           if(response.data.code==1){
                this.userInfo = response.data.data.list
                this.CPage=response.data.data.total
           }
        })
        
      },
      termInit(){
        this.$http.get('/api/term/getAll').then((res)=>{
            this.terms = res.data;
            this.term=nowTerm(this.term,this.terms)
        });
      },
      currentChange(val) {
        //分页跳转
        this.CPage=val
        this.init(this.CPage, this.limit,this.term.id)
      },
      details(index, val) {
        this.dialogFormVisible = true
        if(val.state=='已停课' || val.state=='已取消'||val.state=='已确认'||val.state=='已拒绝'||val.state=='已转课'){
          this.singleChecked=true
        }else{
          this.singleChecked=false
        }
        this.singleUser=JSON.parse(JSON.stringify(val))
        this.backSingleUser=JSON.parse(JSON.stringify(val))
      },
      btnBack() {
        this.dialogFormVisible = false
        this.singleUser = this.backSingleUser
      },
      query(){
        this.init(this.CPage, this.limit,this.term.id)
      },
      queryTerm(val){
        this.termDate=val.startDate+'至'+val.endDate
        this.CPage=1
        this.get()
      },
      cancel(index,item){
         this.$confirm('选择已取消后状态不可更改，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          this.$http.post('/api/signUpCurriculum/backEndCancel', {
            id: item.id,
          }).then((res) => {
            if(res.data.code==1){
              this.init(this.state,this.CPage,this.limit)
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
    components:{
        auditing
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
          .term{
            text-align: left;
            padding: 16px 0;
            margin-top: 16px;
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
                  height:40px; 
                  font-size: 14px;
                  background-color:#eef1f6;
                  width: 100px;
              }
              td{
                  border-right: 1px solid #dfe6ec;
                  border-bottom:1px solid #dfe6ec;
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
