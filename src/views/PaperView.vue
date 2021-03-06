<template>
  <div class="container">
    <div class="header">
      <div class="left">
        <el-button circle type="primary" @click="router.back()">
          <el-icon><i-ep-arrowLeftBold /></el-icon>
        </el-button>
        <h1>{{ paper.title }}</h1>
      </div>
      <div class="right">
        <el-button type="primary" @click="rightWidth = -rightWidth">
          <el-icon :size="20" v-if="rightWidth > 0"><i-ep-expand /></el-icon>
          <el-icon :size="20" v-else><i-ep-fold /></el-icon>
        </el-button>
      </div>
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
        <PDFReader :url="paper && paper.attachment.url" :paper-id="paper && paper.id"></PDFReader>
      </div>
      <div class="separator" v-if="rightWidth > 0">
        <div class="handle"></div>
      </div>
      <div class="right">
        <div class="mask" v-if="mousedown"></div>
        <el-tabs class="tabs" stretch v-model="tab" :style="{ width: (rightWidth > 0 ? rightWidth : 0) + 'px' }">
          <el-tab-pane label="信息" name="info" v-loading="loadingPaperInfo">
            <div class="info">
              <div class="info-item">
                <span>标题</span>
                <span
                  >{{ paper.title }}
                  <el-button text circle @click="handleEditPaperInfo('title')">
                    <el-icon><i-ep-edit /></el-icon>
                  </el-button>
                </span>
              </div>
              <div class="info-item">
                <span>标签</span>
                <div class="tag-container">
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
                    class="new-tag-input"
                    @keyup.enter="handleCreateTag"
                    @blur="handleCreateTag"
                  />
                  <el-button size="small" round @click="newTagInputVisible = true">+ 添加</el-button>
                </div>
              </div>
              <div class="info-item">
                <span>DOI</span>
                <span
                  >{{ paper.doi || "未知" }}
                  <el-button text circle @click="handleEditPaperInfo('doi')">
                    <el-icon><i-ep-edit /></el-icon>
                  </el-button>
                </span>
              </div>
              <div class="info-item">
                <span>来源</span>
                <span
                  >{{ paper.publication || "未知" }} {{ paper.volume }} {{ paper.pages }}
                  <el-button text circle @click="handleEditPaperInfo('source')">
                    <el-icon><i-ep-edit /></el-icon>
                  </el-button>
                </span>
              </div>
              <div class="info-item">
                <span>出版时间</span>
                <span
                  >{{ paper.year > 0 ? paper.year + " 年" : "未知" }} {{ paper.month > 0 ? paper.month + " 月" : "" }}
                  <el-button text circle @click="handleEditPaperInfo('pub_time')">
                    <el-icon><i-ep-edit /></el-icon>
                  </el-button>
                </span>
              </div>
              <div class="info-item">
                <span>作者</span>
                <span class="tag" v-for="(item, index) in paper.author" :key="index">{{ item }}</span>
                <el-button text circle @click="handleEditPaperInfo('author')">
                  <el-icon><i-ep-edit /></el-icon>
                </el-button>
              </div>
              <div class="info-item">
                <span>关键词</span>
                <span class="tag" v-for="(kw, index) in paper.keyword" :key="index">{{ kw }}</span>
                <el-button text circle @click="handleEditPaperInfo('keyword')">
                  <el-icon><i-ep-edit /></el-icon>
                </el-button>
              </div>
              <div class="info-item">
                <span>摘要</span>
                <span
                  >{{ paper.abstract }}
                  <el-button text circle @click="handleEditPaperInfo('abstract')">
                    <el-icon><i-ep-edit /></el-icon>
                  </el-button>
                </span>
              </div>
              <div class="info-item">
                <span>添加时间</span>
                <span>{{ paper.create_time }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="笔记" name="note" lazy v-loading="loadingPaperInfo || loadingNote">
            <PaperNote v-if="!loadingPaperInfo" @ready="loadingNote = false" :paper-id="paper.id"></PaperNote>
          </el-tab-pane>
          <el-tab-pane label="思维导图" name="mindmap" lazy v-loading="loadingPaperInfo || loadingMindmap">
            <MindMap v-if="!loadingPaperInfo" :paper="paper" @ready="loadingMindmap = false" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
  <!-- 复杂修改弹窗 -->
  <el-dialog v-model="paperInfoModifyDialogFormVisible" title="编辑论文信息" width="33%">
    <el-form v-if="paperInfoModifyKey === 'source'" :model="paperInfoModifyDialogForm">
      <el-form-item label="出版单位" label-width="80px">
        <el-input v-model="paperInfoModifyDialogForm.publication" autocomplete="off" />
      </el-form-item>
      <el-form-item label="卷号" label-width="80px">
        <el-input v-model="paperInfoModifyDialogForm.volume" autocomplete="off" />
      </el-form-item>
      <el-form-item label="页数" label-width="80px">
        <el-input v-model="paperInfoModifyDialogForm.pages" autocomplete="off" />
      </el-form-item>
    </el-form>

    <el-form v-else-if="paperInfoModifyKey === 'pub_time'" :model="paperInfoModifyDialogForm">
      <el-form-item label="出版日期" label-width="80px">
        <el-date-picker v-model="paperInfoModifyDialogForm.date" type="month" placeholder="选择出版日期" />
      </el-form-item>
    </el-form>

    <el-form
      v-else-if="paperInfoModifyKey === 'author' || paperInfoModifyKey === 'keyword'"
      :model="paperInfoModifyDialogForm"
      @submit.prevent
    >
      <el-form-item :label="paperInfoModifyKey == 'author' ? '作者' : '关键词'" label-width="80px">
        <div class="tag-container">
          <el-tag
            v-for="tag in paperInfoModifyDialogForm.tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="new-tag-input"
            v-if="paperInfoModifyDialogForm.tagInputVisible"
            autofocus
            v-model="paperInfoModifyDialogForm.tagInputValue"
            size="small"
            @keyup.enter.stop="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else size="small" @click="showInput"> + 添加 </el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-form v-else-if="paperInfoModifyKey === 'abstract'">
      <el-form-item>
        <el-input
          v-model="paperInfoModifyDialogForm.abstract"
          :autosize="{ minRows: 4, maxRows: 12 }"
          type="textarea"
          placeholder="请输入摘要"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="paperInfoModifyDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="paperInfoModifyDialogFunction">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import PDFReader from "../components/PDFReader.vue";
import MindMap from "../components/MindMap.vue";
import { getPaper, addTag, deleteTag, editPaperInfo } from "@/api/paper";
import { ElMessageBox } from "element-plus";
import { formatTime } from "@/utils/util";
import { showErrorPrompt, showSuccessPrompt } from "@/utils/MyPrompt";
import PaperNote from "../components/PaperNote.vue";

useDark();
const router = useRouter();
const route = useRoute();
const paper = ref("");
let paperId = route.params.paperId;

const tab = ref("info");
watch(tab, (newVal, oldVal) => {
  if (newVal != oldVal) {
    localStorage.setItem("tab", newVal);
  }
});

// 调整左右窗口大小
const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const separatorWidth = 14;
const rightWidth = ref(parseFloat(localStorage.getItem("rightWidth")) || (windowWidth - separatorWidth) * 0.3);
let mousedown = ref(false);
const handleMouseDown = e => {
  if (e.target.className == "handle") {
    mousedown.value = true;
  }
};
const handleResize = e => {
  if (mousedown.value) {
    rightWidth.value = rightWidth.value - e.movementX;
  }
};
const handleResizeComplete = () => {
  if (mousedown.value) {
    mousedown.value = false;
    localStorage.setItem("rightWidth", rightWidth.value);
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
const loadingPaperInfo = ref(true);
const loadingMindmap = ref(true);
const loadingNote = ref(true);
onMounted(() => {
  getPaper(paperId)
    .then(res => {
      res.create_time = formatTime(res.create_time);
      paper.value = res;
      tab.value = localStorage.getItem("tab") || "info";
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
      loadingPaperInfo.value = false;
    });
});

// 修改论文信息
const paperInfoModifyDialogFormVisible = ref(false);
const paperInfoModifyKey = ref("");
const paperInfoModifyDialogForm = ref({
  publication: "",
  volume: "",
  pages: "",
  date: null,
  tags: [],
  tagInputValue: "",
  tagInputVisible: false,
  abstract: "",
});

const handleEditPaperInfo = key => {
  // 简单修改
  if (["title", "doi"].indexOf(key) !== -1) {
    let friendlyName, regExp, errMsg;
    switch (key) {
      case "title":
        friendlyName = "标题";
        regExp = /\s*\S+?/;
        errMsg = "标题不能为空";
        break;
      case "doi":
        friendlyName = "DOI";
        break;
      default:
        break;
    }

    ElMessageBox.prompt("请输入新的" + friendlyName, "编辑论文信息", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: regExp,
      inputErrorMessage: errMsg,
      inputValue: paper.value[key],
      inputType: "text",
    }).then(async ({ value }) => {
      if (value === paper.value[key]) {
        return;
      }
      editPaperInfo(paper, { [key]: value })
        .then(() => {
          paper.value[key] = value;
          showSuccessPrompt(`${friendlyName}修改成功`);
        })
        .catch(err => showErrorPrompt(`${friendlyName}修改失败`, err));
    });
  } else {
    // 复杂修改
    paperInfoModifyKey.value = key;
    switch (key) {
      case "source":
        paperInfoModifyDialogForm.value.publication = paper.value.publication;
        paperInfoModifyDialogForm.value.volume = paper.value.volume;
        paperInfoModifyDialogForm.value.pages = paper.value.pages;
        break;
      case "pub_time":
        paperInfoModifyDialogForm.value.date = new Date(paper.value.year, paper.value.month - 1, paper.value.day);
        break;
      case "author":
        paperInfoModifyDialogForm.value.tags = paper.value.author.slice(0);
        break;
      case "keyword":
        paperInfoModifyDialogForm.value.tags = paper.value.keyword.slice(0);
        break;
      case "abstract":
        paperInfoModifyDialogForm.value.abstract = paper.value.abstract;
        break;
      default:
        break;
    }
    paperInfoModifyDialogFormVisible.value = true;
  }
};

const paperInfoModifyDialogFunction = () => {
  // 更新来源
  switch (paperInfoModifyKey.value) {
    case "source":
      editPaperInfo(paper, {
        publication: paperInfoModifyDialogForm.value.publication,
        volume: paperInfoModifyDialogForm.value.volume,
        pages: paperInfoModifyDialogForm.value.pages,
      })
        .then(() => {
          paper.value.publication = paperInfoModifyDialogForm.value.publication;
          paper.value.volume = paperInfoModifyDialogForm.value.volume;
          paper.value.pages = paperInfoModifyDialogForm.value.pages;
          showSuccessPrompt("来源修改成功");
        })
        .catch(err => showErrorPrompt("来源修改失败", err));
      break;
    case "pub_time": // 更新出版时间
      editPaperInfo(paper, {
        year: paperInfoModifyDialogForm.value.date.getFullYear(),
        month: paperInfoModifyDialogForm.value.date.getMonth() + 1,
        day: paperInfoModifyDialogForm.value.date.getDate(),
      })
        .then(() => {
          paper.value.year = paperInfoModifyDialogForm.value.date.getFullYear();
          paper.value.month = paperInfoModifyDialogForm.value.date.getMonth() + 1;
          paper.value.day = paperInfoModifyDialogForm.value.date.getDate();
          showSuccessPrompt("来源修改成功");
        })
        .catch(err => showErrorPrompt("来源修改失败", err));
      break;
    case "author": // 更新作者
      editPaperInfo(paper, {
        author: paperInfoModifyDialogForm.value.tags,
      })
        .then(() => {
          paper.value.author = paperInfoModifyDialogForm.value.tags.slice(0);
          showSuccessPrompt("作者修改成功");
        })
        .catch(err => showErrorPrompt("作者修改失败", err));
      break;
    case "keyword": // 更新关键词
      editPaperInfo(paper, {
        keyword: paperInfoModifyDialogForm.value.tags,
      })
        .then(() => {
          paper.value.keyword = paperInfoModifyDialogForm.value.tags.slice(0);
          showSuccessPrompt("关键词修改成功");
        })
        .catch(err => showErrorPrompt("关键词修改失败", err));
      break;
    case "abstract": // 更新摘要
      editPaperInfo(paper, {
        abstract: paperInfoModifyDialogForm.value.abstract,
      })
        .then(() => {
          paper.value.abstract = paperInfoModifyDialogForm.value.abstract;
          showSuccessPrompt("摘要修改成功");
        })
        .catch(err => showErrorPrompt("摘要修改失败", err));
      break;
    default:
      break;
  }

  paperInfoModifyDialogFormVisible.value = false;
};

const handleClose = tag => {
  paperInfoModifyDialogForm.value.tags.splice(paperInfoModifyDialogForm.value.tags.indexOf(tag), 1);
};

const showInput = () => {
  paperInfoModifyDialogForm.value.tagInputVisible = true;
};

const handleInputConfirm = () => {
  if (paperInfoModifyDialogForm.value.tagInputValue) {
    paperInfoModifyDialogForm.value.tags.push(paperInfoModifyDialogForm.value.tagInputValue);
  }
  paperInfoModifyDialogForm.value.tagInputVisible = false;
  paperInfoModifyDialogForm.value.tagInputValue = "";
};
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
    gap: 12px;
    padding: 10px 20px;
    border-bottom: 1px solid var(--separator-color);
    background-color: var(--theme);
    color: #fff;
    width: 100%;
    box-sizing: border-box;

    .left,
    .right {
      display: flex;
      align-items: center;
    }

    .left {
      max-width: calc(100% - 100px);

      h1 {
        font-size: 24px;
        font-weight: normal;
        margin-left: 12px;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .main-container {
    flex: 1;
    display: flex;
    align-items: stretch;
    overflow: hidden;

    .reader {
      position: relative;
      flex: 1;
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
            width: 100%;
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

:deep(.tag-container) {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  .new-tag-input {
    width: 50%;
  }
}
</style>
