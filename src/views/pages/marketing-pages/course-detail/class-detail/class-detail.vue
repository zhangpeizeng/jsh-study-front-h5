<template>
  <div class="class-details">
    <div class="no-network" v-if="isNetwork">
      <jshHeader :header="header" @leftClick="gobackto"></jshHeader>
      <div>
        <div class="set">
          <div style="padding-top: 30%">
            <img src="../../../../../assets/images/network.png" alt="" />
          </div>
          <div style="padding-top: 30px;color: #646566;font-size: 14px">
            网络请求失败
          </div>
          <div style="padding-top: 10px">请检查您的网络，重新加载试试吧</div>
          <div class="refresh" @click="refreshClick">刷新</div>
        </div>
      </div>
    </div>
    <div v-show="docViewFlag && !isNetwork">
      <jshHeader :header="header" @leftClick="gobackto"></jshHeader>
      <div class="course-box">
        <div class="text-content">
          <div class="d-flex align-items-center">
            <div class="mr-10 class-count">
              {{ classDetail.sort | numberFilter }}
            </div>
            <div>
              <div class="fs-13 color-black mb-6">
                {{ classDetail.name }}
              </div>
              <div class="fs-12 mb-6">
                <span
                  class="color-gray"
                  v-if="classDetail.studyStartTime || classDetail.studyEndTime"
                >
                  {{ classDetail.studyStartTime | date1("yyyy-MM-dd hh:mm") }}至
                  {{ classDetail.studyEndTime | date1("yyyy-MM-dd hh:mm") }}
                </span>
                <!--<span-->
                <!--class="color-gray"-->
                <!--v-if="-->
                <!--!(classDetail.studyStartTime || classDetail.studyEndTime)-->
                <!--"-->
                <!--&gt;-->
                <!--学习时间:不限-->
                <!--</span>-->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tabs">
        <van-tabs v-model="active">
          <van-tab
            v-for="(item, index) in tabList"
            :key="index"
            :title="item.name"
            title-inactive-color="#646566"
            title-active-color="#323233"
          >
            <div
              class="pb-6"
              v-if="item.name === '视频' && videoList.length > 0"
            >
              <div class="media-list">
                <div
                  class="media-item"
                  v-for="(item, index) in videoList"
                  :key="index"
                >
                  <div class="media-layer"></div>
                  <div class="media-name van-ellipsis">
                    {{ item.liveName }}
                  </div>
                  <div class="media-study-progress" v-if="item.progress">
                    已学习{{ item.progress }}%
                    <img
                      src="../../../../../assets/images/answer.png"
                      style="width: 14px;height: 14px;"
                      @click="toProgress"
                    />
                  </div>
                  <div
                    class="media-study-progress"
                    style="text-align: center; background:#C0C4CC"
                    v-if="!item.progress"
                  >
                    未学习
                    <img
                      src="../../../../../assets/images/answer.png"
                      style="width: 14px;height: 14px;"
                      @click="toProgress"
                    />
                  </div>
                  <div style="width: 100%;position: relative;">
                    <img
                      src="@/assets/images/video.png"
                      style="height: 200px;width: 100%;"
                    />
                    <div
                      style="width: 100%;text-align: center;position: absolute;top: 0;left: 0;padding-top: 70px;z-index:10"
                    >
                      <img
                        src="@/assets/images/videoplsyw.png"
                        style="height: 60px;width:60px;display: inline-block;"
                        @click="item.videoPlayer = true"
                      />
                    </div>
                  </div>
                  <!--<VideoPlayer-->
                  <!--:vid="item.liveId"-->
                  <!--:baseId="id"-->
                  <!--:coursesType="4"-->
                  <!--:liveType="item.liveType"-->
                  <!--:sourceId="id"-->
                  <!--:video-container-width="widthVideo"-->
                  <!--:video-container-height="200"-->
                  <!--mediaType="video"-->
                  <!--/>-->
                  <van-popup
                    v-model="item.videoPlayer"
                    @close="closeClick(item)"
                  >
                    <div
                      v-if="item.videoPlayer"
                      style="width: 375px;margin: 0 auto"
                    >
                      <VideoPlayer
                        :vid="item.liveId"
                        :baseId="id"
                        :coursesType="4"
                        liveType="1"
                        :sourceId="id"
                        :cover="courseImg"
                        :video-container-width="widthVideo"
                        :video-container-height="200"
                        mediaType="video"
                        v-if="item.transcodingStatus"
                      />
                      <div
                        style="width: 100%;position: relative;color: white;"
                        v-if="!item.transcodingStatus"
                      >
                        <img
                          :src="courseImg"
                          style="width: 100%;height: 200px;"
                        />
                        <div
                          style="width: 100%;height: 200px;opacity: 0.5;position: absolute;top: 0;left: 0;background-color: #333333;"
                        ></div>
                        <div
                          style="width: 100%;position: absolute;bottom: 20px;text-align: center;left: 0;"
                        >
                          <van-loading type="spinner" v-if="videoshowto" />
                          <div
                            style="width: 100%;text-align: center;font-size: 13px;padding-top: 13px;"
                          >
                            学习内容即将播放，请稍等...
                          </div>
                          <div
                            style="width: 100%;text-align: center;padding-top: 13px;"
                          >
                            <div
                              style="width: 86px;line-height:24px;height: 24px;text-align: center;border-radius: 12px;color: #ffffff;font-size:14px;display: inline-block;"
                              class="border-yuan"
                              @click="getvideotask(item)"
                            >
                              刷新
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </van-popup>
                </div>
              </div>
            </div>
            <div
              class="pb-6"
              v-if="item.name === '音频' && voiceList.length > 0"
            >
              <div class="media-list">
                <div
                  class="media-item"
                  v-for="(item, index) in voiceList"
                  :key="index"
                >
                  <div class="media-name van-ellipsis">
                    {{ item.liveName }}
                  </div>
                  <div class="media-study-progress" v-if="item.progress">
                    已学习{{ item.progress }}%
                    <img
                      src="../../../../../assets/images/answer.png"
                      style="width: 14px;height: 14px;"
                      @click="toProgress"
                    />
                  </div>
                  <div
                    class="media-study-progress"
                    style="text-align: center; background:#C0C4CC"
                    v-if="!item.progress"
                  >
                    未学习
                    <img
                      src="../../../../../assets/images/answer.png"
                      style="width: 14px;height: 14px;"
                      @click="toProgress"
                    />
                  </div>
                  <div style="width: 100%;position: relative;">
                    <img
                      src="@/assets/images/music.png"
                      style="height: 200px;width: 100%;"
                    />
                    <div
                      style="width: 100%;text-align: center;position: absolute;top: 0;left: 0;padding-top: 70px;"
                    >
                      <img
                        src="@/assets/images/videoplsyw.png"
                        style="height: 60px;width:60px;display: inline-block;"
                        @click="item.voicePlayer = true"
                      />
                    </div>
                  </div>
                  <!--<VideoPlayer-->
                  <!--:vid="item.liveId"-->
                  <!--:baseId="id"-->
                  <!--:coursesType="4"-->
                  <!--:liveType="item.liveType"-->
                  <!--:sourceId="id"-->
                  <!--:video-container-width="widthVideo"-->
                  <!--:video-container-height="200"-->
                  <!--mediaType="audio"-->
                  <!--/>-->
                  <van-popup
                    v-model="item.voicePlayer"
                    @close="closeClickVoice(item)"
                  >
                    <div
                      v-if="item.voicePlayer"
                      style="width: 375px;margin: 0 auto"
                    >
                      <VideoPlayer
                        :vid="item.liveId"
                        :baseId="id"
                        :coursesType="4"
                        liveType="2"
                        :sourceId="id"
                        :video-container-width="widthVideo"
                        :video-container-height="200"
                        mediaType="audio"
                      />
                    </div>
                  </van-popup>
                </div>
              </div>
            </div>
            <div class="pb-6" v-if="item.name === '文档' && docList.length > 0">
              <div class="media-list">
                <div
                  class="border-bottom mb-16"
                  v-for="(item, index) in docList"
                  :key="index"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                    @click="gotoView(item)"
                  >
                    <div class="d-flex align-items-center">
                      <van-icon name="orders-o" />
                      <div class="doc-name">{{ item.liveName }}</div>
                    </div>
                    <van-icon name="arrow" />
                  </div>
                  <div class="d-flex justify-content-end align-items-center">
                    <div class="study-progress" v-if="item.progress">
                      已学习{{ item.progress }}%
                    </div>
                    <div
                      class="study-progress text-center"
                      style="text-align: center; background:#C0C4CC"
                      v-if="!item.progress"
                    >
                      未学习
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <progressPopup ref="progressPopup"></progressPopup>
    </div>
    <homework-learning
      ref="learning"
      :huihuiNumber="classDetail.huihuiNumber"
      @backDoc="backDoc"
      v-if="!docViewFlag && !isNetwork"
    ></homework-learning>
  </div>
