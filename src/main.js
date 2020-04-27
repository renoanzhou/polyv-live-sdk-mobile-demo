import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import eruda from "eruda";
import 'element-ui/lib/theme-chalk/index.css';
import { Loading } from "element-ui";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

Vue.use(Loading);

eruda.init();
