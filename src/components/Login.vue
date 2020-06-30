<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!--登录区域-->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0"
        class="label"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont iconyonghu"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont iconmima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="myLogin">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        username: "",
        password: ""
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
      ]
    };
  },
methods: {
  resetLoginForm(){
    this.$refs.loginFormRef.resetFields();
  },
  //表单的预验证
  myLogin(){
  this.$refs.loginFormRef.validate(async valid =>{
    if(!valid) return;
    const{data:res}=await this.$http.post("login",this.loginForm);
    if(res.meta.status!==200) return this.$message.error('登录失败！')
    this.$message.success('登陆成功！')
    window.sessionStorage.setItem('token',res.data.token)
    this.$router.push({path:'/home'})
  })
}
},
};
</script>
<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #eee;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #eee;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.label {
  position: absolute;
  bottom: 0;
  padding: 0 10px;
  width: 100%;
  box-sizing: border-box;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>
