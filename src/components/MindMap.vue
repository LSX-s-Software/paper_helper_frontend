<template>
  <mindmap
    :key="mindmapkey"
    v-model="mindmapData"
    timetravel
    drag
    zoom
    edit
    center-btn
    fit-btn
    add-node-btn
    download-btn
    ctm
  ></mindmap>
</template>

<script>
import mindmap from "vue3-mindmap";
import "vue3-mindmap/dist/style.css";
import * as ShareDB from "sharedb/lib/client";
import * as otJson1 from "ot-json1";
import * as jsondiff from "json0-ot-diff";
import * as diffMatchPatch from "diff-match-patch";
import * as textUnicode from "ot-text-unicode";
import { ElMessage } from "element-plus";

export default {
  components: { mindmap },
  props: {
    paper: {
      type: Object,
      required: true,
    },
  },
  emits: ["ready"],
  data() {
    return {
      doc: null,
      initiating: true,
      mindmapkey: 0, // 用于强制刷新思维导图
      mindmapData: [{ name: "加载中" }],
    };
  },

  methods: {
    initConnection() {
      ShareDB.types.register(otJson1.type);
      let socket = new WebSocket("ws://localhost:9090");
      socket.onopen = () => {
        let connection = new ShareDB.Connection(socket);
        this.doc = connection.get("mindmap", `paper-${this.paper.id}`);
        // 从 ShareDB 服务器获取最新文档内容
        // 并指示 ShareDB 将后续对此文档的操作事件发送到此客户端
        this.doc.subscribe(error => {
          if (error) throw error;
          if (this.doc.type === null) {
            // 创建新的思维导图
            this.mindmapData = [
              {
                name: this.paper.title,
              },
            ];
            this.mindmapkey++;
            this.doc.create(this.mindmapData, "json1", () => {
              console.log("已创建思维导图");
            });
          } else {
            // 加载已有的思维导图
            this.mindmapData = this.doc.data;
            this.mindmapkey++;
            console.log("已加载思维导图");
          }
          setTimeout(() => {
            this.initiating = false;
          }, 500);
          this.$emit("ready");
        });
        // 监听事件，‘op’ 表示对文档有修改
        this.doc.on("op", (op, source) => {
          // console.log("received op:", op, source);
          // source === true 表示是本客户端对 doc 的修改
          if (source) {
            return;
          }
          this.mindmapkey++;
          this.mindmapData = this.doc.data;
        });
      };
      socket.onerror = () => {
        ElMessage.error("无法连接协作服务器");
        this.$emit("ready");
      };
    },
  },

  watch: {
    mindmapData: {
      handler(newValue, oldValue) {
        if (this.initiating || this.doc == null) {
          return;
        }
        let op = jsondiff(oldValue, newValue, diffMatchPatch, otJson1, textUnicode);
        if (op != null) {
          this.doc.submitOp(op);
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.initConnection();
  },
};
</script>
