<template>
<div>
     <div style="text-align:left;margin:16px;">
      <el-button @click="showAddDialog" type="primary" >+添加学期</el-button><span class="warnContent">*注意：创建课程表之后，学期将不可再修改。</span>
     </div>
     <el-table
      :data="data"
      style="width: 800px;">
       <el-table-column
        prop="id"
        label="id"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="startDate"
        label="开始时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="endDate"
        label="结束时间"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="text" @click="modify(scope.row)">编辑</el-button>
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
     </el-table>
     <div> 
          <el-pagination class="pagination" layout="prev, pager, next" @current-change='currentChange' :total="page">
          </el-pagination>
    </div>
    <el-dialog :title="title" :close-on-click-modal="false"  :visible.sync="showAdd">
      <div class='w1000px'>
        <div class="row">
          <span class="title">名称：</span>
          <el-input class="w300px" v-model="newItem.name"></el-input>
        </div>
        <div class="row">
          <span class="title">开始时间：</span>
          <el-date-picker
            class="w300px"
            v-model="newItem.startDate"
            type="date"
            placeholder="选择日期"
            >
          </el-date-picker>
        </div>
        <div class="row">
          <span class="title">结束时间：</span>
          <el-date-picker
            v-model="newItem.endDate"
            type="date"
            class="w300px"
            placeholder="选择日期"
            >
          </el-date-picker>
        </div>
        <div class="row">
          <span class="title vertical">设置学生请假次数：</span>
          <em class="w300px inlineBlock">
            <span class="math">≤：</span>
            <el-input v-model="newItem.classHour" class="w40px"  ></el-input>课时，
            可请：<el-input v-model="newItem.belowclassHour" class="w40px" ></el-input>次假<br />
            <span class="math">≤：</span>
            <el-input v-model="newItem.classHour1" class="w40px" @change="classHourFn" ></el-input>课时，
            可请：<el-input v-model="newItem.belowclassHour1" class="w40px" ></el-input>次假<br />
            <span class="math">>：</span><em>{{classHour}}</em>课时，
            可请：<el-input v-model="newItem.higherThanClassHour" class="w40px" ></el-input>次假
          </em>
        </div>
        <div class="row">
          <span class="title">报名须知：</span>
          <ueditor class="ueditor"  :content="newItem.registrationNotes" @get="changeRegistrationNotes" ></ueditor>
        </div> 
        <div class="row">
          <span class="title">预约须知：</span>
          <ueditor class="ueditor"  :content="newItem.noticeOfReservation" @get="changeNoticeOfReservation" ></ueditor>
        </div>
        <div class="row btns">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
      </div>
    </el-dialog>
   </div>
