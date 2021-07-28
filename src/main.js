import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/filter/index.js";
import VueWechatTitle from "vue-wechat-title";
import "@/mixins/keep-alive.js";
import "@/mixins/adapter.js";
import foot from "@/directives/foot.js";
import VConsole from "vconsole";
import VueAwesomeSwiper from "vue-awesome-swiper";
import Loading from "@/components/loading-all/loading-all";
import globalVariable from "@/assets/js/global_varibale.js";
import md5 from "js-md5";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

Vue.prototype.GLOBAL = globalVariable;
Vue.prototype.ht = new Vue();
Vue.prototype.$md5 = md5;
// import vconsole from "vconsole";
// new vconsole();
Vue.use(VueWechatTitle)
  .use(foot)
  .use(VueAwesomeSwiper);
Vue.use(VueWechatTitle)
  .use(foot)
  .use(Loading);

Vue.config.productionTip = false;

if (process.env.NODE_ENV === "development") {
  Vue.config.devtools = true;

  // eslint-disable-next-line no-unused-vars
  Vue.config.errorHandler = (err, vm, info) => {
    // eslint-disable-next-line no-console
    console.error(err);
  };
  if (process.env.VUE_APP_CONSOLE === "true") new VConsole();
}

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    Vue,
    dsn: "https://b44c2a66a4f34d18a59a2e0d72fcce6a@sentry.ylhtest.com/7",
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    logErrors: false,

    release: "jsh-study-front-h5@RELEASE_VERSION_FOR_WEBPACK",
    environment: process.env.VUE_APP_SENTRY_ENV,
    sendDefaultPii: true,
    autoSessionTracking: true
  });
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// 解决ios部分机型键盘将页面顶起无法回弹问题
window.keyboardDisappears = () => {
  setTimeout(function() {
    let scrollHeight =
      document.documentElement.scrollTop || document.body.scrollTop || 0;
    window.scrollTo(0, Math.max(scrollHeight - 1, 0));
  }, 100);
};
