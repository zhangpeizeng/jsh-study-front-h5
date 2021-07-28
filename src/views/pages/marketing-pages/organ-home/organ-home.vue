<template>
  <div class="home-organ-page">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      success-text="刷新成功"
    >
      <!--        头部搜索框-->
      <div class="jsh-header">
        <div v-if="taskNumData" class="num">
          <span v-if="taskNumData < 100">{{ taskNumData }}</span>
          <span v-else>99+</span>
        </div>
        <div class="header">
          <div style="padding-top: 6px" class="left">
            <van-icon
              @click="backTo()"
              size="5vw"
              color="#227EF7"
              name="arrow-left"
            />
          </div>
          <div class="organ-title" :class="{ w5: classifyName.length == 5 }">
            {{ classifyName }}
          </div>
          <div @click="goSearchList()" class="organ-search">
            <van-icon
              style="vertical-align: middle;padding-right: 2px;color: #999999"
              name="search"
            />
            <span style="vertical-align: middle;padding-bottom: 4px">搜索</span>
          </div>
          <!--          <van-search @click="goSearchList()" disabled placeholder="搜索" />-->
          <div class="right1 d-flex align-items-center" @click="goTask()">
            <img
              style="width: 22px;height: 22px;"
              src="../../../../assets/images/task-icon.png"
              alt=""
            />
            <span style="padding-left: 4px">任务</span>
          </div>
        </div>
      </div>
      <div style="height: 44px;width: 100%"></div>
      <!--      无数据时的缺省页面-->
      <div
        style="padding: 160px 0;text-align: center"
        v-if="
          preLiveList.length == 0 &&
            bannerlist.length == 0 &&
            topicList.length == 0 &&
            classifyList.length == 0
        "
      >
        <img
          style="width:67px;height: 49px"
          src="../../../../assets/images/no-search-data.png"
          alt=""
        />
        <div style="font-size: 13px;color: rgba(153, 153, 153, 1);">
          暂无数据
        </div>
      </div>
      <div class="classify-list w-100 no-line-to" id="recordSoon">
        <div
          v-for="(item, index) of classifyList"
          :key="index"
          @click="toClassify(item)"
          class="item"
        >
          <div>
            <img
              v-if="!item.picUrl"
              style="width:30px;height: 30px;"
              src="../../../../assets/images/twoPic.png"
              alt=""
            />
            <img
              v-if="item.picUrl"
              style="width:30px;height: 30px;"
              :src="item.picUrl"
              alt=""
            />
          </div>
          <div class="name">{{ item.classifyName }}</div>
        </div>
      </div>

      <!--        轮播图-->
      <div style="padding: 13px 15px;background: white">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(item, index) of bannerlist" :key="index">
            <div @click="bannerGoClassDetail(item)" class="w-100">
              <div class="w-100 swipe-list">
                <van-image
                  class="swipe-item bg-cover"
                  width=""
                  height=""
                  radius="10"
                  :src="item.advertUrl | matchImgUrl(800)"
                >
                </van-image>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <!--            直播中-->
      <div
        v-if="preLiveList.length > 0"
        style="background: white;padding: 15px"
      >
        <div class="now-live">
          <div class="d-flex justify-content-between title">
            <div>直播</div>
            <div class="loader d-flex align-items-end">
              <div class="loader-inner"></div>
              <div class="loader-inner"></div>
              <div class="loader-inner"></div>
              <div class="loader-inner"></div>
              <div class="loader-inner"></div>
              <div class="loader-inner"></div>
            </div>
          </div>
          <div class="box-list">
            <div
              v-for="(item, index) of preLiveList"
              :key="index"
              @click="goClassDetail(item)"
              class="list d-flex align-items-center"
            >
              <div class="pic">
                <img
                  style="border-radius: 50px"
                  v-if="!item.lecturerPic"
                  src="../../../../assets/images/news.png"
                  alt=""
                />
                <van-image
                  style="border-radius: 50px"
                  width="35px"
                  height="36px"
                  round
                  v-if="item.lecturerPic"
                  fit="cover"
                  :src="item.lecturerPic"
                />
              </div>
              <div class="detail">
                <div class="detail-title d-flex justify-content-between">
                  <div
                    style="width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                  >
                    {{ item.courseName }}
                  </div>
                  <div class="detail-name">{{ item.lecturerName }}</div>
                </div>
                <div class="d-flex justify-content-between">
                  <div v-if="item.flag === 3" class="d-flex align-items-center">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <div class="live-down d-flex align-items-center">
                        <div class="circle"></div>
                        <div class="d-flex align-items-center">
                          <div style="line-height: 14px">距开播</div>
                        </div>
                      </div>
                      <van-count-down
                        @finish="reviseSoonStatus(item.id)"
                        :time="item.countdown"
                      />
                    </div>
                  </div>
                  <div v-if="item.flag === 1" class="d-flex align-items-center">
                    <div class="live-now">
                      <img
                        src="../../../../assets/images/live-now.png"
                        alt=""
                      />
                      <span style="vertical-align: middle">直播中</span>
                      <span
                        style="vertical-align: middle;width: 2px;height: 2px;display: inline-block;background-color: white;border-radius: 5px;margin-left: 2px"
                      ></span>
                      <span style="vertical-align: middle;padding-left: 6px"
                        >{{ item.studyStudentsNum }}人学习中</span
                      >
                    </div>
                  </div>
                  <div v-if="item.flag === 2" class="d-flex align-items-center">
                    <div
                      class="live-now"
                      style="background: rgb(173, 185, 202);"
                    >
                      <!--                                        <img src="../../../../assets/images/live-now.png" alt="" />-->
                      <span style="vertical-align: middle">直播结束</span>
                      <span
                        style="vertical-align: middle;width: 2px;height: 2px;display: inline-block;background-color: white;border-radius: 5px;margin-left: 2px"
                      ></span>
                      <span style="vertical-align: middle;padding-left: 4px"
                        >{{ item.studyStudentsNum }}人已学习</span
                      >
                    </div>
                    <div></div>
                  </div>
                  <div
                    v-if="item.status === 1"
                    @click.stop="nowAppointment(item)"
                    style="background: #2780F8"
                    class="tip"
                  >
                    立即预约
                  </div>
                  <div
                    v-if="item.status === 2"
                    style="background: #ADB9CA"
                    class="tip"
                  >
                    已预约
                  </div>
                  <div
                    v-if="item.status === 3"
                    style="background: #ADB9CA"
                    class="tip"
                  >
                    报名截止
                  </div>
                  <div
                    v-if="item.status === 4"
                    @click.stop="viewPlay(item)"
                    class="tip"
                  >
                    观看直播
                  </div>
                  <div v-if="item.status === 5" class="tip">直播回放</div>
                  <div
                    v-if="item.status === 6"
                    @click.stop="signUp(item)"
                    style="background: #2780F8"
                    class="tip"
                  >
                    立即报名
                  </div>
                  <div
                    v-if="item.status === 7"
                    style="background: #ADB9CA"
                    class="tip"
                  >
                    已报名
                  </div>
                  <div
                    v-if="item.status === 8"
                    @click.stop="addStudy(item)"
                    class="tip"
                  >
                    加入学习
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            @click="goLatelyLivePage()"
            style="text-align: center;color:rgba(144,147,153,1);padding: 12px;font-size:13px;"
          >
            <span>查看全部</span>
            <img
              style="width: 10px;height: 10px;padding-left: 5px"
              src="../../../../assets/images/right-icon.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <!--        班级班级-->
      <div class="class-home-list" v-show="classList.length > 0">
        <div class="d-flex justify-content-between align-items-center">
          <div class="class-title">班级</div>
          <div class="class-more" @click="goClassList()">
            <span>更多</span>
            <img
              src="../../../../assets/images/right.png"
              style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px"
            />
          </div>
        </div>
        <classOrganList
          :classifyId="classifyId"
          @classList="classListMethod"
          ref="classRef"
        ></classOrganList>
      </div>
      <!--            主题分类-->
      <van-list
        v-if="topicList.length > 0"
        v-model="listDataLoading"
        :finished="listDataFinished"
        @load="onLoadListData"
        :immediate-check="false"
      >
        <div class="theme-classification">
          <div v-for="(item, index) of topicList" :key="index">
            <div
              class="d-flex justify-content-between align-items-center theme-title"
            >
              <div
                style="width: 250px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
              >
                {{ item.classifyName }}
              </div>
              <div @click="goTopicClassPage(item)" class="all">
                <span style="padding-right: 3px">全部</span>
                <img
                  style="width: 10px;height: 10px"
                  src="../../../../assets/images/right-icon.png"
                  alt=""
                />
              </div>
            </div>
            <div class="list">
              <div
                class="item"
                v-for="(item1, index1) of item.courses"
                :key="index1"
                @click="goClassDetail(item1, 2, item)"
              >
                <div class="pic">
                  <img
                    v-if="item1.courseImg"
                    style="width: 100%;height: 98px"
                    :src="item1.courseImg"
                    alt=""
                  />
                  <img
                    v-else
                    style="width: 100%;height: 98px"
                    src="../../../../assets/images/backlogo.png"
                    alt=""
                  />
                </div>
                <div style="position: absolute;top: 85px;left: 10px">
                  <div v-if="item1.leftTopStatusCode === 1" class="live-now">
                    <img src="../../../../assets/images/live-now.png" alt="" />
                    <span>直播中</span>
                  </div>
                  <div
                    v-if="item1.leftTopStatusCode === 2"
                    class="live-now"
                    style="background: #c0c4cc !important;"
                  >
                    <img src="../../../../assets/images/live-now.png" alt="" />
                    <span>直播结束</span>
                  </div>
                  <div
                    style="display: inline-flex"
                    class="live-down d-flex align-items-center"
                    v-if="item1.leftTopStatusCode === 3"
                  >
                    <div class="circle"></div>
                    <div class="d-flex align-items-center">
                      <div style="line-height: 14px">直播倒计时</div>
                      <van-count-down
                        @finish="reviseStatus(item1.id)"
                        :time="item1.countdown"
                      />
                    </div>
                  </div>
                </div>
                <div class="study-num">
                  <img
                    style="width: 13px;height: 12px;margin-right: 6px;vertical-align: middle"
                    src="../../../../assets/images/people-icon2.png"
                    alt=""
                  />
                  <span style="vertical-align: middle">{{
                    item1.studyStudentsNum
                  }}</span>
                </div>
                <div class="content">
                  <div style="height: 55px !important;">
                    <div class="name">
                      <img
                        v-if="item1.courseType === '2'"
                        style="width: 26px;height: 15px;vertical-align: middle;margin-right: 4px"
                        src="@/assets/images/icon-live.png"
                        alt=""
                      />
                      <img
                        v-if="item1.courseType === '3'"
                        style="width: 26px;height: 15px;vertical-align: middle;margin-right: 4px"
                        src="@/assets/images/icon-discuss.png"
                        alt=""
                      />
                      <img
                        v-if="item1.courseType === '4'"
                        style="width: 26px;height: 15px;vertical-align: middle;margin-right: 4px"
                        src="@/assets/images/icon-series.png"
                        alt=""
                      />
                      <span style="vertical-align: middle">{{
                        item1.courseName
                      }}</span>
                    </div>
                    <div class="time">
                      <span v-if="item1.type === 1"
                        >截止{{ item1.signUpTime }}</span
                      >
                      <span v-if="item1.type === 2">{{ item1.liveTime }}</span>
                      <span v-if="item1.type === 3 && item1.studyTime"
                        >截止{{ item1.studyTime }}</span
                      >
                    </div>
                  </div>
                  <div
                    class="d-flex align-items-center justify-content-between des"
                  >
                    <div class="nickname">
                      <!--                      <img-->
                      <!--                        style="vertical-align: middle; width: 18px;height: 18px;border-radius: 20px"-->
                      <!--                        :src="item1.lecturerPic"-->
                      <!--                        alt=""-->
                      <!--                      />-->
                      <van-image
                        style="vertical-align: middle; width: 18px;height: 18px;border-radius: 20px"
                        v-if="item1.lecturerPic"
                        round
                        fit="cover"
                        :src="item1.lecturerPic"
                      />
                      <span
                        style="vertical-align: middle;color:rgba(150,151,153,1);font-size: 13px"
                      >
                        {{ item1.lecturerName }}</span
                      >
                    </div>
                    <div style="padding-right: 5px;">
                      <div
                        v-if="item1.rightBottomStatusCode === 1"
                        @click.stop="nowAppointment(item1)"
                        style="background: #2780F8"
                        class="tip"
                      >
                        立即预约
                      </div>
                      <div
                        v-if="item1.rightBottomStatusCode === 2"
                        style="background: #ADB9CA"
                        class="tip"
                      >
                        已预约
                      </div>
                      <div
                        v-if="item1.rightBottomStatusCode === 3"
                        style="background: #ADB9CA"
                        class="tip"
                      >
                        报名截止
                      </div>
                      <div
                        v-if="item1.rightBottomStatusCode === 4"
                        @click.stop="viewPlay(item1)"
                        class="tip"
                      >
                        观看直播
                      </div>
                      <div v-if="item1.rightBottomStatusCode === 5" class="tip">
                        直播回放
                      </div>
                      <div
                        v-if="item1.rightBottomStatusCode === 6"
                        @click.stop="signUp(item1)"
                        style="background: #2780F8"
                        class="tip"
                      >
                        立即报名
                      </div>
                      <div
                        v-if="item1.rightBottomStatusCode === 7"
                        style="background: #ADB9CA"
                        class="tip"
                      >
                        已报名
                      </div>
                      <div
                        v-if="item1.rightBottomStatusCode === 8"
                        @click.stop="addStudy(item1)"
                        class="tip"
                      >
                        加入学习
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <img src="../../../../assets/images/network.png" style="display: none" />
    <!--        直播提示框-->
    <div v-show="isNav" style="position: fixed;bottom: 4%;left: 15px;">
      <liveFrame v-show="this.GLOBAL.liveFrame"></liveFrame>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import liveFrame from "../../../../components/live-frame/live-frame.vue";
