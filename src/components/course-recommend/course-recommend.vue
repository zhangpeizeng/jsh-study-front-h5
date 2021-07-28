<template>
  <div class="course-recommend w-100 no-line-to">
    <div
      class="item"
      v-for="(item, index) of list"
      :key="index"
      @click="goClassDetail(item)"
    >
      <div class="introduce d-flex align-items-start">
        <div class="pic">
          <img v-if="item.courseImg" :src="item.courseImg" alt="" />
          <img
            v-if="!item.courseImg"
            src="../../assets/images/backlogo.png"
            alt=""
          />
          <div class="detail d-flex justify-content-between align-items-end">
            <div class="name">
              <img
                style="width: 13px;height: 12px;vertical-align: middle"
                src="../../assets/images/teacher.png"
                alt=""
              />
              <span style="vertical-align: middle">{{
                item.lecturerName
              }}</span>
            </div>
            <div class="d-flex align-items-center num">
              <img
                style="width: 13px;height: 12px;padding-right: 2px;vertical-align: middle"
                src="../../assets/images/num-icon.png"
                alt=""
              />
              <span style="vertical-align: middle">{{
                item.studyStudentsNum
              }}</span>
            </div>
          </div>
        </div>
        <div style="padding-left: 10px;flex-grow: 1">
          <div style="min-height:55px">
            <div class="title">
              <img
                v-if="item.courseType === '2'"
                style="width: 26px;height: 15px;vertical-align: middle"
                src="@/assets/images/icon-live.png"
                alt=""
              />
              <img
                v-if="item.courseType === '3'"
                style="width: 26px;height: 15px;vertical-align: middle"
                src="@/assets/images/icon-discuss.png"
                alt=""
              />
              <img
                v-if="item.courseType === '4'"
                style="width: 26px;height: 15px;vertical-align: middle"
                src="@/assets/images/icon-series.png"
                alt=""
              />
              {{ item.courseName }}
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <div></div>
              <div
                v-if="item.status"
                class="tip"
                :class="{
                  tip3:
                    item.status === 3 || item.status === 2 || item.status === 7
                }"
              >
                <span
                  @click.stop="nowAppointment(item)"
                  v-if="item.status === 1"
                  style="vertical-align: middle"
                  >立即预约</span
                >
                <span v-if="item.status === 2" style="vertical-align: middle"
                  >已预约</span
                >
                <span v-if="item.status === 3" style="vertical-align: middle"
                  >报名截止</span
                >
                <span
                  @click.stop="viewPlay(item)"
                  v-if="item.status === 4"
                  style="vertical-align: middle"
                  >观看直播</span
                >
                <span v-if="item.status === 5" style="vertical-align: middle"
                  >直播回放</span
                >
                <span
                  @click.stop="signUp(item)"
                  v-if="item.status === 6"
                  style="vertical-align: middle"
                  >立即报名</span
                >
                <span v-if="item.status === 7" style="vertical-align: middle"
                  >已报名</span
                >
                <span
                  @click.stop="addStudy(item)"
                  v-if="item.status === 8"
                  style="vertical-align: middle"
                  >加入学习</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Image, List, Popup, Field, Loading, Toast, Dialog } from "vant";

import { CloudMarketing } from "@/request";
import JSH from "@/core";

Vue.use(Image)
  .use(List)
  .use(Popup)
  .use(Field)
  .use(Loading)
  .use(Dialog)
  .use(Toast);

