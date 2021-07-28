<template>
  <div class="search-list">
    <!--        头部搜索框-->
    <div class="jsh-header">
      <div class="header">
        <div style="padding-top: 5px" class="left">
          <van-icon
            @click="back"
            size="5vw"
            color="#227EF7"
            name="arrow-left"
          />
        </div>
        <div @click="needFocus()" id="btn"></div>
        <van-search
          @click="displayHistory()"
          :formatter="filterEmoji"
          @search="onSearch"
          @focus="onFocus"
          :autofocus="true"
          id="input"
          v-model="codeOrName"
          placeholder="课程名称/分类/讲师/型号"
        />
        <div class="right1" @click="cancle()">
          搜索
        </div>
      </div>
    </div>
    <div id="viewbottom"></div>
    <!--    历史搜索-->
    <div v-if="showHistory" class="history-search">
      <div class="d-flex justify-content-between align-items-center">
        <div class="search-title">历史搜索</div>
        <div @click="clearHistory()">
          <img
            style="width: 18px;height: 18px"
            src="../../../../assets/images/delete.png"
            alt=""
          />
        </div>
      </div>
      <div
        v-if="history.length === 0"
        style="text-align: center;padding-top:35px"
      >
        <img
          style="width: 34px;height: 26px;vertical-align: middle"
          src="../../../../assets/images/no-search-data.png"
          alt=""
        />
        <span
          style="color:rgba(153,153,153,1);font-size: 13px;vertical-align: middle;padding-left: 5px;"
          >暂无搜索历史</span
        >
      </div>
      <div class="search-content">
        <div
          @click="historyItem(item)"
          v-for="(item, index) in history"
          :key="index"
          class="detail"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <!--        列表-->
    <van-pull-refresh
      v-if="!showHistory"
      v-model="isPullLoading"
      @refresh="onRefresh"
      success-text="加载成功"
      style="min-height: 650px;"
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
                  v-if="item.leftStatus === 3"
                  class="live-down d-flex align-items-center"
                >
                  <div class="circle"></div>
                  <div class="d-flex align-items-center">
                    <div style="line-height: 14px">距开播:</div>
                    <van-count-down
                      @finish="reviseStatus(item.id)"
                      :time="item.countdown"
                    />
                  </div>
                </div>
                <div v-if="item.leftStatus === 1" class="live-now">
                  <img src="../../../../assets/images/live-now.png" alt="" />
                  <span>直播中</span>
                </div>
                <div
                  v-if="item.leftStatus === 2"
                  style="background-color: #c0c4cc"
                  class="live-now"
                >
                  <span>直播结束</span>
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
                <div style="min-height: 40px">
                  <div class="title">
                    <!--<span v-if="item.courseType==='1'">[录播/文档课]</span>-->
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
                    v-if="item.status"
                    class="tip"
                    :class="{
                      tip3:
                        item.status === '3' ||
                        item.status === '2' ||
                        item.status === '7'
                    }"
                  >
                    <!--                                <img style="width: 14px;height: 14px;vertical-align: middle" src="../../../../assets/images/clock.png" alt="">-->
                    <!--                                <span style="vertical-align: middle">提醒我</span>-->
                    <span
                      @click.stop="nowAppointment(item)"
                      v-if="item.status === '1'"
                      style="vertical-align: middle"
                      >立即预约</span
                    >
                    <span
                      v-if="item.status === '2'"
                      style="vertical-align: middle"
                      >已预约</span
                    >
                    <span
                      v-if="item.status === '3'"
                      style="vertical-align: middle"
                      >报名截止</span
                    >
                    <span
                      @click.stop="viewPlay(item)"
                      v-if="item.status === '4'"
                      style="vertical-align: middle"
                      >观看直播</span
                    >
                    <span
                      v-if="item.status === '5'"
                      style="vertical-align: middle"
                      >直播回放</span
                    >
                    <span
                      @click.stop="signUp(item)"
                      v-if="item.status === '6'"
                      style="vertical-align: middle"
                      >立即报名</span
                    >
                    <span
                      v-if="item.status === '7'"
                      style="vertical-align: middle"
                      >已报名</span
                    >
                    <span
                      @click.stop="addStudy(item)"
                      v-if="item.status === '8'"
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
                  handleYear(item.liveStartTime) !==
                    handleYear(item.liveEndTime)
                "
              >
                直播时间:{{ item.liveStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                  item.liveEndTime | date("yyyy-MM-dd hh:mm")
                }}
              </span>
              <span v-else>
                直播时间:{{
                  item.liveStartTime | date1("yyyy-MM-dd hh:mm")
                }}至{{ item.liveEndTime | date1("yyyy-MM-dd hh:mm") }}
              </span>
            </div>
            <div style="width: 100%;" v-else>
              <div v-if="item.studyStartTime || item.studyEndTime" class="time">
                <img
                  style="width: 12px;height: 12px;margin-right: 6px"
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
      </van-list>
    </van-pull-refresh>
    <!--        列表无数据-->
    <div class="no-list" v-if="list.length === 0 && !showHistory && noData">
      <div style="padding-top: 50%">
        <img src="../../../../assets/images/no-search-data.png" alt="" />
      </div>
      <div style="padding-top: 10px">
        找不到任何与“{{ codeOrName }}”匹配的内容
      </div>
    </div>
    <!--        直播提示框-->
    <div
      v-show="isNav && !showHistory"
      style="position: fixed;bottom: 2%;left: 15px;"
    >
      <liveFrame></liveFrame>
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
          <div class="refresh" @click="onRefresh()">刷新</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import liveFrame from "../../../../components/live-frame/live-frame.vue";
