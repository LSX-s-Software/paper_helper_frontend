<template>
  <router-view />
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

:root {
  --theme: #409eff;
  --theme-transparent: #40a0ff33;

  --primary-bg: #f5f5f5;
  --primary-text: #000;
  --secondary-text: rgb(44, 36, 36);
  --separator-color: #e6e6e680;

  --material: rgba(245, 245, 245, 0.8);
}

@media (prefers-color-scheme: dark) {
  :root {
    --theme: #257ed6;
    --theme-transparent: #40a0ff33;

    --primary-bg: #1f1f1f;
    --primary-text: rgb(237, 237, 237);
    --secondary-text: #dadadad0;
    --separator-color: #60606080;

    --material: rgba(39, 39, 39, 0.8);
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--primary-text);
  width: 100vw;
  height: 100vh;

  .dark & {
    color: #ecf0f1;
    background-color: #141414;
  }
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
