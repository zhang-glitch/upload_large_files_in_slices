import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  // 如果匹配的是父路由，那么matched只显示父路由配置。
  // 如果匹配的是子路由，那么matched现实该父子路由的配置。
  // matched 一个数组，包含当前路由的所有嵌套路径片段的路由记录
  {
    path: "/",
    name: "home",
    // 让其重定向到/home路径下，但是你没有匹配的组件啊
    // redirect: "/home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

// 防止多次点击同一个路由出现错误。
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  mode: "history",
  // 应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"
  base: process.env.BASE_URL, //
  routes,
});

// to: 表示目标路由的链接。
// from: 当前导航正要离开的路由。

export default router;
