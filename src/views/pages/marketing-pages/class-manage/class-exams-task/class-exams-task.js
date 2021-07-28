import jshHeader from "@/components/jsh-header/jsh-header.vue";
import classExamsItem from "./class-exams-item.vue";
import classTaskItem from "./class-task-item.vue";
import classCertificateItem from "./class-certificate-item.vue";
import { CloudMarketing } from "@/request";
import nodataPage from "@/components/nodata-page/nodata-page.vue";
import networkError from "@/components/network-error/network-error.vue";
import { Toast, List, PullRefresh, CountDown, Dialog, Tab, Tabs } from "vant";
import jobSubmit from "@/components/job-submit/job-submit.vue";
import Vue from "vue";
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(Dialog);
Vue.use(Tab);
Vue.use(Tabs);

import JSH from "@/core";

export default {
  data() {
    return {
      pageType: 0,
      classId: 0,
      // 列表数据
      tableList: [],
      // 汇总数据
      summaryData: {},

      searchType: 1,
      examType: 1,
      // 当前分页
      pageNum: 1,
      // 每页个数
      pageSize: 10,
      // 总数
      total: 0,
      // 上拉加载
      listDataLoading: false,
      // 列表分页全部加载完成
      listDataFinished: false,
      // 下拉刷新
      isPullLoading: false,
      noData: false,
      isNetworkError: false,
      // 证书弹框
      showCertificateDetail: false,
      // 证书数据
      certificateDetail: {},
      // 提交作业是否显示
      isModifyAssignment: false
    };
  },
  computed: {
    header() {
      return {
        title: ["", "考试", "作业", "证书"][this.pageType]
      };
    }
  },
  components: {
    jshHeader,
    classExamsItem,
    classTaskItem,
    classCertificateItem,
    nodataPage,
    networkError,
    jobSubmit
  },
  created() {
    this.pageType = this.$route.query.pageType * 1;
    this.classId = this.$route.query.classId * 1;
    this.getSummary();
    this.onRefresh();
  },
  activated() {
    this.searchType = 1;
    this.examType = 1;
  },
  watch: {
    searchType() {
      this.pageNum = 1;
      this.onRefresh();
    },
    examType() {
      this.pageNum = 1;
      this.onRefresh();
    }
  },
  methods: {
    onRefresh() {
      this.pageNum = 1;
      this.listDataFinished = false;
      this.isPullLoading = true;
      this.tableList = [];
      this.listDataFinished = true;
      this.getExamsAndTaskList();
    },
    changeSearchType(searchType) {
      this.searchType = searchType;
    },
    //列表数据加载方法
    onLoadListData() {
      this.pageNum++;
      this.getExamsAndTaskList();
    },
    // 获取考试和作业汇总
    getSummary() {
      // 证书页面没有汇总
      if (this.pageType === 3) {
        return;
      }
      const owner = this;
      JSH.request({
        url: [
          "",
          CloudMarketing.listClassExamDataSum,
          CloudMarketing.listClassHomeworkDataSum
        ][this.pageType],
        method: "get",
        params: {
          classId: owner.classId
        },
        success(data) {
          if (data.success) {
            owner.summaryData = data.data;
          } else {
            owner.$toast(data.errorMsg);
          }
        },
        error() {}
      });
    },
    // 获取列表数据
    getExamsAndTaskList() {
      const owner = this;
      this.isNetworkError = false;
      JSH.request({
        url: [
          "",
          CloudMarketing.listClassExamDataByClassId,
          CloudMarketing.listClassHomeworkDataByClassId,
          CloudMarketing.listCertificateByClassId
        ][this.pageType],
        method: "post",
        params: {
          classId: owner.classId,
          pageNum: owner.pageNum,
          pageSize: owner.pageSize,
          searchType: owner.searchType,
          homeWorkType: owner.examType,
          examType: owner.examType
        },
        success(data) {
          if (data.success) {
            owner.tableList =
              owner.pageNum === 1
                ? data.data.list
                : owner.tableList.concat(data.data.list);

            owner.tatol = data.data.total;
            owner.listDataFinished = owner.pageNum >= data.data.pages;
          } else {
            owner.listDataFinished = true;
            owner.pageNum = owner.pageNum - 1 || 1;
            owner.$toast(data.errorMsg);
          }
          owner.isPullLoading = false;
          owner.listDataLoading = false;
          owner.noData = !owner.tableList.length;
        },
        error() {
          if (!owner.tableList.length) {
            owner.isNetworkError = true;
          }
          owner.listDataFinished = true;
          owner.pageNum = owner.pageNum - 1 || 1;
          owner.isPullLoading = false;
          owner.listDataLoading = false;
          owner.noData = !owner.tableList.length;
        }
      });
    },
    // 修改作业
    handHomeWork(item) {
      const owner = this;
      owner.isModifyAssignment = true;
      owner.jobObj = {
        courseId: item.courseId,
        homeworkId: item.id,
        homeworkSubmitId: item.homeworkSubmitId,
        classJump: 1,
        type: true
      };
      owner.$nextTick(() => {
        owner.$refs.submit.show(owner.jobObj);
      });
    },
    submitHomeWork(data) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.saveclasshomework,
        method: "post",
        params: data,
        success(res) {
          if (res.data) {
            Toast("提交成功");
            owner.$refs.submit.close();
            owner.isModifyAssignment = false;
            owner.onRefresh();
          } else {
            Toast(res.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    // 展示证书详情
    showCertificate(item) {
      this.showCertificateDetail = true;
      this.certificateDetail = item;
    },
    // 关闭证书详情
    closeCertificate() {
      this.showCertificateDetail = false;
    },
    // 下载证书
    downloadCertificate(url) {
      const owner = this;
      if (owner.isIos) {
        //    苹果系统的跳转方法
        //ios调用方式  nativeRoute是具体的方法名,
        if (window.webkit && window.webkit.messageHandlers) {
          window.webkit.messageHandlers.downloadImg.postMessage(url);
        }
      } else {
        //安卓调用方式  nativeRoute是具体的方法名,
        if (window.collegeNative) {
          window.collegeNative.downloadImg(url);
        }
      }
    }
  }
};
