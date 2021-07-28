import Vue from "vue";
import { CloudMarketing } from "@/request";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import JSH from "@/core";
import { Toast, List, PullRefresh, CountDown, Dialog } from "vant";
import { formatDate } from "@/utils/utils.js";
import canlen from "@/components/data-calendar/data-calendar.vue";

Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(Dialog);
export default {
  name: "ranking-list",
  filters: {
    Date: function(value) {
      return formatDate(value, "yyyy/MM/dd hh:mm");
    }
  },
  components: { jshHeader, canlen },
  data() {
    return {
      isNetwork: false,
      header: {
        title: "我的课表",
        rightTypeSort: 1
      },
      expiredFlag: false, // 未来时间标识
      nowSystemTime: 0, // 当前系统时间
      serverTime: 0, // 服务器时间用来卡是否能进课程上课
      dateTime: null,
      todayNoStudyList: [], // 当天未学习
      sevenDayNoStudyList: [], // 接下来7天未学习
      completedList: [], // 已完成
      expiredList: [], // 已过期
      isLearned: false, //当天已完成
      isOverdue: false //当天已过期
    };
  },
  methods: {
    handleYear(data) {
      let date = new Date(data);
      return date.getFullYear();
    },
    checkLearned() {
      this.isLearned = !this.isLearned;
    },
    checkOverdue() {
      this.isOverdue = !this.isOverdue;
    },
    dateTimeFun(data) {
      console.log(data);
      this.dateTime = data;
      // 未来日期：展示当天、接下来7天
      if (this.nowSystemTime <= data) {
        this.expiredFlag = false;
      } else {
        this.expiredFlag = true;
      }
      this.initData();
    },
    initData() {
      this.searchList(1); //当天未学习
      this.searchList(2); // 接下来7天未学习
      this.searchList(3); // 已完成
      this.searchList(4); //已过期
    },
    gotoCourseDetail(item) {
      const owner = this;
      if (owner.serverTime < item.studyStartTime) {
        Toast("学习未开始");
        return;
      }
      if (owner.serverTime > item.studyEndTime) {
        Toast("哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程");
        return;
      }
      if (item.courseType === "1") {
        owner.$router.push({
          path: "/public/recorded-course",
          query: {
            courseType: item.courseType,
            id: item.baseId
          }
        });
      } else if (item.courseType === "2") {
        owner.$router.push({
          path: "/public/live-course",
          query: {
            courseType: item.courseType,
            id: item.baseId
          }
        });
      } else if (item.courseType === "3") {
        owner.$router.push({
          path: "/public/discussion-course",
          query: {
            courseType: item.courseType,
            id: item.baseId
          }
        });
      } else if (item.courseType === "4") {
        owner.$router.push({
          path: "/public/series-cours",
          query: {
            courseType: item.courseType,
            id: item.baseId
          }
        });
      } else if (item.courseType === "6") {
        owner.$router.push({
          path: "/public/class-detail",
          query: {
            id: item.baseId
          }
        });
      }
    },
    /**
     * 获取列表
     */
    searchList(code) {
      const owner = this;
      owner.ht.$emit("loading", true);
      JSH.request({
        url: CloudMarketing.getCurriculum,
        method: "post",
        params: {
          searchType: code,
          dateTime: this.dateTime
        },
        success(data) {
          if (data.success) {
            owner.ht.$emit("loading", false);
            owner.isNetwork = false;
            if (code === 1) {
              owner.todayNoStudyList = data.data;
            } else if (code === 2) {
              owner.sevenDayNoStudyList = data.data;
            } else if (code === 3) {
              owner.completedList = data.data;
            } else if (code === 4) {
              owner.expiredList = data.data;
            }
          } else {
            owner.isNetwork = false;
            Toast(data.errorMsg);
            owner.ht.$emit("loading", false);
          }
        },
        error(e) {
          console.log(e);
          owner.isNetwork = true;
          owner.ht.$emit("loading", false);
        }
      });
    },
    // 获取当前系统时间
    getNowDateTime() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getNowDateTime,
        method: "post",
        params: {},
        success(res) {
          if (res.success) {
            owner.serverTime = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    }
  },
  created() {
    const owner = this;
    owner.nowSystemTime = Date.parse(new Date());
    owner.getNowDateTime();
  }
};
