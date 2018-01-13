<template>
  <div class="p-layout">
      <div class="p-layout-left" :style="isCollapse?'width:8%':'width:15%'">
          <div class="p-layout-logo"> <img src="../assets/logo.png" alt=""></div>
           <el-row class="tac" >
            <el-col >
               <el-menu   :default-active="currentRoute" @select='onselect' :router=true class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :unique-opened="true">
                  <div v-for="(menu, index) in menus">
                    <el-menu-item
                      :index="subMenu.path"
                      v-for="(subMenu, subIndex) in menu.children" v-if="subMenu.boff" :key="subMenu.path">
                        <i v-if="subMenu.icon" class="fa" :class="'fa-' + subMenu.icon"></i>
                        <span class="nav-next" >{{subMenu.text}}</span>
                    </el-menu-item>
                  </div> 
              </el-menu> 
            </el-col>
           </el-row> 
           
      </div>
      <div class="p-layout-right" :style="isCollapse?'width:92%':'width:88%'">
         <header>
               <div class="p-layout-collapse" @click="toggleSider">
                 <i class="fa fa-bars"></i>
              </div>
              <div class="p-layout-nav">
                <el-dropdown class="is-user" @command="handleCommand">
                <img src="../assets/avatar.jpg" class="p-layout-avatar" alt="">
                 <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="dropOut">退出</el-dropdown-item>
                </el-dropdown-menu>
               </el-dropdown>
              </div>
          </header>
          <el-breadcrumb class="p-layout-breadcrumb" v-if="bShowRouter" separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页 </el-breadcrumb-item>
            <el-breadcrumb-item>{{breadcrumb}}</el-breadcrumb-item>
          </el-breadcrumb>
          <slot></slot>
      </div>
  </div>
</template>
<script>
import menus from '../nav-config'
export default {
  name: 'p-layout',
  data(){
    return {
      menus,
      isCollapse: false,
      // currentRoute: this.$router.history.current.path,
      breadcrumb:"",
      bShowRouter:true
    }
  },
 
  computed: {
    currentRoute: function(){
      //console.log(this.$router.history.current.path, this.$router.history.current.path.split('/')[0]);

      let name = _.trim(this.$router.history.current.path).split('/')[1];
      for(var i=0;i<menus.length;i++){
        for(var j=0;j<menus[i].children.length;j++){
              if(name == menus[i].children[j].name){
                  return menus[i].children[j].path;
              }
        }
      }
      return this.$router.history.current.path;
    }
  },
  created(){
    console.log(this.menus)
       this.init()
    for(var i=0;i<menus.length;i++){
            if(menus[i].children.length!=0){
                for(var j=0;j<menus[i].children.length;j++){
                     if(this.currentRoute==menus[i].children[j].path){
                          this.breadcrumb=menus[i].children[j].text
                     }
                }
            }
    }
  }
  ,
  methods: {
     init(){
         switch(this.$route.path){
           case '/studentInfo':
           console.log(111)
           this.bShowRouter=false
           break;
           case '/teacherInfo':
           this.bShowRouter=false
           break;
         }
     },
    toggleSider () {
      this.isCollapse = !this.isCollapse
    },
    handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleCommand(command){
         //localStorage.removeItem('token')
         //this.$router.push('login')

         this.$http.post('/api/user/logout').then((res)=>{
          this.$router.push('login')
         });
    },
    onselect(router,value,obj){
       this.breadcrumb=obj.$el.innerText
    }

  }
}
</script>

<style lang="less">
  @gray: #d3dce6;
  @transition: all 0.3s ease;
  html, body, #app {
    margin: 0;
    height: 100%;
 }
 .p-layout{
   display:flex;
   flex-direction:row;
   height:100%;
   &-logo{
     width:100%;
     text-align: left;
     img{
       width:60%;
       margin: 0 0 0 44px;
     }
     margin:30px auto;
   }
   .p-layout-left{
      width:12%;
      background-color:#009688;
      transition:@transition;
    }
    .p-layout-right{
      width:88%;
      transition:@transition;
      header{
        height:0px;
        background-color:#03a9f4;
        line-height:0px;
        position: relative;
      }
    }
    &-collapse {
      float: left;
      width: 70px;
      height:100%;
      cursor: pointer;
      background-color: rgba(255, 255, 255, .1);
      text-align: center;
      color: #fff;
    }
    &-nav {
     float: right;
     position: relative;
     z-index: 200;
     padding-right: 10px;
     .nav-item {
      margin-right: 10px;
      .fa {
        font-size: 20px;
      }
      .el-badge__content.is-fixed {
        top: 20px;
      }
    }
    .p-layout-avatar {
      width: 36px;
      height: 36px;
      border: 2px solid @gray;
    }
   }
   &-avatar {
    border-radius: 50%;
    vertical-align: middle;
    cursor: pointer;
  }
  &-user {
    padding: 20px;
    text-align: center;
    color: #fff;
    .p-layout-avatar {
      width: 64px;
      height: 64px;
      margin-bottom: 10px;
    }
  }
   &-breadcrumb{
      padding: 25px 15px;
      background-color: #fff;
    }
    .el-breadcrumb{
      box-shadow: 0 1px 2px 0 rgba(0,0,0,.1) !important;
      position: relative;
      z-index: 100;
    }
  .el-menu{
     background-color:#009688;
     .el-submenu{
       background-color: rgba(0, 0, 0, 0);
     }
     .el-submenu__title{
       color:white;
     }
     .el-submenu__title:hover{
        background-color: rgba(0, 0, 0, 0);
        border-bottom:1px solid white; 
     }
     &-item{
       color: white;
       text-align: left;
     }
     &-item:hover{
       background-color: rgba(0, 0, 0, 0);
       color:black;
     }
     
   }
  }
  .is-active {
     color: #333 !important;
     background-color:#d1dbe5; 
  }
  .el-submenu__title{
   text-align:left;
  }
  .p-layout>div{
    height:100%;
  }

  .table {  
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
    }
  }
</style>
