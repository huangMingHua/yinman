<template>
    <div>
      <div class="add" >
        <el-button type="primary" @click="addFn">添加</el-button>
      </div>
      <table border=1>
        <thead>
          <tr>
            <th>id</th>
            <th>课程名称</th>
            <th>颜色</th>
            <th>注意事项</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item , index) of curriculums">
            <td>
              {{item.id}}
            </td>
            <td>
              {{item.name}}
            </td>
            <td>
              <span class="color" :style="{'background-color':item.color}"></span>
              {{item.color}}
            </td>
            <td>
              {{item.courseDescription}}
            </td>
            <td>
              <el-button type="text" @click="edit(index)">编辑</el-button>
              <el-button type="text" @click="handleDelete(index)">删除</el-button>
            </td>
          </tr>
        </tbody>  
      </table>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        >
        <course :curriculum="curriculum" @submit="submit" @back="back"></course>
      </el-dialog>      
    </div>
</template>
<script>
import auth from '../auth'
import menus from '../nav-config'
import post from '../post'
import get from '../get'
import course from '../components/courseCreation/course'
  export default {
    name:"introduce",
    data(){
      return {
        title: '添加课程',
        dialogVisible: false,
        curriculum:{
          id: '',
          name: "",
          color: "",
          courseDescription: ''
        },
         //   curri:"",
           page:1,
           CPage:1,
           limit:10,
           curriculums:[],
      	  //  loggedIn: auth.loggedIn(),
         //   timer:null,
         //   checked:false,
         //   backSingleUser:"",
         //   curriculum:{},
         //   id:0,
         //   typeOption: [{
	        //   value: '一对一',
	        //   label: '一对一'
	        // }, {
	        //   value: '一对多',
	        //   label: '一对多',
	        // }],
         //  dialogVisible:false,
         //  title:"",
          copyCurriculums:[]
      }
    },
    created () {
      this.initialCurriculum(this.CPage,this.limit)
    },
    methods:{
      initialCurriculum(pageIndex,limit) {
        get(`/api/course/getPaging?pageIndex=${pageIndex}&limit=${limit}`).then((response) => { 
          if(typeof response === 'object'&& !!response.data){
            this.curriculums=JSON.parse(JSON.stringify(response.data.list)) 
            this.copyCurriculums=JSON.parse(JSON.stringify(response.data.list))
            for(let item of this.curriculums){
              item.courseDescription=item.courseDescription.replace(/<\/[^<>]+>/g,'').replace(/<[^<>]+>/g,'')
            }
            this.page=response.data.pages
          }else{
             this.$message('课程类型数据出错')
          }
        })
      }
      ,
      currentChange(val) {
        this.CPage=val
        this.initialCurriculum(this.CPage,this.limit)
      },
      delArrarFn(val) {
          // this.delCurriculum=val
      },
      addFn() { 
        this.title="添加课程"
        this.id=0
      	this.dialogVisible =true;
      	this.curriculum={
          id: '',
          name: "",
          color: "",
          courseDescription: ''
      	}
      },
      queryname() {
        get('/api/course/query?queryname='+this.curri.trim()).then((response) => { 
          this.curriculums=response.data.count
        })
      },
      handleDelete(index) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          post('/api/course/delete',{ id:this.curriculums[index].id}).then((response) => { 
              if(response.data.code==1){
                this.initialCurriculum(this.CPage,this.limit)
                  this.$message({
                    type: 'success',
                    message: response.data.msg,
                    
                  });
              }else{
                  this.$message({
                    type: 'error',
                    message: response.data.msg
                  });
              }  
            })
          }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
       },
      edit(index) {
        this.title="编辑课程"
        this.dialogVisible =true;
        const jsonString=JSON.stringify(this.copyCurriculums[index])
        this.curriculum=JSON.parse(jsonString)
      },
      back() {
        this.dialogVisible =false;
        this.curriculum={
          id: '',
          name: "",
          color: "",
          courseDescription: ''
        }      
      },
      submit() {
        if (_.trim(this.curriculum.name)=="") {
          return this.$message('课程名称不能为空');
        }
        if (_.trim(this.curriculum.color)=="") {
          return this.$message('请选择颜色');
        }
        if(this.curriculum.id!=0){
          post('/api/course/update',{ makeCouseCreate:this.curriculum }).then((response) => { 
            this.$message(response.data.msg);
              if(response.data.bool){
                this.dialogVisible =false;
                this.initialCurriculum(this.CPage,this.limit)
              }
          })
        }else{
          post('/api/course/add',this.curriculum).then((response) => { 
            this.$message(response.data.msg);
            if(response.data.bool){
              this.dialogVisible =false;
              this.initialCurriculum(this.CPage,this.limit)
            }
          })
        } 
      }
    },
    watch:{
      curri(newVal,oldVal){
        if (newVal.trim().length==0) {
          var This=this
          this.timer=setTimeout(function () {
            This.initialCurriculum()
          },500)
        }else{
          clearTimeout(this.timer)
        }  
      } 
    },
    components:{
      course
    }
   }
</script>
<style lang="less" scoped>
  .add {
    text-align: left;
    padding-left: 20px;
  }
  table {
    margin-top: 20px;
    border-collapse: collapse;
    border-color:rgba(0,0,0,0);
    border-top: 1px solid #dfe6ec;
    thead {
      background-color: #eef1f6;
      th {
        width: 150px;
        height: 30px;
        line-height: 30px;
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        font-size: 14px;
      }
    }
    tbody {
      td {
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        .color {
          display: inline-block;
          width: 10px;
          height: 10px;
        }
      }
    }
    
  }
</style>
