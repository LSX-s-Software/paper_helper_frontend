<template>
  <div class="container">
    <img :src="`/img/bg/${bgIndex}.jpg`" alt="" id="bg" />
    <div class="title-container">
      <h1><i>PaperHelper</i></h1>
      <h2>文献助手</h2>
      <h3>赋能新时代研究课题组合作</h3>
    </div>
    <div class="login-contianer">
      <h2>{{ reg ? "注册" : "登录" }}</h2>
      <el-form class="login-form" :model="userInfo" label-width="80px" label-position="top">
        <el-form-item>
          <el-input v-model="userInfo.username" placeholder="用户名" maxlenth="20">
            <template #prefix
              ><el-icon class="el-input__icon"><i-ep-user /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="reg">
          <el-input v-model="userInfo.phone" placeholder="手机号" maxlenth="11" type="tel">
            <template #prefix
              ><el-icon class="el-input__icon"><i-ep-iphone /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="userInfo.password" type="password" placeholder="密码" show-password maxlenth="30">
            <template #prefix
              ><el-icon class="el-input__icon"><i-ep-lock /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="reg">
          <el-input v-model="userInfo.password2" type="password" placeholder="确认密码" show-password maxlenth="30">
            <template #prefix
              ><el-icon class="el-input__icon"><i-ep-lock /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <div class="switch">
          <span>还没有账号？</span>
          <el-button type="text" @click="reg = !reg">{{ reg ? "登录" : "注册" }}</el-button>
        </div>
        <el-button type="primary" @click="handleAction" id="action-btn">{{ reg ? "注册" : "登录" }}</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { login, register } from "@/api/user";

const router = useRouter();

const userInfo = reactive({
  username: "",
  password: "",
  password2: "",
  phone: "",
});

const reg = ref(false);

const bgIndex = ref(Math.floor(Math.random() * 3) + 1);

const handleAction = () => {
  if (reg.value) {
    if (userInfo.password !== userInfo.password2) {
      alert("两次密码不一致");
      return;
    }
    register(userInfo.username, userInfo.password, userInfo.password2, userInfo.phone)
      .then(() => {
        router.replace("/home/dashboard");
      })
      .catch(err => {
        alert(err.message);
      });
  } else {
    login(userInfo.username, userInfo.password)
      .then(() => {
        router.replace("/home/dashboard");
      })
      .catch(err => {
        alert(err.message);
      });
  }
};
</script>

<style lang="less">
.container {
  img#bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    filter: brightness(0.6);
  }

  .title-container {
    position: fixed;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    text-align: left;

    h1,
    h2 {
      color: rgba(255, 255, 255, 0.95);
      font-weight: normal;
    }

    h1 {
      font-size: 52px;
    }

    h2 {
      font-size: 40px;
    }

    h3 {
      font-size: 24px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: normal;
    }
  }

  .login-contianer {
    position: fixed;
    padding: 32px;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    text-align: left;
    background-color: rgba(245, 245, 245, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 12px;
    }

    .el-form-item {
      margin-bottom: 12px;
      width: 225px;
    }

    .switch {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -10px;
      margin-bottom: 12px;

      & > span {
        font-size: 14px;
        color: var(--secondary-text);
      }
    }

    #action-btn {
      width: 75%;
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
