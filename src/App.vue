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
  --secondary-text: rgb(44, 36, 36);
  --separator-color: #e5e5e5;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
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
