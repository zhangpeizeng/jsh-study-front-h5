import Vue from "vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import {
  CellGroup,
  ActionSheet,
  Icon,
  Sidebar,
  PullRefresh,
  List,
  Toast,
  ImagePreview
} from "vant";

Vue.use(CellGroup)
  .use(ActionSheet)
  .use(PullRefresh)
  .use(Sidebar)
  .use(Toast)
  .use(ImagePreview)
  .use(List)
  .use(Icon);
import jshHeader from "@/components/jsh-header/jsh-header.vue";
export default {
  name: "homeworkLearning",
  components: { jshHeader },
  props: {
    huihuiNumber: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      isReport: true, //防止重复上报
      //标题栏
      header1: {
        title: "",
        backType: true
      },
      isshow: true,
      //上拉加载状态结束
      finished: false,
      //上拉加载状态
      isFinished: false,
      // 图片合集
      workList: [],
      //当前页数
      page: 0,
      //总条数
      pageCount: 1,
      //是否阅读完
      isOk: false,
      // 超时定时器
      overTimer: null,
      // 是否超时
      isOvertime: false,
      //页面停留时间
      timeStudy: 0,
      //定时器
      ting: null,
      //标识
      etag: "474F8F20F403CA77CDCBC79CBE3B4219",
      baseId: "",
      liveId: "",
      sourceId: "",
      name: "",
      coursesType: "",
      progress: "",
      isMax: true,
      vidsetInterval: null,
      intervalTime: "120",
      imgShow: false,
      startIndex: 0
    };
  },
  methods: {
    // 预览图片滑动切换触发
    onChange(index) {
      if (index + 1 == this.page) {
        this.page++;
        this.getPage();
        this.startIndex = index;
        if (index + 1 == this.pageCount) {
          this.report(3); // 到最后一张图片上报已学完
        }
      } else if (index + 1 == this.pageCount) {
        // 如果直接点开最后一页也进行上报
        this.report(3); // 到最后一张图片上报已学完
      }
    },
    // 预览图片关闭触发定位位置
    onClose(imgobj) {
      console.log(imgobj);
      if (imgobj.index !== 0) {
        document.documentElement.scrollTop =
          document.getElementById("imgdoc" + imgobj.index).offsetTop -
          document.getElementById("imgdoc" + imgobj.index).offsetHeight / 2;
      } else {
        document.documentElement.scrollTop = 0;
      }
      console.log(document.documentElement.scrollTop);
    },
    //上拉加载
    onLoad() {
      console.log(this.page);
      this.page++;
      this.isFinished = true;
      if (this.isMax) {
        this.getPage();
      } else {
        if (this.page > this.pageCount) {
          this.finished = true;
        } else {
          this.getMsg();
        }
      }
    },
    //滚动监听
    getScrollDoc() {
      const owner = this;
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollHeight == 0) {
        this.isOk = true;
      } else {
        if (this.finished) {
          //变量scrollTop是滚动条滚动时，距离顶部的距离
          var scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
          //变量windowHeight是可视区的高度
          var windowHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
          //变量scrollHeight是滚动条的总高度
          //滚动条到底部的条件
          setTimeout(() => {
            if (scrollTop + windowHeight >= scrollHeight - 300) {
              //写后台加载数据的函数
              this.isOk = true;
            }
          }, 500);
          // 判断是否滑倒底部 给一个10px误差（兼容苹果12滑到底不触发问题）
          if (scrollTop + windowHeight >= scrollHeight - 10) {
            setTimeout(() => {
              owner.report(3); // 直接上报已学完
            }, 200);
          }
          console.log(scrollHeight);
        }
      }
    },
    //vant 图片预览一张
    sceneImgOne(imgUrl, imgIndex) {
      // let prems = {
      //   imgUrl: imgUrl,
      //   code: this.huihuiNumber
      // };
      this.imgShow = true;
      this.startIndex = imgIndex;
      // if (window.collegeNative) {
      //   ImagePreview({
      //     images: [url], //需要预览的图片 URL 数组
      //     showIndex: false, //是否显示页码
      //     loop: false, //是否开启循环播放
      //     startPosition: 0, //图片预览起始位置索引
      //     closeOnPopstate: true
      //   });
      // }
      // //ios调用方式  nativeRoute是具体的方法名,
      // if (window.webkit && window.webkit.messageHandlers) {
      //   window.webkit.messageHandlers.showImage.postMessage(
      //     JSON.stringify(prems)
      //   );
      // }
    },
    show(data) {
      this.isshow = true;
      this.baseId = data.baseId;
      this.liveId = data.liveId;
      this.sourceId = data.sourceId;
      this.name = data.name;
      this.coursesType = data.coursesType;
      this.progress = data.progress;
      this.header1 = {
        title: this.name,
        backType: true
      };

      this.overTimer = null;
      //页面停留时间
      this.timer();
      // 开启定时器
      this.overTimer = setTimeout(() => {
        this.isOvertime = true;
      }, 120000);
      // this.page = 1;
      this.workList = [];
      //获取总页数
      // this.getPage();
      // //获取内容
      // this.getMsg();
    },
    close() {
      this.isshow = false;
      this.overTimer = null;
      this.workList = [];
    },
    backTo() {
      this.isshow = false;
      this.$emit("backDoc");
    },
    // 获取总页数
    getPage() {
      let that = this;
      JSH.request({
        url: CloudMarketing.getFileResult,
        method: "get",
        params: {
          etag: that.liveId
        },
        success(res) {
          if (res.success) {
            that.pageCount = res.data.pageCount;
            that.isMax = false;
            if (that.page > that.pageCount) {
              that.finished = true;
            } else {
              that.getMsg();
            }
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    //获取文档流
    getMsg() {
      let that = this;
      if (!that.liveId) {
        return;
      }
      JSH.request({
        url: CloudMarketing.getDocPicUrl,
        method: "get",
        params: {
          etag: that.liveId,
          pageIndex: that.page
        },
        success(res) {
          if (res.success) {
            that.workList.push(res.data.url);
            that.isFinished = false;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    //上报
    report(type) {
      let that = this;
      if (!that.isReport) {
        return;
      }
      that.isReport = false;
      let flag;
      let time;
      if (type === 3) {
        flag = 1;
        time = 1;
      } else {
        flag = type;
        time = that.intervalTime;
      }
      JSH.request({
        url: CloudMarketing.savestudyprogress,
        method: "post",
        params: {
          baseId: that.baseId,
          coursesType: that.coursesType,
          liveId: that.liveId,
          liveType: 3,
          stayTime: time,
          studyTime: time,
          flag: flag,
          sourceId: that.sourceId
        },
        success(res) {
          if (res.success) {
            if (res.data) {
              that.isReport = true;
              console.log("学习完成");
            }
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    hasScrollbar() {
      return (
        document.body.scrollHeight >
        (window.innerHeight || document.documentElement.clientHeight)
      );
    },
    getPlaytime() {
      const _this = this;
      JSH.request({
        url: CloudMarketing.getaccountinfo,
        method: "get",
        success(resp) {
          console.log(resp);
          if (resp.success) {
            _this.intervalTime = resp.data.intervalTime
              ? resp.data.intervalTime
              : 120;
            _this.vidsetInterval = setInterval(() => {
              console.log(_this.isOvertime);
              console.log(_this.isOk);
              if (this.progress == 100) {
                _this.report(1);
              } else {
                if (_this.isOvertime && _this.isOk) {
                  _this.report(1);
                } else {
                  _this.report(2);
                }
              }
            }, _this.intervalTime * 1000);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    // 页面停留时间
    timer() {
      this.ting = setTimeout(() => {
        clearTimeout(this.ting);
        this.timeStudy += 1000;
        this.timer();
      }, 1000);
    }
  },
  mounted() {
    window.addEventListener("scroll", this.getScrollDoc, true);
  },
  activated() {},
  destroyed() {
    clearInterval(this.vidsetInterval);
    window.removeEventListener("scroll", this.getScrollDoc, true);
    document.documentElement.scrollTop = 0;
  },
  watch: {
    //判断是否存在滚动条
    finished(val) {
      if (val) {
        if (!this.hasScrollbar()) {
          this.isOk = true;
        }
      }
    }
  },
  created() {
    //上报
    this.getPlaytime();
  }
};
