# PaperHelper 前端

![Vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D) ![JS](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E) ![Babel](https://img.shields.io/badge/Babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=white) ![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

[![wakatime](https://wakatime.com/badge/user/271fef5a-1d0a-45c6-a8f0-9fb67a1417b6/project/c2346067-9852-4f3e-9069-25096c998dc9.svg)](https://wakatime.com/badge/user/271fef5a-1d0a-45c6-a8f0-9fb67a1417b6/project/c2346067-9852-4f3e-9069-25096c998dc9)

## 技术栈

- Vue 3
- Vite
- Pinia
- Vue Router
- Axios
- Less
- ShareDB
- Element+

## 功能

- [x] 文献管理
  - [x] 上传本地PDF文件
  - [x] 根据DOI自动添加文献
- [x] 文献阅读
- [x] 文献批注
- [x] 笔记协同
- [x] 思维导图协同
- [x] 深色模式

## 目录结构

```
.
├── README.md
├── babel.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── icons                 vue3-mindmap所用icon
│   ├── img                   图片
│   └── lib                   外部库
│       └── PDFJsAnnotations
├── src
│   ├── App.vue
│   ├── api                   API接口
│   │   ├── index.js
│   │   ├── paper.js
│   │   ├── project.js
│   │   └── user.js
│   ├── components            组件
│   │   ├── MindMap.vue       思维导图
│   │   ├── PDFReader.vue     PDF阅读器
│   │   └── PaperNote.vue     笔记
│   ├── main.js
│   ├── router                Vue Roouter
│   │   └── index.js
│   ├── store                 Pinia
│   │   └── index.js
│   ├── utils
│   │   ├── MyPrompt.js       弹窗
│   │   └── util.js           常用工具
│   └── views
│       ├── HomeView.vue      首页
│       ├── LoginRegView.vue  登录注册页面
│       └── PaperView.vue     论文阅读页面
└── vite.config.js
```

## 安装依赖
```
npm install
```

### 启动开发服务器（热重载）
```
npm run dev
```

### 为生产环境打包
```
npm run build
```

### 代码格式化
```
npm run lint
```

