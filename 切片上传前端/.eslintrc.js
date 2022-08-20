module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // 这在里配置prettier和prettierrc文件中是一样的功能。
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        // 这里面设置一些规则，将按照这里面的格式化
        singleQuote: false,
        // semi: false, //句末使用分号
      },
    ],
  },
};
