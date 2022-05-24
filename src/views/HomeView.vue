<template>
  <div class="home">
    <el-button @click="toggleDark()">
      <span class="ml-2">{{ isDark ? "Dark" : "Light" }}</span>
    </el-button>
  </div>
</template>

<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
