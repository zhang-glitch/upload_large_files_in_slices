import { defineStore } from "pinia";

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useLoginStore = defineStore("login", {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      username: "zh",
      age: 22,
      password: "12345",
    };
  },
  actions: {
    changeUsername(name) {
      this.username = name;
    },
  },
});
