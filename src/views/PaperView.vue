<template>
  <div class="container">
    <div class="header">
      <el-button circle type="primary" @click="router.back()">
        <el-icon><i-ep-arrowLeftBold /></el-icon>
      </el-button>
      <h1>{{ paper.title }}</h1>
    </div>
    <div class="main-container">
      <PDFReader class="reader"></PDFReader>
      <div class="right">
        <el-tabs v-model="activeName" class="tabs" stretch>
          <el-tab-pane label="信息">
            <div class="info">
              <div class="info-item">
                <span>标题</span>
                <span>{{ paper.title }}</span>
              </div>
              <div class="info-item">
                <span>作者</span>
                <span class="author" v-for="(item, index) in paper.authors" :key="index">{{ item }}</span>
              </div>
              <div class="info-item">
                <span>关键词</span>
                <span>{{ paper.keywords }}</span>
              </div>
              <div class="info-item">
                <span>摘要</span>
                <span>{{ paper.abstract }}</span>
              </div>
              <div class="info-item">
                <span>来源</span>
                <span>{{ `${paper.publication} ${paper.volume} ${paper.pages}` }}</span>
              </div>
              <div class="info-item">
                <span>出版时间</span>
                <span
                  >{{ paper.year }} 年 {{ paper.month && paper.month + " 月" }}
                  {{ paper.day && paper.day + " 日" }}</span
                >
              </div>
              <div class="info-item">
                <span>添加时间</span>
                <span>{{ paper.createTime }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="笔记">
            <textarea class="note" v-model="note" placeholder="在这里记录读论文时的想法💡"></textarea>
          </el-tab-pane>
          <el-tab-pane label="思维导图">思维导图</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import PDFReader from "../components/PDFReader.vue";

useDark();
const router = useRouter();
// const route = useRoute();

const paper = reactive({
  id: 1,
  title: "论文一",
  abstract:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
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
});

const note = ref("");
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  & > .header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
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
  }

  .main-container {
    flex: 1;
    display: flex;
    align-items: stretch;
    overflow: hidden;

    .reader {
      flex: 5;
    }

    .right {
      flex: 1;
      height: 100%;

      .tabs {
        height: 100%;
        display: flex;
        flex-direction: column;

        :deep(.el-tabs__header) {
          margin-bottom: 0;
        }

        :deep(.el-tabs__content) {
          flex: 1;

          .el-tab-pane {
            height: 100%;
            box-sizing: border-box;
          }
        }
      }

      .info {
        width: 100%;
        text-align: left;
        height: 100%;
        overflow: auto;
        padding: 16px;
        box-sizing: border-box;

        .info-item {
          margin-bottom: 16px;

          span {
            display: block;
          }

          span:first-child {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 4px;
          }

          span.author {
            display: inline-block;
            padding: 1px 4px;
            border-radius: 5px;
            background-color: var(--theme-transparent);
            border: 0.5px solid var(--theme);
            color: var(--theme);
            margin: 4px 8px 4px 0;
          }
        }
      }

      .note {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: none;
        font-size: 14px;
        color: var(--primary-text);
        padding: 6px 8px;
      }
    }
  }
}
</style>
