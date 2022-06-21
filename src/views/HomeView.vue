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
              <el-button type="primary" @click="createProject">新建项目</el-button>
              <el-button>加入项目</el-button>
            </template>
          </el-popover>
        </div>
        <div class="placeholder" v-if="!projectListLoading && projectList.length == 0">
          <span>目前没有项目</span>
          <el-button type="primary" @click="createProject">新建项目</el-button>
          <el-button>加入项目</el-button>
        </div>
        <el-menu class="nav-menu" router v-loading="projectListLoading">
          <el-menu-item v-for="item in projectList" :key="item.id" :index="`/home/${item.id}`">
            <el-icon><i-ep-document /></el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right-container">
        <template v-if="currentProject == -1">
          <div class="placeholder">
            <h3>欢迎回到PaperHelper</h3>
            <h4>从左侧选择一个项目继续工作吧</h4>
          </div>
        </template>
        <template v-else>
          <div class="header">
            <h2>{{ projectList[currentProject].name }}</h2>
            <div class="operations">
              <!-- 编辑按钮 -->
              <el-button circle @click="edit = !edit" :type="edit ? 'primary' : 'default'">
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
import { getProjectList } from "@/api/project";

const isDark = useDark();
const router = useRouter();

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

// 处理项目变化
const currentProject = useRoute().params.projectId == "dashboard" ? ref(-1) : ref(useRoute().params.projectId);
onBeforeRouteUpdate(to => {
  if (to.params.projectId == "dashboard") {
    currentProject.value = -1;
  } else {
    currentProject.value = projectList.value.findIndex(item => item.id == to.params.projectId);
  }
});

const creatingProject = ref(false);
const createProject = () => {
  if (creatingProject.value) {
    return;
  }
  creatingProject.value = true;
  ElMessageBox.prompt("请输入项目名称", "创建项目", {
    confirmButtonText: "创建",
    cancelButtonText: "取消",
    inputPattern: /\s*\S+?/,
    inputErrorMessage: "项目名称不能为空",
  })
    .then(({ value }) => {
      ElMessage({
        type: "success",
        message: `Your email is:${value}`,
      });
    })
    .catch(() => {})
    .finally(() => {
      creatingProject.value = false;
    });
};

const paperList = ref([
  {
    id: 1,
    title: "论文一",
    abstract: "论文一摘要",
    keywords: "论文一关键词",
    authors: ["作者1", "作者2"],
    publication: "刊物1",
    volume: "论文一卷",
    pages: "20",
    year: 2020,
    month: 1,
    day: 1,
    read: false,
    createTime: "2020-01-02",
  },
  {
    id: 2,
    title: "论文二",
    abstract: "论文二摘要",
    keywords: "论文二关键词",
    authors: ["作者1", "作者2"],
    publication: "刊物2",
    volume: "论文二卷",
    pages: "10",
    year: 2021,
    month: 1,
    day: 1,
    read: false,
    createTime: "2020-01-01",
  },
]);

// 列表
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
        message: "获取个人信息失败:" + (error.detail || error.message || error),
      });
      return;
    }
  }
  getProjectList()
    .then(res => {
      projectList.value = res;
    })
    .catch(err => {
      ElMessageBox.confirm(err.detail || err.message || err, "获取项目列表失败", {
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
          font-size: 20px;
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

        h2 {
          font-size: 24px;
          font-weight: normal;
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
