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
      .catch(err => reject(err.response ? err.response.data.message : err.message));
  });
}

/**
 * 获取项目详情
 * @param {String} projectId 项目id
 * @returns 项目详情Promise
 */
export function getProjectInfo(projectId) {
  return new Promise((resolve, reject) => {
    http
      .get(`/projects/${projectId}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => reject(err.response ? err.response.data.message : err.message));
  });
}

// export function getPaperList(projectId) {
//   return new Promise((resolve, reject) => {
//     http
//       .get(`/projects/${projectId}/papers`)
//       .then(res => {
//         resolve(res.data);
//       })
//       .catch(err => reject(err));
//   });
// }
