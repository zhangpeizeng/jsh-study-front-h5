<template>
  <div>
    <div id="topsocll"></div>
    <jshHeader
      :header="header"
      @leftClick="backTo"
      @rightClick="goStudyReport"
    ></jshHeader>
    <div style="position: fixed;top: 44px;left: 0;right: 0;z-index: 99">
      <van-tabs
        @click="tabclick"
        :lazy-render="false"
        active=""
        color="#2780F8"
      >
        <van-tab
          tab-class="tab-class"
          tab-active-class="active"
          :title="tolearn"
          :badge="stayLearnNum"
        ></van-tab>
        <van-tab
          tab-class="tab-class"
          tab-active-class="active"
          title="已学习"
        ></van-tab>
        <van-tab
          tab-class="tab-class"
          tab-active-class="active"
          title="作业"
          :badge="homeworkNoFinishNum"
        ></van-tab>
        <van-tab
          tab-class="tab-class"
          tab-active-class="active"
          title="考试"
          :badge="testNoFinishNum"
        ></van-tab>
        <van-tab
          tab-class="tab-class"
          tab-active-class="active"
          title="PK墙"
        ></van-tab>
      </van-tabs>
    </div>
    <div style="height: 44px;width: 100%"></div>
    <!--    待学习-->
    <div v-if="istasksToLearn">
      <tasksToLearn
        :temID="temID"
        @length="getTolearn"
        :classId="classId"
      ></tasksToLearn>
    </div>

    <!--    已学习-->
    <div v-if="istaskLearned">
      <taskLearned :temID="temID"></taskLearned>
    </div>

    <!--    作业-->
    <div v-if="istaskHomework">
      <taskHomework @length="getToHomework" :classId="classId"></taskHomework>
    </div>

    <!--    考试-->
    <div v-if="istaskTest">
      <task-test @testLength="getToTest" :classId="classId"></task-test>
    </div>
    <!--    PK-->
    <div v-if="istaskPk">
      <task-pk :classId="classId"></task-pk>
    </div>
    <div class="footer" :class="{ no: footShow, organ: type === 'organ' }">
      <liveFrame></liveFrame>
    </div>
    <div v-if="!type" style="z-index:9999 ">
      <Tabbar></Tabbar>
    </div>

    <div id="ding"></div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Cell, CellGroup, Search, Tab, Tabs, Icon, Toast } from "vant";
import tasksToLearn from "@/components/taskItems/tasks-to-learn/tasks-to-learn.vue";
import taskLearned from "@/components/taskItems/task-learned/task-learned.vue";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import liveFrame from "@/components/live-frame/live-frame.vue";
import taskHomework from "@/views/pages/marketing-pages/task-homework/task-homework.vue";
import taskTest from "@/views/pages/marketing-pages/task-homework/task-test.vue";
import taskPk from "@/views/pages/marketing-pages/task-homework/task-pk.vue";
import Tabbar from "@/components/tabbar/tabbar.vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";

Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup)
  .use(Search)
  .use(Tab)
  .use(Icon)
  .use(Tabs);

