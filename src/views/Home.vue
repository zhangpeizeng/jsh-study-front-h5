<template>
  <div>
    <van-nav-bar :title="notice" />
    <van-cell-group>
      <van-cell title="Demo" @click="gotoPage('/demo', 'Demo')" is-link />
      <van-cell
        title="VideoDemo"
        @click="gotoPage('/videodemo', 'Demo')"
        is-link
      />
      <van-cell
        title="登录"
        @click="gotoPage('/public/home', 'Home')"
        is-link
      />
      <van-cell
        title="首页"
        @click="gotoPage('/public/home-page', '首页')"
        is-link
      />
      <van-cell
        title="任务作业"
        @click="gotoPage('/task-homework', '任务作业')"
        is-link
      />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="日历控件" @click="gotoPageto('/TestDemo')" is-link />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="录播文档详情" @click="gotoCourseDetail(1)" is-link />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="直播课详情" @click="gotoCourseDetail(2)" is-link />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="研讨课详情" @click="gotoCourseDetail(3)" is-link />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="系列课详情" @click="gotoCourseDetail(4)" is-link />
    </van-cell-group>
    <van-cell-group>
      <van-cell
        title="课时详情"
        @click="gotoPageto('/public/class-detail', '101844')"
        is-link
      />
    </van-cell-group>
    <van-cell-group>
      <van-cell
        title="任务"
        @click="gotoPage('/public/taskList', '任务')"
        is-link
      />
    </van-cell-group>
    <van-cell-group>
      <van-cell
        title="作业详情"
        @click="gotoPage('/public/taskDetails', '作业详情')"
        is-link
      />
    </van-cell-group>
    <van-cell-group>
      <van-cell
        title="作业学习"
        @click="gotoPage('/public/homeworkLearning', '作业学习')"
        is-link
      />
    </van-cell-group>
    <van-cell-group>
      <van-cell
        title="最近直播"
        @click="gotoPage('/public/recentline', 'Honor')"
        is-link
      />
    </van-cell-group>
    <van-cell-group>
      <van-cell
        title="荣誉"
        @click="gotoPage('/public/honor', 'Honor')"
        is-link
      />
    </van-cell-group>
  </div>
</template>

<script>
import Vue from "vue";
import { NavBar, Cell, CellGroup } from "vant";
import { CloudBase } from "@/request";
// import JSH from "@/core";

Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);

export default {
  name: "Home",
  components: {},
  data() {
    return {
      notice: "海尔智家成套功能入口" + CloudBase.titlePrefix
    };
  },
  created() {},
  methods: {
    // eslint-disable-next-line no-unused-vars
    gotoPage(pagePath, title) {
      // eslint-disable-next-line no-console
      console.log(pagePath);
      // JSH.reportSelfPageChange("GOTO", pagePath, title);
      this.$router.push(pagePath);
    },
    gotoPageto(pagePath, id) {
      this.$router.push({
        path: pagePath,
        query: {
          id
        }
      });
    },
    gotoCourseDetail(type) {
      const owner = this;
      let path = "";
      let id = "";
      if (type == 1) {
        path = "public/recorded-course";
        id = "102231";
      } else if (type == 2) {
        path = "public/live-course";
        id = "101833";
      } else if (type == 3) {
        path = "public/discussion-course";
        id = "101840";
      } else if (type == 4) {
        path = "public/series-course";
        id = "101834";
      }
      owner.$router.push({
        path: path,
        query: {
          id: id
        }
      });
    }
  }
};
</script>
