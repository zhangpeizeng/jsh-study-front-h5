<template>
  <div class="study-jsh-share">
    <van-popup
      round
      @close="closePop"
      v-model="show"
      class="share"
      position="bottom"
      get-container="body"
    >
      <div class="mask" v-show="isPic">
        <img style="width: 100%;height: 100%" :src="newQrCode" alt="" />
      </div>
      <div class="title">立即分享给好友</div>
      <div class="share-mode d-flex  align-items-center">
        <div v-if="studyTerminalCode === '1'" @click.prevent="shareWechat">
          <div>
            <img src="../../../../../assets/images/wchat-logo.png" alt="" />
          </div>
          <div>
            发送给朋友
          </div>
        </div>
        <div v-if="studyTerminalCode === '1'" @click.prevent="shareFriends">
          <div>
            <img src="../../../../../assets/images/wechat-moment.png" alt="" />
          </div>
          <div>
            发送到朋友圈
          </div>
        </div>
        <div @click.prevent="downImage()">
          <div>
            <img src="../../../../../assets/images/down-load2.png" alt="" />
          </div>
          <div>
            保存图片
          </div>
        </div>
      </div>
      <div class="footer-btn" @click="onCancel">
        取消
      </div>
      <!--    <van-button @click="show = false" block>取消</van-button>-->
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { Popup, Button, Toast } from "vant";
Vue.use(Popup)
  .use(Button)
  .use(Toast);

export default {
  name: "JshShare",
  props: {
    qrCode: null
  },
  computed: {
    newQrCode() {
      return "data:image/jpg;base64," + this.qrCode;
    }
  },
  data() {
    return {
      isPic: false,
      isRepeat: false, // 防重复点击
      show: false,
      learnedNum: "", //已学习课程数量
      learnedTime: "", // 学习时长（分）
      learnedDay: "", //累计学习天数
      studentName: "", //学员名称
      studyReportContent: "", //心灵鸡汤
      studyReportImg: "", //底图
      searchType: "", //（1-近30天，2-上月，3-累计）
      studyTerminalCode: ""
    };
  },
  created() {
    this.studyTerminalCode = localStorage.getItem("studyTerminalCode");
  },
  methods: {
    open({ qrCode }) {
      this.show = true;
      this.qrCode = qrCode;
      setTimeout(() => {
        this.isPic = true;
      }, 350);
    },
    shareWechat() {
      this.onShare("1");
    },
    shareFriends() {
      this.onShare("2");
    },
    onCancel() {
      this.show = false;
    },
    // platform
    onShare(type) {
      const owner = this;
      if (this.qrCode === "") {
        owner.$toast(`图片获取中，请稍后重试`);
        return;
      }
      let prems = {
        url: owner.qrCode,
        type: type
      };
      //ios调用方式  nativeRoute是具体的方法名,
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.shareImage.postMessage(
          JSON.stringify(prems)
        );
      }
      //安卓调用方式  nativeRoute是具体的方法名,
      if (window.collegeNative) {
        window.collegeNative.shareImage(
          `data:image/jpg;base64,` + this.qrCode,
          type
        );
      }
      this.show = false;
    },
    onSuccess() {},
    // 下载海报
    downImage() {
      const owner = this;
      console.log("下载图片");
      // var a = document.createElement("a");
      // a.download = name || "pic";
      // a.href = value;
      // a.click();
      if (this.isRepeat || this.qrCode === "") {
        return;
      }
      owner.show = false;
      this.isRepeat = true;
      setTimeout(() => {
        owner.isRepeat = false;
      }, 2500);

      //    苹果系统的跳转方法
      //ios调用方式  nativeRoute是具体的方法名,
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.downloadImg.postMessage(
          `data:image/jpg;base64,` + owner.qrCode
        );
      }
      //安卓调用方式  nativeRoute是具体的方法名,
      if (window.collegeNative) {
        window.collegeNative.downloadImg(
          `data:image/jpg;base64,` + owner.qrCode
        );
      }
    },
    // 关闭弹出层触发的方法
    closePop() {
      // this.qrCode = "";
      this.isPic = false;
    }
  }
};
</script>
<style lang="scss">
.van-popup {
  overflow: initial !important;
}
</style>
<style lang="scss" scoped>
.share {
  .mask {
    width: 240px;
    height: 395px;
    background: white;
    position: fixed;
    top: 50px;
    left: 65px;
    z-index: 2010;
  }
  .popup-container {
    display: flex;
    justify-content: flex-start;
    padding: 0 10px;
    width: 100%;
    white-space: nowrap;
    background: white;

    .container-item {
      padding: 30px 10px;
      text-align: center;

      .item-image {
        margin: 0 auto 20px auto;
        width: 120px;
        height: 120px;
        line-height: 120px;
        background: #ffffff;
        border-radius: 6px;

        img {
          width: 35px;
          height: 35px;
          vertical-align: middle;
        }
      }
    }
  }
}

.title {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #323233;
  text-align: center;
  margin-top: 15px;
}
.share-mode {
  display: flex;
  text-align: center;
  padding: 15px 10px 15px 10px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #646566;

  & > div {
    width: 25%;
    white-space: nowrap;
  }

  img {
    width: 48px;
    height: 48px;
    margin-bottom: 10px;
  }
}

.footer-btn {
  width: 100%;
  text-align: center;
  font-size: 16px;
  padding: 14px;
  font-weight: 400;
  color: #323233;
  font-family: PingFangSC-Regular, PingFang SC;
  background: white !important;
  border-top: 11px solid #f2f3f5;
}
</style>
