<template>
  <div class="container">
    <quill-editor
      v-if="collaborateData"
      :options="editorOption"
      v-model:value="collaborateData.content"
      @ready="handleEditorReady($event)"
      @change="handleEditorChange"
    ></quill-editor>
  </div>
</template>

<script>
import { quillEditor } from "vue3-quill";
import * as ShareDB from "sharedb/lib/client";
import * as otJson1 from "ot-json1";
import * as jsondiff from "json0-ot-diff";
import * as diffMatchPatch from "diff-match-patch";
import * as textUnicode from "ot-text-unicode";
import { ElMessage } from "element-plus";

export default {
  name: "PaperNote",
  components: {
    quillEditor,
  },
  props: ["paperId"],
  emits: ["ready"],

  data() {
    return {
      editor: null,
      editorOption: {
        placeholder: "在这里记录读论文时的想法💡",
        modules: {
          // toolbars: [
          // custom toolbars options
          // will override the default configuration
          // ],
          // other moudle options here
          // otherMoudle: {}
        },
        // more options
      },
      doc: null,
      lock: true,
      currentContent: "",
      collaborateData: null,
    };
  },

  mounted() {
    this.initConnection();
  },

  methods: {
    handleEditorReady(editor) {
      this.editor = editor;
    },
    handleEditorChange() {
      if (this.lock || this.doc == null) {
        return;
      }
      let oldData = {
        content: this.currentContent,
        collaborators: this.collaborateData.collaborators,
      };
      let op = jsondiff(oldData, this.collaborateData, diffMatchPatch, otJson1, textUnicode);
      if (op != null) {
        this.doc.submitOp(op);
      }
      this.currentContent = this.collaborateData.content;
    },
    initConnection() {
      ShareDB.types.register(otJson1.type);
      let socket = new WebSocket("ws://localhost:9090");
      socket.onopen = () => {
        let connection = new ShareDB.Connection(socket);
        this.doc = connection.get("note", `paper-${this.paperId}`);
        // 从 ShareDB 服务器获取最新文档内容
        // 并指示 ShareDB 将后续对此文档的操作事件发送到此客户端
        this.doc.subscribe(error => {
          if (error) throw error;
          if (this.doc.type === null) {
            // 创建新的笔记
            this.collaborateData = {
              content: "",
              collaborators: [],
            };
            this.doc.create(this.collaborateData, "json1", () => {
              console.log("已创建笔记");
            });
          } else {
            // 加载已有的笔记
            this.collaborateData = this.doc.data;
            this.currentContent = this.collaborateData.content;
            console.log("已加载笔记");
          }
          setTimeout(() => {
            this.lock = false;
          }, 100);
          this.$emit("ready");
        });
        // 监听事件，‘op’ 表示对文档有修改
        this.doc.on("op", (op, source) => {
          // console.log("received op:", op, source);
          // source === true 表示是本客户端对 doc 的修改
          if (source) {
            return;
          }
          this.collaborateData = this.doc.data;
          this.currentContent = this.collaborateData.content;
        });
      };
      socket.onerror = () => {
        ElMessage.error("无法连接协作服务器");
        this.$emit("ready");
      };
    },
  },
};
</script>
