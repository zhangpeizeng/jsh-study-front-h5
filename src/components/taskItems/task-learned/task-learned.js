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
  Row,
  Icon,
  Sidebar,
  SidebarItem,
  CountDown,
  PullRefresh,
  List,
  Overlay,
  Toast
} from "vant";

Vue.use(CellGroup)
  .use(Search)
  .use(Col)
  .use(Overlay)
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
  name: "task-learned",
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
      isFirstEnter: true,
      nowDateTime: Date.parse(new Date())
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
      this.getTableList(1);
      this.isFinished = false;
      this.finished = false;
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
      this.getTableList(2);
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
    getTableList(type) {
      const that = this;
      if (type != 1 && type != 2) {
        that.ht.$emit("loading", true);
      }

      JSH.request({
        url: CloudMarketing.searchAppCourseLearned,
        method: "post",
        params: {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          classClassifyId: this.classifyId
        },
        success(res) {
          if (res.success) {
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
            that.isRefresh = false;
            Toast(res.errorMsg);
            that.ht.$emit("loading", false);
          }
        },
        error() {
          that.isWifi = false;
          that.isRefresh = false;
          that.ht.$emit("loading", false);
        }
      });
    },
    //处理是否学完--不用了
    isComplete(val) {
      let list = val.split("/");
      if (list[0] == list[1]) {
        return true;
      } else {
        return false;
      }
    },
    seachClick() {
      //获取分类
      this.getSearchTreeNode();
      this.dropDown = true;
    },
    //跳转详情
    Todetails(item) {
      console.log(item);
      const owner = this;
      owner.temID = item.id;
      if (item.baseStatus == 1 || item.baseStatus == 3 || item.deleteFlg == 1) {
        owner.$toast(
          "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
        );
        return;
      }
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
            console.log(res);
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
    }
  },
  deactivated() {
    this.dropDown = false;
  },
  destroyed() {
    this.dropDown = false;
  },
  activated() {
    //获取当前时间
    // this.nowDateTime = Date.parse(new Date());
    console.log(this.nowDateTime, "999999this.nowDateTime已经学习");
    const owner = this;
    // 局部刷新
    if (!owner.isFirstEnter) {
      JSH.request({
        url: CloudMarketing.partialRefresh,
        method: "get",
        params: {
          baseId: owner.temID
        },
        success(data) {
          if (data.success) {
            if (owner.preLiveList.length > 0) {
              owner.preLiveList.forEach(value => {
                if (value.id == data.data.id) {
                  value.status = data.data.status;
                  value.leftStatus = data.data.leftStatusCode;
                  value.countdown = data.data.countdown;
                  value.progress = data.data.progress;
                }
              });
            }
          } else {
            owner.$toast(data.errorMsg);
          }
        },
        error() {}
      });
    }
    this.$forceUpdate();
    this.isFirstEnter = false;
  },
  created() {
    this.dropDown = false;
    this.isFinished = false;
    this.finished = false;
    this.pageNum = 1;
    this.getTableList();
  }
};
