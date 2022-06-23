<template>
  <div class="container">
    <div class="header">
      <h1>PaperHelper</h1>
      <div class="right">
        <el-popover :width="192" trigger="click">
          <template #reference>
            <div class="user">
              <img :src="userInfo.avatar" alt="" class="avatar" />
              <span>{{ userInfo.username }}</span>
            </div>
          </template>
          <template #default>
            <el-button @click="showUserInfoDrawer = true">修改信息</el-button>
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
          <div class="welcome-screen">
            <img src="/img/undraw_online_articles_re_yrkj.svg" alt="" />
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
              <!-- 项目信息按钮 -->
              <el-button circle @click="showProjectDetail">
                <el-icon><i-ep-setting /></el-icon>
              </el-button>
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
                :http-request="handleFileUpload"
              >
                <el-button circle :type="edit ? 'default' : 'primary'">
                  <el-icon><i-ep-plus /></el-icon>
                </el-button>
              </el-upload>
              <!-- 删除按钮 -->
              <el-popconfirm title="确认要删除这些文献吗？此操作不可撤销" @confirm="handleDeletePaper">
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
            <el-table-column prop="tag" label="标签" width="180">
              <template #default="scope">
                <span class="tag" v-for="(t, index) in scope.row.tag" :key="index">
                  {{ t.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="authors" label="作者">
              <template #default="scope">
                <span class="tag" v-for="(author, index) in scope.row.author" :key="index">
                  {{ author }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="year" label="年份" width="80" sortable />
            <el-table-column prop="publication" label="来源" sortable />
            <el-table-column prop="create_time" label="添加日期" width="120" sortable />
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

  <!-- 项目信息抽屉 -->
  <el-drawer v-model="showProjectInfoDrawer">
    <template #header>
      <h4 style="font-weight: 500; text-align: left">项目信息</h4>
    </template>
    <template #default>
      <div>
        <el-descriptions :column="1">
          <el-descriptions-item label="项目名">
            {{ currentProject.name }}
            <el-button text circle @click="handleEditProject('name')">
              <el-icon><i-ep-edit /></el-icon>
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="项目描述">
            {{ currentProject.description }}
            <el-button text circle @click="handleEditProject('description')">
              <el-icon><i-ep-edit /></el-icon>
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="邀请码">
            <span @click="copyInvitation">{{ currentProject.invitation_code }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentProject.create_time }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentProject.update_time }}</el-descriptions-item>
          <el-descriptions-item label="所有者">
            {{ currentProject.members.find(m => m.is_owner).username }}
          </el-descriptions-item>
          <el-descriptions-item label="项目成员" :class-name="'avatar-list ' + (selectingNewAdmin ? 'selectable' : '')">
            <el-tooltip
              v-for="member in currentProject.members"
              :key="member.id"
              class="box-item"
              :content="member.username"
              placement="bottom"
            >
              <el-avatar
                :size="36"
                :src="member.avatar"
                @click="selectingNewAdmin ? handleTransferProject(member) : false"
              />
            </el-tooltip>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </template>
    <template #footer>
      <div>
        <el-popover
          placement="top"
          title="更改项目的所有者"
          trigger="click"
          :width="200"
          content="在上方成员列表中选择一个成员作为新的项目所有者"
          v-if="isOwner"
        >
          <template #reference>
            <el-button v-if="isOwner" @click="handleTransferProject">更改所有者</el-button>
          </template>
        </el-popover>
        <el-popconfirm
          v-if="isOwner"
          title="确认删除这个项目吗？此操作不能撤销"
          confirm-button-type="danger"
          confirm-button-text="删除"
          cancel-button-text="取消"
          @confirm="handleDeleteProject(currentProjectId)"
        >
          <template #reference>
            <el-button type="danger">删除项目</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm
          v-if="!isOwner"
          title="确认退出这个项目吗？退出后可以通过邀请码重新加入项目"
          confirm-button-type="danger"
          confirm-button-text="退出"
          cancel-button-text="取消"
          @confirm="handleLeaveProject(currentProject.id)"
        >
          <template #reference>
            <el-button type="danger">退出项目</el-button>
          </template>
        </el-popconfirm>
      </div>
    </template>
  </el-drawer>

  <!-- 个人信息抽屉 -->
  <el-drawer v-model="showUserInfoDrawer">
    <template #header>
      <h4 style="font-weight: 500; text-align: left">个人信息</h4>
    </template>
    <template #default>
      <div>
        <el-descriptions :column="1">
          <el-descriptions-item label="用户名">
            {{ userInfo.username }}
            <el-button text circle @click="handleEditUserInfo('username')">
              <el-icon><i-ep-edit /></el-icon>
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ userInfo.phone }}
            <el-button text circle @click="handleEditUserInfo('phone')">
              <el-icon><i-ep-edit /></el-icon>
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="密码">
            ********
            <el-button text circle @click="handleEditUserInfo('password')">
              <el-icon><i-ep-edit /></el-icon>
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="头像">
            <el-upload
              style="display: inline-block"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :http-request="handleAvatarUpload"
              accept="image/*"
            >
              <el-button text circle>
                <el-icon><i-ep-edit /></el-icon>
              </el-button>
            </el-upload>
          </el-descriptions-item>
          <el-descriptions-item>
            <el-avatar :size="100" :src="userInfo.avatar" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import { onBeforeRouteUpdate } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {fetchUserInfo, logout, checkUsername, editUserInfo, changePassword, uploadAvatar} from "@/api/user";
