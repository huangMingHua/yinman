<template>
  <div class="p-teacher">
    <div>
      <span class="warn" style="left:-630px;top:0px;">*</span>
      <span class="span">标题</span>
      <el-input class="input" v-model="form.title" placeholder="请输入标题"></el-input>
    </div>
    <div>
      <span class="warn" style="left:-655px;top:0px;">*</span>
      <span class="span">学生姓名</span>
      <el-input class="input" v-model="form.name" placeholder="请输入学生姓名"></el-input>
    </div>
    <div class="pic">
      <div>
      <span class="warn" style="left:20px;top:5px;">*</span>
      <span style="width:100px;display:inline-block;">上传视频</span>
      <el-upload class="upload-demo" :action="url"  style="display:inline-block"
        :auto-upload="false"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false" 
        :on-change="handlePreview">
        <el-button size="small" type="primary">选择视频</el-button>
      </el-upload>
      </div>
      <video v-if="viewUrl != ''" :src="viewUrl" style="width:200px; height:150px;" controls="controls"></video>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="back">取 消</el-button>
      <el-button type="primary" @click="success">提 交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['info'],
  data() {
    return {
      url: '/api/exerciseVideo/saveOrUpdateVideoInfo',
      viewUrl:'',
      file: null,
      form: {
        id: 0,
        title: '',
        name: '',
        path: ''
      },
      message:null
    }
  },
  created() {
    Object.assign(this.form, this.info)
    this.viewUrl = this.info.path
  },
  methods: {
    handlePreview(file){
      if(file.raw.type.split('/')[0]=='audio'||file.raw.type.split('/')[0]=='image'){
             this.$message.error('只能上传视频');       
      }else{
         this.viewUrl = file.url;
          this.mimeType = file.raw.type;
          this.file = file;
          console.log(this.file);
        }
        
      },
    beforeAvatarUpload(file) {
      var isVideo = true
      if (file.type != 'video/mp4') {
        this.$message.error('只能上传视频');
        isVideo = false
      }
      return isVideo;
    },
    back() {
      this.$emit('back')
    },
    success() {
      // this.$emit('close')
      let that = this;
      console.log(this.file)
      
      this.message = this.$message({
        message:'上传中。。。',
        duration:0
      })
      //this.$refs.form.submit();
      
      let formData = new FormData()
      formData.append('id',this.form.id)
      formData.append('name', this.form.name)
      formData.append('title', this.form.title)
      if(this.file != null && this.file.raw){
        formData.append('file', this.file.raw)
      }
      //console.log(this.form)
      this.$http.post(this.url, formData).then(res=>{
        if(that.message){
          that.message.close();
        }
        console.log(res);
        if(res.data.code == 1){
          that.$message('保存成功');
          that.$emit('success');
        }
        else{
          that.$message(res.data.msg)
        }
      });
    }    
  },
  watch:{
    }
}
</script>
<style lang="less" scoped>
.input {
  float: left;
  width: 300px;
}

.span {
  float: left;
  width: 100px;
  text-align: right;
  margin-right: 20px;
  vertical-align: middle;
}

.p-teacher {
  >div {
    margin: 20px 0;
    overflow: hidden;
  }
  .pic {
    position: absolute;
    right: 20px;
    top: 30px;
  }
  textarea {
    width: 400px;
    height: 200px;
    border-radius: 5px;
    vertical-align: middle;
  }
}
</style>