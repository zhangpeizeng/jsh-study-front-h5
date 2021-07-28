<template>
  <!-- :style='playStyle' -->
  <div
    :style="{ height: videoContainerHeight + 'px' }"
    @click="
      () => {
        $emit('jsh-pause');
      }
    "
    style="position: relative;transform:rotate(0deg);"
  >
    <div class="prism-player" :id="playerId">
      <slot></slot>
      <div
        v-show="showError"
        style="position: absolute;width:100%;left: 0;right:0;z-index: 2;"
        :style="{ top: videoContainerHeight / 2 - 50 + 'px' }"
      >
        <img
          src="../assets/images/video-error.png"
          style="width: 72px;height: 72px;margin-left: 152px"
        />
        <p class="color-999 fs-15" style="margin-left: 123px;margin-top: 8px">
          哎哟，视频跑路了...
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import JSH from "@/core";
import { CloudMarketing } from "@/request";
export default {
  name: "VideoPlayer",
  components: {},
  props: {
    playStyle: {
      type: String,
      default: ""
    },
    videoContainerHeight: {
      type: Number,
      default: 400
    },
    videoContainerwidth: {
      type: Number,
      default: 375
    },
    aliplayerSdkPath: {
      // Aliplayer 代码的路径
      type: String,
      default: "https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-h5-min.js"
    },
    autoplay: {
      type: Boolean,
      default: false
    },

    encryptType: {
      type: Number,
      default: 1
    },

    isLive: {
      type: Boolean,
      default: false
    },
    playsinline: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    controlBarVisibility: {
      type: String,
      default: "hover"
    },
    mediaType: {
      type: String,
      default: "video" //为’video’视频 ‘audio’音频的视频
    },
    useH5Prism: {
      type: Boolean,
      default: true
    },
    useFlashPrism: {
      type: Boolean,
      default: false
    },
    vid: {
      type: String,
      default: ""
    },
    cover: {
      type: String,
      default: ""
    },
    format: {
      type: String,
      default: "m3u8"
    },
    x5_video_position: {
      type: String,
      default: "center"
    },
    x5_type: {
      type: String,
      default: "h5"
    },
    x5_fullscreen: {
      type: Boolean,
      default: true
    },
    x5_orientation: {
      type: Number,
      default: 2
    },
    autoPlayDelay: {
      type: Number,
      default: 0
    },
    autoPlayDelayDisplayText: {
      type: String
    }
  },
  data() {
    return {
      playerId: "aliplayer_" + Math.floor(Math.random() * 10000000),
      scriptTagStatus: 0,
      instance: null,
      playAuth: "", //播放码
      source: "", //播放地址
      showError: false,
      alltime: null,
      vidsetInterval: null,
      seektime: 0
    };
  },
  created() {
    // this.dataUpdate();
    if (window.Aliplayer !== undefined) {
      // 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
      this.scriptTagStatus = 2;
      this.getPlaySource();
    } else {
      // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
      this.insertScriptTag();
    }
    // this.videoContainerwidth = window.screen.width;
  },
  mounted() {
    if (window.Aliplayer !== undefined) {
      // 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
      this.scriptTagStatus = 2;
      // this.getPlaySource();
    } else {
      // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
      this.insertScriptTag();
    }
  },
  watch: {
    // vid() {
    //   console.log(this.vid)
    // }
  },
  methods: {
    insertScriptTag() {
      const _this = this;
      let playerScriptTag = document.getElementById("playerScriptTag");
      // 如果这个tag不存在，则生成相关代码tag以加载代码
      if (playerScriptTag === null) {
        playerScriptTag = document.createElement("script");
        playerScriptTag.type = "text/javascript";
        playerScriptTag.src = this.aliplayerSdkPath;
        playerScriptTag.id = "playerScriptTag";
        let s = document.getElementsByTagName("head")[0];
        s.appendChild(playerScriptTag);
      }
      if (playerScriptTag.loaded) {
        _this.scriptTagStatus++;
        _this.getPlaySource();
      } else {
        playerScriptTag.addEventListener("load", () => {
          _this.scriptTagStatus++;
          playerScriptTag.loaded = true;
          _this.getPlaySource();
        });
      }
      // _this.getPlaySource();
    },
    getPlaySource() {
      const _this = this;
      JSH.request({
        url: CloudMarketing.getremotevodaddress,
        method: "get",
        params: {
          videoId: _this.vid
        },
        success(resp) {
          if (resp.success) {
            _this.source = resp.data.payInfoList[0].playUrl;
            _this.cover = resp.data.coverUrl;
            _this.seektime = resp.data.creationTime
              ? resp.data.creationTime
              : 0;
            console.log(_this.source);
            _this.initAliplayer();
          } else {
            _this.showError = true;
          }
        },
        error(e) {
          // eslint-disable-next-line no-console
          console.log(e);
          _this.showError = true;
        }
      });
      // _this.initAliplayer();
    },
    initAliplayer() {
      const _this = this;
      // scriptTagStatus 为 2 的时候，说明两个必需引入的 js 文件都已经被引入，且加载完成
      if (_this.scriptTagStatus === 2 && _this.instance === null) {
        // Vue 异步执行 DOM 更新，这样一来代码执行到这里的时候可能 template 里面的 script 标签还没真正创建
        // 所以，我们只能在 nextTick 里面初始化 Aliplayer
        _this.$nextTick(() => {
          // console.log(_this.encryptType)
          // console.log(_this.vid)
          // console.log(_this.playauth)
          _this.instance = window.Aliplayer({
            id: _this.playerId,
            autoplay: _this.autoplay,
            isLive: false,
            width: _this.width,
            height: _this.height,
            controlBarVisibility: _this.controlBarVisibility,
            useH5Prism: _this.useH5Prism,
            useFlashPrism: _this.useFlashPrism,
            qualitySort: "asc",
            mediaType: _this.mediaType,
            vid: _this.vid,
            seek: _this.seek,
            source: _this.source,
            cover: _this.cover,
            // x5_video_position: _this.x5_video_position,
            x5_type: _this.x5_type,
            x5_fullscreen: _this.x5_fullscreen,
            x5_orientation: _this.x5_orientation,
            autoPlayDelay: _this.autoPlayDelay,
            autoPlayDelayDisplayText: _this.autoPlayDelayDisplayText,
            skinLayout: [
              {
                name: "H5Loading",
                align: "cc"
              },
              // {
              //   name: "errorDisplay",
              //   align: "tlabs",
              //   x: 0,
              //   y: 0
              // },
              // {
              //   name: "infoDisplay"
              // },
              {
                name: "bigPlayButton",
                align: "cc"
              },
              {
                name: "tooltip",
                align: "blabs",
                x: 0,
                y: 56
              },
              // {
              //   name: "thumbnail",
              //   align: "cc"
              // },
              {
                name: "controlBar",
                align: "blabs",
                x: 0,
                y: 0,
                children: [
                  {
                    name: "progress",
                    align: "blabs",
                    x: 0,
                    y: 44
                  },
                  {
                    name: "playButton",
                    align: "tl",
                    x: 15,
                    y: 12
                  },
                  {
                    name: "timeDisplay",
                    align: "tr",
                    x: 30,
                    y: 7
                  },
                  { name: "fullScreenButton", align: "brabs", x: 0, y: 7 }
                ]
              }
            ]
          });
          // 绑定事件，当 AliPlayer 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
          _this.instance.on("ready", () => {
            this.$emit("ready", _this.instance);
            // eslint-disable-next-line no-console
            console.log("=====ready");
            const dom = document.querySelector(".prism-animation");
            if (dom) {
              dom.parentNode.removeChild(dom);
            }
            _this.instance.seek(_this.seektime);
          });
          _this.instance.on("play", () => {
            this.$emit("play", _this.instance);
            // 播放打开常亮开关
            console.log("openLightScreen");
            //安卓调用方式  nativeRoute是具体的方法名,
            if (window.collegeNative) {
              window.collegeNative.openLightScreen();
            }
            //ios调用方式  nativeRoute是具体的方法名,
            if (window.webkit && window.webkit.messageHandlers) {
              window.webkit.messageHandlers.openLightScreen.postMessage("");
            }

            // eslint-disable-next-line no-console
            console.log("=====play");
          });
          _this.instance.on("pause", () => {
            console.log("=====pause");
            this.$emit("pause", _this.instance);
          });
          _this.instance.on("ended", () => {
            console.log("=====ended播放完毕");
            // 播放结束关闭常亮开关
            console.log("closeLightScreen");
            //安卓调用方式  nativeRoute是具体的方法名,
            if (window.collegeNative) {
              window.collegeNative.closeLightScreen();
            }
            //ios调用方式  nativeRoute是具体的方法名,
            if (window.webkit && window.webkit.messageHandlers) {
              window.webkit.messageHandlers.closeLightScreen.postMessage("");
            }

            _this.seektime = 0;
            this.$emit("ended", _this.instance);
          });
          _this.instance.on("error", () => {
            this.$emit("error", _this.instance);
            // eslint-disable-next-line no-console
            console.log("======error");
            this.showError = true;
          });
          _this.instance.on("liveStreamStop", () => {
            console.log("=====liveStreamStop");
            this.$emit("liveStreamStop", _this.instance);
          });
          _this.instance.on("m3u8Retry", () => {
            console.log("=====m3u8Retry");
            this.$emit("m3u8Retry", _this.instance);
          });
          _this.instance.on("hideBar", () => {
            console.log("=====hideBar");
            this.$emit("hideBar", _this.instance);
          });
          _this.instance.on("waiting", () => {
            console.log("=====waiting");
            this.$emit("waiting", _this.instance);
          });
          _this.instance.on("snapshoted", () => {
            console.log("=====snapshoted");
            this.$emit("snapshoted", _this.instance);
          });
        });
      }
    },
    /**
     * 播放视频
     */
    play: function() {
      this.instance.play();
    },
    /**
     * 暂停视频
     */
    pause: function() {
      this.instance.pause();
    },
    /**
     * 重播视频
     */
    replay: function() {
      this.instance.replay();
    },
    /**
     * 跳转到某个时刻进行播放
     * @argument time 的单位为秒
     */
    seek: function(time) {
      this.instance.seek(time);
    },
    /**
     * 获取当前时间 单位秒
     */
    getCurrentTime: function() {
      return this.instance.getCurrentTime();
    },
    /**
     *获取视频总时长，返回的单位为秒
     * @returns 返回的单位为秒
     */
    getDuration: function() {
      return this.instance.getDuration();
    },
    /**
             获取当前的音量，返回值为0-1的实数ios和部分android会失效
             */
    getVolume: function() {
      return this.instance.getVolume();
    },
    /**
             设置音量，vol为0-1的实数，ios和部分android会失效
             */
    setVolume: function(vol) {
      this.instance.setVolume(vol);
    },
    /**
     *直接播放视频url，time为可选值（单位秒）目前只支持同种格式（mp4/flv/m3u8）之间切换暂不支持直播rtmp流切换
     *@argument url 视频地址
     *@argument time 跳转到多少秒
     */
    loadByUrl: function(url, time) {
      this.instance.loadByUrl(url, time);
    },
    /**
     * 设置播放速度
     *@argument speed 速度
     */
    setSpeed: function(speed) {
      this.instance.setSpeed(speed);
    },
    /**
     * 设置播放器大小w,h可分别为400px像素或60%百分比chrome浏览器下flash播放器分别不能小于397x297
     *@argument w 播放器宽度
     *@argument h 播放器高度
     */
    setPlayerSize: function(w, h) {
      this.instance.setPlayerSize(w, h);
    },
    /**
     * 目前只支持HTML5界面上的重载功能,暂不支持直播rtmp流切换m3u8）之间切换,暂不支持直播rtmp流切换
     *@argument vid 视频id
     *@argument playauth 播放凭证
     */
    reloaduserPlayInfoAndVidRequestMts: function(vid, playauth) {
      this.instance.reloaduserPlayInfoAndVidRequestMts(vid, playauth);
    }
  },
  destroyed() {
    let _this = this;
    this.instance.dispose();
    clearInterval(_this.vidsetInterval);
    // 组件销毁则关闭常亮开关
    //安卓调用方式  nativeRoute是具体的方法名,
    if (window.collegeNative) {
      window.collegeNative.closeLightScreen();
    }
    //ios调用方式  nativeRoute是具体的方法名,
    if (window.webkit && window.webkit.messageHandlers) {
      window.webkit.messageHandlers.closeLightScreen.postMessage("");
    }
  }
};
</script>
<!-- sts -->
<style lang="scss">
@import url(https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css);
*::-webkit-media-controls-panel {
  display: none !important;
  -webkit-appearance: none;
}

