import Vue from "vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import VideoPlayer from "@/components/VideoPlayerOrdinary";
import synopsisOpenUp from "../../views/pages/marketing-pages/product-center/product-center-details/components/synopsisOpenUp/synopsisOpenUp";
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
  Sticky,
  Circle,
  Tab,
  Image as VanImage,
  Tabs,
  Toast
} from "vant";

Vue.use(Field);
Vue.use(CellGroup)
  .use(Search)
  .use(Card)
  .use(VanImage)
  .use(Tab)
  .use(Tabs)
  .use(Uploader)
  .use(Popup)
  .use(ActionSheet)
  .use(Sticky)
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
    VideoPlayer,
    synopsisOpenUp
  },
  props: {
    productCode: null
  },
  data() {
    return {
      header: {
        title: "商品信息",
        backType: true
      },
      active: 0,
      tabName: "基本信息",
      index: 0,
      isfixed: false,
      selectType: 0,
      info: "",
      // 视频id
      liveId: "",
      // 视频播放开关
      isVideoPlayer: false,
      pdfInstructions: []
    };
  },
  methods: {
    backTo() {
      this.$emit("backPro");
    },
    handleScroll() {
      let height = document
        .getElementsByClassName("pro-box")[0]
        .getBoundingClientRect().height;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop; // 滚动条偏移量
      if (scrollTop > height) {
        this.isfixed = true;
      } else {
        this.isfixed = false;
      }
    },
    tabClick(index, item) {
      this.tabName = item;
      this.index = index;
    },
    // 获取文件类型
    getFileType(name) {
      return name.split("?")[0].split(".")[
        name.split("?")[0].split(".").length - 1
      ];
    },
    getInfo() {
      const that = this;
      that.ht.$emit("loading", true);
      JSH.request({
        url: CloudMarketing.getitembasicdetail,
        method: "get",
        params: {
          productCode: this.productCode
        },
        success(data) {
          if (data.success) {
            that.info = data.data;
            if (data.data.pdfInstructions) {
              for (let i = 0; i < data.data.pdfInstructions.length; i++) {
                const item = data.data.pdfInstructions[i];
                if (item.etag) {
                  that.pdfInstructions.push(item);
                }
              }
            } else {
              that.pdfInstructions = [];
            }
            that.ht.$emit("loading", false);
          } else {
            that.ht.$emit("loading", false);
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
          that.ht.$emit("loading", false);
          Toast("接口异常");
        }
      });
    },
    playVideo(item) {
      this.liveId = item.videoId;
      this.isVideoPlayer = true;
    }
  },
  deactivated() {
    this.isVideoPlayer = false;
    window.removeEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll); // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
  },
  created() {
    // this.productCode = this.$route.query.productCode;
    this.isVideoPlayer = false;
    this.getInfo();
  }
};
