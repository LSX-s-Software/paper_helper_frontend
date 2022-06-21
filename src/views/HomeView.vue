<template>
  <div class="container">
    <div class="header">
      <h1>PaperHelper</h1>
      <div class="right">
        <el-popover :width="192" trigger="hover">
          <template #reference>
            <div class="user">
              <img :src="userInfo.avatar" alt="" class="avatar" />
              <span>{{ userInfo.username }}</span>
            </div>
          </template>
          <template #default>
            <el-button>修改信息</el-button>
            <el-button type="danger" @click="handleLogout">退出登录</el-button>
          </template>
        </el-popover>
      </div>
    </div>
    <div class="main-container">
      <div class="left-container">
        <div class="header">
          <h2>项目</h2>
          <el-popover trigger="click" :width="195" v-if="!projectListLoading && projectList.length > 0">
            <template #reference>
              <el-button circle>
                <el-icon><i-ep-plus /></el-icon>
              </el-button>
            </template>
            <template #default>
              <div>
                <el-button type="primary" @click="handleCreateProject">新建项目</el-button>
                <el-button @click="handleJoinProject">加入项目</el-button>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="placeholder" v-if="!projectListLoading && projectList.length == 0">
          <span>目前没有项目</span>
          <el-button type="primary" @click="handleCreateProject">新建项目</el-button>
          <el-button @click="handleJoinProject">加入项目</el-button>
        </div>
        <el-menu class="nav-menu" router v-loading="projectListLoading" :default-active="route.path">
          <el-menu-item v-for="item in projectList" :key="item.id" :index="`/home/${item.id}`">
            <el-icon><i-ep-document /></el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right-container">
        <template v-if="currentProjectId == -1">
          <div class="placeholder">
            <h3>欢迎回到PaperHelper</h3>
            <h4>从左侧选择一个项目继续工作吧</h4>
          </div>
        </template>
        <template v-else>
          <div class="header">
            <div class="left">
              <h2 class="name">{{ currentProject.name }}</h2>
              <span class="desc">{{ currentProject.description }}</span>
            </div>
            <div class="operations">
              <!-- 编辑按钮 -->
              <el-button circle @click="edit = !edit" :type="edit ? 'primary' : 'default'" v-if="paperList.length > 0">
                <el-icon>
                  <i-ep-edit v-if="!edit" />
                  <i-ep-check v-else />
                </el-icon>
              </el-button>
              <!-- 添加按钮 -->
              <el-upload
                v-if="!edit"
                accept=".pdf"
                :show-file-list="false"
                :on-success="handleFileUploadSuccess"
                :on-error="handleFileUploadError"
              >
                <el-button circle :type="edit ? 'default' : 'primary'">
                  <el-icon><i-ep-plus /></el-icon>
                </el-button>
              </el-upload>
              <!-- 删除按钮 -->
              <el-popconfirm title="确认要删除这些文献吗？此操作不可撤销" @confirm="deletePaper()">
                <template #reference>
                  <el-button type="danger" circle v-if="edit">
                    <el-icon><i-ep-delete /></el-icon>
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
          <!-- 表格 -->
          <el-table
            class="paper-list"
            ref="table"
            :data="paperList"
            height="250"
            :stripe="!isDark"
            row-key="id"
            @row-click="handleRowClick"
            row-class-name="paper-list-item"
            v-loading="paperListLoading"
          >
            <el-table-column type="selection" width="40" v-if="edit" />
            <el-table-column prop="title" label="名称" sortable />
            <el-table-column prop="authors" label="作者">
              <template #default="scope">
                <span class="author-tag" v-for="(author, index) in scope.row.authors" :key="index">
                  {{ author }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="year" label="年份" width="80" sortable />
            <el-table-column prop="publication" label="来源" sortable />
            <el-table-column prop="createTime" label="添加日期" width="120" sortable />
            <el-table-column prop="read" label="已读" width="60">
              <template #default="scope">
                <el-icon v-if="scope.row.read"><i-ep-circleCheckFilled /></el-icon>
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import { onBeforeRouteUpdate } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchUserInfo, logout } from "@/api/user";
import { useUserStore } from "@/store";
import { getProjectList, getProjectInfo, createProject, joinProject } from "@/api/project";

const isDark = useDark();
const router = useRouter();
const route = useRoute();

// 用户信息
const userStore = useUserStore();
const userInfo = ref(
  userStore.id != ""
    ? userStore.info
    : {
        username: "加载中",
        avatar: "",
      }
);

const handleLogout = () => {
  logout();
  userInfo.username = "";
  userInfo.avatar = "";
  router.replace("/");
  ElMessage({
    message: "您已成功退出登录",
    type: "success",
  });
};

// 项目
const projectListLoading = ref(true);
const projectList = ref([]);
const currentProjectId = route.params.projectId == "dashboard" ? ref(-1) : ref(route.params.projectId);
const currentProject = ref("");
const paperListLoading = ref(false);

// 加载项目信息
const loadProjectInfo = projectId => {
  paperListLoading.value = true;
  getProjectInfo(projectId)
    .then(data => {
      currentProject.value = data;
      paperList.value = data.list || [];
    })
    .catch(err => {
      ElMessageBox.alert(err, "获取论文列表失败", {
        confirmButtonText: "确定",
        type: "error",
      });
    })
    .finally(() => (paperListLoading.value = false));
};

// 处理项目变化
onBeforeRouteUpdate(to => {
  if (to.params.projectId == "dashboard") {
    currentProjectId.value = -1;
  } else {
    let projectId = to.params.projectId;
    currentProjectId.value = projectList.value.findIndex(item => item.id == projectId);
    loadProjectInfo(projectId);
  }
});