import classOrganList from "@/components/class-massage/class-organ-list/class-organ-list";
import {
  Field,
  CellGroup,
  Swipe,
  SwipeItem,
  Search,
  Toast,
  Dialog,
  CountDown,
  PullRefresh
} from "vant";
import { CloudMarketing } from "@/request";
import JSH from "@/core";

Vue.use(Field);
Vue.use(CellGroup);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Search);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(CountDown);
Vue.use(PullRefresh);
export default {
  name: "home-page",
  components: {
    liveFrame,
    classOrganList
  },
  data() {
    return {
      // 上拉加载loading
      listDataLoading: false,
      // 上拉加载数据完成
      listDataFinished: false,
      //下拉刷新
      isLoading: true,
      //悬浮框是否展示
      i: null,
      haha: null,
      //首页弹框广告
      show: true,
      //悬浮展示
      isNav: true,
      //轮播背景图
      bannerlist: [],
      //二级分类list
      classifyList: [],
      // 直播中的列表
      liveList: [],
      //即将直播的列表
      preLiveList: [],
      //已结束列表
      overLiveList: [],
      //二级主题分类列表
      topicList: [],
      //记录主题分类列表得位置
      recordTopicList: [],
      //记录即将直播列表位置
      recordSoon: 0,
      kaiping: "",
      //终端
      studyTerminalCode: "1",
      //一级分类名称
      classifyName: "",
      //一级分类classifyId
      classifyId: "",
      //一级分类id
      id: "",
      //待任务的数量
      taskNumData: 0,
      page: 0,
      classList: [] // 班级列表集合
    };
  },
  mounted() {},
  activated() {
    this.isNav = true;
    document.getElementById("recordSoon").scrollLeft = this.recordSoon;
    //上滑，下滑的监听
    window.addEventListener("scroll", this.handleScroll, true);
    this.obtainTaskNum();
    this.obtainBannerList();
    this.classificationList();
    this.listAppLiveCourseTwo();
    this.topicClassList();
    this.$refs.classRef.getClassList();
    this.$forceUpdate();
  },
  created() {
    this.id = this.$route.query.id;
    this.classifyId = this.$route.query.classifyId;
    this.classifyName = this.$route.query.classifyName;
    this.studyTerminalCode = localStorage.getItem(
      "studyTerminalCode",
      Number(this.studyTerminalCode)
    );
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    aaaaaa() {
      console.log(this.taskNumData);
    },
    gernerateId: function(index) {
      return "person_" + index;
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      this.isLoading = true;
      setTimeout(() => {
        this.obtainTaskNum();
        this.obtainBannerList();
        this.classificationList();
        this.listAppLiveCourseTwo();
        this.topicClassList();
        this.$refs.classRef.getClassList();
      }, 500);
    },
    toadvertisement() {
      // 去广告详情页
      const owner = this;
      if (
        owner.kaiping.advertJumpType === "2" ||
        owner.kaiping.advertJumpType === "3"
      ) {
        JSH.request({
          url: CloudMarketing.checkAdvertStatusOrganization,
          method: "post",
          params: {
            type: owner.kaiping.advertJumpType,
            advertJumpAddress: owner.kaiping.advertJumpAddress
          },
          success(data) {
            if (data.success) {
              if (data.data.throwStatus == "2") {
                if (data.data.deleteFlag == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
                // 已下架
                if (data.data.status == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
                if (data.data.studyStartStatus == "2") {
                  owner.$toast("学习未开始");
                  return;
                }
                if (data.data.studyEndStatus == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
              } else if (data.data.throwStatus == "1") {
                // return ;
                if (owner.kaiping.advertJumpType === "2") {
                  if (owner.kaiping.courseType === "1") {
                    owner.$router.push({
                      path: "/public/recorded-course",
                      query: {
                        courseType: owner.kaiping.courseType,
                        id: owner.kaiping.advertJumpAddress
                      }
                    });
                  } else if (owner.kaiping.courseType === "2") {
                    owner.$router.push({
                      path: "/public/live-course",
                      query: {
                        courseType: owner.kaiping.courseType,
                        id: owner.kaiping.advertJumpAddress
                      }
                    });
                  } else if (owner.kaiping.courseType === "3") {
                    owner.$router.push({
                      path: "/public/discussion-course",
                      query: {
                        courseType: owner.kaiping.courseType,
                        id: owner.kaiping.advertJumpAddress
                      }
                    });
                  } else if (owner.kaiping.courseType === "4") {
                    owner.$router.push({
                      path: "/public/series-course",
                      query: {
                        courseType: owner.kaiping.courseType,
                        id: owner.kaiping.advertJumpAddress
                      }
                    });
                  }
                } else if (owner.kaiping.advertJumpType === "3") {
                  console.log("w为啥没进来");
                  owner.$router.push({
                    path: "/public/theme-classification-list",
                    query: {
                      id: owner.kaiping.advertJumpAddress,
                      title: owner.kaiping.themeName,
                      type: "organ"
                    }
                  });
                }
              }
            } else {
              Toast(data.errorMsg);
            }
          },
          error(e) {
            console.log(e);
          }
        });
      } else if (owner.kaiping.advertJumpType === "1") {
        return;
      } else if (owner.kaiping.advertJumpType == "4") {
        owner.$router.push({
          path: "/public/advertisement",
          query: {
            title: owner.kaiping.advertName,
            content: owner.kaiping.content
          }
        });
      }
    },
    backTo() {
      this.$router.go(-1); //返回上一层
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
            if (owner.preLiveList.length > 0) {
              owner.preLiveList.forEach(item => {
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
     * 跳转到三级机构分类页面
     */
    toClassify(item) {
      if (document.getElementById("recordSoon").scrollLeft) {
        this.recordSoon = document.getElementById("recordSoon").scrollLeft;
      }
      const owner = this;
      // gio统计--二级课程分类点击次数
      setTimeout(() => {
        window.gio("track", "course_category_click_time2", {
          course_category: owner.classifyName, // 一级分类名称
          course_category_2: item.classifyName, // 二级分类名称
          client_platform: owner.studyTerminalCode // 所属学习终端
        });
      }, 50);
      this.$router.push({
        path: "/public/organ-classify-list",
        query: {
          classifyNameOne: owner.classifyName,
          classifyIdTwo: item.classifyId,
          idTwo: item.id,
          title: item.classifyName
        }
      });
    },
    /**
     *
     * 修改列表标签的状态
     */
    reviseStatus(id) {
      const _that = this;
      _that.topicList.forEach(item => {
        item.courses.forEach(item1 => {
          if (item1.id === id) {
            item1.leftTopStatusCode = 1;
          }
        });
      });
    },
    reviseSoonStatus(id) {
      const _that = this;
      console.log(_that.preLiveList, "1111111111111");
      _that.preLiveList.forEach(item => {
        if (item.id === id) {
          item.flag = 1;
        }
      });
      _that.$forceUpdate();
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
      this.haha = scroll;
      if (scroll > 10) {
        this.i = scrollTop;
        this.isNav = false;
      } else if (scroll < -10) {
        this.i = scrollTop;
        this.isNav = true;
      }
    },

    /**
     * 把一个数组按照一定长度分割成若干数组
     * @param array
     * @param subGroupLength
     * @returns {[]}
     */
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    /**
     * 获取待任务的数量
     *
     */
    obtainTaskNum() {
      const _that = this;
      // 获取二级分类接口
      JSH.request({
        url: CloudMarketing.getAppTaskNum,
        method: "get",
        params: {},
        success(data) {
          if (data.success) {
            console.log(
              "ggggggggggggggggggggggggggggggggggggggggggggggggggggggg"
            );
            _that.taskNumData = data.data;
            _that.$forceUpdate();
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
     * 获取机构运营-获取课程分类的所有二级分类
     * @type {number[]}
     */
    classificationList() {
      const _that = this;
      // 获取二级分类接口
      JSH.request({
        url: CloudMarketing.listClassClassifyNodesTwoLevel,
        method: "get",
        params: { classifyId: this.classifyId, studyTerminal: "" },
        success(data) {
          if (data.success) {
            _that.classifyList = data.data;
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
     * 获取机构运营-获取二级课程的即将直播列表
     * @type {number[]}
     */
    listAppLiveCourseTwo() {
      const _that = this;
      _that.ht.$emit("loading", true);
      // 获取二级分类接口
      JSH.request({
        url: CloudMarketing.listAppLiveCourseTwoLevel,
        method: "get",
        params: { classClassifyId: this.id },
        success(data) {
          if (data.success) {
            _that.isLoading = false;
            if (data.data.preLiveList.length > 0) {
              _that.preLiveList = data.data.preLiveList;
            }
            // _that.preLiveList.forEach((item)=>{
            //     item.countdown = 1000000;
            //     item.flag = 1
            // });
            console.log(_that.preLiveList, "ggggggggggggggggggggggggggg");
            _that.ht.$emit("loading", false);
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          _that.ht.$emit("loading", false);
          console.log(e);
        }
      });
    },
    // 班级入口组件
    classListMethod(data) {
      this.classList = data;
    },
    /**
     * 跳转搜索列表
     */
    goSearchList() {
      if (document.getElementById("recordSoon").scrollLeft) {
        this.recordSoon = document.getElementById("recordSoon").scrollLeft;
      }
      this.$router.push("/public/search-list");
    },
    /**
     * 跳转任务页面
     */
    goTask() {
      if (document.getElementById("recordSoon").scrollLeft) {
        this.recordSoon = document.getElementById("recordSoon").scrollLeft;
      }
      this.$router.push({
        path: "/public/taskList",
        query: {
          type: "organ"
        }
      });
    },

    /**
     * 获取banner轮播图列表
     */
    obtainBannerList() {
      const _that = this;
      // 获取一级分类接口
      JSH.request({
        url: CloudMarketing.listHomePageBannerOrganization,
        method: "post",
        params: { classClassifyId: this.id },
        success(data) {
          if (data.success) {
            _that.bannerlist = data.data;
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
     * 跳转到课程分类页面
     */
    goClassificationPage(item) {
      if (document.getElementById("recordSoon").scrollLeft) {
        this.recordSoon = document.getElementById("recordSoon").scrollLeft;
      }
      this.$router.push({
        path: "/public/course-classification-list",
        query: {
          classifyName: item.classifyName,
          id: item.id
        }
      });
    },
    /**
     * 跳转到最近直播页面
     */
    goLatelyLivePage() {
      if (document.getElementById("recordSoon").scrollLeft) {
        this.recordSoon = document.getElementById("recordSoon").scrollLeft;
      }
      this.$router.push({
        path: "/public/recentline",
        query: {
          type: "organ",
          classifyId: this.id
        }
      });
    },

    /**
     * 跳转到班级列表
     */
    goClassList() {
      this.$router.push({
        path: "/public/class-list",
        query: {
          classifyId: this.classifyId
        }
      });
    },
    /**
     * 跳转到课程详情页面
     */
    goClassDetail(item, type, themeItem) {
      if (document.getElementById("recordSoon").scrollLeft) {
        this.recordSoon = document.getElementById("recordSoon").scrollLeft;
      }
      const owner = this;
      if (type === 2) {
        // gio统计--机构页运营主题课程数量
        setTimeout(() => {
          window.gio("track", "org_theme_course_count", {
            course_name: item.courseName, // 课程名称
            org_name: owner.classifyName, // 机构名称
            ad_status: 1, // 1生效
            client_platform: owner.studyTerminalCode // 所属学习终端
          });
        }, 50);
        // gio统计--机构页运营主题课程点击
        setTimeout(() => {
          window.gio("track", "org_theme_course_click", {
            course_name: item.courseName, // 课程名称
            subject_name: themeItem.classifyName, // 主题名称
            org_name: owner.classifyName, // 机构名称
            ad_status: 1, // 1生效
            client_platform: owner.studyTerminalCode // 所属学习终端
          });
        }, 50);
      }
      if (item.studyStartTime !== "" && item.studyStartTime !== null) {
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
            courseType: item.courseType,
            id: item.id
          }
        });
      } else if (item.courseType === "2") {
        this.$router.push({
          path: "/public/live-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      } else if (item.courseType === "3") {
        this.$router.push({
          path: "/public/discussion-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      } else if (item.courseType === "4") {
        this.$router.push({
          path: "/public/series-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      }
    },
    /**
     * bannner跳转到课程详情页面
     */
    bannerGoClassDetail(item) {
      if (document.getElementById("recordSoon").scrollLeft) {
        this.recordSoon = document.getElementById("recordSoon").scrollLeft;
      }
      const owner = this;
      // gio统计--各机构页Banner点击次数
      setTimeout(() => {
        window.gio("track", "banner_org_click_count", {
          org_name: owner.classifyName, // 机构名称
          ad_status: item.status, // 广告状态
          client_platform: owner.studyTerminalCode, // 所属学习终端
          ad_name: item.advertName, // 广告名称
          ad_id: item.id // bannerID
        });
      }, 50);
      if (item.advertJumpType === "2" || item.advertJumpType === "3") {
        JSH.request({
          url: CloudMarketing.checkAdvertStatusOrganization,
          method: "post",
          params: {
            type: item.advertJumpType,
            advertJumpAddress: item.advertJumpAddress
          },
          success(data) {
            if (data.success) {
              if (data.data.throwStatus == "2") {
                if (data.data.deleteFlag == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
                // 已下架
                if (data.data.status == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
                if (data.data.studyStartStatus == "2") {
                  owner.$toast("学习未开始");
                  return;
                }
                if (data.data.studyEndStatus == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
              } else if (data.data.throwStatus == "1") {
                // return ;
                console.log("jkasdfhhajksdfhashdfjhasdhfjashfdjkahsdfjh");
                console.log(item.advertJumpType);
                if (item.advertJumpType == "2") {
                  if (item.courseType === "1") {
                    owner.$router.push({
                      path: "/public/recorded-course",
                      query: {
                        courseType: item.courseType,
                        id: item.advertJumpAddress
                      }
                    });
                  } else if (item.courseType === "2") {
                    owner.$router.push({
                      path: "/public/live-course",
                      query: {
                        courseType: item.courseType,
                        id: item.advertJumpAddress
                      }
                    });
                  } else if (item.courseType === "3") {
                    owner.$router.push({
                      path: "/public/discussion-course",
                      query: {
                        courseType: item.courseType,
                        id: item.advertJumpAddress
                      }
                    });
                  } else if (item.courseType === "4") {
                    owner.$router.push({
                      path: "/public/series-course",
                      query: {
                        courseType: item.courseType,
                        id: item.advertJumpAddress
                      }
                    });
                  }
                } else if (item.advertJumpType == "3") {
                  console.log("金鹏在时代峰峻");
                  owner.$router.push({
                    path: "/public/theme-classification-list",
                    query: {
                      id: item.advertJumpAddress,
                      title: item.themeName,
                      type: "organ"
                    }
                  });
                }
              }
            } else {
              Toast(data.errorMsg);
            }
          },
          error(e) {
            console.log(e);
          }
        });
      } else if (item.advertJumpType === "1") {
        return;
      } else if (item.advertJumpType == "4") {
        owner.$router.push({
          path: "/public/advertisement",
          query: {
            title: item.advertName,
            content: item.content
          }
        });
      }
    },
    /**
     * 上拉加载
     */
    onLoadListData() {
      this.listDataLoading = true;
      this.page++;
      setTimeout(() => {
        this.topicClassList(this.page, () => {
          setTimeout(() => {
            this.isPullLoading = false;
            this.listDataLoading = false;
          }, 1000);
        });
      }, 200);
    },
    /**
     * 获取主题以及对应课程
     */
    topicClassList(page, callback) {
      const _that = this;
      if (!page) {
        page = 1;
      }
      // 获取主题分类列表接口
      JSH.request({
        url: CloudMarketing.listThemeCourseOrganization,
        method: "post",
        params: { classifyId: this.id, pageNum: page, pageSize: 10 },
        success(data) {
          if (data.success) {
            _that.againTrigger = false;
            // this.studentTableData = this.studentTableData.concat(data);
            if (data.data.hasNextPage) {
              _that.topicList = _that.topicList.concat(data.data.list);
              _that.listDataFinished = false;
            } else {
              _that.topicList = _that.topicList.concat(data.data.list);
              _that.listDataFinished = true;
            }
            if (page === 1) {
              _that.topicList = data.data.list;
            }
            // _that.topicList = data.data.list;
            //去掉没有课程的主题分类
            for (let i = _that.topicList.length - 1; i >= 0; i--) {
              if (
                _that.topicList[i].courses === null ||
                _that.topicList[i].courses.length === 0
              ) {
                _that.topicList.splice(i, 1);
              }
            }
            callback(data);
            _that.$forceUpdate();
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
     * 跳转到主题分类页面
     */
    goTopicClassPage(item) {
      if (document.getElementById("recordSoon").scrollLeft) {
        this.recordSoon = document.getElementById("recordSoon").scrollLeft;
      }
      this.$router.push({
        path: "/public/theme-classification-list",
        query: {
          id: item.id,
          title: item.classifyName,
          type: "organ"
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
    }
  }
};
</script>
<style scoped lang="scss">
.class-home-list {
  padding: 0;
  .class-title {
    padding: 0 15px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #323233;
  }
  .class-more {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #646566;
    margin-right: 15px;
  }
}
.loader {
  display: flex;
  /*height: 40px;*/
  /*left: 0;*/
  /*margin: auto;*/
  /*padding-top: 35px;*/
  /*width: 60px;*/
}

.loader-inner:nth-child(1) {
  -webkit-animation-delay: 0.05s;
  animation-delay: 0.05s;
}

.loader-inner:nth-child(2) {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.loader-inner:nth-child(3) {
  -webkit-animation-delay: 0.15s;
  animation-delay: 0.15s;
}

.loader-inner:nth-child(4) {
  -webkit-animation-delay: 0.25s;
  animation-delay: 0.25s;
}

.loader-inner:nth-child(5) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.loader-inner:nth-child(6) {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

@keyframes loader {
  50% {
    height: 12px;
  }
}

.loader-inner {
  margin-right: 2px;
  background: #adb9ca;
  height: 5px;
  margin-left: 2px;
  opacity: 1;
  width: 2px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  /*-webkit-animation: loader 1.1s infinite ease-in-out;*/
  /*-moz-animation: loader 1.1s infinite ease-in-out;*/
  /*-o-animation: loader 1.1s infinite ease-in-out;*/
  animation: loader 1.1s infinite ease-in-out;
}

.van-overlay {
  z-index: 9999 !important;
}

.p-wrap {
  background: white;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  text-overflow: ellipsis;
  font-weight: 400;
  white-space: pre-wrap;
  margin: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.live-now {
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  padding: 2px 4px;
  background: linear-gradient(
    127deg,
    rgba(255, 56, 128, 1) 0%,
    rgba(255, 45, 28, 1) 100%
  );
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

.live-down {
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  padding: 2px 4px;
  background: rgba(255, 187, 0, 1);
  border-radius: 2px;

  .circle {
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background: white;
    margin-right: 3px;
  }
}

.tip {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: white;
  background: #2780f8;
  border-radius: 30px;
  padding: 3px 10px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 281px;
  height: 308px;
  background-color: #fff;
  padding: 24px;
  border-radius: 4px;

  .block-img {
    float: left;
    width: 120px;
    height: 140px;
    margin-right: 15px;
  }
}

.wrapper-img {
  margin-top: 15px;
  width: 40px;
  height: 40px;
}

.jsh-header {
  background-color: white;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100% !important;

  .num {
    z-index: 99;
    padding: 1px 5px;
    color: white;
    background: #ff2d1c;
    border-radius: 12px;
    position: absolute;
    top: 4px;
    right: 32px;
    font-size: 12px;

    .data {
      color: white;
      position: relative;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    /*height: 44px;*/
    /*line-height: 44px;*/
    font-size: 17px;
    position: relative;

    .organ-title {
      min-width: 10px;
      margin-right: 10px;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #323233;
    }
    .w5 {
      min-width: 50px;
    }
    .organ-search {
      padding: 4px 10px;
      display: inline-block;
      background: #f7f8fa;
      border-radius: 35px;
      color: #c8c9cc;
      font-size: 14px;
      flex-grow: 1;
      .van-icon {
        color: #323233;
        font-size: 16px;
      }
    }

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
      width: 44%;
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
      position: relative;
      padding: 0 10px 0 10px;
      font-size: 13px;
      color: #909399;
    }
  }
}

.classify-list {
  width: 100%;
  background: #ffffff;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: center;

  .item {
    padding: 14px;
    text-align: center;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(50, 50, 51, 1);

    .name {
      padding-top: 10px;
    }
  }
}

.now-live {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 21px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  .box-list {
    border-bottom: 1px dashed #dcdee0;
  }

  .list {
    padding: 0px 10px;

    .pic {
      padding-right: 8px;

      img {
        width: 35px;
        height: 36px;
      }
    }

    .detail {
      flex-grow: 1;
      padding: 15px 10px;

      .detail-title {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(50, 50, 51, 1);
        padding-bottom: 5px;

        .detail-name {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(150, 151, 153, 1);
        }
      }
    }
  }

  .title {
    padding: 0px 10px;
    padding-top: 20px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(50, 50, 51, 1);
  }
}

.swipe-list {
  text-align: center;

  .swipe-item {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    height: 160px;
    border-radius: 8px !important;
  }
}

.van-swipe__indicator {
  background-color: #bbbbbb;
}

.van-swipe__indicator--active {
  width: 2.66667vw;
  height: 1.33333vw;
  border-radius: 0.8vw;
  opacity: 1;
  background-color: white;
}

.classification {
  background-color: white;

  .van-swipe {
    padding-bottom: 30px;
  }

  .van-swipe__indicator--active {
    background-color: #227ef7;
  }

  .van-swipe__indicators {
    bottom: 6px;
  }

  text-align: center;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(50, 50, 51, 1);

  img {
    width: 44px;
    height: 44px;
    border-radius: 44px;
    padding-bottom: 5px;
  }

  .classification-box {
    flex-wrap: wrap;

    .item {
      padding-top: 15px;
      width: 25%;

      .picture {
        /*height: 44px;*/
        /*width: 44px;*/
        /*background: indianred;*/
        /*border-radius: 50px;*/
      }

      img {
        border-radius: 50px;
        width: 44px;
        height: 44px;
      }
    }
  }
}

.theme-classification {
  background: white;

  .theme-title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(50, 50, 51, 1);
    padding: 0px 25px;

    .all {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(150, 151, 153, 1);
    }
  }

  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;
    padding: 14px 12px;
    flex-wrap: wrap;

    .item {
      position: relative;
      margin-bottom: 10px;
      overflow: hidden;
      width: 48%;
      box-shadow: 0px 2px 21px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      .study-num {
        position: absolute;
        top: 75px;
        right: 5px;
        display: inline-block;
        padding: 0px 2.13333vw;
        height: 5.06667vw;
        line-height: 4vw;
        position: absolute;
        transform: scale(0.8);
        background: rgba(48, 49, 51, 0.8);
        border-radius: 5.06667vw;
        color: white;
      }

      .content {
        padding: 12px 6px 13px 7px;
      }

      .name {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(50, 50, 51, 1);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .time {
        padding-top: 5px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(144, 147, 153, 1);
      }

      .des {
        padding-top: 11px;
      }
    }
  }
}
</style>
<style lang="scss">
.home-organ-page {
  min-height: 100%;
  background: white;
  .van-count-down {
    color: #909399;
  }

  .theme-classification {
    .van-count-down {
      color: #ffffff;
    }
  }

  .van-search {
    padding: 10px 0px;
  }

  .van-field__left-icon .van-icon,
  .van-field__right-icon .van-icon {
    font-size: 18px;
  }
}

.van-swipe__indicator {
  background-color: #bbbbbb;
}

.van-swipe__indicator--active {
  width: 2.66667vw;
  height: 1.33333vw;
  border-radius: 0.8vw;
  opacity: 1;
  background-color: white;
}

.classification {
  .van-swipe__indicator--active {
    background-color: #227ef7;
  }

  .van-swipe__indicators {
    bottom: 6px;
  }
}
</style>
