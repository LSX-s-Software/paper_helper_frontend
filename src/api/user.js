import { http } from "@/api/index";
import { useUserStore } from "@/store";

/**
 * 登录
 * @param {String} username 用户名
 * @param {String} password 密码
 * @returns {Promise} 登录Promise
 */
export function login(username, password) {
  return new Promise((resolve, reject) => {
    http
      .post("/tokens/login", {
        username,
        password,
      })
      .then(res => {
        if (res.data.token) {
          const user = useUserStore();
          localStorage.setItem("token", res.data.token);
          user.id = res.data.id;
          delete res.data.token;
          user.info = res.data;
          resolve();
        } else {
          throw { message: res.data.message };
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 注册
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} confirmPassword 确认密码
 * @param {String} phone 手机号
 * @returns 注册Promise
 */
export function register(username, password, confirmPassword, phone) {
  return new Promise((resolve, reject) => {
    http
      .post("/tokens/register", {
        username: username,
        password: password,
        confirmPassword: confirmPassword,
        phone: phone,
      })
      .then(res => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          resolve();
        } else {
          throw { message: res.data.message };
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 检查用户名是否合法
 * @param {String} username 用户名
 * @returns {Promise} 检查用户名是否合法Promise
 */
export function checkUsername(username) {
  return new Promise((resolve, reject) => {
    http
      .get(`/tokens/count/${username}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      .then(res => {
        if (res.data.count === 0) {
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);
  });
}

/**
 * 登出
 */
export function logout() {
  localStorage.removeItem("token");
}

/**
 * 校验token是否有效
 * @param {String} token token
 * @returns 校验结果Promise
 */
export function checkToken(token) {
  return new Promise((resolve, reject) => {
    if (token == "" || token == null) {
      reject();
      return;
    }
    http
      .get("/test/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      .then(res => {
        if (res.data.message == "login success") {
          resolve();
        } else {
          throw { message: res.data.message };
        }
      })
      .catch(err => {
        reject(err.response ? err.response.data.detail : err.message);
        logout();
      });
  });
}

/**
 * 获取用户信息
 * @returns {Promise} 获取用户信息Promise
 */
export function fetchUserInfo() {
  const user = useUserStore();
  return new Promise((resolve, reject) => {
    http
      .get(`/users/${user.id}`)
      .then(res => {
        user.id = res.data.id;
        user.info = res.data;
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.detail : err.message);
      });
  });
}

/**
 * 编辑用户信息
 * @param {String} key 键
 * @param {String} value 值
 * @returns 编辑结果Promise
 */
export function editUserInfo(key, value) {
  return new Promise((resolve, reject) => {
    const user = useUserStore();
    http
      .put(`/users/${user.id}`, { [key]: value })
      .then(() => {
        user.info[key] = value;
        resolve();
      })
      .catch(err => {
        reject(err.response ? err.response.data.detail : err.message);
      });
  });
}

/**
 * 修改密码
 * @param {String} oldPassword 旧密码
 * @param {String} newPassword 新密码
 * @returns 修改结果Promise
 */
export function changePassword(oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    const user = useUserStore();
    http
      .put(`/users/${user.id}`, {
        old_password: oldPassword,
        new_password: newPassword,
      })
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err.response ? err.response.data.detail : err.message);
      });
  });
}

/**
 * 上传头像
 * @param {File} file 文件
 * @returns 上传结果Promise
 */
export function uploadAvatar(file) {
  return new Promise((resolve, reject) => {
    const user = useUserStore();
    const formData = new FormData();
    formData.append("file", file);
    http
        .post(`/users/${user.id}/avatars`, formData, {
          headers: {"Content-Type": "multipart/form-data"},
        })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.response ? err.response.data.detail : err.message);
        });
  });
}
