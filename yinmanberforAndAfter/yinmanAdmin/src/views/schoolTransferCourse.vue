<template>
    <div>
         <div class="terms">
            学期名称：<el-select v-model="iTerm" @change="fChangeTearm" placeholder="请选择">
              <el-option
                v-for="item in aTerms"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
            <span>课程周期：{{iTermDate}}</span>
            <el-button type="primary" @click="fVisible"   style="width:100px;">学校调课</el-button>
         </div>
           <el-table :data="aList">
           <el-table-column
              prop="id"
              label="id"
              width="150">
            </el-table-column>
              <el-table-column
              prop="iClassSchedulingTime"
              label="调课时间"
              width="150">
            </el-table-column>
            <el-table-column
              prop="iMakeupTime"
              label="补课时间"
              width="150">
            </el-table-column> 
            <el-table-column
              prop="iReason"
              label="调课原因"
              width="150">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="170">
            </el-table-column>
      </el-table>  
     <!-- <div>
          <el-pagination
            @current-change="currentChange"
            class="pagination"
            layout="prev, pager, next"
            :page-size="limit" 
            :current-page="page" 
            :total="total">
          </el-pagination>
        </div>  -->
        <el-dialog title="学校调课" :visible.sync="bVisible" :close-on-click-modal='false'>
          <div class="row">
            <span>*</span>调课时间：
            <el-date-picker
            class="select-input"
            v-model="iClassSchedulingTime"
            type="date"
            placeholder="选择日期"
            >
            </el-date-picker>
          </div>
          <div class="row">
            <span>*</span>补课时间：
            <el-date-picker
            class="select-input"
            v-model="iMakeupTime"
            type="date"
            placeholder="选择日期"
            >
            </el-date-picker></div>
          <div class="row">
             <span>*</span>调课原因：
             <el-input class="select-input"  v-model="iReason" placeholder="请输入调课原因"></el-input> 
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="bVisible = false">取 消</el-button>
            <el-button type="primary" @click="fSubmit">提交</el-button>
          </div>
        </el-dialog>
   </div>     
</template>

<script>
import nowTerm from '../commonJs/nowTerm';
import auth from '../auth'
import menus from '../nav-config'
import moment from 'moment';
  export default {
      name:"introduce",
      data(){
      	return {
          bVisible: false,
          iClassSchedulingTime: '',
          iMakeupTime: '',
          iReason: '',
          aTerms:[],
          iTerm:'',
          iTermDate:'',
          nTermId:null,
          aList:[]
      	}
      },
      created () {
          // document.title = '调课管理'
          this.init()
	    },
    methods:{
      init(){
          this.$http.get('/api/term/getAll').then((res)=>{
            this.aTerms = res.data;
            if(this.aTerms.length > 0){
                this.iTerm=nowTerm(this.iTerm,this.aTerms)
                this.iTermDate=this.iTerm.startDate+'至'+this.iTerm.endDate
                this.nTermId=this.iTerm.id
                
            }
        }).then(()=>{
           this.getAll()
        })
      },
      getAll(){
          
       this.$http.get('/api/schoolTransferCourse/getAll?nTermId='+this.nTermId).then((res)=>{
                this.aList=res.data.data
           });
      },
      fVisible(){
          this.bVisible=true;
      },
      fChangeTearm(val){
          this.iTermDate=val.startDate+'至'+val.endDate
          this.nTermId=val.id
          this.getAll()
      },
      fSubmit(){
          if (!this.iClassSchedulingTime) {
              this.$message('请选择调课时间')   
              return
          }
          if (!this.iMakeupTime) {
              this.$message('请选择补课时间')   
              return
          }
          if (!this.iReason) {
              this.$message('请填写原因')   
              return
          }
          if (moment(this.iClassSchedulingTime).format('YYYY-MM-DD') == moment(this.iMakeupTime).format('YYYY-MM-DD')) {
              this.$message('调课时间和补课时间不能重复')  
              return
          } 
          if(!this.nTermId){
              this.$message('还没有学期')   
              return
          }
          let iTermDate = this.iTermDate.split('~')
          if (new Date(iTermDate[0]).getTime()>new Date(this.iClassSchedulingTime).getTime()||new Date(this.iClassSchedulingTime).getTime()>new Date(iTermDate[1]).getTime()||new Date(this.iMakeupTime).getTime()<new Date(iTermDate[0]).getTime()||new Date(iTermDate[1]).getTime()<new Date(this.iMakeupTime).getTime()) {
              this.$message('请选择当前学期内日期')   
              return
          }
          this.$http.post('/api/schoolTransferCourse/createCourseInfo',{
              nTermId:this.nTermId,
              iClassSchedulingTime:moment(this.iClassSchedulingTime).format('YYYY-MM-DD'),
              iMakeupTime:moment(this.iMakeupTime).format('YYYY-MM-DD'),
              iReason:this.iReason
              }).then((res)=>{
                if(res.data.code==1){
                    this.$message('调课成功')
                    this.bVisible=false  
                    this.init()
                }else{
                  this.$message(res.data.msg)
                }
          })
      }
    },
    watch:{
      
    }
   }
</script>
<style lang="less" scoped>
    .terms{
      text-align: left;
      margin: 15px;
    }
    .row {
        margin-bottom: 10px;
        width:500px;
        span{
            position: relative;
            top:5px;
            left:-6px;
            font-size:26px;
            color:red;
            vertical-align: middle;
        }
        .select-input{
            width: 300px;
        }
    }
</style>

