import { http } from "@/api/index";

/**
 * 获取论文详情
 * @param {String} paperId 论文id
 * @returns {Promise} 论文详情Promise
 */
export function getPaper(paperId) {
  return new Promise((resolve, reject) => {
    http
      .get(`/papers/${paperId}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.detail : err.message);
      });
  });
}

/**
 * 删除论文
 * @param {String} PaperId 论文id
 * @returns 删除结果Promise
 */
export function deletePaper(paperId) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/papers/${paperId}`)
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err.response ? err.response.data.detail : err.message);
      });
  });
}

/**
 * 添加标签
 * @param {String} paperId 论文id
 * @param {String} newTagName 新标签名
 * @returns 添加标签结果Promise
 */
export function addTag(paperId, newTagName) {
  return new Promise((resolve, reject) => {
    http
      .post(`/papers/${paperId}/tags`, { name: newTagName })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.detail : err.message);
      });
  });
}

/**
 * 删除标签
 * @param {String} paperId 论文id
 * @param {String} tagId 标签id
 * @returns 删除结果Promise
 */
export function deleteTag(paperId, tagId) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/papers/${paperId}/tags/${tagId}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.detail : err.message);
      });
  });
}