*::--webkit-media-controls-play-button {
  display: none !important;
  -webkit-appearance: none;
}
*::-webkit-media-controls-start-playback-button {
  display: none !important;
  -webkit-appearance: none;
}
.prism-player {
  width: 100% !important;
  height: 100% !important;
  video {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
  }
}
.prism-player .prism-cover {
  background-size: auto;
  z-index: 0;
}
.prism-controlbar {
  z-index: 13 !important;
}
.prism-controlbar-bg {
  background-color: rgba(0, 0, 0, 0.4) !important;
}
.prism-progress prism-progress-hover {
  background-color: transparent;
}
.prism-player .prism-liveshift-progress .prism-progress-played,
.prism-player .prism-progress .prism-progress-played {
  background-color: #fff;
}

.prism-player .prism-liveshift-progress,
.prism-player .prism-progress {
  height: 1px !important;
}

.prism-play-btn {
  background-image: url("../assets/images/video-restart.png") !important;
  &.playing {
    background-image: url("../assets/images/video-pause.png") !important;
  }
}
.prism-player .prism-big-play-btn {
  position: fixed;
  opacity: 0.9;
  z-index: 13;
}
.prism-player .prism-big-play-btn .outter {
  border: none;
}
.prism-player .prism-progress-hover .prism-progress-cursor {
  top: -8px !important;
}
.prism-time-display {
  margin-top: 4px !important;
}
</style>
