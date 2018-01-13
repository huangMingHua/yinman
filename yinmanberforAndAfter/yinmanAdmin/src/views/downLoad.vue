<template>
  <p-layout>
  
    <div class="p-search">
  
      <el-tabs v-model="activeName" @tab-click="handleClick">
  
        <!-- <el-tab-pane label="视频管理" name="video"></el-tab-pane> -->
  
        <el-tab-pane label="音频管理" name="audio"></el-tab-pane>
  
        <el-tab-pane label="图片管理" name="image"></el-tab-pane>
  
      </el-tabs>  
      <div>
        <div class="p-search-wrap">
          <div class="p-search-head">
            <!--<el-input class="query-input" placeholder="查询：请输入标题"></el-input>-->
            <div class="btns">
              <el-button @click="uploadPic" type="primary" style="margin-left:15px;">+上传</el-button>
            </div>
  
          </div>
  
          <div class="p-search-table">
  
            <table style="float:left;">
  
              <thead>
  
                <tr>
  
                  <th>ID</th>
  
                  <th>标题</th>
  
                  <th>说明</th>
  
                  <th>上传时间</th>
                   
                  <th>更新时间</th>
  
                </tr>
  
              </thead>
  
              <tbody>
                <tr v-for="item in pic" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{item.title}}</td>
                  <td>{{item.explain}}</td>
                  <td>{{item.createTime}}</td>
                  <td>{{item.updateTime}}</td>
                </tr>
              </tbody>
  
            </table>
  
            <table>
  
              <thead>
  
                <tr>
  
                  <th style="width:160px">操作</th>
                </tr>
              </thead>
              <tbody>
  
                <tr v-for="(item,index) in pic" :key="item.id">
                  <td><span class="spans" @click="modifyPic(item)">编辑</span><span @click="deletePic(item)" class="spans">删除</span></td>
                </tr>
              </tbody>
  
            </table>
  
          </div>
  
          <div>
            <el-pagination class="pagination" @current-change="CChangePic"  layout="prev, pager, next" :total="totalCount">
            </el-pagination>
          </div>
          <transition name="fade">
            <el-dialog title="添加文件" :visible.sync="dialogFormVisiblePic" :close-on-click-modal="false" :before-close="backPic">
              <pic-info :info="editInfo" :activeName="activeName" @success="successPic" @backPic="backPic"></pic-info>
            </el-dialog>
          </transition>
        </div>
      </div>
    </div>
  </p-layout>
</template>
<script>  
  // import audioInfo from '../components/exhibitionCenter/audioInfo'
  import picInfo from '../components/exhibitionCenter/picInfo'
  // import videoInfo from '../components/exhibitionCenter/videoInfo'
  

  export default {
    name: "introduce",
    data() {
      return {
        activeName:'audio',
        totalCount: 1,
        page: 1,
        limit: 10,
        dialogFormVisiblePic: false,
        pic:[],
        editInfo:{
          id:0,
          title:'',
          explain:'',
          mimeType:''
        }
      }  
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.loadImages();
      },
      loadImages(){
        this.$http.get('/api/downloadPic/getList', { params:{
          pageIndex:this.page,
          limit: this.limit,
          type: this.activeName
        }}).then((res) => {
          this.pic = res.data.list
          this.totalCount = res.data.totalCount
        })
      },
      modifyPic(item) {
        this.editInfo = _.cloneDeep(item);
        this.dialogFormVisiblePic = true
        
      },
      CChangeVideo(val){
          this.init();
     },
      CChangeAudio(val){
          this.init();
     },
     CChangePic(val){
          this.init()
     },
      uploadPic() {
        this.editInfo = {
          id:0,
          title:'',
          explain:'',
          mimeType:''
        }
        this.dialogFormVisiblePic = true
  
      },
      successPic(form, img, url) {
        this.dialogFormVisiblePic = false
        this.loadImages()
      },
       deletePic(item){
         var self = this;
         this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.post('/api/downloadPic/delete',{id:item.id}).then((res)=>{
            if(res.data.code==1){
              self.loadImages();
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
              
          })
        }).catch(() => {
   
        });
      },
      query(){

      },      
      backPic() {
        this.dialogFormVisiblePic = false  
      },
  
     
      handleClick(tab, event) {
        this.page = 1
        //console.log(tab, event);
        this.loadImages();
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
  
      // audioInfo,
  
      picInfo,
  
      // videoInfo
  
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
  
    .p-search-wrap {
  
      background-color: white;
  
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
  
        padding: 0 20px;
  
        height: 40px;
  
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
  
  
  
  .show {
  
    position: absolute;
  
    left: 0;
  
    top: 0;
  
    background-color: rgba(0, 0, 0, 0.5);
  
    width: 100%;
  
    height: 100%;
  
    z-index: 100;
  
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
</style>
