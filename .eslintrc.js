module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-case-declarations": "off",
    "max-len": [
      "warn",
      {
        code: 120,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
};