</template>
<script>
import ueditor from '../components/ueditor/ueditor'
  export default {
    name:"terms",
    data(){
      return {
        data: [],
        showAdd: false,
        page: 1,
        CPage: 1,
        limit: 10,
        newItem:{
          id: 0,
          name: '',
          startDate: new Date(),
          endDate: new Date(),
          classHour: '',
          classHour1: '',
          belowclassHour: '',
          belowclassHour1: '',
          higherThanClassHour: '',
          registrationNotes: '',
          noticeOfReservation: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ]
        },
        title:'添加学期',
        classHour:'',
        teacherClassHour:''
      }
    },
    created () {
      this.init(this.CPage,this.limit)
	  },
    methods:{
      init(pageIndex,limit){
       this.newItem={
          id: 0,
          name: '',
          startDate: new Date(),
          endDate: new Date(),
          classHour: '',
          classHour1: '',
          belowclassHour: '',
          belowclassHour1: '',
          higherThanClassHour: '',
          registrationNotes: '',
          noticeOfReservation: ''
        }
        this.$http.get(`/api/term/getList?pageIndex=${pageIndex}&limit=${limit}`).then((res) => { 
          this.data = res.data.list
          this.page = res.data.totalCount
        })
      },
      classHourFn(){
        this.classHour=this.newItem.classHour1
      },
      onSubmit(){
        if(this.newItem.id){
              const startDate=new Date(this.newItem.startDate)
              const endDate=new Date(this.newItem.endDate)
              this.newItem.startDate=startDate.getFullYear()+"-"+(startDate.getMonth()+1)+'-'+startDate.getDate()
              this.newItem.endDate=endDate.getFullYear()+"-"+(endDate.getMonth()+1)+'-'+endDate.getDate()
           this.$http.post('/api/term/update', this.newItem).then(res=>{
              if(res.data.code == 1){
                this.$message('修改成功');
                this.showAdd = false;
                this.init(this.CPage,this.limit)
              }
              else {
                this.$message(res.data.msg);
              }
          });
        }else{
          this.$http.post('/api/term/add', this.newItem).then(res=>{
              if(res.data.code == 1){
                this.$message('添加成功');
                this.showAdd = false;
                this.init(this.CPage,this.limit)
              }
              else{
                this.$message(res.data.msg);
              }
          });
        }
      },
      cancel(){
        this.showAdd = false;
      },
      //报名须知
      changeRegistrationNotes(val){
        this.newItem.registrationNotes = val 
      },
      //预约须知
      changeNoticeOfReservation(val){
        this.newItem.noticeOfReservation = val 
      },
      showAddDialog(){
        this.showAdd = true
        this.title='添加学期'
        this.newItem={
          id: 0,
          name: '',
          startDate: new Date(),
          endDate: new Date(),
          classHour: '',
          classHour1: '',
          belowclassHour: '',
          belowclassHour1: '',
          higherThanClassHour: '',
          registrationNotes: '',
          noticeOfReservation: ''
        }
      },
      del(id){
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false,
        }).then(() => {
          this.$http.post('/api/term/delete',{ id: id }).then((res) => {
            if(res.data.code == 1){
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.init(this.CPage,this.limit)
            }
            else{
              this.$message(res.data.msg);
            }
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      currentChange(val){
      },
      modify(item){
        let it=JSON.parse(JSON.stringify(item))
        this.showAdd=true
        this.title='编辑学期'
        this.newItem={
          id: it.id,
          name: it.name,
          startDate: it.startDate,
          endDate: it.endDate,
          classHour: it.belowClass1,
          classHour1: it.belowClass2,
          belowclassHour: it.numberOfRequests1,
          belowclassHour1: it.numberOfRequests2,
          higherThanClassHour: it.numberOfRequests3,
          registrationNotes: it.registrationNotes||'',
          noticeOfReservation: it.noticeOfReservation||''
        }
        // this.newItem={
        //     id: it.id,
        //     name: it.name,
        //     startDate: it.startDate,
        //     endDate: it.endDate,
        //     classHour: it.belowClass1,
        //     classHour1: it.belowClass2,
        //     belowclassHour: it.numberOfRequests1,
        //     belowclassHour1: it.numberOfRequests2,
        //     higherThanClassHour: it.numberOfRequests3,
        // }
        this.classHour=it.belowClass2      }
    },
    watch:{
        //  curri(newVal,oldVal){
        //    if(newVal.trim().length==0){
        //       var This=this
        //        this.timer=setTimeout(function () {
        //           This.initialCurriculum()
        //        },500)
        //     }else{
        //         clearTimeout(this.timer)
        //     }  
        //  } 
      
    },
    components:{
      ueditor
    }
   }
</script>
<style lang="less" scoped>
  .w1000px{
    width: 1000px;
    text-align:left;
  }
  .w300px{
    width: 300px !important;
  }
  .inlineBlock{
    display: inline-block;
    font-style: normal;
    vertical-align: middle;
  }
  .ueditor{
    display: inline-block;
    width: 600px;
    height: 300px;
    vertical-align: middle;
  }
  .el-date-editor.300px{
    width: 300px;
  }
  .w40px{
    width: 40px;
  }
  .vertical{
    vertical-align: middle;
  }
  .title{
    width: 160px;
    display: inline-block;
    margin-left: 120px;
  }
  .show{
    position:absolute;
    left:0;
    top:0;
    background-color:rgba(0,0,0,0.5);
    width:100%;
    height:100%;
    z-index:100;
  } 
  .row{
    margin-top: 20px;
  }
  .btns{
    text-align: center;
  }
  .pagination {
    text-align: left;
  }
  .warnContent{
    margin-left: 20px;
    color:red;
    font-size: 14px;
  }
  .setLeave{
    text-align: left;
    .classHour{
      width: 40px;
    }
     em{
        display:inline-block;
        padding: 3px 10px;
        font-style: normal;
        width: 40px;
        height: 36px;
        line-height: 30px;
        vertical-align: middle;
        border:1px solid #bfcbd9;
        border-radius: 4px;
        box-sizing: border-box;
      }
  }
  .math{
    display: inline-block;
    width: 30px;
    text-align: right;
  }
</style>

