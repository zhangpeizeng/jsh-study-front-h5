import Vue from "vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import { Tab, Tabs, Sticky, Toast, Dialog } from "vant";

Vue.use(Tab)
  .use(Tabs)
  .use(Sticky)
  .use(Toast)
  .use(Dialog);
export default {
  name: "study-report",
  data() {
    return {
      activeName: "1",
      searchType: "1",
      studyReportRankingList: [], //榜单列表
      rownum: "", //排名
      studyTimeStr: "", //时长
      studyReportContent: "", //语录
      date: "",
      noData: false,
      isNetwork: false
    };
  },
  created() {
    this.studyReport();
    let date = new Date();
    let year = date.getFullYear(); //获取完整的年份(4位)
    let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let day = date.getDate() - 1; //获取当前日(1-31)
    this.date = year.toString() + "." + month.toString() + "." + day.toString();
  },
  methods: {
    /**
     * 回到上一个页面
     */
    backTo() {
      this.$router.go(-1); //返回上一层
    },

    /**
     *规则说明
     */
    openRule() {
      Dialog.alert({
        title: "规则说明",
        message:
          "1.学习勤奋榜可按照周榜和月榜进行实时排名；\n2.客户端取同中心学员学习时长top20排名，直销员/员工端取同中心、产业学员学习时长top20排名。",
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
     * 获取学习勤奋榜
     */
    studyReport() {
      const owner = this;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      const params = {
        searchType: owner.searchType
      };
      owner.ht.$emit("loading", true);
      JSH.request({
        url: CloudMarketing.studyReportRankingList,
        method: "get",
        params: params,
        success(data) {
          if (data.success) {
            owner.isNetwork = false;
            owner.studyReportRankingList = data.data.studyReportRankingListDtos;
            if (data.data.studyReportRankingListDtos.length === 0) {
              owner.noData = true;
            } else {
              owner.noData = false;
            }
            owner.rownum = data.data.rownum;
            owner.studyTimeStr = data.data.studyTimeStr;
            owner.studyReportContent = data.data.studyReportContent;
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          owner.isNetwork = true;
          console.log(e);
        }
      });
      setTimeout(() => {
        owner.ht.$emit("loading", false);
      }, 1000);
    },

    /**
     * 打开分享页面
     */
    openShare() {
      this.$refs.jshShare.open();
    }
  }
};