import { useUserStore } from "@/store";
import {
  getProjectList,
  getProjectInfo,
  createProject,
  editProject,
  deleteProject,
  joinProject,
  leaveProject,
  transferProject,
} from "@/api/project";
import { formatTime } from "@/utils/util";
import {deletePaper, uploadPaper} from "@/api/paper";

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
  userInfo.value.username = "";
  userInfo.value.avatar = "";
  router.replace("/");
  ElMessage({
    message: "您已成功退出登录",
    type: "success",
  });
};

// 修改用户信息
const showUserInfoDrawer = ref(false);

const handleEditUserInfo = key => {
  let friendlyName, regExp, errMsg;
  switch (key) {
    case "username":
      friendlyName = "用户名";
      regExp = /\s*\S+?/;
      errMsg = "用户名不能为空";
      break;
    case "phone":
      friendlyName = "手机号";
      regExp = /^[0-9]{11}$/;
      errMsg = "手机号无效";
      break;
    case "password":
      ElMessageBox.prompt("请输入旧密码", "修改密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\s*\S+?/,
        inputType: "password",
        inputErrorMessage: "密码不能为空",
      }).then(({ value: oldPassword }) => {
        ElMessageBox.prompt("请输入新密码", "修改密码", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\s*\S+?/,
          inputType: "password",
          inputErrorMessage: "密码不能为空",
        }).then(({ value: newPassword }) => {
          changePassword(oldPassword, newPassword)
            .then(() => {
              ElMessage({
                message: "修改密码成功",
                type: "success",
              });
            })
            .catch(err => {
              ElMessageBox.alert(err, "密码修改失败", {
                confirmButtonText: "确定",
                type: "error",
              });
            });
        });
      });
      return;
    default:
      break;
  }
  ElMessageBox.prompt("请输入新的" + friendlyName, "编辑用户信息", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: regExp,
    inputErrorMessage: errMsg,
    inputValue: userInfo.value[key],
    inputType: key == "password" ? "password" : "text",
  }).then(async ({ value }) => {
    if (key == "username") {
      try {
        await checkUsername(value);
      } catch (error) {
        ElMessageBox.alert("用户名已存在", "用户名修改失败", {
          confirmButtonText: "确定",
          type: "error",
        });
        return;
      }
    }
    if (value == userInfo.value[key]) {
      return;
    }
    editUserInfo(key, value)
      .then(() => {
        userInfo.value[key] = value;
        ElMessage({
          message: `${friendlyName}修改成功`,
          type: "success",
        });
      })
      .catch(err => {
        ElMessageBox.alert(err, `${friendlyName}修改失败`, {
          confirmButtonText: "确定",
          type: "error",
        });
      });
  });
};

