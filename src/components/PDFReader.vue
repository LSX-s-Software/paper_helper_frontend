<template>
  <iframe
    src="/lib/PDFJsAnnotations/index.html"
    frameborder="0"
    :data-url="url"
    :data-annotationurl="`https://api.paperhelper.nagico.cn/papers/${paperId}/annotations`"
    id="pdf"
    @ready="handlePDFReady"
    @save="handleSave"
  ></iframe>
</template>

<script>
import { saveAnnotation } from "@/api/paper";
import { showErrorPrompt, showSuccessPrompt } from "@/utils/MyPrompt";

export default {
  name: "PDFReader",
  props: ["paperId", "url"],
  emits: ["ready"],

  methods: {
    handlePDFReady() {
      this.$emit("ready");
    },
    handleSave() {
      let myIframe = document.querySelector("#pdf").contentWindow;
      myIframe.getPDFData().then(data => {
        saveAnnotation(this.paperId, data)
          .then(() => showSuccessPrompt("批注保存成功"))
          .catch(err => showErrorPrompt("批注保存失败", err));
      });
    },
  },
};
</script>

<style lang="less" scoped>
iframe {
  width: 100%;
  height: 100%;
}
</style>
