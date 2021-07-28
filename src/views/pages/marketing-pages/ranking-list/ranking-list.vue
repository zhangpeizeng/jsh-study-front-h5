<template>
  <div class="ranking-list" style="height: 100%">
    <div
      @click="isLabel = false"
      v-show="isLabel"
      style="height: 100%;width:100%;position: fixed;background: #000000;opacity: 0.5;z-index: 1000"
    ></div>
    <!--        一级标题-->
    <div class="jsh-header">
      <jshHeader ref="childHeader" :header="header"></jshHeader>
    </div>
    <div
      v-show="isLabel"
      class="top-header"
      style="top: 42px;position: fixed;z-index: 1001;"
    >
      <div class="tab-title d-flex align-items-center">
        <div
          @click="changeScreen(1)"
          class="tab-item"
          :class="{ selectBlue: screenType === 1 }"
        >
          <span style="vertical-align: middle">类型 </span>
          <span v-show="screenType === 1" class="triangle-up" />
          <span v-show="screenType === 2" class="triangle-down" />
        </div>
        <div
          @click="changeScreen(2)"
          class="tab-item"
          :class="{ selectBlue: screenType === 2 }"
        >
          <span style="vertical-align: middle">状态 </span>
          <span v-show="screenType === 2" class="triangle-up" />
          <span v-show="screenType === 1" class="triangle-down" />
        </div>
      </div>
      <div v-show="screenType === 1" class="tab-container">
        <div
          class="fin-status"
          @click="changeStatus(0)"
          :class="{ radio: true, active: selectStatus === 0 }"
        >
          不限
        </div>
        <div
          @click="changeStatus(1)"
          class="fin-status"
          :class="{ radio: true, active: selectStatus === 1 }"
        >
          视频
        </div>
        <div
          @click="changeStatus(4)"
          class="fin-status"
          :class="{ radio: true, active: selectStatus === 4 }"
        >
          系列
        </div>
        <div
          @click="changeStatus(2)"
          class="fin-status"
          :class="{ radio: true, active: selectStatus === 2 }"
        >
          音频
        </div>
        <div
          @click="changeStatus(3)"
          class="fin-status"
          :class="{ radio: true, active: selectStatus === 3 }"
        >
          文档
        </div>
        <div
          @click="changeStatus(5)"
          class="fin-status"
          :class="{ radio: true, active: selectStatus === 5 }"
        >
          直播
        </div>
      </div>
      <div v-show="screenType === 2" class="tab-container">
        <div
          class="fin-status"
          @click="changeCourseStatus(0)"
          :class="{ radio: true, active: selectCourseStatus === 0 }"
        >
          不限
        </div>
        <div
          @click="changeCourseStatus(3)"
          class="fin-status"
          :class="{ radio: true, active: selectCourseStatus === 3 }"
        >
          未学习
        </div>
        <div
          @click="changeCourseStatus(1)"
          class="fin-status"
          :class="{ radio: true, active: selectCourseStatus === 1 }"
        >
          学习中
        </div>
        <div
          @click="changeCourseStatus(2)"
          class="fin-status"
          :class="{ radio: true, active: selectCourseStatus === 2 }"
        >
          已学完
        </div>
      </div>
    </div>
    <div class="ranking-tip">
      <span v-if="type === '1'"> 课程热门排行，数据每天00:00更新</span>
      <span v-if="type === '2'"> 新上课程排行，数据每天00:00更新</span>
      <span v-if="type === '3'"> 五星课程排行，数据每天00:00更新</span>
    </div>
    <!--    <div class="set-height" :class="{activeHeight:isLabel}"></div>-->
    <!--        列表-->
    <van-pull-refresh
      v-model="isPullLoading"
      @refresh="onRefresh"
      success-text="加载成功"
    >
      <van-list
        v-model="listDataLoading"
        :finished="listDataFinished"
        @load="onLoadListData"
        finished-text="没有更多了"
        :immediate-check="false"
      >
        <div class="list">
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
                  src="../../../../assets/images/backlogo.png"
                  alt=""
                />
                <div
                  v-if="item.labelLeftCode === 1"
                  class="live-now d-flex align-items-center"
                >
                  <img src="../../../../assets/images/live-now.png" alt="" />
                  <div>直播中</div>
                </div>
                <div
                  v-if="item.labelLeftCode === 2"
                  class="live-now"
                  style="background-color: #c0c4cc"
                >
                  <span>直播结束</span>
                </div>
                <div v-if="item.labelLeftCode === 3" class="live-down">
                  <div class="circle"></div>
                  <span class="d-flex align-items-center"
                    ><div style="line-height: 14px">距开播:</div>
                    <van-count-down
                      @finish="reviseStatus(item.id)"
                      :time="item.countdown"
                  /></span>
                </div>
                <div class="progress-box">
                  <div v-if="item.progress == 100" class="two">已学完</div>
                  <div
                    v-else-if="item.progress || item.progress == 0"
                    class="one"
                  >
                    已学习{{ item.progress }}%
                  </div>
                </div>
              </div>
              <div style="padding-left: 10px;flex-grow: 1">
                <div style="min-height:32px">
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
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="name">
                    <img
                      style="width: 13px;height: 12px;margin-right: 2px"
                      src="../../../../assets/images/icon-teacher.png"
                      alt=""
                    />
                    {{ item.lecturerName }}
                  </div>
                  <div
                    class="d-flex align-items-center"
                    style="margin-left: 25px"
                  >
                    <img
                      style="width: 13px;height: 12px;margin-right: 6px"
                      src="../../../../assets/images/people-icon.png"
                      alt=""
                    />
                    <span>{{ item.studyStudentsNum }}</span>
                  </div>
                </div>
                <div
                  class="d-flex align-items-center justify-content-between mt-6"
                >
                  <div></div>
                  <div
                    v-if="item.status"
                    class="tip"
                    :class="{
                      tip3:
                        item.status === 3 ||
                        item.status === 2 ||
                        item.status === 7
                    }"
                  >
                    <!--                                <img style="width: 14px;height: 14px;vertical-align: middle" src="../../../../assets/images/clock.png" alt="">-->
                    <!--                                <span style="vertical-align: middle">提醒我</span>-->
                    <span
                      @click.stop="nowAppointment(item)"
                      v-if="item.status === 1"
                      style="vertical-align: middle"
                      >立即预约</span
                    >
                    <span
                      v-if="item.status === 2"
                      style="vertical-align: middle"
                      >已预约</span
                    >
                    <span
                      v-if="item.status === 3"
                      style="vertical-align: middle"
                      >报名截止</span
                    >
                    <span
                      @click.stop="viewPlay(item)"
                      v-if="item.status === 4"
                      style="vertical-align: middle"
                      >观看直播</span
                    >
                    <span
                      v-if="item.status === 5"
                      style="vertical-align: middle"
                      >直播回放</span
                    >
                    <span
                      @click.stop="signUp(item)"
                      v-if="item.status === 6"
                      style="vertical-align: middle"
                      >立即报名</span
                    >
                    <span
                      v-if="item.status === 7"
                      style="vertical-align: middle"
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
            <div
              v-if="
                (item.liveStartTimeDate || item.liveEndTimeDate) &&
                  item.liveEndTimeDate > nowDateTime
              "
              class="time"
            >
              <span
                v-if="
                  handleYear(item.liveStartTimeDate) !==
                    handleYear(item.liveEndTimeDate)
                "
              >
                直播时间:{{
                  item.liveStartTimeDate | date("yyyy-MM-dd hh:mm")
                }}至{{ item.liveEndTimeDate | date("yyyy-MM-dd hh:mm") }}
              </span>
              <span v-else>
                直播时间:{{
                  item.liveStartTimeDate | date1("yyyy-MM-dd hh:mm")
                }}至{{ item.liveEndTimeDate | date1("yyyy-MM-dd hh:mm") }}
              </span>
            </div>
            <div
              v-else-if="item.studyStartTimeDate || item.studyEndTimeDate"
              class="time"
            >
              <div style="width: 100%;">
                <img
                  style="width: 12px;height: 12px;margin-right: 6px"
                  src="../../../../assets/images/icon-time.png"
                  alt=""
                />
                <span
                  v-if="
                    handleYear(item.studyStartTimeDate) !==
                      handleYear(item.studyEndTimeDate)
                  "
                >
                  {{ item.studyStartTimeDate | date("yyyy-MM-dd hh:mm") }}至{{
                    item.studyEndTimeDate | date("yyyy-MM-dd hh:mm")
                  }}
                </span>
                <span v-else>
                  {{ item.studyStartTimeDate | date1("yyyy-MM-dd hh:mm") }}至{{
                    item.studyEndTimeDate | date1("yyyy-MM-dd hh:mm")
                  }}
                </span>
              </div>
            </div>
            <div
              class="d-flex align-items-center justify-content-between"
            ></div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <!--        列表无数据-->
    <div class="no-list" v-if="list.length === 0">
      <div style="padding-top: 50%">
        <img src="../../../../assets/images/no-search-data.png" alt="" />
      </div>
      <div style="padding-top: 10px">暂无课程，先学习其他课程吧~</div>
    </div>
    <!--        网络有问题展示-->
    <div class="no-network" v-if="isNetwork">
      <div>
        <div class="set">
          <div style="padding-top: 30%">
            <img src="../../../../assets/images/network.png" alt="" />
          </div>
          <div style="padding-top: 30px;color: #646566;font-size: 14px">
            网络请求失败
          </div>
          <div style="padding-top: 10px">请检查您的网络，重新加载试试吧</div>
          <div class="refresh" @click="searchList(1)">刷新</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { CloudMarketing } from "@/request";
