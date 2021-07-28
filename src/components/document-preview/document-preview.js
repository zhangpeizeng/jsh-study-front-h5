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
      //标题栏
      header1: {
        title: "文档预览",
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
      intervalTime: "120"
    };
  },
  methods: {
    //上拉加载
    onLoad() {
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
    //vant 图片预览一张
    sceneImgOne(url) {
      let prems = {
        imgUrl: url,
        code: this.huihuiNumber
      };
      if (window.collegeNative) {
        ImagePreview({
          images: [url], //需要预览的图片 URL 数组
          showIndex: false, //是否显示页码
          loop: false, //是否开启循环播放
          startPosition: 0, //图片预览起始位置索引
          closeOnPopstate: true
        });
      }
      //ios调用方式  nativeRoute是具体的方法名,
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.showImage.postMessage(
          JSON.stringify(prems)
        );
      }
    },
    show(data) {
      this.isshow = true;
      this.liveId = data.liveId;
      this.workList = [];
    },
    close() {
      this.isshow = false;
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
    }
  },
  created() {}
};