</template>

<script>
import Vue from "vue";
import { Tab, Tabs, Button, Image as VanImage, Toast } from "vant";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import VideoPlayer from "@/components/VideoPlayer";
import homeworkLearning from "@/components/homework-learning/homework-learning.vue";
import JSH from "@/core";
import { CloudMarketing } from "@/request";
import progressPopup from "@/components/course-detail/progress-popup/progress-popup.vue";

Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Button);
Vue.use(VanImage);
Vue.use(Toast);

export default {
  name: "seriesCourse",
  components: { jshHeader, VideoPlayer, homeworkLearning, progressPopup },
  data() {
    return {
      //标题栏
      header: {
        title: "课时详情",
        backType: true
      },
      id: "",
      courseImg: "",
      tabList: [],
      active: "",
      videoList: [],
      voiceList: [],
      docList: [],
      classDetail: {},
      widthVideo: 375,
      docViewFlag: true,
      viewurl: null,
      isNetwork: false,
      videoshowto: false //视频加载
    };
  },
  methods: {
    closeClick(item) {
      const owner = this;
      item.videoPlayer = false;
      owner.getSeriesCoursesDetail(owner.id);
    },
    closeClickVoice(item) {
      const owner = this;
      item.voicePlayer = false;
      owner.getSeriesCoursesDetail(owner.id);
    },
    // 浏览返回
    backDoc() {
      const owner = this;
      owner.docViewFlag = true;
      owner.getSeriesCoursesDetail(owner.id);
    },
    // 文档浏览
    gotoView(item) {
      const owner = this;
      owner.docViewFlag = false;
      let params = {
        name: item.liveName,
        baseId: owner.id,
        coursesType: 4,
        progress: item.progress,
        liveId: item.liveId,
        sourceId: owner.id
      };
      owner.$nextTick(() => {
        owner.$refs.learning.show(params);
      });
    },
    getSeriesCoursesDetail(id) {
      const owner = this;
      // owner.$loading.show(5000);
      owner.ht.$emit("loading", true);
      JSH.request({
        url: CloudMarketing.getSeriesCoursesDetail,
        method: "get",
        params: {
          id: id
        },
        success(res) {
          owner.isNetwork = false;
          if (res.success) {
            owner.ht.$emit("loading", false);
            owner.classDetail = res.data;
            owner.tabList = [];
            if (owner.classDetail.liveList) {
              owner.videoList = owner.classDetail.liveList;
              owner.videoList.forEach(value => {
                owner.$set(value, "videoPlayer", false);
              });
              owner.tabList.push({ name: "视频" });
            }
            if (owner.classDetail.mp4List) {
              owner.voiceList = owner.classDetail.mp4List;
              owner.voiceList.forEach(value => {
                owner.$set(value, "voicePlayer", false);
              });
              owner.tabList.push({ name: "音频" });
            }
            if (owner.classDetail.textList) {
              owner.docList = owner.classDetail.textList;
              owner.tabList.push({ name: "文档" });
            }
          } else {
            Toast(res.data.errorMsg);
            owner.ht.$emit("loading", false);
          }
        },
        error() {
          owner.ht.$emit("loading", false);
          owner.isNetwork = true;
        }
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
    toProgress() {
      this.$refs.progressPopup.initData(1);
    },
    refreshClick() {
      const owner = this;
      owner.getSeriesCoursesDetail(owner.id);
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
  created() {
    const owner = this;
    owner.id = owner.$route.query.id;
    // 后续添加字段判断数据来源
    if (owner.$route.query.courseImg) {
      let value = JSON.parse(owner.$route.query.courseImg);
      if (value && value !== "") {
        console.log(value);
        let index = value.lastIndexOf(".");
        if (index < 0 || value.length - index > 5) {
          console.log(value);
        } else {
          let start = value.substring(0, index);
          let end = value.substring(index, value.length);
          owner.courseImg = start + "_w300" + end;
        }
      }
    } else {
      this.header.title = "课程详情";
    }

    owner.widthVideo = window.screen.width;
    owner.getSeriesCoursesDetail(owner.id);
    owner.viewurl = owner.$route.query.viewurl
      ? owner.$route.query.viewurl
      : null;
  }
};
</script>
<style lang="scss">
.tabs {
  .van-tabs__line {
    background-color: #2780f8;
  }
}
.class-details {
  .van-overlay {
    background-color: rgba(0, 0, 0, 0.95);
  }
}
</style>
<style lang="scss" scoped>
.course-box {
  background: #ffffff;
  margin: 10px 15px;
  padding: 15px;
  border-radius: 5px;
  .text-content {
    .title-span {
      font-weight: 700;
      color: #323233;
      font-size: 15px;
    }
    .title-study {
      color: #ffbb00;
      font-size: 12px;
    }
    .color-black {
      color: #323233;
    }
    .color-gray {
      color: #969799;
    }
    .color-brown {
      color: #646566;
    }
    .color-yellow {
      color: #ffbb00;
    }
    .color-blue {
      color: #227ef7;
    }
    .mt-4 {
      margin-top: 4px;
    }
    .button-height {
      height: 24px;
      line-height: 26px;
    }
    .icon-teacher {
      margin-left: 5px;
      width: 30px;
      height: 15px;
      line-height: 15px;
      border-radius: 3px;
      text-align: center;
      font-size: 11px;
      color: #ffbb00;
      border: 1px solid #ffbb00;
    }
    .class-count {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #227ef7;
      width: 30px;
      height: 30px;
      border-radius: 40px;
      color: #ffffff;
      font-size: 13px;
    }
  }
}
.tabs {
  margin: 10px 15px;
  background: #ffffff;
  border-radius: 5px;
  .media-list {
    margin: 15px 15px 0 15px;
    .media-item {
      width: 100%;
      position: relative;
      margin-bottom: 15px;
      .media-cover {
        width: 100%;
      }
      .media-layer {
        position: absolute;
        width: 100%;
        height: 200px;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9;
      }
      .media-play {
        position: absolute;
        top: 54px;
        left: 128px;
        width: 60px;
        height: 60px;
        z-index: 10;
      }
      .media-name {
        width: 100%;
        position: absolute;
        top: 0;
        padding: 5px 9px;
        color: #ffffff;
        font-size: 12px;
        background: linear-gradient(
          270deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 1) 100%
        );
        border-radius: 10px 10px 0px 0px;
        z-index: 10;
      }
      .media-study-progress {
        position: absolute;
        bottom: 5px;
        right: 0;
        padding: 0 5px;
        height: 16px;
        line-height: 16px;
        color: #ffffff;
        font-size: 12px;
        background: rgba(39, 128, 248, 1);
        border-radius: 5px 0px 0px 0px;
        z-index: 10;
      }
    }
    .doc-name {
      margin-left: 10px;
      font-size: 13px;
      color: #323233;
    }
    .study-progress {
      padding: 0 5px;
      height: 16px;
      line-height: 16px;
      color: #ffffff;
      font-size: 12px;
      background: rgba(39, 128, 248, 1);
      border-radius: 5px 0px 0px 0px;
    }
  }
}
.border-bottom {
  border-bottom: 1px solid #dcdee0;
}
.no-network {
  padding-top: 83px;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 100%;
  background: white;

  .refresh {
    display: inline-block;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(39, 128, 248, 1);
    margin-top: 30px;
    padding: 7px 35px;
    border-radius: 40px;
    border: 1px solid #2780f8;
  }

  img {
    width: 100px;
    height: 70px;
  }

  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(150, 151, 153, 1);
}
.border-yuan {
  border: 1px solid #ffffff !important;
}
</style>
