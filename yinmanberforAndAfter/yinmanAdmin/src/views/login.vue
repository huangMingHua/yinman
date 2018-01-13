<template>
  <div class="page-login">
    <div class="login-box">
      <div class="login-title">
        <div> <img class="logo" src="../assets/login.png"> </div>
        <h3>音曼课堂管理系统</h3>
      </div>
      <div class="login-form">
        <el-form label-position="top" :model="loginForm" :rules="loginRule" ref="loginForm">
          <el-form-item prop="username">
            <el-input placeholder="用户名" type="text" v-model="loginForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input placeholder="密码" type="password" v-model="loginForm.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import auth from '../auth'

export default {
  name: 'login',
  data () {
    return {
      loginRule: {
        username: [
          {
            require: true,
            message: '请填写员工号'
          }
        ]
      },
      autoLogin: false,
      keepPassword: false,
      loginForm: {
        username: 'admin',
        pass: 'admin'
      }
    }
  },
  created () {
    // if (window.localStorage.getItem('autoLogin') === 'true') {
    //   this.autoLogin = true
    //   this.loginForm.username = window.localStorage.getItem('username')
    //   auth.login(window.localStorage.getItem('username'), window.localStorage.getItem('pass'), (val) => {
    //     if (val) {
    //       this.goDashboard()
    //     }
    //   })
    // }
    // if (window.localStorage.getItem('keepPassword') === 'true') {
    //   this.keepPassword = true
    //   this.loginForm.username = window.localStorage.getItem('username')
    //   this.loginForm.pass = window.localStorage.getItem('pass')
    // }
  },
  mouted () {
    // if (localStorage.getItem('autoLogin')) {
    //   this.goDashboard()
    // }
  },
  methods: {
    goDashboard () {
      this.$router.push('userManagement')
    },
    handleSubmit () {
      var self = this
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$http.post('/api/user/login', { 
            username: this.loginForm.username,
            password : this.loginForm.pass
           })
           .then((res)=>{
              if(res.data.code == 1){
                self.goDashboard();
              }
              else{
                this.$message({
                      message: res.data.msg,
                      type: 'error'
                  });
              }
           });
          // auth.login(this.loginForm.username, this.loginForm.pass, (val) => {
          //   if (val) {
          //     window.localStorage.setItem('autoLogin', This.autoLogin)
          //     window.localStorage.setItem('keepPassword', This.keepPassword)
          //     if (This.autoLogin) {
          //       window.localStorage.setItem('username', This.loginForm.username)
          //       window.localStorage.setItem('pass', This.loginForm.pass)
          //     }
          //     this.goDashboard()
          //   }
          // })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
html, body, .page-login {
  min-height: 100vh;
}
.page-login {
  background-color: #f7f7f7;
  padding-top: 50px;
}
.login-title {
  color: #2a323c;
  text-align: center;
  padding: 20px 0 0;
  .logo{
    width: 180px;
  }
  h3 {
    font-family:"Microsoft YaHei";
    font-size: 30px;
    margin: 0 0 30px 0;
  }
  p {
    font-weight: bold;
    color: #898989;
    margin: 0;
  }
}
.login-box {
  margin: 0 auto;
  max-width: 400px;
  border-radius: 5px;
  background-color: #fff;
}
.login-form {
  padding: 20px 30px;
  border: 0;
  width: 300px;
  margin: 0 auto;
  button {
    display: block;
    width: 100%;
  }
}
</style>
