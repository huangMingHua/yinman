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
                            <th>id</th><th>学生姓名</th><th>学生性别</th><th>报名课程</th><th>类型</th><th>头像</th><th>昵称</th><th>家长姓名</th><th>联系电话</th><th>关注时间</th><th>最后交互</th><th>特殊要求</th><th>状态</th><th>操作</th>    
                        </tr>
                        <tr> 
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th>
                            <el-select @change="query" style="margin-top:-20px;" v-model="state" placeholder="请选择">
                              <el-option
                                v-for="item in typeOption"
                                :key="item.label"
                                :label="item.label"
                                :value="item.label">
                              </el-option>
                            </el-select>
                          </th>
                          <th></th>    
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

                           
                            <a :href="'/#/studentInfo?userId='+item.oUser.id+'&studentId='+item.oStudent.id+'&activeName=user'">{{item.oStudent.name}}</a>
                        </td> 
                        <td>
                            {{item.oStudent.sex}}
                        </td> 
                        <td >
                            {{item.courseTableDetail.course.name}}
                        </td>
                        <td v-if="item.courseTableDetail.dayOfWeek">
                          学期课
                        </td> 
                        <td v-else>
                          课时课
                        </td> 
                        <td>
                            <img :src="item.oUser.wxHead" style="width:30px;height:30px;" />
                        </td> 
                        <td>
                            {{item.oUser.wxName}}
                        </td> 
                        <td>
                            {{item.oStudent.parentName}}
                        </td> 
                        
                        <td>
                            {{item.oStudent.telephone}}
                        </td> 
                        <td>
                            {{item.oUser.attentionTime}}
                        </td> 
                        <td>
                            {{item.oUser.lastInteraction}}
                        </td> 
                        <td :title="item.specialRequirements">
                             {{aSpecialRequirements[index]}}
                        </td> 
                        <td style="width:100px">
                            <el-tag :type="stateClass(item.state)" close-transition>{{item.state}}</el-tag>
                        </td>
                         <td>
                            <el-button type="text" @click="details(index,item)" >审核</el-button>
                            <!-- <el-button type="text" v-if="item.state=='已确认'" @click="cancel(index,item)" >取消报名</el-button> -->
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
             <el-dialog title="报名审核" @close="goBack" :visible.sync="dialogFormVisible" :close-on-click-modal="false" >
                 <auditing :id='id' :type='type' @goBack="goBack" @changes="change()" @btnBack="btnBack" @success="get"></auditing>
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
        singleChecked: false,
        dialogFormVisible: false,
        student: {},
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
        state: '',
        aSpecialRequirements: [],
        terms: [],
        term: '',
        termDate: '',
        id: 0,
        type: 0
      }
    },
  
    created() {
     //初加载
      this.termInit()
    },
    methods: {
      get(){
         this.init(this.state,this.CPage, this.limit,this.term.id)
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
      init(state,pageIndex,limit,termId) {
        this.dialogFormVisible = false
        this.$http.get(`/api/signUpCurriculum/getAll?pageIndex=${pageIndex}&limit=${limit}&state=${state}&termId=${termId}`).then((response) => {
          if (response.data.code) {
            this.userInfo=response.data.data.aCurriculum
            this.page=response.data.data.nTotalCount
          }
        })
        
      },
      termInit(){
        this.$http.get('/api/term/getAll').then((res)=>{
            this.terms = res.data;
            this.term=nowTerm(this.term,this.terms);
            this.get()
        });
      },
      currentChange(val) {
        //分页跳转
        this.CPage=val
        this.init(this.state,this.CPage, this.limit)
      },
      details(index, val) {
        if (!val.courseTableDetail.dayOfWeek) {
          this.type = 1;
        }else{
          this.type = 0;
        }
        this.dialogFormVisible = true;
        this.id = val.id
      },
      btnBack() {
        this.dialogFormVisible = false
      },
      query(){
        if(this.state=='全部'){
          this.state="" 
        }
        this.init(this.state,this.CPage,this.limit,this.termDate)
      },
      queryTerm(val){
        this.termDate=val.startDate+'至'+val.endDate
        this.get()
      },
      goBack(){
        this.id = 0;
        this.dialogFormVisible = false
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
