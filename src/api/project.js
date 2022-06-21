import { http } from "@/api/index";
import { useUserStore } from "@/store";

/**
 * 获取项目列表
 * @returns {Promise} 项目列表Promise
 */
export function getProjectList() {
  return new Promise((resolve, reject) => {
    const user = useUserStore();
    http
      .get(`/users/${user.id}/projects`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => reject(err));
  });
}
