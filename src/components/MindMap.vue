<template>
  <mindmap v-model="data" timetravel drag zoom edit center-btn fit-btn add-node-btn download-btn ctm></mindmap>
</template>

<script>
import mindmap from "vue3-mindmap";
import "vue3-mindmap/dist/style.css";

export default defineComponent({
  components: { mindmap },
  setup() {
    const data = [
      {
        name: "如何学习D3",
        children: [
          {
            name: "预备知识",
            children: [{ name: "HTML & CSS" }, { name: "JavaScript" }],
          },
          {
            name: "安装",
            collapse: true,
            children: [{ name: "折叠节点" }],
          },
          { name: "进阶", left: true },
        ],
      },
    ];

    return { data };
  },
});
</script>