// 修改头像
const handleAvatarUpload = options => {
  uploadAvatar(options.file)
    .then(res => {
      userInfo.value.avatar = res.avatar;
      ElMessage({
        message: "头像修改成功",
        type: "success",
      });
    })
    .catch(err => {
      ElMessageBox.alert(err, "头像修改失败", {
        confirmButtonText: "确定",
        type: "error",
      });
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
      data.create_time = formatTime(data.create_time);
      data.update_time = formatTime(data.update_time);
      isOwner.value = data.members.find(m => m.id == userInfo.value.id).is_owner;
      currentProject.value = data;
      // 处理论文列表
      let readPaperList = localStorage.getItem("readPaperList");
      if (readPaperList != null && readPaperList != "") {
        readPaperList = JSON.parse(readPaperList);
      } else {
        readPaperList = {};
      }
      paperList.value = data.paper.map(p => {
        p.create_time_long = formatTime(p.create_time);
        p.create_time = formatTime(p.create_time, "yyyy-MM-dd");
        p.read = p.id in readPaperList;
        return p;
      });
    })
    .catch(err => {
      ElMessageBox.alert(err, "获取论文列表失败", {
        confirmButtonText: "确定",
        type: "error",
      });
    })
    .finally(() => (paperListLoading.value = false));
};

// 显示项目详情
const showProjectInfoDrawer = ref(false);

const showProjectDetail = () => {
  showProjectInfoDrawer.value = true;
};

// 复制邀请码
const copyInvitation = () => {
  navigator.clipboard
    .writeText(currentProject.value.invitation_code)
    .then(() => {
      ElMessage({
        message: "邀请码已复制到剪贴板",
        type: "success",
      });
    })
    .catch(err => {
      console.error(err);
      ElMessage({
        message: "邀请码复制失败",
        type: "error",
      });
    });
};

// 编辑项目
const handleEditProject = key => {
  let friendlyName, regExp, errMsg;
  switch (key) {
    case "name":
      friendlyName = "名称";
      regExp = /\s*\S+?/;
      errMsg = "项目名称不能为空";
      break;
    case "description":
      friendlyName = "描述";
      regExp = /\s*\S+?/;
      errMsg = "项目描述不能为空";
      break;
    default:
      break;
  }
  ElMessageBox.prompt("请输入项目" + friendlyName, "编辑项目", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: regExp,
    inputErrorMessage: errMsg,
    inputValue: currentProject.value[key],
  }).then(({ value }) => {
    editProject(currentProjectId.value, key, value)
      .then(() => {
        ElMessage({
          message: `项目${friendlyName}修改成功`,
          type: "success",
        });
        currentProject.value[key] = value;
      })
      .catch(err => {
        ElMessageBox.alert(err, `项目${friendlyName}修改失败`, {
          confirmButtonText: "确定",
          type: "error",
        });
      });
  });
};

// 删除项目
const isOwner = ref(false);
const handleDeleteProject = projectId => {
  if (!isOwner) {
    ElMessageBox.alert("您不是项目创建者，无法删除项目", "提示", {
      confirmButtonText: "确定",
      type: "error",
    });
  } else {
    deleteProject(projectId)
      .then(() => {
        ElMessage({
          message: "项目已删除",
          type: "success",
        });
        showProjectInfoDrawer.value = false;
        projectList.value.splice(
          projectList.value.findIndex(p => p.id == projectId),
          1
        );
        router.replace("/home/dashboard");
      })
      .catch(err => {
        ElMessageBox.alert(err, "删除项目失败", {
          confirmButtonText: "确定",
          type: "error",
        });
      });
  }
};

