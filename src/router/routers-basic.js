import Home from "@/views/Home.vue";
import Demo from "@/views/Demo.vue";
import NoPage from "@/views/page-not-found.vue";
import VideoDemo from "@/views/VideoDemo.vue";
import redirect from "@/views/redirect.vue";
import MapDemo from "@/views/MapDemo.vue";
import TaskHomework from "@/views/pages/marketing-pages/task-homework/task-homework.vue";
import Test from "@/views/pages/marketing-pages/debug-enter-page/debug-enter-page.vue";
import TestDemo from "@/views/test-demo.vue";
/**
 * 各入口页面
 *
 * meta 可配置参数
 * @param {boolean} keepAlive 是否缓存页面,一般默认为false
 * @param {string} title 页面标题
 * @param {string} permission 页面访问权限码,无此属性则不设权限
 */
export default [
  {
    path: "/",
    name: "NoPage",
    component: NoPage
  },
  {
    path: "/home",
    name: "home",
    component: Home
  },
  {
    path: "/demo",
    name: "Demo",
    component: Demo
  },
  {
    path: "/404",
    name: "NoPage",
    component: NoPage
  },
  {
    path: "/videodemo",
    name: "VideoDemo",
    component: VideoDemo
  },
  {
    path: "/TestDemo",
    name: "TestDemo",
    component: TestDemo
  },
  {
    path: "/map-demo",
    name: "MapDemo",
    component: MapDemo
  },
  {
    path: "/redirect",
    name: "redirect",
    component: redirect,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/task-homework",
    name: "task-homework",
    component: TaskHomework,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/test",
    name: "test",
    component: Test,
    meta: {
      keepAlive: true
    }
  }
];
