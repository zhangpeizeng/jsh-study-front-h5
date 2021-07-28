import Vue from "vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import jobSubmit from "@/components/job-submit/job-submit.vue";
import VideoPlayer from "@/components/VideoPlayerTwo";
import documentPreview from "@/components/document-preview/document-preview.vue";
import { UEditorBox } from "@jsh/helper/components";

import {
  Field,
  CellGroup,
  Search,
  Card,
  Button,
  Uploader,
  ActionSheet,
  Switch,
  Popup,
  Loading,
  Overlay,
  ImagePreview,
  Circle,
  Toast
} from "vant";

Vue.use(Field);
Vue.use(CellGroup)
  .use(Search)
  .use(Card)
  .use(Uploader)
  .use(Popup)
  .use(ActionSheet)
  .use(Switch)
  .use(ImagePreview)
  .use(Toast)
  .use(Loading)
  .use(Circle)
  .use(Overlay)
  .use(Button);

export default {
  name: "home",
  components: {
    jshHeader,
    jobSubmit,
    VideoPlayer,
    documentPreview,
    UEditorBox
  },
  data() {
    return {
      //标题栏
      header: {
        title: "作业"
      },
      // 图片水印是否展示
      picWaterMark: false,
      contentWaterMark: false, // 课程内容水印第二行是否展示
      waterMarkList: [], // 水印数组
      isWifi: true,
      getwork: true,
      getpk: true,
      //视频id
      liveId: "",
      //视频播放
      isVideoPlayer: false,
      //作业id
      homeworkId: 1,
      //课程id
      courseId: 1,
      classJump: null,
      //作业提交id
      homeworkSubmitId: 1,
      //上传的内容
      jobObj: {},
      //作业展开收起
      isWork: true,
      //上传进度
      currentRate: 0,
      uploadText: "0%",
      //作业要求展开收起
      isRequirement: true,
      isRequirementFooter: true,
      //是否上传过视频;
      isVideo: false,
      //是否上传过图片
      isMsg: false,
      //是否上传过音频
      isAudio: false,
      //是否上传过文档
      isDoc: false,
      //上传图片的合集
      images: [],
      //上拉框提交作业
      dropDown: false,
      saveHomework: CloudMarketing.saveHomework,
      //pk的展开
      indexPk: [],
      //遮罩开关
      overlay: false,
      //加载的内容
      loadMsg: "提交中...",
      //提交作业详情
      homework: {},
      mediaType: "video",
      submitDetail: CloudMarketing.getHomeworkSubmitDetail,
      //课程详情
      classMsg: {},
      //pk信息
      PKMsg: {},
      jobsub: false,
      msgBox: [],
      VideoBox: [],
      docBox: [],
      AudioBox: [],
      isDocShow: false
    };
  },
  activated() {},
  deactivated() {
    this.isVideoPlayer = false;
    this.$refs.submit.close();
  },
  mounted() {
    if (this.$route.query.isType !== undefined) {
      if (
        this.$route.query.isType === "true" ||
        this.$route.query.isType === true
      ) {
        this.jobsub = true;
        this.$nextTick(() => {
          if (this.classJump) {
            this.jobObj.classJump = 1;
          } else {
            this.jobObj.classJump = 0;
          }
          setTimeout(() => {
            this.$refs.submit.show(this.jobObj);
          }, 1000);
          // this.$refs.submit.show(this.jobObj);
        });
      } else {
        this.$nextTick(() => {
          this.$refs.submit.close();
        });
      }
    }
    setTimeout(() => {
      if (document.getElementById("waterMark").offsetHeight) {
        let height = document.getElementById("waterMark").offsetHeight;
        console.log(height, "高度===================================");
        if (height > 100) {
          this.contentWaterMark = true;
        }
        let num = 1;
        num = parseInt(height / 150);
        if (num > 0) {
          for (let i = 0; i < num; i++) {
            this.waterMarkList.push({ value: this.classMsg.huihuiNumber });
          }
        } else if (num == 0) {
          this.waterMarkList = [{ value: this.classMsg.huihuiNumber }];
        }
        console.log(this.waterMarkList, "哈哈哈哈哈哈");
      }
    }, 4000);
  },
  methods: {
    handleYear(data) {
      let date = new Date(data);
      return date.getFullYear();
    },
    //展开收起
    isShowPk(index) {
      if (this.indexPk.indexOf(index) != -1) {
        return true;
      } else {
        return false;
      }
    },
    //点击占开
    pkShow(index) {
      this.indexPk.push(index);
    },
    // 浏览返回
    backDoc() {
      const owner = this;
      owner.isDocShow = false;
    },
    //点击收起
    pkHide(index) {
      for (let i = 0; i < this.indexPk.length; i += 1) {
        if (Number(this.indexPk[i]) == Number(index)) {
          this.indexPk.splice(i, 1);
          i -= 1;
        }
      }
    },
    //文档预览
    computerFileShow(item) {
      this.isDocShow = true;
      this.$nextTick(() => {
        this.$refs.documentPreview.show({
          liveId: item
        });
      });
    },
    // 视频播放
    videoPlay(item, type) {
      if (type === 1) {
        this.mediaType = "video";
      }
      if (type === 2) {
        this.mediaType = "audio";
      }
      this.liveId = item.value;
      this.isVideoPlayer = true;
    },
    // 初始化展开
    indexPkShow() {
      if (this.PKMsg.homeWorkSubmits != null) {
        for (let i = 0; i < this.PKMsg.homeWorkSubmits.length; i += 1) {
          this.indexPk.push(i);
        }
      }
    },
    //是否 上传过视频图片
    isVideoMsg() {
      if (this.homework.dates != null && this.homework.dates.length > 0) {
        this.homework.dates.forEach(item => {
          if (item.type == 0) {
            this.isMsg = true;
            this.msgBox.push(item);
          }
          if (item.type == 1) {
            this.isVideo = true;
            this.VideoBox.push(item);
          }
          if (item.type == 2) {
            this.isAudio = true;
            this.AudioBox.push(item);
          }
          if (item.type == 3) {
            this.isDoc = true;
            this.docBox.push(item);
          }
        });
      }
    },
    //提交作业
    submit(data) {
      let that = this;
      JSH.request({
        url: that.saveHomework,
        method: "post",
        params: data,
        success(res) {
          if (res.success) {
            Toast("提交成功");
            that.$refs.submit.close();
            that.homeworkSubmitId = res.data;
            if (Number(that.classJump) !== 1) {
              debugger;
              //获取PK详情
              that.getListHomeworkPks();
              //获取课程详情
              that.getCollegeMarketingById();
            }
            //获取作业详情
            that.getWorkAll();
            //获取视频上传的信息
            that.uploadVideoInfo();
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          that.getwork = false;
          that.getpk = false;
          that.isWifi = false;
        }
      });
    },
    // 获取作业详情
    getWorkAll() {
      const that = this;
      if (that.homeworkSubmitId == null) {
        that.homeworkSubmitId = "";
      }
      JSH.request({
        url: that.submitDetail,
        method: "get",
        params: {
          homeworkSubmitId: that.homeworkSubmitId,
          homeworkId: that.homeworkId
        },
        success(res) {
          if (res.success) {
            that.homework = res.data;
            //是否上传过图片视频
            that.isVideoMsg();
            that.getwork = false;
            that.isWifi = true;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          that.getwork = false;
          that.getpk = false;
          that.isWifi = false;
        }
      });
    },
    // 获取pk墙详情
    getListHomeworkPks() {
      let that = this;
      JSH.request({
        url: CloudMarketing.listHomeworkPks,
        method: "get",
        params: {
          homeworkId: that.homeworkId
        },
        success(res) {
          if (res.success) {
            if (res.data == null) {
              that.PKMsg = [];
            } else {
              that.PKMsg = res.data;
              //初始化pk展开
              that.indexPkShow();
            }
            that.getpk = false;
            that.isWifi = true;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          that.getwork = false;
          that.getpk = false;
          that.isWifi = false;
        }
      });
    },
    //无网络刷新
    wifiGo() {
      this.isVideoPlayer = false;
      this.getwork = true;
      this.getpk = true;
      this.isMsg = false;
      this.isVideo = false;
      this.isDoc = false;
      this.isAudio = false;
      if (this.$route.query.homeworkId !== undefined) {
        this.homeworkId = this.$route.query.homeworkId;
      }
      if (this.$route.query.courseId !== undefined) {
        this.courseId = this.$route.query.courseId;
      }
      if (this.$route.query.homeworkSubmitId !== undefined) {
        this.homeworkSubmitId = this.$route.query.homeworkSubmitId;
      }
      this.jobObj = {
        courseId: this.courseId,
        homeworkId: this.homeworkId
      };
      setTimeout(() => {
        if (this.$route.query.isType !== undefined) {
          if (this.$route.query.isType == true) {
            this.jobsub = true;
            this.$nextTick(() => {
              if (this.classJump) {
                this.jobObj.classJump = 1;
              } else {
                this.jobObj.classJump = 0;
              }
              this.$refs.submit.show(this.jobObj);
            });
          } else {
            this.$refs.submit.close();
          }
        }
      }, 500);
      setTimeout(() => {
        //获取PK详情
        this.getListHomeworkPks();
        //获取课程详情
        this.getCollegeMarketingById();
        //获取作业详情
        this.getWorkAll();
        //获取视频上传的信息
        this.uploadVideoInfo();
      }, 500);
    },
    //获取视频上传的信息
    uploadVideoInfo() {
      let that = this;
      JSH.request({
        url: CloudMarketing.getUploadVideoInfo,
        method: "get",
        success(res) {
          if (res.success) {
            //发送
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          that.getwork = false;
          that.getpk = false;
          that.isWifi = false;
        }
      });
    },
    //vant 图片预览一张
    sceneImgOne(url) {
      let owner = this;
      owner.picWaterMark = true;
      ImagePreview({
        images: [url], //需要预览的图片 URL 数组
        showIndex: false, //是否显示页码
        loop: false, //是否开启循环播放
        startPosition: 0, //图片预览起始位置索引
        closeOnPopstate: true,
        onClose() {
          owner.picWaterMark = false;
        }
      });
    },
    //关闭交作业1111
    closeWork() {
      this.jobsub = false;
    },
    //交作业
    workjob() {
      this.jobsub = true;
      if (this.classJump) {
        this.jobObj.classJump = 1;
      } else {
        this.jobObj.classJump = 0;
      }
      this.$nextTick(() => {
        this.$refs.submit.show(this.jobObj);
      });
    },
    //获取课程详情
    getCollegeMarketingById() {
      let that = this;
      JSH.request({
        url: CloudMarketing.getCourseDetail,
        method: "get",
        params: {
          id: that.courseId
        },
        success(res) {
          if (res.success) {
            that.classMsg = res.data;
            that.isWifi = true;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          that.getwork = false;
          that.getpk = false;
          that.isWifi = false;
        }
      });
    }
  },
  created() {
    this.isVideoPlayer = false;
    this.getwork = true;
    this.getpk = true;
    this.isMsg = false;
    this.isVideo = false;
    this.isDoc = false;
    this.isAudio = false;
    if (this.$route.query.homeworkId !== undefined) {
      this.homeworkId = this.$route.query.homeworkId;
    }
    if (this.$route.query.courseId !== undefined) {
      this.courseId = this.$route.query.courseId;
    }
    if (this.$route.query.homeworkSubmitId !== undefined) {
      this.homeworkSubmitId = this.$route.query.homeworkSubmitId;
    }
    this.jobObj = {
      courseId: this.courseId,
      homeworkId: this.homeworkId
    };
    this.classJump = this.$route.query.classJump;
    setTimeout(() => {
      //获取PK详情
      if (!this.classJump) {
        this.getListHomeworkPks();
        //获取课程详情
        this.getCollegeMarketingById();
      } else {
        this.submitDetail = CloudMarketing.getClassHomeworkSubmitDetail;
        this.saveHomework = CloudMarketing.saveclasshomework;
      }

      //获取作业详情
      this.getWorkAll();
      //获取视频上传的信息
      this.uploadVideoInfo();
    }, 500);
  }
};