import jshHeader from "../../../../components/jsh-header/jsh-header.vue";
import JSH from "@/core";
import { Toast, List, PullRefresh, CountDown, Dialog } from "vant";
import { formatDate } from "../../../../utils/utils.js";

Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(Dialog);
export default {
  name: "ranking-list",
  filters: {
    Date: function(value) {
      return formatDate(value, "yyyy/MM/dd hh:mm");
    }
  },
  components: { jshHeader },
  data() {
    return {
      isNetwork: false,
      header: {
        title: null,
        rightType: 3,
        rightTypeSort: 1
      },
      type: "", //1-热门排行    2-新课排行   3-五星排行
      time: 30 * 60 * 60 * 1000,
      list: [],
      // 下拉刷新loading
      isPullLoading: false,
      // 上拉加载loading
      listDataLoading: true,
      // 上拉加载数据完成
      listDataFinished: false,
      page: 1, // 页数
      themeId: null, //分类id
      //直播倒计时
      liveInterval: null,
      //口令
      vhallObj: null,
      //按钮防止二次点击
      againTrigger: false,
      isFirstEnter: true,
      temID: "",
      nowDateTime: null,
      //选中的类型标签状态
      selectStatus: 0,
      //选中的课程状态标签状态
      selectCourseStatus: 0,
      isLabel: false, // 筛选
      screenType: 1 // 1类型 2状态
    };
  },
  activated() {
    //获取当前时间
    this.nowDateTime = Date.parse(new Date());
    const owner = this;
    // 局部刷新
    if (!owner.isFirstEnter) {
      JSH.request({
        url: CloudMarketing.partialRefresh,
        method: "get",
        params: {
          baseId: owner.temID
        },
        success(data) {
          if (data.success) {
            if (owner.list.length > 0) {
              owner.list.forEach(value => {
                if (value.id == data.data.id) {
                  value.status = data.data.status;
                  value.labelLeftCode = data.data.leftStatusCode;
                  value.countdown = data.data.countdown;
                }
              });
            }
          } else {
            owner.$toast(data.errorMsg);
          }
        },
        error() {}
      });
    }
    this.$forceUpdate();
    this.isFirstEnter = false;
  },
  created() {
    this.header.title = this.$route.query.title;
    this.type = this.$route.query.type;
    // this.header.title = "热门排行";
    // this.themeId = this.$route.query.id;
    this.themeId = "90";
    this.type = this.$route.query.type;
    this.list = [];
    this.ht.$emit("loading", true);
    this.onRefresh();
  },
  methods: {
    handleYear(data) {
      let date = new Date(data);
      return date.getFullYear();
    },
    changeScreen(val) {
      this.screenType = val;
    },
    /**
     *切换标签（不限，视频，系列，音频，文档，直播）
     */
    changeStatus(val) {
      this.selectStatus = val;
      val > 0 || this.selectCourseStatus > 0
        ? (this.header.rightTypeSort = 2)
        : (this.header.rightTypeSort = 1);
      this.isLabel = false;
      this.onRefresh();
    },
    /**
     *切换课程状态标签（不限，未学习，学习中，已学完）
     */
    changeCourseStatus(val) {
      this.selectCourseStatus = val;
      val > 0 || this.selectStatus > 0
        ? (this.header.rightTypeSort = 2)
        : (this.header.rightTypeSort = 1);
      this.isLabel = false;
      this.onRefresh();
    },
    /**
     *标签是否展示
     */
    fatherLabel() {
      this.isLabel = !this.isLabel;
    },
    /**
     *
     * 修改列表标签的状态
     */
    reviseStatus(id) {
      const _that = this;
      _that.list.forEach(item => {
        if (item.id === id) {
          item.labelLeftCode = 1;
        }
      });
    },
    /**
     *
     * 下拉刷新
     */
    onRefresh() {
      this.isPullLoading = true;
      this.listDataFinished = false;
      this.page = 1;
      this.searchList(this.page, data => {
        setTimeout(() => {
          this.isPullLoading = false;
          console.log(data, "=====================888888888");
          if (data.hasNextPage) {
            this.listDataLoading = false;
          }
        }, 500);
      });
    },
    /**
     * 上拉加载
     */
    onLoadListData() {
      this.listDataLoading = true;
      this.page++;
      setTimeout(() => {
        this.searchList(this.page, data => {
          setTimeout(() => {
            this.isPullLoading = false;
            console.log(data, "1111111");
            if (data.hasNextPage) {
              this.listDataLoading = false;
            }
          }, 1000);
        });
      }, 200);
    },
    /**
     * 获取排行列表
     */
    searchList(page, callback) {
      const owner = this;
      const studyType = this.selectStatus ? this.selectStatus : "";
      const studyStatus = this.selectCourseStatus
        ? this.selectCourseStatus
        : "";
      JSH.request({
        url: CloudMarketing.listCourseRankingList,
        method: "post",
        params: {
          searchType: this.type,
          pageSize: 10,
          pageNum: page,
          studyType: studyType,
          studyStatus: studyStatus
        },
        success(data) {
          if (data.success) {
            owner.ht.$emit("loading", false);
            owner.isNetwork = false;
            if (data.data.hasNextPage) {
              owner.list = owner.list.concat(data.data.list);
              owner.listDataFinished = false;
            } else {
              owner.list = owner.list.concat(data.data.list);
              owner.listDataFinished = true;
            }
            if (page === 1) {
              owner.list = data.data.list;
            }

            owner.noData = owner.list.length === 0;
            callback(data.data);
          } else {
            owner.isNetwork = false;
            Toast(data.errorMsg);
            owner.ht.$emit("loading", false);
          }
        },
        error(e) {
          console.log(e);
          owner.isNetwork = true;
          owner.ht.$emit("loading", false);
        }
      });
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
          } else {
            owner.$toast(data.errorMsg);
          }
        },
        error() {}
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
.jsh-header {
  background-color: white;
  z-index: 1002;
  position: fixed;
  top: 0;
  left: 0;
  width: 100% !important;
}
.ranking-tip {
  position: fixed;
  width: 100%;
  z-index: 999;
  top: 44px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f86e21;
  background: #fef9ec;
  padding: 10px 15px;
}
.top-header {
  background-color: #ffffff;
  width: 100%;
  line-height: 34px;
  /*padding: 9px 15px;*/
  .radio {
    font-size: 13px;
    display: inline-block;
    width: 72px;
    height: 24px;
    color: #7d7e80;
    text-align: center;
    line-height: 24px;
    background: #f5f5f5;
    border-radius: 4px;

    &.active {
      color: #2780f8;
      border-radius: 6px;
      border: 1px solid rgba(39, 128, 248, 1);
      background: url("../../../../assets/images/radio-checked-blue.png")
          no-repeat right bottom,
        rgba(239, 246, 255, 1);
      background-size: 10px 13px;
    }

    & + .radio {
      margin-right: 14px;
    }
  }
  .fin-status {
    margin-top: 5px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(125, 126, 128, 1);
    background: rgba(242, 243, 245, 1);
    border-radius: 6px;
    width: 20%;
    height: 24px;
    text-align: center;
    line-height: 24px;
    margin-right: 14px;
  }
  .tab-container {
    padding: 15px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .test {
      flex: 1;
      text-align: center;
      border-radius: 17.5px 0px 0px 17.5px;
      border: 1px solid rgba(34, 126, 247, 1);
      color: #227ef7;
    }
    .homework {
      flex: 1;
      text-align: center;
      border: 1px solid rgba(34, 126, 247, 1);
      border-left: 0;
      border-right: 0;
      color: #227ef7;
    }

    .pkwall {
      flex: 1;
      text-align: center;
      border-radius: 0px 50px 50px 0px;
      border: 1px solid rgba(34, 126, 247, 1);
      color: #227ef7;
    }
  }
  .tab-title {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;
    padding: 5px 0;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
    .tab-item {
      width: 30%;
      text-align: center;
    }
    .selectBlue {
      color: #2283e2;
    }
    .triangle-up {
      vertical-align: middle;
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-bottom: 4px solid #2780f8;
    }
    .triangle-down {
      vertical-align: middle;
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-top: 4px solid #dcdee0;
    }
  }
}

.list {
  .item {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(150, 151, 153, 1);
    padding: 10px 10px 10px 10px;
    margin: 10px 10px 0px 10px;
    background-color: white;
    border-radius: 10px;

    .pic {
      position: relative;

      img {
        width: 144px;
        height: 90px;
        border-radius: 6px;
      }

      .live-down {
        display: flex;
        align-items: center;
        position: absolute;
        top: 0px;
        left: 0px;
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
        top: 0px;
        left: 0px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        padding: 3px 6px;
        background: rgba(255, 187, 0, 1);
        border-radius: 4px;

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

      .progress-box {
        position: absolute;
        bottom: 4px;
        right: 0px;
        color: white;
        font-size: 11px;
        text-align: center;
        border-radius: 3px 0px 6px 0px;
        overflow: hidden;
        .one {
          padding: 1px 4px;
          background: #2780f8;
        }
        .two {
          padding: 1px 4px;
          background: #c3c7d0;
        }
      }
    }

    .title {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(50, 50, 51, 1);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .name {
      width: 95px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .tip {
      display: flex;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: white;
      background: #2780f8;
      border-radius: 30px;
      padding: 3px 10px;
    }

    .tip3 {
      display: flex;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: white;
      background: #adb9ca;
      border-radius: 30px;
      padding: 3px 10px;
    }

    .time {
      padding-top: 10px;
    }
  }
}

.no-list {
  text-align: center;
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0%;
  top: 5%;
  background-color: white;

  img {
    width: 67px;
    height: 49px;
  }

  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}

.no-network {
  top: 0%;
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
</style>
<style lang="scss">
.van-count-down {
  color: #ffffff;
  font-size: 10px !important;
  padding-left: 3px;
  line-height: 10px;
}

.ranking-list {
  .activeHeight {
    padding-top: 120px !important;
  }
  .van-pull-refresh {
    min-height: 100%;
    padding-top: 80px;
  }
}
</style>
