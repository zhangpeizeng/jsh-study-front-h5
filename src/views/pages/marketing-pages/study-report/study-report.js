import Vue from "vue";
import JshShare from "./share/share.vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import { Tab, Button, Tabs, Toast, Dialog } from "vant";

Vue.use(Tab)
  .use(Button)
  .use(Tabs)
  .use(Toast)
  .use(Dialog);
export default {
  name: "study-report",
  components: {
    JshShare
  },
  data() {
    return {
      value: "http://10.168.5.38:8081/h5/#/demo",
      studyTerminalCode: "1",
      activeName: "1",
      data: {
        learnedTime: 0
      },
      date: "",
      rownum: 1, //排名
      searchType: "1",
      learnedNum: "", //已学习课程数量
      learnedTime: 998, //学习时长（分
      learnedDay: "", //累计学习天数
      submitHomeWorkNum: "", //已提交作业数量
      homeWorkPassRate: "", //作业合格率
      submitExamNum: "", //已提交考试数量
      examPassRate: "", //考试合格率
      studentName: "", //学员名称
      studyReportImg: "", //底图
      studyReportContent: "", //心灵鸡汤
      gmCode: "", //登陆人中心编码
      companyCode: "", //公司编码
      departmentCode: "", //部门编码
      isNetwork: false, //网络报错
      isCreated: false, //学习报告是否生成
      isFirstPage: false, //是否第一次进入学习报告
      qrCode: "",
      viewurl: null,
      vcNum: 0 // 点击次数
    };
  },
  created() {
    const owner = this;
    this.studyReportList();
    this.studyReportStatus();
    this.studyTerminalCode = localStorage.getItem("studyTerminalCode");
    if (this.$route.query.id) {
      this.activeName = this.$route.query.id;
      owner.viewurl = owner.$route.query.viewurl
        ? owner.$route.query.viewurl
        : null;
    }
  },
  activated() {
    this.studyReportList();
  },
  methods: {
    // 获取海报路径接口
    GetPoster() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.studyReportShare,
        method: "post",
        params: {
          learnedNum: owner.data.learnedNum, //已学习课程数量
          learnedTime: parseInt(owner.data.learnedTime / 60) || 0, // 学习时长（分）
          learnedDay: owner.data.learnedDay, //累计学习天数
          studentName: owner.data.studentName, //学员名称
          studyReportContent: owner.data.studyReportContent, //心灵鸡汤
          studyReportImg: owner.data.studyReportImg, //底图
          searchType: owner.activeName
        },
        success(data) {
          if (data.success) {
            owner.qrCode = data.data;
          } else {
            Toast(data.errorMsg);
            Toast.clear();
          }
        },
        error() {
          owner.$toast(`失败，请稍后重试`);
        }
      });
    },
    /**
     * 回到上一个页面
     */
    backTo() {
      const owner = this;
      if (owner.viewurl) {
        //安卓调用方式  nativeRoute是具体的方法名,
        if (window.collegeNative) {
          window.collegeNative.backToNative();
        }
        //ios调用方式  nativeRoute是具体的方法名,
        if (window.webkit && window.webkit.messageHandlers) {
          window.webkit.messageHandlers.backToNative.postMessage("");
        }
      } else {
        owner.$router.go(-1); //返回上一层
      }
    },
    /**
     * 处理成小时
     */
    handleHour(start) {
      let hour;
      let afterHour;
      let min;
      let afterMin;
      hour = Math.floor(start / (60 * 60));
      afterHour = start - hour * 60 * 60;
      min = Math.floor(afterHour / 60);
      afterMin = Math.floor(start - hour * 60 * 60 - min * 60);
      if (hour < 10) {
        hour = "0" + hour.toString();
      }
      if (afterMin < 10) {
        afterMin = "0" + afterMin.toString();
      }
      if (min < 10) {
        min = "0" + min.toString();
      }
      return hour;
    },
    /**
     * 处理成分钟
     */
    handleMin(start) {
      let hour;
      let afterHour;
      let min;
      let afterMin;
      hour = Math.floor(start / (60 * 60));
      afterHour = start - hour * 60 * 60;
      min = Math.floor(afterHour / 60);
      afterMin = Math.floor(start - hour * 60 * 60 - min * 60);
      if (hour < 10) {
        hour = "0" + hour.toString();
      }
      if (afterMin < 10) {
        afterMin = "0" + afterMin.toString();
      }
      if (min < 10) {
        min = "0" + min.toString();
      }
      return min;
    },
    /**
     * 跳转到团队页面
     */
    goTeam() {
      this.$router.push("/public/team-study-report");
    },

    /**
     * 跳转到学习勤奋榜
     */
    goTeamList() {
      this.$router.push("/public/study-list");
    },
    /**
     *规则说明
     */
    openRule() {
      Dialog.alert({
        title: "规则说明",
        message:
          "1.学习报告可按照近30天、上月、累计进行查看学习实时结果；\n2.学习课程数即产生学习进度的课程数合计；\n3.学习时长即产生学习进度的累计时长合计；\n4.学习天数即产生学习进度的天数合计；\n5.提交作业数即已提交的作业合计（去重）；\n6.作业合格率即合格作业数/总提交作业数*100%；\n7.提交考试数即已考的考试数合计（去重）；\n8.考试达标率即达标考试数/总考试数*100%。",
        confirmButtonText: "知道了",
        confirmButtonColor: "#555555",
        messageAlign: "left"
      }).then(() => {
        // on close
      });
    },

    /**
     * 切换tab标签
     */
    onClick(name, title) {
      console.log(name);
      console.log(title);
      const owner = this;
      owner.searchType = name;
      owner.studyReport();
    },

    /**
     * 获取学习报告
     */
    studyReport() {
      const owner = this;
      const params = {
        searchType: Number(owner.searchType)
      };
      // Toast.loading({
      //   message: "加载中...",
      //   forbidClick: true,
      //   duration: 0
      // });
      this.ht.$emit("loading", true);
      JSH.request({
        url: CloudMarketing.getStudyReport,
        method: "get",
        params: params,
        success(data) {
          if (data.success) {
            owner.isNetwork = false;
            owner.data = data.data;
            owner.GetPoster();
            owner.studyReportImg = `url(${data.data.studyReportImg})`;
            owner.$forceUpdate();
            // Toast.clear();
            owner.ht.$emit("loading", false);
          } else {
            owner.isNetwork = false;
            Toast(data.errorMsg);
            // Toast.clear();
            owner.ht.$emit("loading", false);
          }
        },
        error(e) {
          console.log(e);
          Toast.clear();
          // this.ht.$emit('loading', false);
          owner.isNetwork = true;
        }
      });
      setTimeout(() => {
        // Toast.clear();
        owner.ht.$emit("loading", false);
      }, 1000);
    },
    /**
     * 获取学习报告是否汇算完成
     */
    studyReportStatus() {
      const owner = this;
      const params = {
        accountId: ""
      };
      JSH.request({
        url: CloudMarketing.saveStudyReport,
        method: "get",
        params: params,
        success(data) {
          if (data.success) {
            owner.isNetwork = false;
            owner.studyReport();
            owner.isCreated = true;
            // Toast.clear();
            owner.ht.$emit("loading", false);
          } else {
            owner.isNetwork = false;
            owner.isCreated = true;
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
          Toast.clear();
          owner.isCreated = true;
          owner.isNetwork = true;
        }
      });
      setTimeout(() => {
        Toast.clear();
      }, 1000);
    },
    /**
     * 获取学习勤奋榜
     */
    studyReportList() {
      const owner = this;
      const params = {
        searchType: 1
      };
      JSH.request({
        url: CloudMarketing.studyReportRankingList,
        method: "get",
        params: params,
        success(data) {
          if (data.success) {
            owner.studyReportRankingList = data.data.studyReportRankingListDtos;
            owner.rownum = data.data.rownum;
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
      setTimeout(() => {
        Toast.clear();
      }, 1000);
    },

    /**
     * 打开分享页面
     */
    openShare() {
      this.$refs.jshShare.open({
        qrCode: this.qrCode
      });
    },
    // 打开调试
    showConsole() {
      this.vcNum++;
      if (this.vcNum === 10) {
        this.$store.commit("showVConsole");
      }
    }
  }
};