// 处理项目变化
onBeforeRouteUpdate(to => {
  if (to.params.projectId == "dashboard") {
    currentProjectId.value = -1;
  } else {
    let projectId = to.params.projectId;
    currentProjectId.value = projectId;
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
            message: `您已成功加入项目“${data.name}”`,
          });
          projectList.value.push(data);
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

// 退出项目
const handleLeaveProject = projectId => {
  leaveProject(projectId)
    .then(() => {
      ElMessage({
        type: "success",
        message: "您已成功退出项目",
      });
      projectList.value.splice(
        projectList.value.findIndex(p => p.id == projectId),
        1
      );
      showProjectInfoDrawer.value = false;
      router.replace("/home/dashboard");
    })
    .catch(err => {
      ElMessageBox.alert(err, "退出项目失败", {
        confirmButtonText: "确定",
        type: "error",
      });
    });
};

// 迁移项目
const selectingNewAdmin = ref(false);
const handleTransferProject = (newOwner = null) => {
  if (!selectingNewAdmin.value) {
    selectingNewAdmin.value = true;
    return;
  }
  selectingNewAdmin.value = false;
  if (newOwner.is_owner) {
    ElMessageBox.alert("您已是项目所有者，无需迁移", "提示", {
      confirmButtonText: "确定",
      type: "info",
    });
    return;
  }
  ElMessageBox.confirm(`确定要将项目迁移给${newOwner.username}吗？`, "迁移项目", {
    confirmButtonText: "迁移",
    cancelButtonText: "取消",
  }).then(() => {
    transferProject(currentProjectId.value, newOwner.id)
      .then(() => {
        ElMessage({
          type: "success",
          message: "项目的所有者现在已更改为" + newOwner.username,
        });
        isOwner.value = false;
        currentProject.value.members.forEach(m => {
          if (m.id == newOwner.id) {
            m.is_owner = true;
          } else if (m.id == userInfo.id) {
            m.is_owner = false;
          }
        });
        showProjectInfoDrawer.value = false;
      })
      .catch(err => {
        ElMessageBox.alert(err, "迁移项目失败", {
          confirmButtonText: "确定",
          type: "error",
        });
      });
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
    // 标记已读
    if (!row.read) {
      let readPaperList = localStorage.getItem("readPaperList");
      if (readPaperList != null && readPaperList != "") {
        readPaperList = JSON.parse(readPaperList);
      } else {
        readPaperList = {};
      }
      readPaperList[row.id] = true;
      localStorage.setItem("readPaperList", JSON.stringify(readPaperList));
    }
    router.push(`/paper/${row.id}`);
  }
};

// 上传论文
const handleFileUpload = options => {
  uploadPaper(options.file, route.params.projectId)
      .then(res => {
        let p = res;
        p.create_time = formatTime(p.create_time, "yyyy-MM-dd");
        p.read = false;

        paperList.value.push(p);
        ElMessage({
          message: "论文上传成功",
          type: "success",
        });
      })
      .catch(err => {
        ElMessageBox.alert(err, "论文上传失败", {
          confirmButtonText: "确定",
          type: "error",
        });
      });
};

// 编辑状态
const edit = ref(false);
// 删除论文
const handleDeletePaper = () => {
  try {
    table.value.getSelectionRows().forEach(async row => {
      await deletePaper(row.id);
      let index = paperList.value.findIndex(p => p.id == row.id);
      paperList.value.splice(index, 1);
    });
    ElMessage({
      type: "success",
      message: "删除成功",
    });
  } catch (error) {
    ElMessageBox.alert(error, "删除失败", {
      confirmButtonText: "确定",
      type: "error",
    });
  }
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

    .welcome-screen {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: var(--secondary-text);

      img {
        height: 40%;
        transform: translateY(-20px);
      }

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

      .tag {
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

:deep(.avatar-list) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  margin-left: 8px;

  &.selectable {
    & > * {
      cursor: pointer;
      transition: all ease 0.1s;

      &:hover {
        border: 1px solid var(--theme);
      }

      &:active {
        filter: brightness(0.8);
      }
    }
  }
}
</style>
