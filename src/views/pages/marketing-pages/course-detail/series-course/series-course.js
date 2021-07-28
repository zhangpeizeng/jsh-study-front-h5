import Vue from "vue";
import { Col, Row, Button, Toast, Image as VanImage, Dialog } from "vant";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import courseRecommend from "@/components/course-recommend/course-recommend.vue";
import courseDetailFoot from "@/components/course-detail/course-detail-foot/course-detail-foot.vue";
import lecturerPopup from "@/components/course-detail/lecturer-popup/lecturer-popup.vue";
import progressPopup from "@/components/course-detail/progress-popup/progress-popup.vue";
import jobSubmit from "@/components/job-submit/job-submit.vue";
import JSH from "@/core";
import { CloudMarketing } from "@/request";
import { UEditorBox } from "@jsh/helper/components";

Vue.use(Col);
Vue.use(Row);
Vue.use(Button);
Vue.use(Toast);
Vue.use(VanImage);
Vue.use(Dialog);

export default {
  name: "seriesCourse",
  components: {
    courseRecommend,
    jshHeader,
    courseDetailFoot,
    lecturerPopup,
    jobSubmit,
    progressPopup,
    UEditorBox
  },
  data() {
    return {
      recommendList: [],
      //标题栏
      header: {
        title: "课程详情",
        backType: true
      },
      id: "",
      detailObj: {}, // 详情对象
      lecturerObj: {}, // 讲师
      // 下拉刷新加载
      isPullLoading: false,
      //列表数据加载
      listDataLoading: false,
      // 列表数据加载完成
      listDataFinished: true,
      // 分页
      page: 0,
      // 列表数据
      list: [],
      classList: [],
      nowTime: "",
      testUrl: "",
      testShowStatus: false,
      taskShowStatus: false,
      pkShowStatus: false,
      jobObj: {},
      signUpStatus: false, // 报名状态
      viewurl: null,
      isNetwork: false,
      modify: true,
      tableList: [],
      evaluateTotal: 0,
      reviewStatus: 0,
      yuanRate: 0,
      rate: 0
    };
  },
  methods: {
    handleYear(data) {
      let date = new Date(data);
      return date.getFullYear();
    },
    getListLength(data) {
      this.recommendList = data;
    },
    gernerateId: function(index) {
      return "company_" + index;
    },
    removeClass(item) {
      let styleContent = document.getElementById("lypl" + item.id);
      styleContent.style.cssText = "display: block;overflow:inherit";
    },
    // 评价列表
    toEvaluate() {
      this.$router.push({
        path: "/public/courseEvaluation",
        query: {
          id: this.id
        }
      });
    },
    // 获取列表数据
    getReviewList() {
      const that = this;
      JSH.request({
        url: CloudMarketing.listappreviews,
        method: "post",
        params: {
          pageNum: 1,
          pageSize: 5,
          baseId: that.id
        },
        success(data) {
          if (data.success) {
            if (data.data.reviewList) {
              that.tableList = data.data.reviewList;
            }
            that.evaluateTotal = data.data.total;
            that.tableList.forEach(item => {
              item.isClick = true;
              item.isShow = false;
            });
            setTimeout(() => {
              that.tableList.forEach((item, index) => {
                let o = document.getElementById("company_" + index);
                if (!o) {
                  item.iswidth = false;
                  return;
                }
                let w = o.clientWidth || o.offsetWidth;
                if (w > 299) {
                  item.iswidth = true;
                } else {
                  item.iswidth = false;
                }
              });
            }, 1500);
            that.yuanRate = Number(data.data.averageGrade).toFixed(1);
            that.rate = that.getStarNum(data.data.averageGrade);
            Toast.clear();
          } else {
            Toast(data.errorMsg);
            setTimeout(() => {
              Toast.clear();
            }, 1000);
          }
          that.getCourseDetail(that.id);
        },
        error(e) {
          console.error(e);
          Toast("接口异常");
        }
      });
    },
    /**
     * 是否展示公司提示信息
     * @param index
     */
    checkTip(index) {
      this.tableList.forEach((item, i) => {
        if (index !== i) {
          item.isShow = false;
        }
      });
      if (this.tableList[index].isShow) {
        this.tableList[index].isShow = false;
      } else {
        this.tableList[index].isShow = true;
      }
      this.$forceUpdate();
    },
    likeClick(item, index) {
      if (item.isClick) {
        this.tableList[index].isClick = false;
        // 取消点赞
        if (item.likeStatus == 0) {
          this.tableList[index].likeStatus = 1;
          this.tableList[index].likeNum -= 1;
          this.like(2, index, item);
        } else {
          // 点赞
          this.tableList[index].likeStatus = 0;
          this.tableList[index].likeNum += 1;
          this.like(1, index, item);
        }
      }
    },
    // 获取平均星星数量
    getStarNum(nums) {
      const num = Number(nums);
      if (num <= 1) {
        return 1;
      }
      if (num > 1 && num <= 2) {
        return 2;
      }
      if (num > 2 && num <= 3) {
        return 3;
      }
      if (num > 3 && num <= 4) {
        return 4;
      }
      if (num > 4 && num <= 5) {
        return 5;
      }
    },
    // 点赞
    like(type, index, item) {
      const that = this;
      JSH.request({
        url: CloudMarketing.addreviewslike,
        method: "post",
        params: {
          status: type,
          reviewId: item.reviewId
        },
        success(data) {
          if (data.success) {
            if (data.data) {
              that.tableList[index].isClick = true;
            }
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
          Toast("接口异常");
        }
      });
    },
    comments(data) {
      const owner = this;
      console.log(111111);
      console.log(data);
      data.baseId = this.id;
      JSH.request({
        url: CloudMarketing.addreviews,
        method: "post",
        params: data,
        success(res) {
          if (res.success) {
            Toast("新增评价成功");
            owner.$router.push({
              path: "/public/courseEvaluation",
              query: {
                id: owner.id,
                type: true
              }
            });
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    footButton(status) {
      const owner = this;
      if (status == 1) {
        // 立即预约
        Dialog.confirm({
          title: "确定预约提醒此课程",
          message: "本课程将于开课前2小时短信提醒"
        })
          .then(() => {
            owner.toStudy(3);
          })
          .catch(() => {});
      } else if (status == 6) {
        // 立即报名
        owner.toStudy(2);
      } else if (status == 8) {
        // 加入学习
        owner.toStudy(1);
      }
    },
    toView() {
      this.$refs.lecturerPopup.initData(this.lecturerObj);
    },
    toProgress() {
      this.$refs.progressPopup.initData(4);
    },
    //去考试
    goToExam() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getexamurl,
        method: "get",
        params: {
          baseId: owner.detailObj.id,
          examJoinid: owner.detailObj.examJoinid,
          type: 1
        },
        success(res) {
          if (res.success) {
            owner.testUrl = res.data;
            owner.$router.push({
              path: "/public/examQuestions",
              query: {
                testUrl: owner.testUrl
              }
            });
          } else {
            Toast(res.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    // 跳转课时详情
    gotoClassDetail(item) {
      const owner = this;
      if (!owner.signUpStatus) {
        Toast("先报名才可以学习内容哦~");
        return;
      }
      if (item.studyStartTime && item.studyEndTime) {
        if (owner.nowTime < item.studyStartTime) {
          Toast("学习未开始");
          return;
        }
        if (owner.nowTime > item.studyEndTime) {
          Toast("哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程");
          return;
        }
      }
      // 0 未删除 1已删除
      if (item.deleteFlg == 0) {
        // 自建课时
        if (item.type == "1") {
          owner.$router.push({
            path: "class-detail",
            query: {
              id: item.id,
              courseImg: JSON.stringify(owner.detailObj.courseImg)
            }
          });
        } else if (item.type == "2") {
          // 引用课时
          let path = "";
          if (item.courseType == "1") {
            path = "recorded-course";
          } else if (item.courseType == "2") {
            path = "live-course";
          } else if (item.courseType == "3") {
            path = "discussion-course";
          }
          owner.$router.push({
            path: path,
            query: {
              id: item.id
            }
          });
        }
      } else {
        Toast("哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程");
      }
    },
    toStudy(type) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.toStudy,
        method: "post",
        params: { type: type, baseId: owner.detailObj.id },
        success(res) {
          if (res.success) {
            if (type == 1) {
              Toast("已加入到任务-【待学习】");
            } else if (type == 2) {
              Toast("报名成功");
            } else if (type == 3) {
              Toast("预约成功");
            }
            owner.getCourseDetail(owner.detailObj.id);
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    // 跳转到作业详情
    gotoHomeWork() {
      const owner = this;
      owner.$router.push({
        path: "taskDetails",
        query: {
          homeworkId: owner.detailObj.taskId,
          courseId: owner.detailObj.id,
          homeworkSubmitId: owner.detailObj.taskSubmitId
        }
      });
    },
    // 交作业
    handHomeWork(type) {
      const owner = this;
      // 提交作业
      if (type === 1 && owner.detailObj.id && owner.detailObj.taskId) {
        owner.jobObj = {
          courseId: owner.detailObj.id,
          homeworkId: owner.detailObj.taskId
        };
        owner.$refs.submit.show(owner.jobObj);
      }
      // 修改作业
      if (
        type === 2 &&
        owner.detailObj.id &&
        owner.detailObj.taskId &&
        owner.detailObj.taskSubmitId
      ) {
        owner.jobObj = {
          courseId: owner.detailObj.id,
          homeworkId: owner.detailObj.taskId,
          homeworkSubmitId: owner.detailObj.taskSubmitId,
          type: true
        };
        owner.$refs.submit.show(owner.jobObj);
      }
    },
    submitHomeWork(data) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.saveHomework,
        method: "post",
        params: data,
        success(res) {
          if (res.data) {
            Toast("提交成功");
            owner.$refs.submit.close();
            owner.$refs.submit.againTrigger = false;
            owner.getCourseDetail(owner.detailObj.id);
          } else {
            Toast(res.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    // 参与PK
    updatePkStatus() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.updatePkStatus,
        method: "get",
        params: { homeworkId: owner.detailObj.taskId },
        success(res) {
          if (res.success) {
            Toast("参与PK成功");
            owner.getCourseDetail(owner.detailObj.id);
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    getlecturerInfo(id) {
      const owner = this;
      //获取讲师介绍
      JSH.request({
        url: CloudMarketing.getlecturerInfo,
        method: "get",
        params: { baseId: id, type: "APP" },
        success(res) {
          if (res.success) {
            owner.lecturerObj = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    getSeriesCoursesList(id) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getSeriesCoursesList,
        method: "get",
        params: {
          id: id
        },
        success(res) {
          if (res.success) {
            owner.classList = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    // 获取当前课程是否报名
    getSignUpStatus(id) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getSignUpStatus,
        method: "get",
        params: { baseId: id },
        success(res) {
          if (res.success) {
            owner.signUpStatus = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    getCourseDetail(id) {
      const owner = this;
      // owner.$loading.show(5000);
      owner.ht.$emit("loading", true);
      //获取课程详情
      JSH.request({
        url: CloudMarketing.getCourseDetail,
        method: "get",
        params: {
          id: id
        },
        success(res) {
          owner.isNetwork = false;
          if (res.success) {
            // owner.$loading.hide();
            owner.ht.$emit("loading", false);
            owner.getNowDateTime();
            if (res.data.isQualified == 0) {
              if (res.data.taskEndTime) {
                if (Number(res.data.taskEndTime) < Number(owner.nowTime)) {
                  owner.modify = false;
                }
              } else {
                owner.modify = true;
              }
            } else {
              owner.modify = false;
            }
            let detailObj = res.data;
            owner.reviewStatus = res.data.reviewStatus;
            owner.getlecturerInfo(detailObj.id);
            owner.getSeriesCoursesList(detailObj.id);
            owner.getSignUpStatus(detailObj.id);
            owner.$nextTick(() => {
              owner.$refs.courseDetailFoot.initData({
                status: detailObj.status,
                isComment: owner.reviewStatus,
                evaluateTotal: owner.evaluateTotal
              });
              if (detailObj.testStatus == 1) {
                if (
                  owner.nowTime > detailObj.testStartTime &&
                  owner.nowTime < detailObj.testEndTime
                ) {
                  owner.testShowStatus = true;
                }
              }
              if (detailObj.taskStatus == 1) {
                if (
                  owner.nowTime > detailObj.taskStartTime &&
                  owner.nowTime < detailObj.taskEndTime
                ) {
                  owner.taskShowStatus = true;
                }
                // 没有作业时间
                if (!detailObj.taskStartTime && !detailObj.taskEndTime) {
                  owner.taskShowStatus = true;
                }
              }
              if (detailObj.pkStatus == 1) {
                if (
                  owner.nowTime > detailObj.pkStartTime &&
                  owner.nowTime < detailObj.pkEndTime
                ) {
                  owner.pkShowStatus = true;
                }
                // 没有PK时间
                if (!detailObj.pkStartTime && !detailObj.pkEndTime) {
                  owner.pkShowStatus = true;
                }
              }
            });
            owner.detailObj = detailObj;
          } else {
            // owner.$loading.hide();
            owner.ht.$emit("loading", false);
            Toast(res.errorMsg);
          }
        },
        error() {
          // owner.$loading.hide();
          owner.ht.$emit("loading", false);
          owner.isNetwork = true;
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
            owner.nowTime = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    gobackto() {
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
    refreshClick() {
      const owner = this;
      owner.getNowDateTime();
      owner.getCourseDetail(owner.id);
    }
  },
  created() {
    const owner = this;
    owner.id = owner.$route.query.id;
    owner.viewurl = owner.$route.query.viewurl
      ? owner.$route.query.viewurl
      : null;
    owner.getNowDateTime();
    owner.getReviewList();
    document.addEventListener(
      "click",
      function() {
        owner.tableList.forEach(item => {
          item.isShow = false;
        });
        owner.$forceUpdate();
      },
      false
    );
  }
};
