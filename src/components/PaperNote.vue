<template>
  <quill-editor :options="editorOption" v-model:value="content" @ready="handleEditorReady"></quill-editor>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { quillEditor, Quill } from "vue3-quill";
// import customQuillModule from "customQuillModule";
// Quill.register("modules/customQuillModule", customQuillModule);

export default {
  name: "PaperNote",
  components: {
    quillEditor,
  },
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
      content: "",
    };
  },

  mounted() {},

  methods: {
    handleEditorReady(editor) {
      this.editor = editor;
      this.$emit("ready");
    },
  },
};
</script>
