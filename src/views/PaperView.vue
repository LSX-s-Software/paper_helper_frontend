<template>
  <div class="container">
    <div class="header">
      <el-button circle type="primary" @click="router.back()">
        <el-icon><i-ep-arrowLeftBold /></el-icon>
      </el-button>
      <h1>{{ paper.title }}</h1>
    </div>
    <div
      class="main-container"
      @mousedown="handleMouseDown"
      @mousemove="handleResize"
      @mouseup="handleResizeComplete"
      @mouseleave="handleResizeComplete"
    >
      <div class="reader">
        <div class="mask" v-if="mousedown"></div>
        <PDFReader :style="{ width: leftWidth + 'px' }" :url="paper && paper.attachment.url"></PDFReader>
      </div>
      <div class="separator">
        <div class="handle"></div>
      </div>
      <div class="right">
        <div class="mask" v-if="mousedown"></div>
        <el-tabs class="tabs" stretch v-model="tab">
          <el-tab-pane label="信息" name="info" v-loading="loading == 'info'">
            <div class="info">
              <div class="info-item">
                <span>标题</span>
                <span>{{ paper.title }}</span>
              </div>
              <div class="info-item">
                <span>标签</span>
                <div class="tag-contianer">
                  <el-tag
                    v-for="item in paper.tag"
                    :key="item.id"
                    closable
                    effect="dark"
                    round
                    @close="handleDeleteTag(item)"
                    >{{ item.name }}</el-tag
                  >
                  <el-input
                    v-if="newTagInputVisible"
                    v-model="newTagName"
                    size="small"
                    autofocus
                    id="new-tag-input"
                    @keyup.enter="handleCreateTag"
                    @blur="handleCreateTag"
                  />
                  <el-button size="small" round @click="newTagInputVisible = true">+ 添加</el-button>
                </div>
              </div>
              <div class="info-item">
                <span>DOI</span>
                <span>{{ paper.doi }}</span>
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
                <span>作者</span>
                <span class="tag" v-for="(item, index) in paper.author" :key="index">{{ item }}</span>
              </div>
              <div class="info-item">
                <span>关键词</span>
                <span class="tag" v-for="(kw, index) in paper.keyword" :key="index">{{ kw }}</span>
              </div>
              <div class="info-item">
                <span>摘要</span>
                <span>{{ paper.abstract }}</span>
              </div>
              <div class="info-item">
                <span>参考文献</span>
                <ol>
                  <li v-for="(item, index) in paper.reference" :key="index">{{ item }}</li>
                </ol>
              </div>
              <div class="info-item">
                <span>添加时间</span>
                <span>{{ paper.create_time }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="笔记" name="note" lazy v-loading="loading == 'note'">
            <textarea class="note" v-model="note" placeholder="在这里记录读论文时的想法💡"></textarea>
          </el-tab-pane>
          <el-tab-pane label="思维导图" name="mindmap" lazy v-loading="loading == 'mindmap'">
            <MindMap />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import PDFReader from "../components/PDFReader.vue";
import MindMap from "../components/MindMap.vue";
import { getPaper, addTag, deleteTag } from "@/api/paper";
import { ElMessageBox } from "element-plus";
import { formatTime } from "@/utils/util";
import { showErrorPrompt } from "@/utils/MyPrompt";

useDark();
const router = useRouter();
const route = useRoute();
const paper = ref("");
let paperId = route.params.paperId;

const tab = ref(localStorage.getItem("tab") || "info");
watch(tab, val => {
  localStorage.setItem("tab", val);
});

const note = ref("");

// 调整左右窗口大小
const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const separatorWidth = 14;
const leftWidth = ref(parseFloat(localStorage.getItem("leftWidth")) || (windowWidth - separatorWidth) * 0.84);
let mousedown = ref(false);
const handleMouseDown = e => {
  if (e.target.className == "handle") {
    mousedown.value = true;
  }
};
const handleResize = e => {
  if (mousedown.value) {
    leftWidth.value = leftWidth.value + e.movementX;
  }
};
const handleResizeComplete = () => {
  if (mousedown.value) {
    mousedown.value = false;
    localStorage.setItem("leftWidth", leftWidth.value);
  }
};

//标签
const newTagInputVisible = ref(false);
const newTagName = ref("");

const handleCreateTag = () => {
  if (newTagName.value) {
    addTag(paperId, newTagName.value)
      .then(res => {
        paper.value.tag.push(res);
        newTagName.value = "";
        newTagInputVisible.value = false;
      })
      .catch(err => {
        showErrorPrompt("添加标签失败", err);
      });
  } else {
    newTagInputVisible.value = false;
  }
};

const handleDeleteTag = tag => {
  deleteTag(paperId, tag.id)
    .then(() => {
      paper.value.tag.splice(paper.value.tag.indexOf(tag), 1);
    })
    .catch(err => {
      showErrorPrompt("删除标签失败", err);
    });
};

// 加载论文信息
const loading = ref(tab.value);
onMounted(() => {
  getPaper(paperId)
    .then(res => {
      res.create_time = formatTime(res.create_time);
      paper.value = res;
    })
    .catch(err => {
      ElMessageBox.alert(err, "加载失败", {
        confirmButtonText: "确定",
        type: "error",
      }).then(() => {
        router.back();
      });
    })
    .finally(() => {
      loading.value = false;
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
      position: relative;
    }

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
    }

    .separator {
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--separator-color);

      .handle {
        width: 6px;
        height: 50px;
        background-color: #a9a9a9;
        border-radius: 5px;
        cursor: col-resize;
        transition: all 0.15s ease;

        &:active {
          background-color: #7b7b7b;
        }

        @media (prefers-color-scheme: dark) {
          &:active {
            background-color: #e1e1e1;
          }
        }
      }
    }

    .right {
      flex: 1;
      height: 100%;
      position: relative;

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

          & > span {
            display: block;
          }

          & > span:first-child {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 4px;
          }

          .tag-contianer {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;

            #new-tag-input {
              width: 50%;
            }
          }

          span.tag {
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
