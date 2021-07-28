import Vue from "vue";
import jshHeader from "../../../../components/jsh-header/jsh-header.vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import { Tab, DropdownMenu, DropdownItem, Tabs, Toast, Dialog } from "vant";

Vue.use(Tab)
  .use(Tabs)
  .use(Toast)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Dialog);
export default {
  name: "team-study-report",
  components: {
    jshHeader
  },
  data() {
    return {
      header: {
        title: "团队学习报告"
      },
      activeName: 1,
      date: "",
      month: "",
      option1: [
        { text: "月度", value: 1 },
        { text: "累计", value: 2 }
      ],
      studentName: "", //学员姓名
      emojiReg: /\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\ud83e[\udd00-\udfff]|[\u2600-\u27ff]|[\s]/g,
      list: [],
      count: 0,
      page: 1, // 页数
      //搜索的内容
      codeOrName: "",
      // 下拉刷新loading
      isPullLoading: false,
      // 上拉加载loading
      listDataLoading: true,
      // 上拉加载数据完成
      listDataFinished: false,
      againTrigger: false, //防重复点击
      isNetwork: false, //网络问题
      noData: false
    };
  },
  created() {
    this.ht.$emit("loading", true);
    this.onRefresh();
    let date = new Date();
    let year = date.getFullYear(); //获取完整的年份(4位)
    let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let day = date.getDate() - 1; //获取当前日(1-31)
    this.date = year.toString() + "." + month.toString() + "." + day.toString();
    let newMonth = month > 9 ? month.toString() : "0" + month.toString();
    this.month = year.toString() + newMonth.toString();
  },
  methods: {
    filterEmoji(value) {
      return value.replace(this.emojiReg, "");
    },
    /**
     * 搜索框回车时触发
     */
    onSearch() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.ht.$emit("loading", true);
      const owner = this;
      owner.onRefresh();
    },
    /**
     * 切换tab标签
     */
    onClick(name, title) {
      console.log(name);
      console.log(title);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      const owner = this;
      this.ht.$emit("loading", true);
      owner.onRefresh();
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      this.isPullLoading = true;
      this.listDataFinished = false;
      this.page = 1;
      this.teamStudyList(this.page, data => {
        setTimeout(() => {
          this.isPullLoading = false;
          if (data.hasNextPage) {
            this.listDataLoading = false;
          }
        }, 500);
      });
    },
    /**
     * 上拉加载
     */
    onLoadListData() {
      this.listDataLoading = true;
      this.page++;
      this.teamStudyList(this.page, data => {
        setTimeout(() => {
          this.isPullLoading = false;
          console.log(data, "1111111");
          if (data.hasNextPage) {
            this.listDataLoading = false;
          }
          // this.listDataLoading = false;
        }, 1000);
      });
    },
    /**
     * 获取团队学习报告列表
     */
    teamStudyList(page, callback) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.listOrgStudyReport,
        method: "post",
        params: {
          name: this.codeOrName,
          searchType: this.activeName,
          pageSize: 20,
          pageNum: page
        },
        success(data) {
          if (data.success) {
            owner.ht.$emit("loading", false);
            owner.isNetwork = false;
            if (data.data.hasNextPage) {
              owner.list = owner.list.concat(data.data.list);
              owner.listDataFinished = false;
            } else {
              owner.list = owner.list.concat(data.data.list);
              owner.listDataFinished = true;
            }
            if (page === 1) {
              owner.list = data.data.list;
            }

            owner.noData = owner.list.length === 0;
            callback(data.data);
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
    /**
     * 点赞
     */
    checkAssist(type, accountId) {
      const owner = this;
      if (owner.againTrigger) {
        return;
      }
      owner.againTrigger = true;
      console.log(accountId);
      owner.list.forEach(item => {
        if (item.accountId === accountId) {
          if (type === 1) {
            item.likeCount = item.likeCount - 1;
            item.isPraised = false;
          } else {
            item.likeCount = item.likeCount + 1;
            item.isPraised = true;
          }
        }
      });

      JSH.request({
        url: CloudMarketing.addReportLike,
        method: "get",
        params: {
          accountId: accountId,
          month: owner.activeName === 1 ? owner.month : "-1"
        },
        success(data) {
          if (data.success) {
            console.log("111");
            owner.againTrigger = false;
          } else {
            owner.againTrigger = false;
            Toast(data.errorMsg);
          }
        },
        error(e) {
          owner.againTrigger = false;
          console.log(e);
        }
      });
    }
  }
};