// 创建项目
let creatingProject = false;
const handleCreateProject = () => {
  if (creatingProject) {
    return;
  }
  creatingProject = true;
  ElMessageBox.prompt("请输入项目名称", "创建项目", {
    confirmButtonText: "创建",
    cancelButtonText: "取消",
    inputPattern: /\s*\S+?/,
    inputErrorMessage: "项目名称不能为空",
  })
    .then(({ value }) => {
      createProject(value)
        .then(data => {
          ElMessage({
            message: "项目创建成功",
            type: "success",
          });
          projectList.value.push(data);
          router.push(`/home/${data.id}`);
        })
        .catch(err => {
          ElMessageBox.alert(err, "创建项目失败", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    })
    .catch(() => {})
    .finally(() => {
      creatingProject = false;
    });
};

// 加入项目
let joiningProject = false;
const handleJoinProject = () => {
  if (joiningProject) {
    return;
  }
  joiningProject = true;
  ElMessageBox.prompt("请输入项目邀请码", "加入项目", {
    confirmButtonText: "加入",
    cancelButtonText: "取消",
    inputPattern: /^[a-zA-Z0-9]{8}$/,
    inputErrorMessage: "邀请码必须是8位字母或数字",
  })
    .then(({ value }) => {
      joinProject(value)
        .then(data => {
          ElMessage({
            type: "success",
            message: `您已成功加入项目${data.name}`,
          });
          router.push(`/home/${data.id}`);
        })
        .catch(err => {
          ElMessageBox.alert(err, "加入项目失败", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    })
    .catch(() => {})
    .finally(() => {
      joiningProject = false;
    });
};

// 论文列表
const paperList = ref([]);
const table = ref(null);
// 行点击事件
const handleRowClick = row => {
  if (edit.value) {
    table.value.toggleRowSelection(row);
  } else {
    router.push(`/paper/${row.id}`);
  }
};

// 添加论文
const handleFileUploadSuccess = (res, file) => {
  console.log(res, file);
  ElMessage({
    message: "上传成功",
    type: "success",
  });
};
const handleFileUploadError = (err, file) => {
  console.error(err, file);
  ElMessage({
    message: `上传失败：${err.message}`,
    type: "error",
  });
};

// 编辑状态
const edit = ref(false);
// 删除论文
const deletePaper = () => {
  table.value.getSelectionRows().forEach(row => {
    paperList.value.splice(
      paperList.value.findIndex(item => item.id == row.id),
      1
    );
  });
};

// 加载数据
onMounted(async () => {
  if (userStore.id == "") {
    try {
      userInfo.value = await fetchUserInfo();
    } catch (error) {
      ElMessage({
        type: "error",
        message: "获取个人信息失败：" + error,
      });
      return;
    }
  }
  getProjectList()
    .then(res => {
      projectList.value = res;
    })
    .catch(err => {
      ElMessageBox.confirm(err, "获取项目列表失败", {
        confirmButtonText: "重试",
        cancelButtonText: "忽略",
        type: "error",
      })
        .then(() => {
          location.reload();
        })
        .catch(() => {});
    })
    .finally(() => {
      projectListLoading.value = false;
    });
  if (route.params.projectId != "dashboard") {
    loadProjectInfo(route.params.projectId);
  }
});
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  & > .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid var(--separator-color);
    background-color: var(--theme);
    color: #fff;
    width: 100%;
    box-sizing: border-box;

    h1 {
      font-size: 24px;
      font-weight: normal;
    }

    .right {
      display: flex;
      align-items: stretch;
      justify-content: flex-end;
      height: 100%;

      & > * {
        display: block;
        margin-right: 12px;
      }

      span {
        white-space: nowrap;
      }

      .user {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .avatar {
          display: block;
          height: 32px;
          width: 32px;
          background-color: #fff;
          border-radius: 50%;
          margin-right: 8px;
          object-fit: contain;
        }
      }
    }
  }

  .main-container {
    display: flex;
    flex: 1;

    .left-container {
      position: relative;
      width: 250px;
      background-color: var(--primary-bg);
      --bg-color: var(--primary-bg);
      display: flex;
      flex-direction: column;
      align-items: stretch;

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 12px 20px;

        h2 {
          font-size: 24px;
          font-weight: 500;
          text-align: left;
        }
      }

      .placeholder {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        span {
          display: block;
        }

        button {
          margin: 0;
        }
      }

      .nav-menu {
        flex: 1;
        border: none;
        background-color: transparent;
      }
    }

    .placeholder {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: var(--secondary-text);

      h3,
      h4 {
        width: 100%;
        font-weight: normal;
        display: block;
      }

      h3 {
        font-size: 32px;
        color: var(--primary-text);
      }

      h4 {
        font-size: 20px;
        color: var(--secondary-text);
      }
    }

    .right-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        padding: 8px 20px;

        .left {
          text-align: left;

          .name {
            font-size: 22px;
            font-weight: 500;
          }

          .desc {
            font-size: 14px;
            color: var(--secondary-text);
          }
        }

        .operations {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          & > * {
            margin-left: 12px;
          }
        }
      }

      .paper-list {
        flex: 1;
        border: none;
        background-color: transparent;
      }

      .pagination {
        margin: 12px 0;
      }

      .author-tag {
        display: inline-block;
        padding: 1px 4px;
        border-radius: 5px;
        background-color: var(--theme-transparent);
        border: 0.5px solid var(--theme);
        color: var(--theme);
        margin-right: 4px;
      }

      :deep(.paper-list-item) {
        cursor: pointer;
      }
    }
  }
}
</style>
