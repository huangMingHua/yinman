<template>
  <p-layout>
  
    <div class="p-search">
  
      <div class="p-search-wrap">
  
        <div class="p-search-head">
  
          <!--<el-input class="query-input" v-model="query" placeholder="查询：请输入姓名"></el-input>-->
  
  
          <div class="btns">
            <el-button @click="add" type="primary" style="margin-left:15px;">+添加</el-button>
          </div>
  
        </div>
  
        <div class="p-search-table">
  
          <table style="float:left;">
  
            <thead>
  
              <tr>
  
                <th>ID</th>
  
                <th>封面</th>

                <th>姓名</th>
  
                <th>获奖内容</th>
  
                <th>创建时间</th>
  
                <th>更新时间</th>
                <th>操作</th>
              </tr>
  
            </thead>
  
            <tbody>
  
              <tr v-for="item in teachers" :key="item.id">
                <td>{{ item.id }} </td>
                <td><img style="width:30px;height:30px;" :src="item.path"></img></td>
                <td>{{item.name}}</td>
                <td>{{item.introduce}}</td>
                <td>{{item.createTime}}</td>
                <td>{{item.updateTime}}</td>
                <td><span class="spans" @click="modify(item)">编辑</span><span @click="deleteInfo(item)" class="spans">删除</span></td>
              </tr>
            </tbody>
          </table>  
        </div>
  
        <div>
  
          <el-pagination class="pagination" @current-change="currentChange" layout="prev, pager, next" :total="page*10">
  
          </el-pagination>
  
        </div>
  
      </div>
  
    </div>
  
    <transition name="fade">
  
      <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
  
        <honour-info :info="editInfo" @success="success" @back="back" @close="close" ></honour-info>
  
      </el-dialog>
  
    </transition>
  
  </p-layout>
</template>
<script>  
  import honourInfo from '../components/aboutYinman/honour'
  
  export default {
    name: "introduce",
    data() {
      return {
        query: '',
        page: 1,
        CPage:1,
        limit:10,
        url: "/api/upload/upload",
        teachers: [],
        dialogFormVisible: false,
        title:"",
        editInfo:{id:0,
            name:'',
            introduce:''
        }
      }
  
    },
  
    created() {
      this.init()  
    },
  
    methods: {  
      init() {
        this.$http.get(`/api/honorRoll/getList?pageIndex=${this.CPage}&limit=${this.limit}`).then((res) => {
          console.log(res)
          this.teachers = res.data.list
          this.page = res.data.pages
        })
      },
      modify(item) {
        this.title="编辑光荣榜"
        this.dialogFormVisible = true  
        this.editInfo = _.cloneDeep(item);  
      },
  
      back() {
        this.dialogFormVisible = false  
      },
      currentChange(val){
         console.log(val)
         this.CPage=val
         this.init()
      },
      deleteInfo(item){
        console.log(item)
         this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/api/honorRoll/delete',{id:item.id}).then((response)=>{
            if(response.data.code==1){
              this.init()
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }else{
              this.$message({
                type: 'error',
                message: response.data.msg
              });
            }
          })
        }).catch(() => {        
        });
      },
      close(val) {
        if(_.trim(this.form.name)==""){
           this.$message('姓名不能为空')
        }else if(_.trim(this.form.introduce)==''){
           this.$message('获奖内容不能为空')
        }else{
        this.$http.post("/api/honorRoll/saveOrUpdateCompetitionInfo", {
          form: this.form
        }).then((res) => {
          if (res.data.id) {
            this.$message('提交成功');
            this.isShow = !this.isShow
            this.imageUrl = ""
            this.dialogFormVisible = false
            this.init()
          }
        })

        }
        
      },
  
      success() {
        this.dialogFormVisible = false
        this.init()
      },
      add() {
        this.title="添加光荣榜"
        this.editInfo = {
            id:0,
            name:'',
            introduce:''
        }
        this.dialogFormVisible = true
        
      }
    },
  
    watch: {
  
      curri(newVal, oldVal) {
  
        if (newVal.trim().length == 0) {
  
          var This = this
  
          this.timer = setTimeout(function() {
  
            This.init()
  
          }, 500)
  
        } else {
  
          clearTimeout(this.timer)
  
        }
  
      },
  
    },
  
    components: {
      honourInfo
    }
  
  }
</script>
<style lang="less" scoped>
  .fade-enter-active,
  
  .fade-leave-active {
  
    transition: opacity .5s
  
  }
  
  
  
  .fade-enter,
  
  .fade-leave-active {
  
    opacity: 0
  
  }
  
  
  
  .p-search {
  
  
    background-color: #f5f5f5;
  
    .p-search-wrap {
  
      background-color: white;
  
    }
  
    .btns {
  
      margin-top: 20px;
  
    }
  
    .p-search-head {
  
      text-align: left;
  
      margin-bottom: 22px;
  
    }
  
    .query-input {
  
      width: 192px;
  
      height: 28px;
  
    }
  
    .query-btn {
  
      margin-left: 10px;
  
    }
  
    .p-search-table:after {
  
      content: "";
  
      display: block;
  
      clear: both;
  
    }
  
    .p-search-table {
  
      zoom: 1;
  
      border: 1px solid #dfe6ec;
  
      table {
  
        border-collapse: collapse;
  
      }
  
      th {
  
        background-color: #eef1f6;
  
      }
  
      th,
  
      td {
  
        border-right: 1px solid #dfe6ec;
  
        border-bottom: 1px solid #dfe6ec;
  
        height: 40px;
  
        padding: 0 20px;
  
        font-size: 14px;
  
      }
  
      .spans {
  
        float: left;
  
        cursor: pointer;
  
        color: #20a0ff;
  
        width: 80px;
  
        text-align: center;
  
        height: 100%;
  
        line-height: 40px;
  
      }
  
    }
  
  }
  
  
  
  .curriculumShow {
  
    position: absolute;
  
    left: 0;
  
    top: 0;
  
    background-color: rgba(0, 0, 0, 0.5);
  
    width: 100%;
  
    height: 100%;
  
    z-index: 1000;
  
  }
  
  
  
  .el-icon-plus:before {
  
    position: absolute;
  
    left: 0;
  
    right: 0;
  
    top: 0;
  
    bottom: 0;
  
    width: 30px;
  
    height: 30px;
  
    margin: auto;
  
  }
</style>
