import Vue from "vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import {
  NavBar,
  Cell,
  CellGroup,
  Search,
  Tab,
  Tabs,
  ActionSheet,
  Col,
  Overlay,
  Row,
  Icon,
  Sidebar,
  SidebarItem,
  CountDown,
  PullRefresh,
  Dialog,
  List,
  Toast
} from "vant";

Vue.use(CellGroup)
  .use(Search)
  .use(Overlay)
  .use(Col)
  .use(Dialog)
  .use(Row)
  .use(Tab)
  .use(Tabs)
  .use(Cell)
  .use(NavBar)
  .use(ActionSheet)
  .use(PullRefresh)
  .use(Sidebar)
  .use(SidebarItem)
  .use(CountDown)
  .use(Toast)
  .use(List)
  .use(Icon);

export default {
  name: "tasks-to-learn",
  props: ["classId", "temID"],
  data() {
    return {
      searchMsg: "请根据课程分类进行搜索",
      isWifi: true,
      dropDown: false,
      activeKey: 0,
      time: 30 * 60 * 60 * 1000,
      //下拉选中
      activeIndex: -1,
      //上拉框的展示index
      searchIndex: -1,
      lastIndex: -1,
      //口令
      vhallObj: {},
      //上拉加载状态结束
      finished: false,
      //上拉加载状态
      isFinished: false,
      //下拉刷新状态
      isRefresh: false,
      //分类选中的id
      classifyId: "",
      //分页
      pageSize: 10,
      pageNum: 1,
      //数据列表
      preLiveList: [],
      //分类
      typeList: [],
      //条数
      total: null,
      isFirstEnter: true,
      nowDateTime: null,
      againTrigger: false
    };
  },
  methods: {
    handleYear(data) {
      let date = new Date(data);
      return date.getFullYear();
    },
    tabFlag(item) {
      this.flag = item;
    },
    //下拉刷新
    onRefresh() {
      this.pageNum = 1;
      this.classifyId = "";
      this.isFinished = false;
      this.finished = false;
      this.getTableList(1);
      this.isFinished = true;
      this.searchMsg = "请根据课程分类进行搜索";
    },
    // 无网络刷新
    wifiGo() {
      this.pageNum = 1;
      this.classifyId = "";
      this.isFinished = false;
      this.finished = false;
      this.getTableList();
      this.isFinished = true;
      this.searchMsg = "请根据课程分类进行搜索";
    },
    //上拉加载
    onLoad() {
      this.isFinished = true;
      this.pageNum++;
      setTimeout(() => {
        this.getTableList(2);
      }, 200);
    },
    seachClick() {
      //获取分类
      this.getSearchTreeNode();
      this.dropDown = true;
    },
    //一级菜单点击
    sidebarClick(item, index) {
      this.activeIndex = index;
      this.searchIndex = -1;
      this.lastIndex = -1;
      if (item.children.length == 0) {
        this.pageNum = 1;
        this.dropDown = false;
        this.searchMsg = item.classifyName;
        this.classifyId = item.id;
        this.getTableList();
      }
    },
    //二级菜单点击
    sidebarCenterClick(item, index) {
      this.searchIndex = index;
      this.lastIndex = -1;
      if (item.children.length == 0) {
        this.pageNum = 1;
        this.dropDown = false;
        this.searchMsg = item.classifyName;
        this.classifyId = item.id;
        this.getTableList();
      }
    },
    //三级菜单点击
    sidebarLastClick(item, index) {
      this.pageNum = 1;
      this.dropDown = false;
      this.lastIndex = index;
      this.searchMsg = item.classifyName;
      this.classifyId = item.id;
      this.getTableList();
    },
    //清除
    clearMsg() {
      this.activeIndex = -1;
      this.searchIndex = -1;
      this.lastIndex = -1;
      this.searchMsg = "请根据课程分类进行搜索";
      this.classifyId = "";
      this.dropDown = false;
      this.pageNum = 1;
      this.getTableList();
    },
    //时间戳转时间
    time1(time = +new Date()) {
      let date = new Date(time + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 19)
        .replace("T", " ")
        .replace(/-/g, "-");
      let arr = date.split("-");
      if (arr[0] == new Date().getFullYear()) {
        date = date.substr(5);
      }
      return date;
    },
    //倒计时结束fff
    finishTime(index) {
      this.preLiveList[index].leftStatus = 1;
      this.preLiveList[index].status = "观看直播";
      this.$forceUpdate();
    },
    getTableList(type) {
      const that = this;
      if (type != 1 && type != 2) {
        that.ht.$emit("loading", true);
      }
      JSH.request({
        url: CloudMarketing.searchAppCourseTodo,
        method: "post",
        params: {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          classClassifyId: this.classifyId
        },
        success(res) {
          if (res.success) {
            that.total = res.data.total;
            if (res.data.lastPage <= res.data.pageNum) {
              that.finished = true;
            } else {
              that.isFinished = false;
            }
            if (type == 1) {
              that.isRefresh = false;
              that.preLiveList = res.data.list;
            } else if (type == 2) {
              that.preLiveList = [...that.preLiveList, ...res.data.list];
            } else {
              that.preLiveList = res.data.list;
              that.isWifi = true;
            }
            that.ht.$emit("loading", false);
          } else {
            Toast(res.errorMsg);
            that.isFinished = false;
            that.preLiveList = [];
            that.ht.$emit("loading", false);
          }
        },
        error() {
          that.isWifi = false;
          that.isFinished = false;
          that.ht.$emit("loading", false);
        }
      });
    },
    // 跳原生直播--页面入口已屏蔽
    viewPlay(item) {
      const owner = this;
      owner.getvhallCode(item);
    },
    // 获取口令
    getvhallCode(item) {
      const owner = this;
      //获取口令
      JSH.request({
        url: CloudMarketing.getvhallCode,
        method: "get",
        params: { classId: item.id },
        success(res) {
          if (res.success) {
            owner.vhallObj = res.data;
            let prems = {
              param: {
                baseId: item.id,
                sourceId: item.id,
                eduId: item.vhallLiveId,
                invitationCode: owner.vhallObj.student_pwd
              },
              routePath: "com.jsh.marketingcollege.ui.VhLiveClassActivity"
            };
            //安卓调用方式  nativeRoute是具体的方法名,
            if (window.collegeNative) {
              window.collegeNative.nativeRoute(JSON.stringify(prems));
            }
            //ios调用方式  nativeRoute是具体的方法名,
            if (window.webkit && window.webkit.messageHandlers) {
              window.webkit.messageHandlers.nativeRoute.postMessage(
                JSON.stringify(prems)
              );
            }
          } else {
            Toast(res.data.errorMsg);
          }
        },
        error() {
          owner.isWifi = false;
          owner.ht.$emit("loading", false);
        }
      });
    },
    //立即预约
    appointment(item) {
      let that = this;
      if (that.againTrigger) {
        return;
      }
      that.againTrigger = true;
      Dialog.confirm({
        title: "确定预约提醒此课程",
        message: "本课程将于开课前2小时短信提醒"
      })
        .then(() => {
          JSH.request({
            url: CloudMarketing.saveCollegeMarketingCustomer,
            method: "post",
            params: {
              baseId: item.id,
              type: 3
            },
            success(res) {
              if (res.success && res.data) {
                Toast("预约成功");
                that.againTrigger = false;
                that.localRefresh(item.id);
              } else {
                Toast(res.errorMsg);
              }
            },
            error() {
              that.isWifi = false;
              that.ht.$emit("loading", false);
            }
          });
        })
        .catch(() => {
          that.againTrigger = false;
          Toast("取消预约");
        });
    },
    //立即报名
    signUp(item) {
      let that = this;
      if (that.againTrigger) {
        return;
      }
      that.againTrigger = true;
      // on close
      JSH.request({
        url: CloudMarketing.saveCollegeMarketingCustomer,
        method: "post",
        params: {
          baseId: item.id,
          type: 2
        },
        success(res) {
          if (res.success && res.data) {
            Toast("报名成功");
            that.againTrigger = false;
            that.localRefresh(item.id);
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          that.isWifi = false;
          that.ht.$emit("loading", false);
        }
      });
    },
    /**
     * 局部刷新
     */
    localRefresh(id) {
      const owner = this;
      owner.againTrigger = false;
      JSH.request({
        url: CloudMarketing.partialRefresh,
        method: "get",
        params: {
          baseId: id
        },
        success(data) {
          if (data.success) {
            owner.againTrigger = false;
            if (owner.preLiveList.length > 0) {
              owner.preLiveList.forEach(item => {
                if (item.id == data.data.id) {
                  item.status = data.data.status;
                  item.flag = data.data.leftStatusCode;
                  item.countdown = data.data.countdown;
                }
              });
            }
          } else {
            owner.$toast(data.errorMsg);
          }
        },
        error() {}
      });
    },
    //跳转详情
    Todetails(item) {
      const owner = this;
      owner.temID = item.id;
      if (item.studyStartTime !== null && item.studyStartTime !== "") {
        //    有值判断 在前 还是在后
        const now = Date.parse(new Date());
        const start = item.studyStartTime;
        const end = item.studyEndTime;
        if (now < start) {
          owner.$toast("学习未开始");
          return;
        }
        if (now > end) {
          owner.$toast(
            "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
          );
          return;
        }
        // const startTime = value.studyStartTime
      }
      //录播/文档课
      if (item.courseType == 1) {
        this.$router.push({
          path: "/public/recorded-course",
          query: {
            id: item.id
          }
        });
      }
      //直播课
      if (item.courseType == 2) {
        this.$router.push({
          path: "/public/live-course",
          query: {
            id: item.id
          }
        });
      }
      //研讨课
      if (item.courseType == 3) {
        this.$router.push({
          path: "/public/discussion-course",
          query: {
            id: item.id
          }
        });
      }
      //系列课
      if (item.courseType == 4) {
        this.$router.push({
          path: "/public/series-course",
          query: {
            id: item.id
          }
        });
      }
    },
    //获取分类
    getSearchTreeNode() {
      const that = this;
      let studyTerminalCode = localStorage.getItem("studyTerminalCode");
      JSH.request({
        url: CloudMarketing.searchTreeNode,
        method: "get",
        params: {
          studyTerminalCode: studyTerminalCode
        },
        success(res) {
          if (res.success) {
            that.typeList = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          that.isWifi = false;
          that.ht.$emit("loading", false);
        }
      });
    }
  },
  watch: {
    total(val) {
      this.$emit("length", val);
    }
  },
  filters: {
    classType(val) {
      if (val == 1) {
        // return "录播/文档课";
        return "";
      }
      if (val == 2) {
        return "[直播]";
      }
      if (val == 3) {
        return "[研讨]";
      }
      if (val == 4) {
        return "[系列]";
      }
      if (val == 5) {
        return "[自建课时]";
      }
    },
    classButton(val) {
      if (val == 1) {
        return "立即预约";
      }
      if (val == 2) {
        return "已预约";
      }
      if (val == 3) {
        return "报名截止";
      }
      if (val == 4) {
        return "观看直播";
      }
      if (val == 5) {
        return "直播回放";
      }
      if (val == 6) {
        return "立即报名";
      }
      if (val == 7) {
        return "已报名";
      }
    }
  },
  deactivated() {
    this.dropDown = false;
  },
  destroyed() {
    this.dropDown = false;
  },
  activated() {
    this.pageNum = 1;
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
    }, 100);

    const owner = this;

    //上拉加载状态结束
    owner.finished = false;
    //上拉加载状态
    owner.isFinished = false;
    //下拉刷新状态
    owner.isRefresh = false;
    // owner.$forceUpdate();
    owner.isFirstEnter = false;
    owner.getTableList(1);
  },
  created() {
    this.dropDown = false;
    this.pageNum = 1;
    this.isFinished = false;
    this.finished = false;
    //获取当前时间
    this.nowDateTime = Date.parse(new Date());
    this.getTableList();
  }
};
