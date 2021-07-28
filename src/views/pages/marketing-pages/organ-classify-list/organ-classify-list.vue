<template>
  <div class="organ-classify-list">
    <div
      @click="isLabel = false"
      v-show="isLabel"
      style="height: 100%;width:100%;position: fixed;z-index: 2"
    >
      <div style="width: 100%;height: 105px;background:white;"></div>
      <div
        style="height: 100%;width:100%;opacity: 0.5;background: #000000;"
      ></div>
    </div>
    <div
      v-show="isLabel"
      class="top-header"
      :class="{ Top100: classifyListTree.length > 0 }"
      style="top: 42px;position: fixed;z-index: 8;"
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
    <!--        一级标题-->
    <div class="jsh-header">
      <jshHeader :header="header"></jshHeader>
    </div>
    <div style="position: fixed;width: 100%;top: 42px;z-index: 3">
      <van-tabs
        :ellipsis="false"
        v-if="classifyListTree.length > 0"
        @click="handOnClick"
      >
        <van-tab
          v-for="(item, index) in classifyListTree"
          :key="index"
          :title="item.classifyName"
          :name="item.id"
        >
        </van-tab>
      </van-tabs>
    </div>
    <!--        列表-->
    <van-pull-refresh
      v-if="list.length !== 0"
      v-model="isPullLoading"
      @refresh="onRefresh"
      success-text="加载成功"
      :class="{ pt87: classifyListTree.length > 0 }"
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
                v-if="item.leftTopStatusCode === 1"
                class="live-now d-flex align-items-center"
              >
                <img src="../../../../assets/images/live-now.png" alt="" />
                <div>直播中</div>
              </div>
              <div
                v-if="item.leftTopStatusCode === 2"
                class="live-now d-flex align-items-center"
                style="background-color: #c0c4cc"
              >
                <div class="circle"></div>
                <span>直播结束</span>
              </div>
              <div v-if="item.leftTopStatusCode === 3" class="live-down">
                <div class="circle"></div>
                <span class="d-flex align-items-center"
                  ><div style="line-height: 14px">即将开始</div>
                  <van-count-down
                    @finish="reviseStatus(item.id)"
                    :time="item.countdown"
                  />
                </span>
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
              <div style="min-height:40px">
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
              <div class="d-flex align-items-center">
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
              <div class="d-flex align-items-center justify-content-between">
                <div></div>
                <div
                  v-if="item.rightBottomStatusCode"
                  class="tip3"
                  :class="{
                    tip:
                      item.rightBottomStatusCode === 1 ||
                      item.rightBottomStatusCode === 6,
                    tip4:
                      item.rightBottomStatusCode === 4 ||
                      item.rightBottomStatusCode === 8 ||
                      item.rightBottomStatusCode === 5
                  }"
                >
                  <!--                                <img style="width: 14px;height: 14px;vertical-align: middle" src="../../../../assets/images/clock.png" alt="">-->
                  <!--                                <span style="vertical-align: middle">提醒我</span>-->
                  <span
                    @click.stop="nowAppointment(item)"
                    v-if="item.rightBottomStatusCode === 1"
                    style="vertical-align: middle"
                    >立即预约</span
                  >
                  <span
                    v-if="item.rightBottomStatusCode === 2"
                    style="vertical-align: middle"
                    >已预约</span
                  >
                  <span
                    v-if="item.rightBottomStatusCode === 3"
                    style="vertical-align: middle"
                    >报名截止</span
                  >
                  <span
                    @click.stop="viewPlay(item)"
                    v-if="item.rightBottomStatusCode === 4"
                    style="vertical-align: middle"
                    >观看直播</span
                  >
                  <span
                    v-if="item.rightBottomStatusCode === 5"
                    style="vertical-align: middle"
                    >直播回放</span
                  >
                  <span
                    @click.stop="signUp(item)"
                    v-if="item.rightBottomStatusCode === 6"
                    style="vertical-align: middle"
                    >立即报名</span
                  >
                  <span
                    v-if="item.rightBottomStatusCode === 7"
                    style="vertical-align: middle"
                    >已报名</span
                  >
                  <span
                    @click.stop="addStudy(item)"
                    v-if="item.rightBottomStatusCode === 8"
                    style="vertical-align: middle"
                    >加入学习</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="
              (item.liveStartTime || item.liveEndTime) &&
                item.liveEndTime > nowDateTime
            "
            class="time"
          >
            <span
              v-if="
                handleYear(item.liveStartTime) !== handleYear(item.liveEndTime)
              "
            >
              直播时间:{{ item.liveStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                item.liveEndTime | date("yyyy-MM-dd hh:mm")
              }}
            </span>
            <span v-else>
              直播时间:{{ item.liveStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
                item.liveEndTime | date1("yyyy-MM-dd hh:mm")
              }}
            </span>
          </div>
          <div
            v-else-if="item.studyStartTime || item.studyEndTime"
            class="time"
          >
            <div style="width: 100%;">
              <img
                style="width: 13px;height: 12px;margin-right: 2px"
                src="../../../../assets/images/icon-time.png"
                alt=""
              />
              <span
                v-if="
                  handleYear(item.studyStartTime) !==
                    handleYear(item.studyEndTime)
                "
              >
                {{ item.studyStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                  item.studyEndTime | date("yyyy-MM-dd hh:mm")
                }}
              </span>
              <span v-else>
                {{ item.studyStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
                  item.studyEndTime | date1("yyyy-MM-dd hh:mm")
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <!--        分类列表无数据-->
    <div
      class="no-list-data"
      :class="{ threeTab: classifyListTree.length > 0 }"
      v-if="list.length === 0"
    >
      <div class="set">
        <div style="padding-top: 50%">
          <img src="../../../../assets/images/no-search-data.png" alt="" />
        </div>
        <div style="padding-top: 10px">暂无课程，先学习其他课程吧～</div>
      </div>
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
          <div class="refresh" @click="classificationList()">刷新</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jshHeader from "../../../../components/jsh-header/jsh-header.vue";
import Vue from "vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import { Toast, List, PullRefresh, CountDown, Dialog } from "vant";
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(Dialog);
export default {
  name: "organ-classify-list",
  components: {
    jshHeader
  },
  data() {
    return {
      temID: "",
      isFirstEnter: true, //局部刷新
      isNetwork: false, //网络状态
      nowDateTime: null,
      header: {
        title: "",
        rightType: 3,
        rightTypeSort: 1
      },
      list: [],
      // 下拉刷新loading
      isPullLoading: false,
      // 上拉加载loading
      listDataLoading: false,
      // 上拉加载数据完成
      listDataFinished: false,
      page: 1, // 页数
      studyTerminalCode: "", // 学习终端（埋点用）
      classifyNameOne: "", // 一级分类名称（埋点用）
      classifyIdTwo: "", //二级的分类的id
      classifyListTree: [], //三级的tab
      idTwo: "", //二级分类的id
      id: "", //三级分类的id
      isLabel: false,
      //选中的标签状态
      selectStatus: 0,
      selectCourseStatus: 0,
      screenType: 1 // 1类型 2状态
    };
  },
  created() {
    this.classifyNameOne = this.$route.query.classifyNameOne;
    this.classifyIdTwo = this.$route.query.classifyIdTwo;
    this.idTwo = this.$route.query.idTwo;
    this.header.title = this.$route.query.title;
    this.studyTerminalCode = localStorage.getItem(
      "studyTerminalCode",
      Number(this.studyTerminalCode)
    );
    // this.onRefresh();
    this.ht.$emit("loading", true);
    this.classificationList();
  },
  activated() {
    const owner = this;
    //获取当前时间
    this.nowDateTime = Date.parse(new Date());
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
    this.isFirstEnter = false;
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
      this.oneClassList();
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
     *切换tab标签
     */
    handOnClick(name, title) {
      this.isLabel = false;
      console.log(title);
      const _that = this;
      _that.id = name;
      // gio统计--三级课程分类点击次数
      setTimeout(() => {
        window.gio("track", "course_category_click_time3", {
          course_category: _that.classifyNameOne, // 一级分类名称
          course_category_2: _that.header.title, // 二级分类名称
          course_category_3: title, // 三级分类名称
          client_platform: _that.studyTerminalCode // 所属学习终端
        });
      }, 50);
      // 获取三级下的课程
      _that.oneClassList();
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
     * 获取机构运营-获取课程分类的所有三级分类（tab）
     * @type {number[]}
     */
    classificationList() {
      const _that = this;
      // 获取二级分类接口
      JSH.request({
        url: CloudMarketing.listClassClassifyNodesTwoLevel,
        method: "get",
        params: { classifyId: this.classifyIdTwo, studyTerminal: "" },
        success(data) {
          if (data.success) {
            if (data.data && data.data.length > 0) {
              _that.classifyListTree = data.data;
              _that.id = data.data[0].id;
            }
            _that.oneClassList();
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    /**
     * 三级分类下的课程（如果没有三级tab就查二级下的课程）
     * @type {number[]}
     */
    oneClassList(page, callback) {
      const owner = this;
      owner.isNetwork = false;
      const studyType = this.selectStatus ? this.selectStatus : "";
      const studyStatus = this.selectCourseStatus
        ? this.selectCourseStatus
        : "";
      const params = {
        studyType: studyType,
        studyStatus: studyStatus
      };
      if (this.classifyListTree.length == 0) {
        params.id = this.idTwo;
      } else {
        params.id = this.id;
      }
      // 获取二级分类接口
      JSH.request({
        url: CloudMarketing.listClassClassifyCourses,
        method: "get",
        params: params,
        success(data) {
          if (data.success) {
            owner.againTrigger = false;
            owner.ht.$emit("loading", false);
            if (data.data.course) {
              owner.list = data.data.course;
            }
            if (page === 1) {
              callback(data);
            }
          } else {
            Toast(data.errorMsg);
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
     *
     * 下拉刷新
     */
    onRefresh() {
      this.isPullLoading = true;
      this.listDataFinished = false;
      this.oneClassList(1, () => {
        setTimeout(() => {
          this.isPullLoading = false;
          this.againTrigger = false;
        }, 500);
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
            owner.oneClassList();
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
        const start = item.studyStartTime;
        const end = item.studyEndTime;
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
<style lang="scss">
.organ-classify-list {
  .van-pull-refresh {
    padding-top: 87px;
  }
  .van-tabs__line {
    background: rgba(39, 128, 248, 1);
  }
  .van-tab {
    padding: 20px !important;
  }
  .van-pull-refresh {
    padding-top: 45px;
    min-height: 85%;
  }
  .pt87 {
    padding-top: 87px;
  }
}
</style>
<style scoped lang="scss">
.organ-classify-list {
  height: 100%;
  .jsh-header {
    background-color: white;
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100% !important;

    .header {
      display: flex;
      justify-content: space-between;
      height: 44px;
      line-height: 44px;
      font-size: 17px;

      .titleBox {
        text-align: center;
      }

      /*.titleBox :nth-child(2) {*/
      /*    margin-left: 66px;*/
      /*}*/

      .m-l-66 {
        margin-left: 66px;
      }

      .m-l-33 {
        margin-left: 20px;
      }
    }
  }
  .Top100 {
    top: 87px !important;
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
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
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
      border-radius: 10px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(150, 151, 153, 1);
      margin: 10px;
      padding: 15px 10px;
      background-color: white;

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
            border-radius: 2px;
            background: white;
            margin-right: 3px;
          }
        }

        .live-now {
          .circle {
            width: 4px;
            height: 4px;
            border-radius: 4px;
            background: white;
            margin-right: 3px;
          }
          position: absolute;
          top: 0px;
          left: 0px;
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          padding: 3px 6px;
          background: rgba(255, 187, 0, 1);
          border-radius: 2px;

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
          border-radius: 6px 0px 12px 0px;
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
        margin-top: 8px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: white !important;
        background: rgba(39, 128, 248, 1) !important;
        border-radius: 30px;
        padding: 3px 10px;
      }

      .tip3 {
        display: flex;
        margin-top: 8px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: white;
        background: #adb9ca;
        border-radius: 30px;
        padding: 3px 10px;
      }
      .tip4 {
        margin-top: 8px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: white !important;
        background: rgba(39, 128, 248, 1) !important;
        border-radius: 30px;
        padding: 3px 10px;
      }

      .time {
        padding-top: 10px;
      }
    }
  }
  .no-list-data {
    padding-top: 60px;
    text-align: center;
    width: 100%;
    height: 83%;

    .set {
      height: 550px;
      margin: 15px;
      background: white;
      border-radius: 10px;
    }

    img {
      width: 67px;
      height: 49px;
    }

    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
  .threeTab {
    padding-top: 80px;
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
}
</style>
