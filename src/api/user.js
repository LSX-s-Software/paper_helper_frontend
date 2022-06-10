import { http } from "@/api/index";

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
          localStorage.setItem("token", res.data.token);
          resolve();
        } else {
          throw { message: res.data.message };
        }
      })
      .catch(err => {
        console.error(err);
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
        console.error(err);
        reject(err);
      });
  });
}
