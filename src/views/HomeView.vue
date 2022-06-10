<template>
  <div class="container">
    <header>
      <h1>PaperHelper</h1>
      <div class="right">
        <div class="user">
          <el-button @click="toggleDark()">
            <span class="ml-2">{{ isDark ? "Dark" : "Light" }}</span>
          </el-button>
          <img :src="userInfo.avatar" alt="" class="avatar" />
          <span>{{ userInfo.username }}</span>
        </div>
      </div>
    </header>
    <div class="main-container">
      <div class="left-container">
        <h2>项目</h2>
        <el-menu class="nav-menu" router>
          <el-menu-item v-for="item in projectList" :key="item.id" :index="`/home/${item.id}`">
            <el-icon><i-ep-document /></el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right-container">
        <template v-if="currentProject == -1">
          <div class="placeholder">
            <h3>欢迎回到PaperHelper<br />从左侧选择一个项目继续工作吧</h3>
          </div>
        </template>
        <template v-else>
          <div class="header">
            <h2>{{ projectList[currentProject].name }}</h2>
            <div class="operations">
              <el-button @click="addPaper()">
                <el-icon><i-ep-plus /></el-icon>
                <span>添加论文</span>
              </el-button>
            </div>
          </div>
          <el-table :data="paperList" height="250" stripe class="paper-list" row-key="id" @row-click="handleRowClick">
            <el-table-column type="selection" width="40" />
            <el-table-column prop="title" label="名称" />
            <el-table-column prop="authors" label="作者">
              <template #default="scope">
                <span class="author-tag" v-for="(author, index) in scope.row.authors" :key="index">
                  {{ author }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="year" label="年份" width="80" sortable />
            <el-table-column prop="publication" label="来源" />
            <el-table-column prop="createTime" label="添加日期" width="120" sortable />
            <el-table-column prop="read" label="已读" width="60">
              <template #default="scope">
                <el-icon v-if="scope.row.read"><i-ep-circleCheckFilled /></el-icon>
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            background
            layout="prev, pager, next"
            :page-count="pageCount"
            hide-on-single-page
            small
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDark, useToggle } from "@vueuse/core";
import { onBeforeRouteUpdate } from "vue-router";

const isDark = useDark();
const toggleDark = useToggle(isDark);

// 用户信息
const userInfo = reactive({
  username: "张三",
  avatar: "",
});

// 项目
const projectList = ref([
  {
    id: 1,
    name: "项目一",
    description: "项目一描述",
    createTime: "2020-01-01",
  },
  {
    id: 2,
    name: "项目二",
    description: "项目二描述",
    createTime: "2020-01-01",
  },
]);
// 处理项目变化
const currentProject = ref(-1);
onBeforeRouteUpdate(to => {
  if (to.params.projectId == "dashboard") {
    currentProject.value = -1;
  } else {
    currentProject.value = projectList.value.findIndex(item => item.id == to.params.projectId);
  }
});

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

// 分页
const pageCount = ref(10);
// const currentPage = ref(0);

// 行点击事件
const handleRowClick = row => {
  console.log(row);
};

// 添加论文
const addPaper = () => {
  alert("addPaper");
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  header {
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
      height: 100%;

      span {
        display: block;
        white-space: nowrap;
      }

      .user {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .avatar {
          display: block;
          height: 100%;
          aspect-ratio: 1 / 1;
          background-color: #fff;
          border-radius: 50%;
          margin-right: 8px;
        }
      }
    }
  }

  .main-container {
    display: flex;
    flex: 1;

    .left-container {
      width: 250px;
      background-color: var(--primary-bg);
      --bg-color: var(--primary-bg);
      display: flex;
      flex-direction: column;
      align-items: stretch;

      h2 {
        font-size: 20px;
        font-weight: 500;
        text-align: left;
        margin: 12px 20px;
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
      color: var(--secondary-text);
      font-size: 20px;

      h3 {
        width: 100%;
        font-weight: normal;
        display: block;
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
    }
  }
}
</style>
