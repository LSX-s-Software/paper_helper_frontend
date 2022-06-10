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
        <el-menu default-active="/home/1" class="nav-menu" router>
          <el-menu-item v-for="item in projectList" :key="item.id" :index="`/home/${item.id}`">
            <el-icon><i-ep-document /></el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right-container">
        <el-table :data="paperList" height="250" stripe class="paper-list">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="title" label="名称" />
          <el-table-column prop="authors" label="作者" />
          <el-table-column prop="year" label="年份" sortable />
          <el-table-column prop="publication" label="来源" />
          <el-table-column prop="createTime" label="添加日期" sortable />
          <el-table-column prop="read" label="已读" />
        </el-table>
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :page-count="pageCount"
          hide-on-single-page
          small
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);

const userInfo = reactive({
  username: "张三",
  avatar: "",
});

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

const paperList = ref([
  {
    id: 1,
    title: "论文一",
    abstract: "论文一摘要",
    keywords: "论文一关键词",
    authors: "论文一作者",
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
    authors: "论文二作者",
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

const pageCount = ref(10);
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

    .right-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .paper-list {
        flex: 1;
        border: none;
        background-color: transparent;
      }

      .pagination {
        margin: 12px 0;
      }
    }
  }
}
</style>
