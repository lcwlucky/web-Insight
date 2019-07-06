<template>
  <div class="login">
    <div class="center clearFix">
      <div class="outer">
        <div>
          <img class="logo" src="../assets/img/logo.png" alt="logo">
          <div class="input_outer">
            <div>
              <span class="iconfont icon-user"></span>
              <input v-model="user.name" type="text" placeholder="输入用户名">
              <div class="aLine"></div>
            </div>
            <div>
              <span class="iconfont icon-passward"></span>
              <input v-model="user.password" type="password" placeholder="输入密码" @keyup.enter="login">
              <div class="aLine"></div>
            </div>
            <div class="button_outer">
              <button type="button" @click="login">登录</button>
            </div>
          </div>
        </div>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
  import {inputIsEmpty, toggleTip, uploadOrUpdate} from "../publics/public";

  export default {
    data() {
      return {
        user:{name:'', password:''}
      }
    },
    methods:{
      login(){
        if (!this.user.name ) {
          inputIsEmpty(this, '用户名不能为空')
        }
        if (!this.user.password) {
          inputIsEmpty(this, '密码不能为空')
        }
        let formData = new FormData()
        formData.append('username', this.user.name)
        formData.append('password', this.user.password)
        uploadOrUpdate('/validation',formData).then(data=>{
          if (data.success) {
            sessionStorage.setItem('root', data.root) //保存用户id
            this.$router.push('/main') //登录成功跳转到主页面
          }else {
            inputIsEmpty(this,data.errMsg)
          }
        }).catch(error=>{
          toggleTip(this, error)
        })
      }
    }
  }
</script>

<style scoped>
  .sanjiao{
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 50px solid black;
  }
.login{
  background: url("../assets/img/bg2.png") center;
  position: relative;
  width: 100vw;
  height: 100vh;
}
.center{
  background: white;
  width: 1000px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

}
.right{
  background: url("../assets/img/bg1.1.png") no-repeat;
  background-size: 100% 100%;
  float: right;
  width: 700px;
  height: 500px;

}
.center .logo{
  width: 180px;
  margin-top: 45px;
}
  .outer{
    text-align: center;
    float: left;
  }
 .outer>div{
   margin: 0 auto;
 }
  .input_outer{
    margin: 80px 50px 5px 45px;
    text-align: left;
  }
  .input_outer>div{
    margin-bottom: 70px;
  }
  .input_outer span{
    color: #aaaaaa;
    padding: 5px;
  }
  .input_outer input{
    outline: none;
    padding: 1px 5px;
    border: none;
  }
  .input_outer .aLine{
    border-bottom: 1px solid #a0a0a0;
    margin-top: 5px;
  }
  .button_outer{
    text-align: center;
    margin-top: 80px;
  }
  .input_outer button{
    padding: 5px 50px;
    outline: none;
    color: white;
    background: linear-gradient(cornflowerblue, rgba(100, 149, 237, 0.81),cornflowerblue);
    border: 1px solid cornflowerblue;
    border-radius: 5px;
  }
</style>