import Vue from "vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import { Toast, List, PullRefresh, CountDown, Dialog } from "vant";
import { formatDate } from "../../../../utils/utils.js";

Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(Dialog);
export default {
  name: "search-list",
  components: {
    liveFrame
  },
  filters: {
    Date: function(value) {
      return formatDate(value, "yyyy/MM/dd hh:mm");
    }
  },
  data() {
    return {
      //当前登录人得id
      accountId: 0,
      i: 0,
      isNav: true,
      isNetwork: false,
      emojiReg: /\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\ud83e[\udd00-\udfff]|[\u2600-\u27ff]|[\s]/g,
      list: [],
      count: 0,
      page: 1, // 页数
      //搜索的内容
      codeOrName: "",
      // 下拉刷新loading
      isPullLoading: false,
      // 上拉加载loading
      listDataLoading: false,
      // 上拉加载数据完成
      listDataFinished: false,
      //按钮防止二次点击
      againTrigger: false,
      //展示历史搜索页面
      showHistory: true,
      //无数据
      noData: false,
      //历史记录
      history: [],
      nowDateTime: null,
      type: 1
    };
  },
  activated() {
    //获取当前时间
    this.nowDateTime = Date.parse(new Date());
    console.log(
      this.nowDateTime,
      "获取当前时间4444444444444444444444444444444"
    );
    //上滑，下滑的监听
    window.addEventListener("scroll", this.handleScroll, true);
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  created() {
    this.type = localStorage.getItem("threePlatform");
    this.accountId = localStorage.getItem("accountId");
    // this.list = [];
    // 如果是运营中台跳转过来的话，先展示搜索内容
    if (this.type) {
      this.cancle();
    }
  },
  mounted() {
    if (!this.type) {
      setTimeout(() => {
        document.getElementById("input").focus();
        // document.getElementById("input").focus();
        this.needFocus();
      }, 200);
    }
  },
  methods: {
    handleYear(data) {
      let date = new Date(data);
      return date.getFullYear();
    },
    needFocus() {
      // let button = document.getElementById('btn');
      let inputElem = document.getElementById("input");
      inputElem.focus();
    },
    /**
     * 点击某个历史记录进行搜索
     */
    historyItem(item) {
      let owner = this;
      // this.$loading.show(8000);
      owner.ht.$emit("loading", true);
      owner.codeOrName = item;
      owner.showHistory = false;
      this.onRefresh();
      this.setHistorys();
    },
    /**
     * 输入框获取焦点时触发
     */
    onFocus() {
      let owner = this;
      // this.list = [];
      // owner.showHistory = true;
      // owner.goTop();
      owner.noData = false;
      owner.getHistorys();
    },
    displayHistory() {
      let owner = this;
      owner.list = [];
      owner.showHistory = true;
    },
    // goTop() {
    //   document.documentElement.scrollTop = 0;
    // },
    /**
     * historys获取localStorage
     */
    getHistorys() {
      let history = localStorage.getItem(this.accountId);
      if (history) {
        this.history = JSON.parse(history);
      }
    },
    /**
     * historys存入localStorage
     */
    setHistorys() {
      let owner = this;
      // 搜索框有内容且不在历史记录里
      if (
        owner.codeOrName &&
        owner.codeOrName !== "" &&
        owner.codeOrName !== " "
      ) {
        // let Arr = Array.from(new Set(owner.history));
        for (let i = this.history.length - 1; i >= 0; i--) {
          if (owner.codeOrName == owner.history[i]) {
            owner.history.splice(i, 1);
          }
        }
        owner.history = [owner.codeOrName, ...owner.history];
        // owner.history = owner.history.push(owner.codeOrName);
      }
      // 历史记录只保存10条
      if (owner.history && owner.history.length && owner.history.length > 10) {
        owner.history = owner.history.slice(0, 10);
      }
      localStorage.setItem(this.accountId, JSON.stringify(owner.history));
    },
    /**
     * 删除历史记录
     */
    clearHistory() {
      this.history = [];
      localStorage.removeItem(this.accountId);
    },
    /**
     * 监听上滑下滑
     */
    handleScroll() {
      // 页面滚动距顶部距离
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // let scrollTop = document
      //   .getElementById("viewbottom")
      //   .getBoundingClientRect().top;
      let scroll = scrollTop - this.i;
      if (scroll > 10) {
        this.i = scrollTop;
        this.isNav = true;
      } else if (scroll < -10) {
        this.i = scrollTop;
        this.isNav = false;
      }
    },
    filterEmoji(value) {
      return value.replace(this.emojiReg, "");
    },
    back() {
      if (this.type && this.type !== "undefined") {
        console.log(typeof this.type);
        //安卓调用方式  nativeRoute是具体的方法名,
        if (window.collegeNative) {
          window.collegeNative.backToThreePlatform();
        }
        //ios调用方式  nativeRoute是具体的方法名,
        if (window.webkit && window.webkit.messageHandlers) {
          window.webkit.messageHandlers.backToNative.postMessage("");
        }
      } else {
        this.$router.go(-1); //返回上一层
      }
    },
    /**
     *
     * 搜索
     */
    cancle() {
      // this.$loading.show(8000);
      this.ht.$emit("loading", true);
      this.showHistory = false;
      this.$forceUpdate();
      this.setHistorys();
      this.onRefresh();
    },
    /**
     *
     * 修改列表标签的状态
     */
    reviseStatus(id) {
      const _that = this;
      _that.list.forEach(item => {
        if (item.id === id) {
          item.leftStatus = 1;
        }
      });
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      this.isPullLoading = true;
      this.listDataFinished = false;
      this.page = 1;
      this.searchList(this.page, () => {
        setTimeout(() => {
          this.isPullLoading = false;
        }, 500);
      });
    },
    /**
     * 上拉加载
     */
    onLoadListData() {
      this.listDataLoading = true;
      this.page++;
      this.searchList(this.page, () => {
        setTimeout(() => {
          this.isPullLoading = false;
          this.listDataLoading = false;
        }, 1000);
      });
    },
    /**
     * 获取搜索列表
     */
    searchList(page, callback) {
      const _that = this;
      JSH.request({
        url: CloudMarketing.listAppLiveCourseIndexByCondition,
        method: "post",
        params: {
          codeOrName: this.codeOrName,
          pageSize: 10,
          pageNum: page
        },
        success(data) {
          if (data.success) {
            _that.isNetwork = false;
            _that.againTrigger = false;
            // _that.$loading.hide();
            _that.ht.$emit("loading", false);
            if (data.data.list.length < 10) {
              _that.listDataFinished = true;
            }
            let numList = [];
            numList = data.data.list;
            if (page === 1) {
              _that.list = data.data.list;
              if (data.data.list.length === 0) {
                _that.noData = true;
              }
            } else {
              _that.noData = false;
              numList.forEach(item => {
                _that.list.push(item);
              });
            }
            callback(data);
          } else {
            // Toast(res.errorMsg);
            _that.againTrigger = false;
            // _that.$loading.hide();
            _that.ht.$emit("loading", false);
          }
        },
        error(e) {
          _that.againTrigger = false;
          _that.isNetwork = true;
          // _that.$loading.hide();
          _that.ht.$emit("loading", false);
          console.log(e);
        }
      });
    },
    /**
     * 搜索框回车时触发
     */
    onSearch() {
      // this.$loading.show(7000);
      this.ht.$emit("loading", true);
      this.showHistory = false;
      this.setHistorys();
      this.onRefresh();
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
            owner.onRefresh();
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
          item.vhallClassId +
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
            item.vhallClassId,
            item.id,
            ""
          );
        }
        //ios调用方式  nativeRoute是具体的方法名,
        if (window.webkit && window.webkit.messageHandlers) {
          let params = {
            baseId: item.id,
            sourceId: "",
            eduId: item.vhallClassId,
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
          params: { classId: item.vhallClassId },
          success(res) {
            if (res.success) {
              owner.vhallObj = res.data;
              let prems = {
                param: {
                  baseId: item.id,
                  sourceId: "",
                  eduId: item.vhallClassId,
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
    }
  }
};
</script>

<style scoped lang="scss">
.search-list {
  height: 100%;
}

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
    position: relative;

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      width: 270px;
      height: 44px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .van-search {
      width: 72%;
      padding: 10px 0px;
    }

    .van-search__content {
      border-radius: 30px;
    }

    .primary {
      background: #1bb5f1;
      color: #fff;
      border: 0;
    }

    .danger {
      background: #ef4f4f;
      color: #fff;
      border: 0;
    }

    .left {
      padding: 0 8px 0 15px;
      font-size: 14px;
      color: #333;
    }

    .right {
      padding: 0 15px 0 8px;
      font-size: 14px;
      color: #666666;
    }

    .right1 {
      padding: 0 15px 0 8px;
      font-size: 16px;
      color: rgba(39, 128, 248, 1);
      font-family: PingFangSC-Regular, PingFang SC;
    }
  }
}

.history-search {
  height: 100%;
  padding: 60px 15px 15px 15px;
  background-color: white;

  .search-title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(50, 50, 51, 1);
    padding-bottom: 15px;
  }

  .search-content {
    /*height: 150px;*/
    /*overflow: hidden;*/
    /*background-color: red;*/
    margin-bottom: 40px;
    /*padding-bottom: 10px;*/

    .detail {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 15px;
      margin-bottom: 16px;
      display: inline-block;
      border-radius: 30px;
      border: 1px solid rgba(220, 222, 224, 1);
      padding: 5px 10px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
    }
  }
}

.list {
  margin-top: 50px;

  .item {
    border-radius: 10px;
    margin: 10px 10px 0px 10px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(150, 151, 153, 1);
    padding: 10px 10px 10px 10px;
    background-color: white;

    .pic {
      position: relative;

      img {
        width: 144px;
        height: 90px;
        border-radius: 6px;
      }

      .live-down {
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
        border-radius: 6px 0px 6px 0px;

        img {
          width: 10px;
          height: 10px;
          vertical-align: middle;
          padding-right: 2px;
          border-radius: 0px;
        }

        span {
          vertical-align: middle;
        }
      }

      .progress-box {
        position: absolute;
        bottom: 3px;
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

    .name {
      width: 95px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
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

    .tip {
      display: flex;
      margin-top: 10px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(39, 128, 248, 1);
      background: rgba(225, 238, 255, 1);
      border-radius: 30px;
      padding: 3px 10px;
    }

    .tip3 {
      display: flex;
      margin-top: 10px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(125, 126, 128, 1);
      background: rgba(242, 243, 245, 1);
      border-radius: 30px;
      padding: 3px 10px;
    }

    .time {
      padding-top: 10px;
    }
  }
}

.no-list {
  z-index: 1;
  text-align: center;
  position: absolute;
  height: 93%;
  width: 100%;
  left: 0%;
  top: 7%;
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
  z-index: 1;
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