export default {
  name: "course-recommend",
  props: {
    baseId: null
  },
  data() {
    return {
      nowDateTime: null,
      studyTerminalCode: "",
      againTrigger: false, //防重复点击
      list: []
    };
  },
  created() {
    //获取当前时间
    this.nowDateTime = Date.parse(new Date());
    this.studyTerminalCode = localStorage.getItem("studyTerminalCode");
    this.getRelatedCourses();
  },
  activated() {},
  methods: {
    /**
     * 课程推荐
     */
    getRelatedCourses() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getCourseRecommendation,
        method: "get",
        params: {
          studyTerminalCode: this.studyTerminalCode,
          baseId: this.baseId
        },
        success(res) {
          if (res.success) {
            owner.list = res.data;
            owner.$emit("list", owner.list);
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },

    /**
     * 立即预约
     */
    nowAppointment(item) {
      const owner = this;
      Dialog.confirm({
        title: "确定预约提醒此课程",
        message: "本课程将于开课前2小时短信提醒"
      })
        .then(() => {
          owner.goStudy(3, item.id);
        })
        .catch(() => {});
    },
    /**
     * 加入学习
     */
    addStudy(item) {
      const owner = this;
      if (owner.againTrigger) {
        return;
      }
      owner.againTrigger = true;
      owner.goStudy(1, item.id);
    },
    /**
     * 报名
     */
    signUp(item) {
      const owner = this;
      if (owner.againTrigger) {
        return;
      }
      owner.againTrigger = true;
      if (item.courseType === "2" || item.courseType === "3") {
        Dialog.confirm({
          title: "确定立即报名",
          message: "本课程将于开课前2小时短信提醒"
        })
          .then(() => {
            owner.goStudy(2, item.id);
          })
          .catch(() => {});
      } else {
        owner.goStudy(2, item.id);
      }
    },
    /**
     * 加入学习/报名/预约接口
     */
    goStudy(type, id) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.toStudy,
        method: "post",
        params: { type: type, baseId: id },
        success(res) {
          if (res.success) {
            if (type == 1) {
              Toast("已加入到任务-【待学习】");
            } else if (type == 2) {
              Toast("报名成功");
            } else if (type == 3) {
              Toast("预约成功");
            }
            //局部刷新
            owner.localRefresh(id);
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    /**
     * 观看直播
     * 跳原生直播
     */
    viewPlay(item) {
      const owner = this;
      if (item.courseLiveType === "APP") {
        let key = this.$md5(localStorage.getItem("accountId") + item.anthCode);
        let liveUrl =
          "http://mudu.tv/activity.php?id=" +
          item.vhallLiveId +
          "&userid=" +
          localStorage.getItem("accountId") +
          "&name=" +
          localStorage.getItem("accountName") +
          "&expire=36000000" +
          "&a=userAssign" +
          "&key=" +
          key;
        //安卓调用方式  nativeRoute是具体的方法名,
        if (window.collegeNative) {
          window.collegeNative.loadMuduLive(
            liveUrl,
            item.vhallLiveId,
            item.id,
            ""
          );
        }
        //ios调用方式  nativeRoute是具体的方法名,
        if (window.webkit && window.webkit.messageHandlers) {
          let params = {
            baseId: item.id,
            sourceId: "",
            eduId: item.vhallLiveId,
            url: liveUrl
          };
          window.webkit.messageHandlers.loadMuduLive.postMessage(
            JSON.stringify(params)
          );
        }
      } else {
        //先获取原生的获取口令
        JSH.request({
          url: CloudMarketing.getvhallCode,
          method: "get",
          params: { classId: item.vhallLiveId },
          success(res) {
            if (res.success) {
              owner.vhallObj = res.data;
              let prems = {
                param: {
                  baseId: item.id,
                  sourceId: "",
                  eduId: item.vhallLiveId,
                  invitationCode: owner.vhallObj.student_pwd,
                  lecturerId: item.lecturerId.toString(),
                  lecturerName: item.lecturerName
                },
                routePath: "com.jsh.marketingcollege.ui.VhLiveClassActivity"
              };
              //安卓调用方式  nativeRoute是具体的方法名,
              if (window.collegeNative) {
                window.collegeNative.nativeRoute(JSON.stringify(prems));
              }
              //ios调用方式  nativeRoute是具体的方法名,
              if (window.webkit && window.webkit.messageHandlers) {
                window.webkit.messageHandlers.nativeRoute.postMessage(
                  JSON.stringify(prems)
                );
              }
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
    /**
     * 局部刷新
     */
    localRefresh(id) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.partialRefresh,
        method: "get",
        params: {
          baseId: id
        },
        success(data) {
          if (data.success) {
            owner.againTrigger = false;
            if (owner.list.length > 0) {
              owner.list.forEach(item => {
                if (item.id == data.data.id) {
                  item.status = data.data.status;
                  item.flag = data.data.leftStatusCode;
                  item.countdown = data.data.countdown;
                }
              });
            }
            if (owner.topicList.length > 0) {
              owner.topicList.forEach(item => {
                item.courses.forEach(item1 => {
                  if (item1.id == data.data.id) {
                    item1.rightBottomStatusCode = data.data.status;
                    item1.leftTopStatusCode = data.data.leftStatusCode;
                    item1.countdown = data.data.countdown;
                  }
                });
              });
            }
          } else {
            owner.$toast(data.errorMsg);
          }
        },
        error() {}
      });
    },
    /**
     * 跳转到课程详情页面
     */
    goClassDetail(item) {
      const owner = this;
      if (item.studyStartTime !== null && item.studyStartTime !== "") {
        //    有值判断 在前 还是在后
        const now = Date.parse(new Date());
        const start = item.studyStartTimeDate;
        const end = item.studyEndTimeDate;
        if (now < start) {
          owner.$toast("学习未开始");
          return;
        }
        if (now > end) {
          owner.$toast(
            "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
          );
          return;
        }
        // const startTime = value.studyStartTime
      }
      this.temID = item.id;
      //路由地址需要之后再改
      if (item.courseType === "1") {
        this.$router.push({
          path: "/public/recorded-course",
          query: {
            id: item.id
          }
        });
      } else if (item.courseType === "2") {
        this.$router.push({
          path: "/public/live-course",
          query: {
            id: item.id
          }
        });
      } else if (item.courseType === "3") {
        this.$router.push({
          path: "/public/discussion-course",
          query: {
            id: item.id
          }
        });
      } else if (item.courseType === "4") {
        this.$router.push({
          path: "/public/series-course",
          query: {
            id: item.id
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.course-recommend {
  width: 100%;
  background: #ffffff;
  padding: 15px 5px 10px 0px;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 10;
  align-items: center;
  .tip {
    margin-top: 10px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: white;
    background: #2780f8;
    border-radius: 30px;
    padding: 3px 10px;
  }

  .tip3 {
    margin-top: 10px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: white;
    background: #adb9ca;
    border-radius: 30px;
    padding: 3px 10px;
  }
  .item {
    display: inline-block;
    vertical-align: middle;
    width: 308px !important;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(150, 151, 153, 1);
    padding: 10px 10px 10px 10px;
    margin-right: 10px;
    background: #f2f3f5;
    border-radius: 5px;
    .pic {
      width: 120px;
      height: 75px;
      background: white;
      position: relative;
      img {
        width: 120px;
        height: 75px;
        border-radius: 6px;
      }
      .detail {
        padding: 3px 5px;
        height: 50px;
        width: 100%;
        position: absolute;
        color: white;
        font-size: 12px;
        background-image: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.7),
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0)
        );
        bottom: 0px;
        opacity: 0.5;
        border-radius: 6px;
      }
      .live-down {
        display: flex;
        align-items: center;
        position: absolute;
        top: 8px;
        left: 8px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        padding: 3px 6px;
        background: linear-gradient(
          127deg,
          rgba(225, 57, 118, 1) 0%,
          rgba(234, 52, 37, 1) 100%
        );
        border-radius: 4px;

        .circle {
          width: 4px;
          height: 4px;
          border-radius: 4px;
          background: white;
          margin-right: 3px;
        }
      }

      .live-now {
        position: absolute;
        bottom: 4px;
        right: 0px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        padding: 3px 6px;
        background: rgba(255, 187, 0, 1);
        border-radius: 6px 0px 6px 0px;

        img {
          width: 10px;
          height: 10px;
          vertical-align: middle;
          padding-right: 2px;
        }

        span {
          vertical-align: middle;
        }
      }
    }

    .title {
      min-height: 45px;
      white-space: pre-wrap;
      width: 100%;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(50, 50, 51, 1);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .name {
      width: 95px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .time {
      padding-top: 10px;
    }
  }
}
</style>
