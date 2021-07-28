<template>
  <div class="container">
    <jshHeader :header="header"></jshHeader>
    <van-dialog
      v-model="isShowDialog"
      class-name="look"
      confirmButtonText="确认"
      show-cancel-button
      cancelButtonText="取消"
      width="270px"
      :beforeClose="beforeClose"
    >
      <div class="dialogd">
        <div style="text-align: center" class="title">
          确认预约提醒此课程
        </div>
        <div style="text-align: center" class="secomd">
          本课程将于开课前2小时短信提醒
        </div>
      </div>
    </van-dialog>
    <van-pull-refresh
      v-model="isPullLoading"
      @refresh="onRefresh"
      success-text="加载成功"
      style="padding-top: 44px"
    >
      <van-list
        v-model="listDataLoading"
        :finished="listDataFinished"
        :finished-text="finish"
        @load="onLoadListData"
      >
        <div class="list" v-if="!nonet">
          <div class="zhiboz" v-if="listNow && listNow.length > 0 && !nodata">
            <div class="wenzizhibo">
              直播中
            </div>
            <div
              class="line"
              v-for="(item, index) in listNow"
              :key="index"
              @click="zhibozhong(item)"
            >
              <div class="imat d-flex">
                <div class="imgleft" style="position: relative">
                  <van-image
                    height="100%"
                    width="144px"
                    :src="item.courseImg"
                    radius="5"
                  >
                    <template v-slot:error>
                      <img
                        class="media-cover"
                        style="border-radius: 8px;height: 75px"
                        src="../../../../assets/images/imgfengmian.png"
                      />
                    </template>
                  </van-image>
                  <!--                                    <img class="tagtop" style="height: 100%" :src="item.courseImg" alt="">-->
                  <div class="tag">
                    <img src="../../../../assets/images/zhibo.png" alt="" />
                    <span style="color: #FFFFFF">
                      {{ item.labelLeft }}
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
                <div class="flex-1">
                  <span class="lessonName">
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
                  </span>
                  <div class="teacher d-flex" style="align-items: center">
                    <div style="width: 95px">
                      <span>
                        <img
                          style="width: 13px;height: 12px;margin-right: 4px"
                          src="../../../../assets/images/icon-teacher.png"
                          alt=""
                        />{{ item.lecturerName }}</span
                      >
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
                    class="d-flex align-items-center justify-content-between mt-5"
                  >
                    <div></div>
                    <div
                      v-if="item.labelRight == '观看直播'"
                      class="yuyue"
                      @click.stop="guankanzhibo(item)"
                      style="background:rgba(225,238,255,1); padding: 3px 10px;border-radius: 30px"
                    >
                      <span style="color:#2780F8" class="fs-13">{{
                        item.labelRight
                      }}</span>
                    </div>
                    <div
                      class="yuyue"
                      v-if="item.labelRight == '立即预约'"
                      @click.stop="lijiyuyue(item)"
                      style="background:rgba(225,238,255,1);"
                    >
                      <!--                                                <img src="../../../../assets/images/tixing.png" alt="">-->
                      <span style="color:#2780F8" class="fs-13">{{
                        item.labelRight
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="time">
                <span style="color: #646566" class="fs-12">
                  直播时间：
                </span>
                <span
                  v-if="
                    handleYear(item.liveStartTimeDate) !==
                      handleYear(item.liveEndTimeDate)
                  "
                  style="color: #969799"
                  class="fs-12"
                >
                  {{ item.liveStartTimeDate | date("yyyy-MM-dd hh:mm") }}至{{
                    item.liveEndTimeDate | date("yyyy-MM-dd hh:mm")
                  }}
                </span>
                <span v-else style="color: #969799" class="fs-12">
                  {{ item.liveStartTimeDate | date1("yyyy-MM-dd hh:mm") }}至{{
                    item.liveEndTimeDate | date1("yyyy-MM-dd hh:mm")
                  }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="jijzhiboz"
            v-if="willListl && willListl.length > 0 && !nodata"
          >
            <div class="wenzizhibo">
              即将直播
            </div>
            <div
              class="line"
              v-for="(item, index) in willListl"
              :key="index"
              @click="zhibozhong(item)"
            >
              <div class="imat d-flex">
                <div class="imgleft" style="position: relative">
                  <van-image
                    height="100%"
                    width="144px"
                    :src="item.courseImg"
                    radius="5"
                  >
                    <template v-slot:error>
                      <img
                        class="media-cover"
                        style="border-radius: 8px;height: 75px"
                        src="../../../../assets/images/imgfengmian.png"
                      />
                    </template>
                  </van-image>
                  <!--                                    <img class="tagtop" style="height: 100%" :src="item.courseImg" alt="">-->
                  <div class="tag">
                    <div style="color: #FFFFFF">
                      <div class="yuandia"></div>
                      距开播：<van-count-down
                        class="fs-10 h-15"
                        style="color: #FFFFFF;display: inline-block;padding: 0;margin: 0;"
                        :time="item.countdown"
                      />
                    </div>
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
                <div class="flex-1">
                  <span class="lessonName">
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
                  </span>
                  <div class="teacher d-flex" style="align-items: center">
                    <div style="width: 95px">
                      <span>
                        <img
                          style="width: 13px;height: 12px;margin-right: 4px"
                          src="../../../../assets/images/icon-teacher.png"
                          alt=""
                        />
                        {{ item.lecturerName }}</span
                      >
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
                    class="d-flex align-items-center justify-content-between mt-5"
                  >
                    <div></div>
                    <div>
                      <!--                                            除了2.3以外都是蓝色-->
                      <div
                        class="yuyue"
                        v-if="item.labelRight == '立即预约'"
                        @click.stop="lijiyuyue(item)"
                        style="background:rgba(225,238,255,1);"
                      >
                        <!--                                                <img src="../../../../assets/images/tixing.png" alt="">-->
                        <span style="color:#2780F8" class="fs-13">{{
                          item.labelRight
                        }}</span>
                      </div>
                      <div
                        class="yuyue"
                        v-if="item.labelRight == '立即报名'"
                        @click.stop="lijibaoming(item)"
                        style="background:rgba(225,238,255,1);"
                      >
                        <!--                                                <img src="../../../../assets/images/tixing.png" alt="">-->
                        <span style="color:#2780F8" class="fs-13">{{
                          item.labelRight
                        }}</span>
                      </div>
                      <!--                                            <div class="yuyue" v-if="item.labelRight=='直播回放'" @click.stop="zhibohuifang(item)" style="background:rgba(225,238,255,1);">-->
                      <!--                                                &lt;!&ndash;                                                <img src="../../../../assets/images/tixing.png" alt="">&ndash;&gt;-->
                      <!--                                                <span style="color:#2780F8" class="fs-13">{{ item.labelRight }}</span>-->
                      <!--                                            </div>-->
                      <div
                        class="yuyue"
                        v-if="item.labelRight == '观看直播'"
                        @click.stop="guankanzhibo(item)"
                        style="background:rgba(225,238,255,1);"
                      >
                        <!--                                                <img src="../../../../assets/images/tixing.png" alt="">-->
                        <span style="color:#2780F8" class="fs-13">{{
                          item.labelRight
                        }}</span>
                      </div>
                      <div
                        class="yuyue"
                        style="background:#F2F3F5;"
                        @click="meiyon()"
                        v-if="
                          item.labelRight == '已预约' ||
                            item.labelRight == '报名截止' ||
                            item.labelRight == '已报名'
                        "
                      >
                        <span style="color:#7D7E80" class="fs-13">{{
                          item.labelRight
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="time">
                <span style="color: #646566" class="fs-12">
                  直播时间：
                </span>
                <span
                  v-if="
                    handleYear(item.liveStartTimeDate) !==
                      handleYear(item.liveEndTimeDate)
                  "
                  style="color: #969799"
                  class="fs-12"
                >
                  {{ item.liveStartTimeDate | date("yyyy-MM-dd hh:mm") }}至{{
                    item.liveEndTimeDate | date("yyyy-MM-dd hh:mm")
                  }}
                </span>
                <span v-else style="color: #969799" class="fs-12">
                  {{ item.liveStartTimeDate | date1("yyyy-MM-dd hh:mm") }}至{{
                    item.liveEndTimeDate | date1("yyyy-MM-dd hh:mm")
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="end" v-if="!nonet">
          <div class="wenzizhibo" v-if="listEnd.length > 0 && !nodata">
            已结束
          </div>
          <div
            class="line"
            v-for="(item, index) in listEnd"
            :key="index"
            @click="zhibozhong(item)"
          >
            <div class="imat d-flex">
              <div class="imgleft" style="position: relative">
                <van-image
                  height="100%"
                  width="144px"
                  :src="item.courseImg"
                  class="imgbor"
                  radius="5"
                >
                  <template v-slot:error>
                    <img
                      class="media-cover"
                      style="border-radius: 8px;height: 75px"
                      src="../../../../assets/images/imgfengmian.png"
                    />
                  </template>
                </van-image>
                <div class="tag">
                  <span style="color: #FFFFFF;text-align: center">
                    {{ item.labelLeft }}
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
              <div class="flex-1">
                <span class="lessonName">
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
                </span>
                <div class="teacher d-flex" style="align-items: center">
                  <div style="width: 95px">
                    <span>
                      <img
                        style="width: 13px;height: 12px;margin-right: 4px"
                        src="../../../../assets/images/icon-teacher.png"
                        alt=""
                      />
                      {{ item.lecturerName }}</span
                    >
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
                  class="d-flex justify-content-between align-items-center mt-5"
                >
                  <div></div>
                  <div>
                    <div
                      class="yuyue"
                      v-if="item.labelRight == '立即预约'"
                      @click.stop="lijiyuyue(item)"
                      style="background:rgba(225,238,255,1);"
                    >
                      <!--                                                <img src="../../../../assets/images/tixing.png" alt="">-->
                      <span style="color:#2780F8" class="fs-13">{{
                        item.labelRight
                      }}</span>
                    </div>
                    <div
                      class="yuyue"
                      style="background:rgba(225,238,255,1);"
                      @click.stop="zhibohuifang(item)"
                      v-if="item.labelRight == '直播回放'"
                    >
                      <span style="color:#2780F8" class="fs-13">{{
                        item.labelRight
                      }}</span>
                    </div>
                    <div
                      class="yuyue"
                      @click.stop="meiyon()"
                      v-if="item.labelRight == '报名截止'"
                      style="background:#F2F3F5;"
                    >
                      <span style="color:#7D7E80" class="fs-13">{{
                        item.labelRight
                      }}</span>
                    </div>
                    <div
                      class="yuyue"
                      v-if="item.labelRight == '加入学习'"
                      @click.stop="jiaruxuexi(item)"
                      style="background:rgba(225,238,255,1);"
                    >
                      <!--                                                <img src="../../../../assets/images/tixing.png" alt="">-->
                      <span style="color:#2780F8" class="fs-13">{{
                        item.labelRight
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="
                (item.liveStartTimeDate || item.liveEndTimeDate) &&
                  (item.liveStartTimeDate != '' ||
                    item.liveEndTimeDate != '') &&
                  item.isshow &&
                  item.liveEndTimeDate > nowDateTime
              "
              class="time"
            >
              <span style="color: #646566" class="fs-12">
                直播时间：
              </span>
              <span
                v-if="
                  handleYear(item.liveStartTimeDate) !==
                    handleYear(item.liveEndTimeDate)
                "
                style="color: #969799"
                class="fs-12"
              >
                {{ item.liveStartTimeDate | date("yyyy-MM-dd hh:mm") }}至{{
                  item.liveEndTimeDate | date("yyyy-MM-dd hh:mm")
                }}
              </span>
              <span v-else style="color: #969799" class="fs-12">
                {{ item.liveStartTimeDate | date1("yyyy-MM-dd hh:mm") }}至{{
                  item.liveEndTimeDate | date1("yyyy-MM-dd hh:mm")
                }}
              </span>
            </div>
            <div
              v-else-if="
                (item.studyStartTimeDate || item.studyEndTimeDate) &&
                  (item.studyStartTimeDate != '' ||
                    item.studyEndTimeDate != '') &&
                  !item.isshow
              "
              class="time"
            >
              <img
                style="width: 12px;height: 12px;margin-right: 6px;vertical-align: middle"
                src="../../../../assets/images/icon-time.png"
                alt=""
              />
              <span style="color: #969799;vertical-align: middle" class="fs-12">
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
                <!--<span v-if="!item.studyStartTimeDate">-->
                <!--不限-->
                <!--</span>-->
              </span>
            </div>
          </div>
        </div>
      </van-list>
      <!--无数据-->
      <div v-if="nodata" class="text-center" style="padding-top: 203px">
        <img
          src="../../../../assets/images/no-search-data.png"
          alt=""
          style="width:67px;height: 49px"
        />
        <div class="color-999 fs-13" style="">暂无课程，先学习其他课程吧~</div>
      </div>
      <div
        v-if="nonet"
        class="text-center"
        style="padding-top: 203px;height: 640px;background-color: white"
      >
        <img
          src="../../../../assets/images/network.png"
          alt=""
          style="width:100px;height: 70px"
        />
        <div class="fs-14" style="margin-top: 30px;color: #646566">
          网络请求失败
        </div>
        <div class="fs-12" style="margin-top: 8px;color: #969799">
          请检查您的网络，重新加载试试吧
        </div>
        <div class="flush" @click="shuaxin">刷新</div>
      </div>
      <div id="viewbottom"></div>
    </van-pull-refresh>
    <div v-show="isNav" style="position: fixed;bottom: 2%;left: 15px;">
      <liveFrame></liveFrame>
    </div>
  </div>
</template>
<script>
import {
  NavBar,
  List,
  PullRefresh,
  Toast,
  Dialog,
  Popup,
  CountDown
} from "vant";
import Vue from "vue";
import JSH from "@/core";
import liveFrame from "@/components/live-frame/live-frame.vue";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import CloudMarketing from "../../../../request/interface/cloud-marketing";
Vue.use(NavBar);
Vue.use(List);
Vue.use(Toast);
Vue.use(PullRefresh);
Vue.use(CountDown);
Vue.use(Dialog);
Vue.use(Popup);
export default {
  components: {
    liveFrame,
    jshHeader
  },
  data() {
    return {
      // 下拉刷新loading
      isPullLoading: false,
      // 上拉加载loading
      listDataLoading: false,
      // 上拉加载数据完成
      listDataFinished: false,
      // 列表分页
      page: 0,
      // 已经结束
      listEnd: [],
      //  正在直播
      listNow: [],
      //  即将直播
      willListl: [],
      enterShow: true,
      curseName: "",
      curseImg: "",
      zhiboId: "",
      isNav: true,
      header: {
        title: "最近直播",
        rightType: 3
      },
      timeData: {
        hours: 12,
        minutes: 10,
        seconds: 15
      },
      time: 12 * 60 * 60,
      isShowDialog: false,
      value: "",
      isIos: true,
      finish: "没有更多了",
      nodata: false,
      student_pwd: "",
      nonet: false,
      //按钮防止二次点击
      againTrigger: false,
      isFirstEnter: true,
      temID: "",
      nowDateTime: null,
      type: "",
      classifyId: ""
    };
  },
  created() {
    this.type = this.$route.query.type;
    this.classifyId = this.$route.query.classifyId;
    const u = navigator.userAgent;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isiOS) {
      //    ios
      this.isIos = true;
      console.log("ios");
    } else {
      this.isIos = false;
      console.log("android");
    }
    const owner = this;
    // owner.$loading.show(3000);
    owner.ht.$emit("loading", true);
    const param = {
      pageNum: 1,
      pageSize: 10
    };
    let url;
    if (this.type === "organ") {
      url = CloudMarketing.listAppLiveTwoLevel;
      param.classifyId = this.classifyId;
    } else {
      url = CloudMarketing.recentLive;
    }
    JSH.request({
      url: url,
      // url:'http://yapi.ylhtest.com/mock/106/api/marketing/page/college/management/list-app-live-course',
      method: "get",
      params: param,
      success(data) {
        // owner.$loading.hide();
        owner.ht.$emit("loading", false);
        //    这里需要正在直播跟即将直播的
        owner.listNow = data.data.liveList;
        owner.willListl = data.data.preLiveList;
        if (
          owner.listNow &&
          owner.listNow.length == 0 &&
          owner.willListl &&
          owner.willListl.length == 0 &&
          data.data.overLiveDate.list == null
        ) {
          owner.finish = "";
          owner.nodata = true;
        }
      },
      error() {
        owner.nonet = true;
        // owner.$loading.hide();
        owner.ht.$emit("loading", false);
        owner.finish = "";
      }
    });
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  activated() {
    //获取当前时间
    this.nowDateTime = Date.parse(new Date());
    const owner = this;
    owner.isNav = true;
    //上滑，下滑的监听
    window.addEventListener("scroll", owner.handleScroll, true);
    if (!owner.isFirstEnter) {
      JSH.request({
        url: CloudMarketing.partialRefresh,
        method: "get",
        params: {
          baseId: owner.temID
        },
        success(data) {
          if (data.success) {
            if (owner.listEnd.length > 0) {
              owner.listEnd.forEach(value => {
                if (value.id == data.data.id) {
                  value.labelRight = data.data.labelRight;
                  value.labelLeft = data.data.leftStatus;
                }
              });
            }
            if (owner.listNow.length > 0) {
              owner.listNow.forEach(value => {
                if (value.id == data.data.id) {
                  value.labelRight = data.data.labelRight;
                  value.labelLeft = data.data.leftStatus;
                }
              });
            }
            if (owner.willListl.length > 0) {
              owner.willListl.forEach(value => {
                if (value.id == data.data.id) {
                  value.labelRight = data.data.labelRight;
                  value.labelLeft = data.data.leftStatus;
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
  methods: {
    handleYear(data) {
      let date = new Date(data);
      return date.getFullYear();
    },
    shuaxin() {
      this.onRefresh();
    },
    jiaruxuexi(items) {
      const owner = this;
      if (owner.againTrigger) {
        return;
      }
      owner.againTrigger = true;
      const param = {
        type: "1",
        baseId: items.id
      };
      JSH.request({
        url: CloudMarketing.joinStudy,
        // url:'http://yapi.ylhtest.com/mock/106/api/marketing/page/college/management/list-app-live-course',
        method: "post",
        params: param,
        success(data) {
          owner.againTrigger = false;
          // owner.showYiChange = false;
          if (data.data) {
            owner.$toast("已加入到任务-【待学习】");
            owner.listEnd.forEach((item, index) => {
              // console.log(item,index)
              if (item == items) {
                owner.listEnd[index].labelRight = "直播回放";
                owner.$forceUpdate();
              }
            });
          } else {
            // owner.$loading.hide();
            owner.$toast(data.errorMsg);
          }
        },
        error() {
          owner.againTrigger = false;
          // owner.$loading.hide();
          // owner.showYiChange = true;
          // owner.isPullLoading = false;
          console.log("接口异常");
        }
      });
    },
    beforeClose(action, done) {
      const owner = this;
      if (action == "confirm") {
        const param = {
          type: "3",
          baseId: owner.value.id
        };
        JSH.request({
          url: CloudMarketing.joinStudy,
          // url:'http://yapi.ylhtest.com/mock/106/api/marketing/page/college/management/list-app-live-course',
          method: "post",
          params: param,
          success(data) {
            // owner.showYiChange = false;
            if (data.data) {
              owner.$toast("预约成功");
              owner.willListl.forEach((item, index) => {
                // console.log(item,index)
                if (item == owner.value) {
                  owner.willListl[index].labelRight = "已预约";
                  owner.$forceUpdate();
                }
              });
              owner.listNow.forEach((item, index) => {
                // console.log(item,index)
                if (item == owner.value) {
                  owner.listNow[index].labelRight = "观看直播";
                  owner.$forceUpdate();
                }
              });
              owner.listEnd.forEach((item, index) => {
                // console.log(item,index)
                if (item == owner.value) {
                  owner.listEnd[index].labelRight = "直播回放";
                  owner.$forceUpdate();
                }
              });
            } else {
              // owner.$loading.hide();
              owner.$toast(data.errorMsg);
            }
          },
          error() {
            // owner.$loading.hide();
            // owner.showYiChange = true;
            // owner.isPullLoading = false;
            console.log("接口异常");
          }
        });
        done();
      } else if (action == "cancel") {
        done();
      }
    },
    zhibozhong(value) {
      const owner = this;
      //    直播的页面跳转
      if (value.studyStartTime !== null && value.studyStartTime !== "") {
        //    有值判断 在前 还是在后
        const now = Date.parse(new Date());
        const start = value.studyStartTimeDate;
        const end = value.studyEndTimeDate;
        if (now < start) {
          owner.$toast("学习未开始");
        } else if (now > end) {
          owner.$toast(
            "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
          );
        } else {
          owner.temID = value.id;
          if (value.courseType === "2") {
            this.$router.push({
              path: "/public/live-course",
              query: {
                courseType: value.courseType,
                id: value.id
              }
            });
          } else if (value.courseType === "3") {
            this.$router.push({
              path: "/public/discussion-course",
              query: {
                courseType: value.courseType,
                id: value.id
              }
            });
          }
        }
        // const startTime = value.studyStartTime
      } else {
        owner.temID = value.id;
        if (value.courseType === "2") {
          this.$router.push({
            path: "/public/live-course",
            query: {
              courseType: value.courseType,
              id: value.id
            }
          });
        } else if (value.courseType === "3") {
          this.$router.push({
            path: "/public/discussion-course",
            query: {
              courseType: value.courseType,
              id: value.id
            }
          });
        }
        //    跳转到课程详情
      }
    },
    handleScroll() {
      // 页面滚动距顶部距离
      // let scrollTop =
      //     window.pageYOffset ||
      //     document.documentElement.scrollTop ||
      //     document.body.scrollTop;
      let scrollTop = document
        .getElementById("viewbottom")
        .getBoundingClientRect().top;
      let scroll = scrollTop - this.i;
      this.i = scrollTop;
      if (scroll > 0) {
        this.isNav = true;
      } else if (scroll < 0) {
        this.isNav = false;
      }
    },
    enterShowIt() {
      const that = this;
      that.enterShow = false;
    },
    lijiyuyue(value) {
      //    立即预约
      const owner = this;
      owner.isShowDialog = true;
      owner.value = value;
    },
    lijibaoming(value) {
      const owner = this;
      if (owner.againTrigger) {
        return;
      }
      owner.againTrigger = true;
      const param = {
        type: "3",
        baseId: value.id
      };
      JSH.request({
        url: CloudMarketing.joinStudy,
        method: "post",
        params: param,
        success(data) {
          // owner.showYiChange = false;
          if (data.data) {
            owner.$toast("报名成功");
            owner.willListl.forEach((item, index) => {
              // console.log(item,index)
              if (item == value) {
                owner.willListl[index].labelRight = "已报名";
                owner.$forceUpdate();
              }
            });
          } else {
            // owner.$loading.hide();
            owner.$toast(data.errorMsg);
          }
        },
        error() {
          // owner.$loading.hide();
          // owner.showYiChange = true;
          // owner.isPullLoading = false;
          console.log("接口异常");
        }
      });
    },
    zhibohuifang(value) {
      //    直播回放
      const owner = this;
      const param = {
        baseId: value.id
      };
      JSH.request({
        url: CloudMarketing.huifang,
        // url:'http://yapi.ylhtest.com/mock/106/api/marketing/page/college/management/list-app-live-course',
        method: "get",
        params: param,
        success(data) {
          // owner.showYiChange = false;
          if (data.success) {
            console.log(data.data.liveId, "jinpeng");
            // owner.$routec
            // 路由跳转 data.liveId data.liveName
            if (value.courseType === "2") {
              owner.$router.push({
                path: "/public/live-course",
                query: {
                  courseType: value.courseType,
                  id: value.id
                }
              });
            } else if (value.courseType === "3") {
              owner.$router.push({
                path: "/public/discussion-course",
                query: {
                  courseType: value.courseType,
                  id: value.id
                }
              });
            }
          } else {
            // owner.$loading.hide();
            owner.$toast(data.errorMsg);
          }
        },
        error() {
          // owner.$loading.hide();
          // owner.showYiChange = true;
          // owner.isPullLoading = false;
          console.log("接口异常");
        }
      });
    },
    guankanzhibo(value) {
      //观看直播 跳转页面
      const owner = this;
      if (value.courseLiveType === "APP") {
        let key = this.$md5(localStorage.getItem("accountId") + value.anthCode);
        let liveUrl =
          "http://mudu.tv/activity.php?id=" +
          value.vhallLiveId +
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
            value.vhallLiveId,
            value.id,
            ""
          );
        }
        //ios调用方式  nativeRoute是具体的方法名,
        if (window.webkit && window.webkit.messageHandlers) {
          let params = {
            baseId: value.id,
            sourceId: "",
            eduId: value.vhallLiveId,
            url: liveUrl
          };
          window.webkit.messageHandlers.loadMuduLive.postMessage(
            JSON.stringify(params)
          );
        }
      } else {
        const paramsa = {
          childId: "",
          classId: value.vhallLiveId
        };
        JSH.request({
          url: CloudMarketing.getvhallCode,
          method: "get",
          params: paramsa,
          success(data) {
            // owner.showYiChange = false;
            if (data.success) {
              console.log(data.data.student_pwd);
              owner.student_pwd = data.data.student_pwd;
              let prems = {
                param: {
                  baseId: value.id,
                  sourceId: "",
                  eduId: value.vhallLiveId,
                  invitationCode: owner.student_pwd,
                  lecturerId: value.lecturerId.toString(),
                  lecturerName: value.lecturerName
                },
                routePath: "com.jsh.marketingcollege.ui.VhLiveClassActivity"
              };
              if (owner.isIos) {
                //    苹果系统的跳转方法
                //ios调用方式  nativeRoute是具体的方法名,
                if (window.webkit && window.webkit.messageHandlers) {
                  window.webkit.messageHandlers.nativeRoute.postMessage(
                    JSON.stringify(prems)
                  );
                }
              } else {
                //安卓调用方式  nativeRoute是具体的方法名,
                if (window.collegeNative) {
                  window.collegeNative.nativeRoute(JSON.stringify(prems));
                }
              }
            } else {
              // owner.$loading.hide();
              owner.$toast(data.errorMsg);
            }
          },
          error() {
            // owner.$loading.hide();
            // owner.showYiChange = true;
            // owner.isPullLoading = false;
            console.log("原來進窩了");
          }
        });
      }
    },
    // 上拉加载
    onLoadListData() {
      const owner = this;
      console.log("刚上来");
      owner.searchList(this.page + 1, data => {
        owner.listDataLoading = false;
        // 重新处理数组
        if (this.page === 0) {
          if (
            data.data.overLiveDate.list &&
            data.data.overLiveDate.list.length > 0
          ) {
            data.data.overLiveDate.list.forEach(datato => {
              let newdate = Date.parse(new Date());
              if (newdate > datato.liveEndTimeDate) {
                datato.isshow = false;
              } else {
                datato.isshow = true;
              }
            });
          }
          owner.listEnd = data.data.overLiveDate.list;
        } else {
          owner.listEnd = owner.listEnd.concat(data.data.overLiveDate.list);
        }
      });
    },
    // 下拉刷新
    onRefresh() {
      const owner = this;
      console.log("第二次上来");
      this.searchList(1, data => {
        owner.isPullLoading = false;
        owner.listDataLoading = false;
        owner.listEnd = data.data.overLiveDate.list;
        owner.listNow = data.data.liveList;
        owner.willListl = data.data.preLiveList;
        this.$forceUpdate();
        // listNow: [],liveList
        //         //  即将直播
        //         willListl: [],preLiveList
      });
    },
    // 查询列表数据
    searchList(page, callback) {
      const param = {
        pageNum: page,
        pageSize: 6
      };
      let url;
      if (this.type === "organ") {
        url = CloudMarketing.listAppLiveTwoLevel;
        param.classifyId = this.classifyId;
      } else {
        url = CloudMarketing.recentLive;
      }
      const owner = this;
      owner.nonet = false;
      console.log("进这里了");
      JSH.request({
        url: url,
        // url:'http://yapi.ylhtest.com/mock/106/api/marketing/page/college/management/list-app-live-course',
        method: "get",
        params: param,
        success(data) {
          console.log("成功了？");
          // owner.showYiChange = false;
          if (data.success) {
            if (!data.data.overLiveDate.list) {
              owner.isPullLoading = false;
              owner.listDataFinished = !data.data.overLiveDate.hasNextPage;
            } else {
              Toast.clear();
              callback(data);
              // 赋值分页
              owner.page = page;
              // 数据是否加载完成
              owner.listDataFinished = !data.data.overLiveDate.hasNextPage;
            }
          } else {
            owner.$toast(data.errorMsg);
          }
        },
        error() {
          owner.finish = "";
          owner.nonet = true;
          owner.$forceUpdate();
          owner.isPullLoading = false;
          owner.listDataLoading = false;
          owner.listDataFinished = true;
          console.log("原來進窩了");
        }
      });
    }
  },
  filters: {
    filterName(value) {
      if (value.length > 8) {
        return value.slice(0, 8) + "...";
      } else {
        return value;
      }
      // return value
    }
  },
  computed: {
    computeFloat() {
      // if(this.float) {
      //     if(this.float&&this.float.courseName.length>8){
      //         this.float.courseName = this.float.courseName.slice(1,8)+'...'
      //         return this.float
      //     }
      // }
      return this.float;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  .list {
    .zhiboz {
      .wenzizhibo {
        font-size: 14px;
        color: #969799;
        margin-top: 15px;
        margin-left: 15px;
        margin-bottom: 5px;
      }
      .line {
        background-color: white;
        padding: 10px 10px 15px 10px;
        margin: 10px 10px 0px 10px;
        border-radius: 10px;
        .time {
          margin-top: 10px;
        }
        .imat {
          img {
            width: 120px;
            height: 100px;
          }
          .teacher {
            font-size: 13px;
            color: #7d7e80;
            margin-top: 8px;
            img {
              width: 14px;
              height: 14px;
              margin-bottom: -2px;
              margin-right: 2px;
            }
            .yuyue {
              display: flex;
              padding: 3px 10px;
              border-radius: 30px;
              text-align: center;
              line-height: 22px;
              width: 72px;
              height: 22px;
              background: rgba(242, 243, 245, 1);
            }
          }
          .imgleft {
            margin-right: 10px;
            width: 144px;
            height: 90px;
            .tagtop {
              height: 100%;
            }
            .tag {
              span {
                font-size: 11px;
              }
              width: 62px;
              height: 19px;
              line-height: 16px;
              text-align: center;
              background-color: #ffbb00;
              position: absolute;
              border-radius: 3px 0px 3px 0px;
              top: 0px;
              left: 0px;
              img {
                width: 10px;
                height: 10px;
              }
            }
            .progress-box {
              position: absolute;
              bottom: 0px;
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
          .lessonName {
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 14px;
            color: #323233;
          }
        }
      }
    }
  }
  .end {
    .wenzizhibo {
      font-size: 14px;
      color: #969799;
      margin-top: 15px;
      margin-left: 15px;
      margin-bottom: 5px;
    }
    .line {
      background-color: white;
      padding: 10px 10px 15px 10px;
      margin: 10px 10px 0px 10px;
      border-radius: 10px;
      .time {
        margin-top: 10px;
      }
      .imat {
        img {
          width: 120px;
          height: 100px;
        }
        .teacher {
          font-size: 13px;
          color: #7d7e80;
          margin-top: 8px;
          img {
            width: 14px;
            height: 14px;
            margin-bottom: -2px;
            margin-right: 2px;
          }
          .yuyue {
            display: flex;
            padding: 3px 10px;
            border-radius: 30px;
            text-align: center;
            line-height: 22px;
            width: 76px;
            height: 22px;
            background: rgba(242, 243, 245, 1);
          }
        }
        .imgleft {
          margin-right: 10px;
          width: 144px;
          height: 90px;
          .tagtop {
            height: 100%;
          }
          .tag {
            span {
              font-size: 11px;
            }
            width: 62px;
            height: 19px;
            line-height: 16px;
            text-align: center;
            background: rgba(192, 196, 204, 1);
            position: absolute;
            border-radius: 3px 0px 3px 0px;
            top: 0px;
            left: 0px;
            img {
              width: 10px;
              height: 10px;
            }
          }
          .progress-box {
            position: absolute;
            bottom: 0px;
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
        .lessonName {
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 14px;
          color: #323233;
        }
      }
    }
  }
  .enter {
    display: flex;
    z-index: 10;
    align-items: center;
    position: fixed;
    width: 345px;
    height: 60px;
    background: rgba(50, 50, 51, 1);
    border-radius: 30px;
    opacity: 0.89;
    /*vertical-align: center;*/
    left: 4%;
    bottom: 20px;
    padding: 8px 15px;
    .leftImage {
      width: 18px;
      height: 18px;
    }
    .shuxian {
      display: inline-block;
      width: 0.5px;
      height: 20px;
      margin-left: 10px;
      background-color: white;
    }
    .avati {
      display: inline-block;
      margin-left: 10px;
      img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
      }
    }
    .enbutt {
      margin-left: 10px;
      width: 48px;
      height: 27px;
      background: rgba(34, 126, 247, 1);
      border-radius: 14px;
      line-height: 27px;
      text-align: center;
    }
  }
}
.yuyue {
  display: flex;
  padding: 3px 10px;
  border-radius: 30px;
}
.jijzhiboz {
  .wenzizhibo {
    font-size: 14px;
    color: #969799;
    margin-top: 15px;
    margin-left: 15px;
    margin-bottom: 5px;
  }
  .line {
    padding: 10px 10px 15px 10px;
    margin: 10px 10px 0px 10px;
    border-radius: 10px;
    background-color: white;
    .time {
      margin-top: 10px;
    }
    .imat {
      img {
        width: 120px;
        height: 100px;
      }
      .teacher {
        font-size: 13px;
        color: #7d7e80;
        margin-top: 8px;
        img {
          width: 14px;
          height: 14px;
          margin-bottom: -2px;
          margin-right: 2px;
        }
        .yuyue {
          display: flex;
          padding: 3px 10px;
          border-radius: 30px;
          text-align: center;
          line-height: 22px;
          width: 76px;
          height: 22px;
          background: rgba(242, 243, 245, 1);
        }
      }
      .imgleft {
        margin-right: 10px;
        width: 144px;
        height: 90px;
        .tagtop {
          height: 100%;
        }
        .tag {
          display: flex;
          align-items: center;
          div {
            font-size: 10px;
          }
          .yuandia {
            width: 4px;
            height: 4px;
            display: inline-block;
            border-radius: 50%;
            background-color: white;
            margin-bottom: 2px;
            margin-right: -1px;
          }
          padding-right: 3px;
          padding-left: 3px;
          height: 19px;
          vertical-align: middle;
          background: linear-gradient(
            127deg,
            rgba(225, 57, 118, 1) 0%,
            rgba(234, 52, 37, 1) 100%
          );
          border-radius: 2px;
          position: absolute;
          top: 0px;
          left: 0px;
          img {
            width: 10px;
            height: 10px;
          }
        }
        .progress-box {
          position: absolute;
          bottom: 0px;
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
      .lessonName {
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: 14px;
        color: #323233;
      }
    }
  }
}
.van-pull-refresh {
  padding-top: 0px !important;
}
.dialogd {
  .title {
    font-size: 16px;
    color: #323233;
  }
  .secomd {
    font-size: 14px;
    color: #7d7e80;
    margin-top: 8px;
  }
  padding: 24px;
}
.look {
  width: 311px;
  border-radius: 4px 4px 0px 0px;
}
.media-cover {
  border-radius: 5px;
}
.flush {
  width: 100px;
  height: 30px;
  border-radius: 15px;
  border: 1px solid rgba(39, 128, 248, 1);
  margin: 0 auto;
  color: #2780f8;
  font-size: 14px;
  line-height: 30px;
  margin-top: 30px;
}
</style>