export default {
  name: "tasks-to-learn",
  components: {
    tasksToLearn,
    taskLearned,
    liveFrame,
    jshHeader,
    taskHomework,
    Tabbar,
    taskTest,
    taskPk
  },
  data() {
    return {
      //等待学习的数量
      stayLearnNum: null,
      //作业未完成的数量
      homeworkNoFinishNum: "",
      //考试未完成的数量
      testNoFinishNum: "",
      ceshi: "44",
      searchMsg: "",
      classId: "",
      tolearn: "待学习",
      istasksToLearn: true,
      istaskLearned: false,
      istaskHomework: false,
      istaskTest: false,
      istaskPk: false,
      work: "作业",
      header: {
        title: "任务",
        backType: true,
        rightType: 4
      },
      top: 0,
      footShow: false,
      isFirstEnter: true,
      temID: "",
      //终端类型
      studyTerminalCode: "",
      type: ""
    };
  },
  methods: {
    getTolearn(data) {
      // this.tolearn = "待学习(" + data + ")";
      data ? (this.stayLearnNum = data) : (this.stayLearnNum = "");
    },
    getToHomework(data) {
      data
        ? (this.homeworkNoFinishNum = data)
        : (this.homeworkNoFinishNum = "");
    },
    getToTest(data) {
      data ? (this.testNoFinishNum = data) : (this.testNoFinishNum = "");
    },
    //作业未完成
    getTaskList() {
      let owner = this;
      JSH.request({
        url: CloudMarketing.homeworktaskHomework,
        method: "get",
        params: {},
        success(data) {
          console.log(data);
          if (data.success) {
            data.data.length > 0
              ? (owner.homeworkNoFinishNum = data.data.length)
              : (owner.homeworkNoFinishNum = "");
          }
        },
        error(e) {
          owner.isFlag = true;
          console.log(e);
        }
      });
    },
    //考试部分未完成
    getExaminationList() {
      let owner = this;
      JSH.request({
        url: CloudMarketing.homeworktaskTest,
        method: "get",
        params: {},
        success(data) {
          if (data.success) {
            data.data.length > 0
              ? (owner.testNoFinishNum = data.data.length)
              : (owner.testNoFinishNum = "");
          }
        },
        error() {
          owner.isFlag = true;
        }
      });
    },
    tabclick(name) {
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
      }, 100);
      if (name == 0) {
        this.istasksToLearn = true;
        this.istaskLearned = false;
        this.istaskHomework = false;
        this.istaskTest = false;
        this.istaskPk = false;
      }
      if (name == 1) {
        this.istasksToLearn = false;
        this.istaskLearned = true;
        this.istaskHomework = false;
        this.istaskTest = false;
        this.istaskPk = false;
      }
      if (name == 2) {
        this.istasksToLearn = false;
        this.istaskLearned = false;
        this.istaskHomework = true;
        this.istaskTest = false;
        this.istaskPk = false;
      }
      if (name == 3) {
        this.istasksToLearn = false;
        this.istaskLearned = false;
        this.istaskHomework = false;
        this.istaskTest = true;
        this.istaskPk = false;
      }
      if (name == 4) {
        this.istasksToLearn = false;
        this.istaskLearned = false;
        this.istaskHomework = false;
        this.istaskTest = false;
        this.istaskPk = true;
      }
    },
    backTo() {
      this.$router.go(-1); //返回上一层
    },
    /**
     * 跳转到学习报告
     */
    goStudyReport() {
      this.$router.push("/public/study-report");
    },
    //滚动监听
    getScroll() {
      if (document.getElementById("topsocll")) {
        let scrollTop = -document
          .getElementById("topsocll")
          .getBoundingClientRect().top;
        if (scrollTop - this.top > 0) {
          console.log(123);
          this.footShow = true;
        } else {
          this.footShow = false;
        }
        this.top = scrollTop;
      }

      //console.log(scrollTop)
      // console.log(top)
    }
  },
  mounted() {
    window.addEventListener("scroll", this.getScroll, true);
  },
  activated() {},
  created() {
    this.studyTerminalCode = localStorage.getItem("studyTerminalCode");
    this.type = this.$route.query.type;
    this.getTaskList();
    this.getExaminationList();
    const that = this;
    JSH.request({
      url: CloudMarketing.homeworktaskTest,
      method: "get",
      params: {},
      success(res) {
        if (res.success) {
          JSH.request({
            url: CloudMarketing.homeworktaskHomework,
            method: "get",
            params: {},
            success(res1) {
              if (res1.success) {
                console.log(999888777);
                console.log(res);
                console.log(res1);
                that.work =
                  "作业(" + (res.data.length + res1.data.length) + ")";
              } else {
                Toast(res1.errorMsg);
              }
            },
            error() {
              that.isWifi = false;
              Toast.clear();
            }
          });
        } else {
          Toast(res.errorMsg);
        }
      },
      error() {
        that.isWifi = false;
        Toast.clear();
      }
    });
  },
  destroyed() {
    window.removeEventListener("scroll", this.getScroll, true);
  }
};
</script>
<style scoped>
/deep/[class*="van-hairline"]::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border: none;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}
</style>
<style lang="scss" scoped>
#ding {
  width: 100%;
  height: 60px;
}
.active {
  color: #323233;
  font-weight: 500;
}
.tab-class {
  color: #646566;
}
.footer {
  position: fixed;
  bottom: 10%;
  left: 15px;
  opacity: 1;
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  z-index: 99;
}
.organ {
  bottom: 5%;
}
.no {
  opacity: 0;
}
</style>
