import Vue from "vue";
import { CloudMarketing } from "@/request";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import JSH from "@/core";
import { Toast, List, PullRefresh, CountDown, Dialog } from "vant";
import { handleYear } from "@/utils/utils.js";
import classListContent from "./class-list-content/class-list-content.vue";
import TYPE from "./type";

Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(Dialog);
export default {
  name: "class-list",
  components: { jshHeader, classListContent },
  data() {
    return {
      header: {
        title: "班级列表",
        rightType: 3,
        rightTypeSort: 1,
        routeParams: {
          path: "/public/class-search-list",
          query: {
            pageType: 2
          }
        }
      },
      // 下拉刷新loading
      isPullLoading: false,
      isFirstEnter: true,
      //选中的课程状态标签状态
      selectCourseStatus: 0,
      isLabel: false, // 筛选
      // 班级列表
      classList: {
        listClassManagementStudying: {
          type: TYPE.SEARCH_TYPE.LEARNING,
          classStatus: "正在学",
          classList: []
        },
        listClassManagementUnStudy: {
          type: TYPE.SEARCH_TYPE.NOT_JOINED,
          classStatus: "未加入",
          classList: []
        },
        listClassManagementStudy: {
          type: TYPE.SEARCH_TYPE.FINISHED,
          classStatus: "已学完",
          classList: []
        }
      },
      emojiReg: /\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\ud83e[\udd00-\udfff]|[\u2600-\u27ff]|[\s]/g,
      nowTime: null,
      handleYear: handleYear,
      pageType: 1,
      codeOrName: "",
      //历史记录
      history: [],
      SEARCH_TYPE: TYPE.SEARCH_TYPE
    };
  },
  activated() {
    const owner = this;
    // 局部刷新
    if (!owner.isFirstEnter) {
      this.onRefresh();
    }
    this.isFirstEnter = false;
    this.pageType = parseInt(this.$route.query.pageType) || 1;
    this.$forceUpdate();
  },
  created() {
    const owner = this;
    this.classifyId = this.$route.query.classifyId || 0;
    this.pageType = parseInt(this.$route.query.pageType) || 1;
    this.ht.$emit("loading", true);
    document.addEventListener(
      "click",
      () => {
        owner.$forceUpdate();
      },
      false
    );
    this.onRefresh();
  },
  computed: {
    // 无数据flag
    noData() {
      let tmpCount = 0;
      Object.values(this.classList).forEach(item => {
        if (item.noData) tmpCount++;
      });
      return !this.selectCourseStatus
        ? tmpCount === Object.values(this.classList).length
        : !Object.values(this.classList).filter(item => {
            return item.type === this.selectCourseStatus;
          })[0].classList.length;
    },
    // 网络失败flag
    isNetwork() {
      let tmpCount = 0;
      Object.values(this.classList).forEach(item => {
        if (item.isNetwork) tmpCount++;
      });
      return tmpCount === Object.values(this.classList).length;
    }
  },
  methods: {
    back() {
      // 这里可定有坑
      this.pageType = 1; //返回上一层
      this.codeOrName = "";
      this.onRefresh();
      this.$router.go(-1);
    },

    filterEmoji(value) {
      return value.replace(this.emojiReg, "");
    },
    onFocus() {
      let owner = this;
      // this.list = [];
      // owner.showHistory = true;
      // owner.goTop();
      owner.getHistorys();
    },
    getHistorys() {
      let history = localStorage.getItem(this.accountId);
      if (history) {
        this.history = JSON.parse(history);
      }
    },
    /**
     * historys存入localStorage
     */
    setHistorys() {
      let owner = this;
      // 搜索框有内容且不在历史记录里
      if (
        owner.codeOrName &&
        owner.codeOrName !== "" &&
        owner.codeOrName !== " "
      ) {
        // let Arr = Array.from(new Set(owner.history));
        for (let i = this.history.length - 1; i >= 0; i--) {
          if (owner.codeOrName == owner.history[i]) {
            owner.history.splice(i, 1);
          }
        }
        owner.history = [owner.codeOrName, ...owner.history];
        // owner.history = owner.history.push(owner.codeOrName);
      }
      // 历史记录只保存10条
      if (owner.history && owner.history.length && owner.history.length > 10) {
        owner.history = owner.history.slice(0, 10);
      }
      localStorage.setItem(this.accountId, JSON.stringify(owner.history));
    },
    /**
     * 删除历史记录
     */
    clearHistory() {
      this.history = [];
      localStorage.removeItem(this.accountId);
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
            owner.nowTime = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    /**
     *
     * 搜索
     */
    cancle() {
      // this.$loading.show(8000);
      this.ht.$emit("loading", true);
      this.showHistory = false;
      this.$forceUpdate();
      this.setHistorys();
      this.onRefresh();
    },
    displayHistory() {
      let owner = this;
      owner.list = [];
      owner.showHistory = true;
    },
    /**
     * 点击某个历史记录进行搜索
     */
    historyItem(item) {
      let owner = this;
      // this.$loading.show(8000);
      owner.ht.$emit("loading", true);
      owner.codeOrName = item;
      owner.showHistory = false;
      this.onRefresh();
      this.setHistorys();
    },

    /**
     * 不感兴趣提示框
     */
    noInterest() {
      Dialog.confirm({
        title: "不感兴趣的班级将不能再次学习，确认不感兴趣？",
        message: "确认后不可以恢复",
        className: "padd"
      })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    /**
     *切换课程状态标签（不限，未学习，学习中，已学完）
     */
    changeCourseStatus(val) {
      this.selectCourseStatus = val;
    },
    /**
     *标签是否展示
     */
    fatherLabel() {
      this.isLabel = !this.isLabel;
    },
    /**
     *
     * 下拉刷新
     */
    onRefresh() {
      this.isPullLoading = true;
      this.page = 1;
      this.searchList();
    },
    /**
     * 获取排行列表
     */
    searchList() {
      this.showHistory = false;
      this.setHistorys();
      const params = Object.assign(
        {
          name: this.codeOrName
        },
        this.classifyId ? { classifyId: this.classifyId } : {}
      );
      Promise.all([
        this.getListClass(params, "listClassManagementStudying"),
        this.getListClass(params, "listClassManagementUnStudy"),
        this.getListClass(params, "listClassManagementStudy")
      ]).then(() => {
        setTimeout(() => {
          this.isPullLoading = false;
          this.listDataLoading = false;
        }, 500);
      });
    },
    /**
     * 获取班级列表
     * @param {*} params
     * @param {*} status
     */
    getListClass(params, status) {
      const owner = this;
      JSH.request({
        url: CloudMarketing[status],
        method: "post",
        params: params,
        success(data) {
          if (data.success) {
            owner.ht.$emit("loading", false);
            owner.$set(owner.classList[status], "classList", data.data);
            owner.$set(owner.classList[status], "noData", !data.data.length);
            owner.$set(owner.classList[status], "isNetwork", false);
          } else {
            Toast(data.errorMsg);
            owner.ht.$emit("loading", false);
          }
        },
        error(e) {
          console.log(e);
          owner.$set(owner.classList[status], "isNetwork", true);
          owner.ht.$emit("loading", false);
        }
      });
    }
  }
};
