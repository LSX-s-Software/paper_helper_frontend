<template>
  <div class="container">
    <img :src="`/img/bg/${bgIndex}.jpg`" alt="" id="bg" />
    <div class="title-container">
      <h1><i>PaperHelper</i></h1>
      <h2>文献助手</h2>
      <h3>赋能新时代研究课题组合作</h3>
    </div>
    <div class="login-container">
      <h2>{{ reg ? "注册" : "登录" }}</h2>
      <el-form
        class="login-form"
        :model="userInfo"
        label-width="80px"
        label-position="top"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item prop="username">
          <el-input v-model="userInfo.username" placeholder="用户名" maxlength="40">
            <template #prefix
              ><el-icon class="el-input__icon"><i-ep-user /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone" v-if="reg">
          <el-input v-model="userInfo.phone" placeholder="手机号" maxlength="11" type="tel">
            <template #prefix
              ><el-icon class="el-input__icon"><i-ep-iphone /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="userInfo.password" type="password" placeholder="密码" show-password maxlength="40">
            <template #prefix
              ><el-icon class="el-input__icon"><i-ep-lock /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="reg" prop="password2">
          <el-input v-model="userInfo.password2" type="password" placeholder="确认密码" show-password maxlength="40">
            <template #prefix
              ><el-icon class="el-input__icon"><i-ep-lock /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <div class="switch">
          <span>还没有账号？</span>
          <el-button type="text" @click="reg = !reg">{{ reg ? "登录" : "注册" }}</el-button>
        </div>
        <el-button type="primary" @click="handleAction" id="action-btn" :loading="loading">{{
          reg ? "注册" : "登录"
        }}</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import { login, register, checkUsername, checkToken } from "@/api/user";
import { ElMessageBox } from "element-plus";

useDark();

const router = useRouter();

checkToken(localStorage.getItem("token"))
  .then(() => {
    router.replace("/home/dashboard");
  })
  .catch(() => {});

const userInfo = reactive({
  username: "",
  password: "",
  password2: "",
  phone: "",
});

const reg = ref(false);

const bgIndex = ref(Math.floor(Math.random() * 3) + 1);

const loading = ref(false);

const formRef = ref(null);
const validateUsername = (rule, value, callback) => {
  if (reg.value && value != "") {
    checkUsername(value)
      .then(() => callback())
      .catch(() => {
        callback(new Error("用户名已存在"));
      });
  }
};
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (userInfo.password2 !== "") {
      if (!formRef.value) return;
      formRef.value.validateField("password2", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== userInfo.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const validatePhone = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else {
    if (value !== "") {
      if (value.length != 11) {
        callback(new Error("手机号不正确"));
      }
    }
    callback();
  }
};
const rules = reactive({
  username: [{ validator: validateUsername, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
  password2: [{ validator: validatePass2, trigger: "blur" }],
  phone: [{ validator: validatePhone, trigger: "blur" }],
});

const handleAction = () => {
  loading.value = true;
  if (reg.value) {
    formRef.value.validate(valid => {
      if (valid) {
        register(userInfo.username, userInfo.password, userInfo.password2, userInfo.phone)
          .then(() => {
            router.replace("/home/dashboard");
          })
          .catch(err => {
            ElMessageBox.alert(err, "注册失败", {
              type: "error",
            });
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        ElMessageBox.alert("信息未填写完整", "注册失败", {
          type: "error",
        });
        loading.value = false;
        return false;
      }
    });
  } else {
    login(userInfo.username, userInfo.password)
      .then(() => {
        router.replace("/home/dashboard");
      })
      .catch(err => {
        ElMessageBox.alert(err, "登录失败", {
          type: "error",
        });
      })
      .finally(() => {
        loading.value = false;
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
    z-index: 0;
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

  .login-container {
    position: fixed;
    padding: 32px;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    text-align: left;
    background-color: var(--material);
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
