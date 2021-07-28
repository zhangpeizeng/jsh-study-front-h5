import Vue from "vue";
import { Col, Row, Button, Toast, Swipe, Dialog } from "vant";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import courseRecommend from "@/components/course-recommend/course-recommend.vue";
import courseDetailFoot from "@/components/course-detail/course-detail-foot/course-detail-foot.vue";
import lecturerPopup from "@/components/course-detail/lecturer-popup/lecturer-popup.vue";
import progressPopup from "@/components/course-detail/progress-popup/progress-popup.vue";
import jobSubmit from "@/components/job-submit/job-submit.vue";
import homeworkLearning from "@/components/homework-learning/homework-learning.vue";
import productDetail from "@/components/product-detail/product-detail.vue";
import JSH from "@/core";
import { CloudMarketing } from "@/request";
import VideoPlayer from "@/components/VideoPlayer";
import netWorkImg from "@/assets/images/network.png";
import { UEditorBox } from "@jsh/helper/components";

Vue.use(Col);
Vue.use(Row);
Vue.use(Button);
Vue.use(Swipe);
Vue.use(Toast);
Vue.use(Dialog);

export default {
  name: "recordedCourse",
  components: {
    jshHeader,
    courseDetailFoot,
    lecturerPopup,
    VideoPlayer,
    jobSubmit,
    progressPopup,
    homeworkLearning,
    courseRecommend,
    productDetail,
    UEditorBox
  },
  data() {
    return {
      i: 0,
      isReport: true, //防止重复上报
      productCode: "", //商品编码
      recommendList: [],
      //标题栏
      header: {
        title: "课程详情",
        backType: true
      },
      contentWaterMark: false, // 课程内容水印第二行是否展示
      waterMarkList: [], // 水印数组
      id: "",
      sourceId: "", // 系列课的id
      detailObj: {}, // 详情对象
      lecturerObj: {}, // 讲师
      sysCourseList: [],
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
      nowTime: "",
      modify: true,
      testName: "",
      testUrl: "",
      testShowStatus: false,
      taskShowStatus: false,
      pkShowStatus: false,
      videoshow: false,
      mediaObj: {
        liveList: [],
        mp4List: [],
        textList: []
      },
      jobObj: {},
      signUpStatus: false, // 报名状态
      docViewFlag: true, // 文档是否展示
      productDetailFlag: true, //商品信息是否展示
      intervalTimeOne: "120", // 轮寻时间
      vidsetIntervalOne: null, // 轮寻定时器
      firstRound: true, // 轮寻标识
      isBottom: false, // 课程内容是否滑动看完
      isNowPage: false, // 让课程简介上报轮寻只能在当页生效
      viewurl: null,
      isNetwork: false,
      netWorkImg: netWorkImg,
      videoPlayFlag: true,
      videoshowto: false, //视频加载
      courseImg: "", //封面地址
      tableList: [],
      evaluateTotal: 0,
      reviewStatus: 0,
      yuanRate: 0,
      rate: 0,
      mediaFlag: true, // 切换标识
      mediaList: [], // 视频音频文档总list
      mediaItem: {}, // 视频音频文档单个对象
      mediaId: "", // 记录点击的媒体id
      autoPlay: false //第一次进来不自动播放
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
    // 视频播放
    videoPlay(item) {
      const owner = this;
      owner.videoPlayFlag = false;
      owner.mediaList.forEach(value => {
        if (item.liveId === value.liveId) {
          value.isVideoPlay = true;
        }
      });
    },
    // 视频暂停
    videoPause() {
      const owner = this;
      owner.videoPlayFlag = true;
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
          that.getCourseDetail(that.id, true);
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
    //商品点击数
    reporting(code) {
      JSH.request({
        url: CloudMarketing.updateProductClickCount,
        method: "post",
        params: {
          baseId: this.id,
          productCode: code
        },
        success(data) {
          if (data.success) {
            console.log("1");
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
    //商品信息
    toDetail(item) {
      window.removeEventListener("scroll", this.getScroll1, true);
      const owner = this;
      // gio统计--参考素材
      setTimeout(() => {
        window.gio("track", "reference_material", {
          course_name: owner.detailObj.courseName, // 课程名称
          goods_name: item.itemName, // 商品名称
          goods_no: item.productCode, // 商品编码
          student_id: owner.detailObj.huihuiNumber, // 学员学号
          student_name: localStorage.getItem("accountName") // 学员名称
        });
      }, 50);
      this.reporting(item.productCode);
      this.productCode = item.productCode;
      this.productDetailFlag = false;
      // this.$router.push({
      //   path: "/public/productCenterDetails",
      //   query: {
      //     productCode: item.productCode
      //   }
      // });
    },
    toProgress() {
      this.$refs.progressPopup.initData(1);
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
    gotoSeriseCourse(item) {
      const owner = this;
      if (owner.detailObj.studyStartTime && owner.detailObj.studyEndTime) {
        if (owner.nowTime < owner.detailObj.studyStartTime) {
          Toast("学习未开始");
          return;
        }
        if (owner.nowTime > owner.detailObj.studyEndTime) {
          Toast("哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程");
          return;
        }
      }
      owner.$router.push({
        path: "series-course",
        query: {
          id: item.baseId
        }
      });
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
            owner.getCourseDetail(owner.detailObj.id, false);
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    // 浏览返回
    backDoc() {
      window.addEventListener("scroll", this.getScroll1, true);
      const owner = this;
      owner.docViewFlag = true;
      owner.getRecordedInfo(owner.detailObj.id, false);
    },
    // 浏览返回
    backProduct() {
      window.addEventListener("scroll", this.getScroll1, true);
      const owner = this;
      owner.productDetailFlag = true;
    },
    // 文档浏览
    gotoView(item) {
      window.removeEventListener("scroll", this.getScroll1, true);
      const owner = this;
      owner.docViewFlag = false;
      let params = {
        name: item.liveName,
        baseId: owner.id,
        coursesType: 1,
        progress: item.progress,
        liveId: item.liveId,
        sourceId: owner.sourceId
      };
      owner.$nextTick(() => {
        owner.$refs.learning.show(params);
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
      window.removeEventListener("scroll", this.getScroll1, true);
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
            // owner.$refs.submit.againTrigger = false;
            window.addEventListener("scroll", this.getScroll1, true);
            owner.getCourseDetail(owner.detailObj.id, false);
          } else {
            Toast(res.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    closeHomeWork() {
      // 关闭作业弹窗重新添加滚动监听
      window.addEventListener("scroll", this.getScroll1, true);
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
            owner.getCourseDetail(owner.detailObj.id, false);
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
    attributionQry(id) {
      const owner = this;
      //查询归属系列课
      JSH.request({
        url: CloudMarketing.attributionQry,
        method: "get",
        params: { id: id },
        success(res) {
          if (res.success) {
            owner.sysCourseList = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    // 获取上报间隔
    getPlaytime() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getaccountinfo,
        method: "get",
        success(resp) {
          if (resp.success) {
            owner.intervalTimeOne = resp.data.intervalTime
              ? resp.data.intervalTime
              : 120;
            owner.vidsetIntervalOne = setInterval(() => {
              console.log(owner.isNowPage + "这里是轮寻内");
              if (owner.isNowPage) {
                if (owner.isBottom) {
                  owner.report(1);
                } else {
                  owner.report(2);
                }
              }
            }, owner.intervalTimeOne * 1000);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    //上报
    report(type) {
      const owner = this;
      if (!owner.isReport) {
        return;
      }
      owner.isReport = false;
      let flag;
      let time;
      if (type === 3) {
        flag = 1;
        time = 1;
      } else {
        flag = type;
        time = owner.intervalTimeOne;
      }
      JSH.request({
        url: CloudMarketing.savestudyprogress,
        method: "post",
        params: {
          baseId: owner.id, // 课程id
          coursesType: 1, // 课程类型
          liveType: 4, // 文档类型 4 是课程简介
          stayTime: time, // 学习时长
          studyTime: time, // 停留时长
          flag: flag, // 1- 已看完 2-未看完
          sourceId: owner.sourceId // 课程id
        },
        success(res) {
          if (res.success) {
            if (res.data) {
              owner.isReport = true;
              console.log("学习完成");
            }
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    // 查询直播/录播视频文档信息
    getRecordedInfo(id, flag) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getRecordedInfo,
        method: "get",
        params: { baseId: id },
        success(res) {
          if (res.success) {
            owner.mediaObj = res.data;
            owner.mediaList = [];
            let mediaList = [];
            if (owner.mediaObj.liveList.length > 0) {
              mediaList = mediaList.concat(owner.mediaObj.liveList);
            }
            if (owner.mediaObj.mp4List.length > 0) {
              mediaList = mediaList.concat(owner.mediaObj.mp4List);
            }
            if (owner.mediaObj.textList.length > 0) {
              mediaList = mediaList.concat(owner.mediaObj.textList);
            }
            mediaList.forEach(value => {
              owner.$set(value, "selected", false); // 是都选中当前
              owner.$set(value, "mediaType", ""); // 媒体类型
              owner.$set(value, "isVideoPlay", false); // 是否正在播放
              if (value.liveType === "1") {
                value.mediaType = "video";
              } else if (value.liveType === "2") {
                value.mediaType = "audio";
              }
            });
            // 初始化进页面赋值tabFlag
            if (flag) {
              owner.mediaItem = mediaList[0];
              mediaList[0].selected = true;
              // mediaList[0].isVideoPlay = true;
            } else {
              mediaList.forEach(value => {
                if (owner.mediaId == value.liveId) {
                  value.selected = true;
                  value.isVideoPlay = true;
                }
              });
            }
            owner.mediaList = mediaList;
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
    getCourseDetail(id, flag) {
      const owner = this;
      // owner.$loading.show(5000);
      this.ht.$emit("loading", true);
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
            let value = res.data.courseImg ? res.data.courseImg : "";
            if (value && value !== "") {
              let index = value.lastIndexOf(".");
              if (index < 0 || value.length - index > 5) {
                console.log(value);
              } else {
                let start = value.substring(0, index);
                let end = value.substring(index, value.length);
                owner.courseImg = start + "_w300" + end;
              }
            }
            console.log("++++", owner.courseImg);
            owner.getlecturerInfo(detailObj.id);
            owner.attributionQry(detailObj.id);
            owner.getRecordedInfo(detailObj.id, flag);
            owner.getSignUpStatus(detailObj.id);
            owner.$nextTick(() => {
              owner.header.title = "课程详情";
              setTimeout(() => {
                owner.noScroll();
                owner.startRound();
              }, 10000);
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
            Toast(res.errorMsg);
            // owner.$loading.hide();
            owner.ht.$emit("loading", false);
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
    mediaChange() {
      this.mediaFlag = !this.mediaFlag;
    },
    // 媒体list点击事件
    mediaClick(item) {
      const owner = this;
      owner.autoPlay = true;
      owner.mediaList.forEach(value => {
        value.selected = false;
        value.isVideoPlay = false;
      });
      owner.mediaItem = item;
      owner.mediaId = item.liveId;
      item.selected = true;
      item.isVideoPlay = true;
      if (this.$refs.videoRef && this.$refs.videoRef.length > 0) {
        this.$refs.videoRef[0].play();
      }
    },
    videoEnded(data) {
      const owner = this;
      owner.autoPlay = true;
      owner.mediaList.forEach((item, index) => {
        if (data.liveId === item.liveId) {
          this.mediaClick(owner.mediaList[index + 1]);
        }
      });
      this.$forceUpdate();
    },
    // 开始播放
    startPlay(item) {
      item.isVideoPlay = true;
    },
    // 开启课程内容的轮寻
    startRound() {
      const owner = this;
      // 课程简介必须有值再上报
      if (owner.detailObj && owner.detailObj.content && owner.signUpStatus) {
        //写后台加载数据的函数
        if (owner.firstRound) {
          owner.firstRound = false;
          owner.getPlaytime();
        }
      }
    },
    noScroll() {
      const owner = this;
      // 没有滚动条
      if (
        document.body.scrollHeight ==
        (window.innerHeight || document.documentElement.clientHeight)
      ) {
        // 课程简介必须有值再上报
        if (owner.detailObj && owner.detailObj.content && owner.signUpStatus) {
          //写后台加载数据的函数
          if (owner.firstRound) {
            owner.firstRound = false;
            owner.report(1); // 直接上报已学完
          }
        }
      }
    },
    //滚动监听
    getScroll1() {
      const owner = this;
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      //变量windowHeight是可视区的高度
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //变量scrollHeight是滚动条的总高度
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      var courseHeight = 0;
      if (owner.recommendList.length > 0) {
        courseHeight = document.getElementById("courseRef").offsetHeight;
      }
      // //滚动条到底部的条件(给40px误差)
      if (
        scrollTop + windowHeight >=
          scrollHeight -
            50 -
            document.getElementById("LeaveRef").offsetHeight -
            courseHeight &&
        scrollTop + windowHeight <=
          scrollHeight -
            10 -
            document.getElementById("LeaveRef").offsetHeight -
            courseHeight
      ) {
        console.log(scrollTop + windowHeight + "aaaaaa");
        console.log(
          scrollHeight -
            50 -
            document.getElementById("LeaveRef").offsetHeight -
            courseHeight +
            "bbbb"
        );
        console.log(scrollHeight);
        if (owner.detailObj && owner.detailObj.content && owner.signUpStatus) {
          owner.isBottom = true;
          setTimeout(() => {
            owner.report(3); // 直接上报已学完
          }, 200);
        }
      }
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
      owner.getCourseDetail(owner.id, false);
    },
    // 获取视频转码状态
    getvideotask(item) {
      const owner = this;
      this.videoshowto = true;
      JSH.request({
        url: CloudMarketing.gettranscodetaskinfo,
        method: "get",
        params: {
          taskId: item.taskId
        },
        success(resp) {
          owner.videoshowto = false;
          if (resp.data) {
            item.transcodingStatus = true;
          }
        },
        error(e) {
          owner.videoshowto = false;
          console.log(e);
        }
      });
    }
  },
  destroyed() {
    const owner = this;
    // 清除定时器
    clearInterval(owner.vidsetIntervalOne);
    window.removeEventListener("scroll", this.getScroll1, true);
    owner.isNowPage = false;
  },
  mounted() {
    // 轮播监听
    window.addEventListener("scroll", this.getScroll1, true);
    setTimeout(() => {
      if (
        document.getElementById("waterMark") &&
        document.getElementById("waterMark").offsetHeight
      ) {
        let height = document.getElementById("waterMark").offsetHeight;
        console.log(height, "高度===================================");
        if (height > 100) {
          this.contentWaterMark = true;
        }
        let num = 1;
        num = parseInt(height / 170);
        if (num > 0) {
          for (let i = 0; i < num; i++) {
            this.waterMarkList.push({ value: this.detailObj.huihuiNumber });
          }
        } else if (num == 0) {
          this.waterMarkList = [{ value: this.detailObj.huihuiNumber }];
        }
        console.log(this.waterMarkList, "哈哈哈哈哈哈");
      }
    }, 4000);
  },
  deactivated() {
    const owner = this;
    // 清除定时器
    clearInterval(owner.vidsetIntervalOne);
    window.removeEventListener("scroll", this.getScroll1, true);
    owner.isNowPage = false;
  },
  created() {
    const owner = this;
    owner.getNowDateTime();
    owner.isNowPage = true; // 解决销毁页面轮寻内的方法依旧触发的问题
    owner.id = owner.$route.query.id;
    owner.viewurl = owner.$route.query.viewurl
      ? owner.$route.query.viewurl
      : null;
    if (owner.$route.query.sourceId) {
      owner.sourceId = owner.$route.query.sourceId;
    } else {
      owner.sourceId = owner.id;
    }
    owner.getReviewList();
  }
};
