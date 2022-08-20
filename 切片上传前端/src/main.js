import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "vui-design/dist/style/vui-design.css";
import VuiDesign from "vui-design";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 引入pinia
import { createPinia, PiniaVuePlugin } from "pinia";
Vue.use(PiniaVuePlugin);
const pinia = createPinia(); //需要挂载在实例上

Vue.config.productionTip = false;
Vue.use(VuiDesign);

Vue.use(ElementUI);

// 这里注册路由和store和vue3不同
new Vue({
  router,
  pinia,
  render: (h) => h(App),
}).$mount("#app");
