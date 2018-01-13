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
    <el-dialog :title="title" :close-on-click-modal="false" size='tiny'  :visible.sync="showAdd">
      <el-form ref="form" :model="newItem" :rules="rules" label-width="160px">
        <el-form-item label="名称：" prop='name'>
          <el-input v-model="newItem.name"></el-input>
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-date-picker
            v-model="newItem.startDate"
            type="date"
            style="width:100%"
            placeholder="选择日期"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker
            v-model="newItem.endDate"
            type="date"
            style="width:100%"
            placeholder="选择日期"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设置学生请假次数：" class="setLeave">
           低于：<el-input v-model="newItem.classHour" class="classHour" @change="classHourFn" ></el-input>课时，可请：<el-input v-model="newItem.belowclassHour" class="classHour" ></el-input>次假<br />
           高于：<em>{{classHour}}</em>课时，可请：<el-input v-model="newItem.higherThanClassHour" class="classHour" ></el-input>次假
        </el-form-item>
        <el-form-item label="设置老师请假次数：" class="setLeave">
           低于：<el-input v-model="newItem.teacherClassHour" class="classHour" @change="teacherClassHourFn" ></el-input>课时，可请：<el-input v-model="newItem.teacherBelowclassHour" class="classHour" ></el-input>次假<br />
           高于：<em>{{teacherClassHour}}</em>课时，可请：<el-input v-model="newItem.teacherHigherThanClassHour" class="classHour" ></el-input>次假
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item> 
      </el-form>
    </el-dialog>
   </div>
</template>
<script>
  export default {
    name:"terms",
    data(){
      return {
        data:[],
        showAdd: false,
        page:1,
        CPage:1,
        limit:10,
        newItem:{
          id:0,
          name:'',
          startDate:new Date(),
          endDate:new Date(),
          classHour:'',
          belowclassHour:'',
          higherThanClassHour:'',
          teacherClassHour:'',
          teacherBelowclassHour:'',
          teacherHigherThanClassHour:'',
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
          id:0,
          name:'',
          startDate:new Date(),
          endDate:new Date(),
          classHour:'',
          belowclassHour:'',
          higherThanClassHour:'',
          teacherClassHour:'',
          teacherBelowclassHour:'',
          teacherHigherThanClassHour:''
        }
        this.$http.get(`/api/term/getList?pageIndex=${pageIndex}&limit=${limit}`).then((res) => { 
          this.data = res.data.list
          this.page = res.data.totalCount
        })
      },
      classHourFn(){
          this.classHour=this.newItem.classHour
      },
      teacherClassHourFn(){
          this.teacherClassHour=this.newItem.teacherClassHour 
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
      showAddDialog(){
        this.showAdd = true
        this.title='添加学期'
        this.newItem={
          id:0,
          name:'',
          startDate:new Date(),
          endDate:new Date(),
          classHour:'',
          belowclassHour:'',
          higherThanClassHour:''
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
              id:it.id,
              name:it.name,
              startDate:it.startDate,
              endDate:it.endDate,
              classHour:it.belowClass,
              belowclassHour:it.numberOfRequests1,
              higherThanClassHour:it.numberOfRequests2,
              teacherClassHour:it.teacherBelowClass,
              teacherBelowclassHour:it.teacherNumberOfRequests1,
              teacherHigherThanClassHour:it.teacherNumberOfRequests2
        }
        this.classHour=it.belowClass
        this.teacherClassHour=it.teacherBelowClass
      }
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
    }
   }
</script>
<style lang="less" scoped>
     .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
      }
      .fade-enter, .fade-leave-active {
        opacity: 0
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
</style>

