import Vue from "vue";
import VueRouter from "vue-router";
import BasicRouter from "./routers-basic";
import RoutersMsrketing from "./routers-marketing";

Vue.use(VueRouter);

const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  base: process.env.BASE_URL,
  routes: [...BasicRouter, ...RoutersMsrketing]
});

router.afterEach(route => {
  // 从路由的元信息中获取 title 属性
  if (route.meta.title) {
    document.title = route.meta.title;
    // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
    // if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    //   const hackIframe = document.createElement("iframe");
    //   hackIframe.style.display = "none";
    //   hackIframe.src = "/static/html/fixIosTitle.html?r=" + Math.random();
    //   document.body.appendChild(hackIframe);
    //   setTimeout(() => {
    //     document.body.removeChild(hackIframe);
    //   }, 300);
    // }
  }
});

export default router;
