<template>
  <iframe src="/lib/PDFJsAnnotations/index.html" frameborder="0" :data-url="url" id="pdf"></iframe>
</template>

<script>
export default {
  name: "PDFReader",
  props: ["url"],
};
</script>

<style lang="less" scoped>
iframe {
  width: 100%;
  height: 100%;
}
</style>
