<template>
  <div>
    <jshHeader :header="header" @leftClick="gobackto"></jshHeader>
    <div class="no-network" v-if="isNetwork">
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
    <div v-else>
      <div class="header-cover" v-if="!videoShowFlag && signUpStatus">
        <div class="header-layer"></div>
        <van-image width="375px" height="200px" :src="detailObj.courseImg">
          <template v-slot:error>
            <img
              class="media-cover"
              src="../../../../../assets/images/imgfengmian.png"
            />
          </template>
        </van-image>
        <div class="play-box">
          <img
            src="../../../../../assets/images/play-button.png"
            class="play-button"
            @click="viewPlay"
          />
          <div
            class="fs-13"
            style="color:#ffffff"
            v-if="detailObj.leftStatus == 1 || detailObj.leftStatus == 3"
          >
            观看直播
          </div>
          <div
            class="fs-13"
            style="color:#ffffff"
            v-if="detailObj.leftStatus == 2"
          >
            观看回放
          </div>
        </div>
        <div class="play-status" v-if="detailObj.leftStatus == 2">
          <span>直播结束</span>
        </div>
        <div class="play-status live-status" v-if="detailObj.leftStatus == 1">
          <img src="../../../../../assets/images/live-now.png" />
          <span>直播中</span>
        </div>
        <div class="play-status live-down" v-if="detailObj.leftStatus == 3">
          <span class="circle"></span>距开播:<van-count-down
            :time="detailObj.countdown"
            @finish="countdownFin"
            class="play-time"
          />
        </div>
        <div class="header-progress" v-if="detailObj.progress">
          已学习{{ detailObj.progress }}%
          <img
            src="../../../../../assets/images/answer.png"
            class="header-img"
            @click="toProgress"
          />
        </div>
        <div class="header-progress back-info" v-if="!detailObj.progress">
          未学习
          <img
            src="../../../../../assets/images/answer.png"
            class="header-img"
            @click="toProgress"
          />
        </div>
      </div>
      <div
        style="width: 100%;height: 200px;"
        v-if="videoShowFlag && signUpStatus"
      >
        <VideoPlayer
          :vid="playBack.liveId"
          :baseId="id"
          :coursesType="detailObj.courseType"
          :cover="courseImg"
          liveType="6"
          :sourceId="sourceId"
          :video-container-height="200"
          mediaType="video"
          v-if="playBack.transcodingStatus"
        />
        <div
          style="width: 100%;position: relative;color: white;"
          v-if="!playBack.transcodingStatus"
        >
          <img :src="courseImg" style="width: 100%;height: 200px;" />
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
            <div style="width: 100%;text-align: center;padding-top: 13px;">
              <div
                style="width: 86px;height: 24px;line-height:24px;text-align: center;border-radius: 12px;color: #ffffff;font-size:14px;display: inline-block;"
                class="border-yuan"
                @click="getvideotask(playBack)"
              >
                刷新
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="course-box">
        <van-row type="flex" class="text-content">
          <van-col span="24">
            <span class="title-span">{{ detailObj.courseName }}</span>
          </van-col>
        </van-row>
        <van-row
          type="flex"
          justify="space-between"
          align="center"
          class="text-content mt-10"
        >
          <van-col span="4">
            <van-image
              width="44px"
              height="44px"
              fit="cover"
              radius="40"
              :src="lecturerObj.lecturerImg"
              @click="toView"
            >
            </van-image>
          </van-col>
          <van-col span="17">
            <span class="fs-14 color-black" @click="toView">
              {{ lecturerObj.lecturerName }}
            </span>
          </van-col>
          <van-col span="2" style="min-width: 25px;">
            <span class="fs-12 color-gray" @click="toView">查看</span>
          </van-col>
          <van-col span="1">
            <img
              src="../../../../../assets/images/right.png"
              style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px;margin-top: -2px;"
              @click="toView"
            />
          </van-col>
        </van-row>
        <van-row type="flex" class="text-content mt-10">
          <van-col span="6">
            <span class="fs-12 color-brown">直播时间:</span>
          </van-col>
          <van-col span="18">
            <span
              v-if="
                handleYear(detailObj.liveStartTime) !==
                  handleYear(detailObj.liveEndTime)
              "
              class="fs-12 color-gray"
            >
              {{ detailObj.liveStartTime | date("yyyy-MM-dd hh:mm") }}
              至{{ detailObj.liveEndTime | date("yyyy-MM-dd hh:mm") }}
            </span>
            <span v-else class="fs-12 color-gray">
              {{ detailObj.liveStartTime | date1("yyyy-MM-dd hh:mm") }}
              至{{ detailObj.liveEndTime | date1("yyyy-MM-dd hh:mm") }}
            </span>
          </van-col>
        </van-row>
        <van-row
          type="flex"
          class="text-content mt-10"
          v-if="detailObj.leftStatus == 2"
        >
          <van-col span="6">
            <span class="fs-12 color-brown">学习时间:</span>
          </van-col>
          <van-col span="18">
            <span
              class="fs-12 color-gray"
              v-if="detailObj.studyStartTime && detailObj.studyEndTime"
            >
              <span
                v-if="
                  handleYear(detailObj.studyStartTime) !==
                    handleYear(detailObj.studyEndTime)
                "
              >
                {{ detailObj.studyStartTime | date("yyyy-MM-dd hh:mm") }}
                至{{ detailObj.studyEndTime | date("yyyy-MM-dd hh:mm") }}
              </span>
              <span v-else>
                {{ detailObj.studyStartTime | date1("yyyy-MM-dd hh:mm") }}
                至{{ detailObj.studyEndTime | date1("yyyy-MM-dd hh:mm") }}
              </span>
            </span>
            <span class="fs-12 color-gray" v-else>
              不限
            </span>
          </van-col>
        </van-row>
      </div>
      <div class="course-box">
        <div
          class="text-content mb-16"
          v-if="detailObj.testStatus == 1 && signUpStatus"
        >
          <div class="d-flex justify-content-between">
            <div>
              <div class="fs-14 color-brown">考试时间</div>
              <div
                v-if="
                  handleYear(detailObj.testStartTime) !==
                    handleYear(detailObj.testEndTime)
                "
                class="fs-12 color-gray mt-10"
              >
                {{ detailObj.testStartTime | date("yyyy-MM-dd hh:mm") }}
                至{{ detailObj.testEndTime | date("yyyy-MM-dd hh:mm") }}
              </div>
              <div v-else class="fs-12 color-gray mt-10">
                {{ detailObj.testStartTime | date1("yyyy-MM-dd hh:mm") }}
                至{{ detailObj.testEndTime | date1("yyyy-MM-dd hh:mm") }}
              </div>
              <div
                class="fs-12 color-gray mt-10"
                v-if="
                  !detailObj.accountTestStatus &&
                    nowTime > detailObj.testEndTime
                "
              >
                本次课程考试已结束，下次不要再错过哦~~~
              </div>
            </div>
            <div
              class="d-flex align-items-center"
              v-if="detailObj.accountTest === 1"
            >
              <van-button
                plain
                hairline
                round
                type="info"
                class="button-height"
                @click="goToExam"
              >
                去补考
              </van-button>
            </div>
            <div
              class="d-flex align-items-center"
              v-if="detailObj.accountTest === 2"
            >
              <van-button
                plain
                hairline
                round
                type="info"
                class="button-height"
                @click="goToExam"
              >
                去考试
              </van-button>
            </div>
            <div
              class="d-flex align-items-center"
              v-if="detailObj.accountTest === 3"
              @click="goToExam"
            >
              <span class="fs-12" style="color:#969799">
                已考试
              </span>
              <img
                src="../../../../../assets/images/right.png"
                class="img-right"
              />
            </div>
          </div>
          <div class="fs-13 color-brown mt-10" v-if="detailObj.certificateName">
            考试通过后可获得《{{ detailObj.certificateName }}》
          </div>
        </div>
        <div
          class="text-content mb-16"
          v-if="detailObj.taskStatus == 1 && signUpStatus"
        >
          <div class="d-flex justify-content-between">
            <div>
              <div class="fs-14 color-brown">作业时间</div>
              <div
                class="fs-12 color-gray mt-10"
                v-if="detailObj.taskStartTime && detailObj.taskEndTime"
              >
                <span
                  v-if="
                    handleYear(detailObj.taskStartTime) !==
                      handleYear(detailObj.taskEndTime)
                  "
                >
                  {{ detailObj.taskStartTime | date("yyyy-MM-dd hh:mm") }}
                  至{{ detailObj.taskEndTime | date("yyyy-MM-dd hh:mm") }}
                </span>
                <span v-else>
                  {{ detailObj.taskStartTime | date1("yyyy-MM-dd hh:mm") }}
                  至{{ detailObj.taskEndTime | date1("yyyy-MM-dd hh:mm") }}
                </span>
              </div>
              <div class="fs-12 color-gray mt-10" v-else>
                随时
              </div>
              <div
                class="fs-12 color-gray mt-10"
                v-if="detailObj.taskStartTime && detailObj.taskEndTime"
              >
                <span
                  v-if="
                    !detailObj.accountTaskStatus &&
                      nowTime > detailObj.taskEndTime
                  "
                >
                  本次课程提交作业已结束，下次不要再错过哦~~~
                </span>
              </div>
            </div>
            <div
              class="d-flex align-items-center"
              v-if="!detailObj.accountTaskStatus"
            >
              <van-button
                plain
                hairline
                round
                type="info"
                class="button-height button-padding"
                v-if="taskShowStatus && detailObj.taskId"
                @click="handHomeWork(1)"
              >
                去交作业
              </van-button>
            </div>
            <div
              class="d-flex align-items-center"
              v-if="detailObj.accountTaskStatus"
            >
              <van-button
                plain
                hairline
                round
                type="info"
                class="button-height button-padding"
                v-if="modify && detailObj.taskId"
                @click="handHomeWork(2)"
              >
                修改作业
              </van-button>
              <span
                v-else
                @click="gotoHomeWork"
                class="fs-12"
                style="color:#969799"
              >
                已交作业
                <img
                  src="../../../../../assets/images/right.png"
                  class="img-right1"
                />
              </span>
            </div>
          </div>
        </div>
        <div
          class="text-content mb-16"
          v-if="
            detailObj.taskStatus == 1 && detailObj.pkStatus == 1 && signUpStatus
          "
        >
          <div class="d-flex justify-content-between">
            <div>
              <div class="fs-14 color-brown">PK时间</div>
              <div
                class="fs-12 color-gray mt-10"
                v-if="detailObj.pkStartTime && detailObj.pkEndTime"
              >
                <span
                  v-if="
                    handleYear(detailObj.pkStartTime) !==
                      handleYear(detailObj.pkEndTime)
                  "
                >
                  {{ detailObj.pkStartTime | date("yyyy-MM-dd hh:mm") }}
                  至{{ detailObj.pkEndTime | date("yyyy-MM-dd hh:mm") }}
                </span>
                <span v-else>
                  {{ detailObj.pkStartTime | date1("yyyy-MM-dd hh:mm") }}
                  至{{ detailObj.pkEndTime | date1("yyyy-MM-dd hh:mm") }}
                </span>
              </div>
              <div class="fs-12 color-gray mt-10" v-else>
                随时
              </div>
              <div
                class="fs-12 color-gray mt-10"
                v-if="detailObj.pkStartTime && detailObj.pkEndTime"
              >
                <span
                  v-if="
                    !detailObj.accountPkStatus && nowTime > detailObj.pkEndTime
                  "
                >
                  本次课程作业PK参与时间已结束，下次不要再错过哦~~~
                </span>
              </div>
            </div>
            <div
              class="d-flex align-items-center"
              v-if="!detailObj.accountPkStatus"
            >
              <van-button
                plain
                hairline
                round
                type="info"
                class="button-height"
                v-if="pkShowStatus && detailObj.taskSubmitId"
                @click="updatePkStatus"
              >
                参与PK
              </van-button>
            </div>
            <div
              class="d-flex align-items-center"
              v-if="detailObj.accountPkStatus"
              @click="gotoHomeWork"
            >
              <span class="fs-12" style="color:#969799">
                已参与
              </span>
              <img
                src="../../../../../assets/images/right.png"
                class="img-right"
              />
            </div>
          </div>
        </div>
        <div class="text-content" v-if="detailObj.courseDescription">
          <div class="fs-14 color-brown">简介内容</div>
          <div class="fs-14 mt-10">
            <div class="course-description">
              <u-editor-box
                :content="detailObj.courseDescription"
              ></u-editor-box>
            </div>
          </div>
        </div>
        <div class="text-content mt-16" v-if="sysCourseList.length > 0">
          <div class="fs-14 color-brown">归属系列课</div>
          <div
            class="d-flex justify-content-between align-items-center mt-10"
            v-for="(item, index) in sysCourseList"
            :key="index"
            @click="gotoSeriseCourse(item)"
          >
            <div class="fs-14 color-gray van-ellipsis">
              {{ item.courseName }} ——第{{ item.sort }}课时
            </div>
            <div class="d-flex align-items-center">
              <img
                src="../../../../../assets/images/right.png"
                style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px;margin-top: -2px;"
              />
            </div>
          </div>
        </div>
      </div>
      <!--      课程推荐-->
      <div v-show="recommendList.length > 0" class="course-recommend-box">
        <div class="title">
          相关课程
        </div>
        <courseRecommend @list="getListLength" :baseId="id"></courseRecommend>
      </div>
      <div class="course-box" style="padding-bottom: 0">
        <div class="text-content">
          <div class="clearfix">
            <div class="fs-14 color-brown float-left">
              课程评价({{ evaluateTotal }})
            </div>
            <div
              class="float-right fs-13"
              style="color: #969799"
              @click="toEvaluate"
            >
              查看全部
              <img
                src="../../../../../assets/images/right.png"
                class="img-right2"
              />
            </div>
          </div>
          <div class="content">
            <div
              v-if="tableList.length != 0"
              class="clearfix pt-16 pb-16 border-b"
            >
              <van-rate
                class="float-left"
                v-model="rate"
                color="#F5A623"
                readonly
              />
              <span class="float-left ml-16 fs-16" style="color: #F5A623"
                >{{ yuanRate }}分</span
              >
            </div>
            <div
              class="pt-16 pb-16"
              v-for="(item, index) in tableList"
              :key="index"
              :class="index == 0 ? '' : 'border-t'"
            >
              <div class="clearfix">
                <div class="float-left">
                  <div class="clearfix fs-14">
                    <span class="float-left" style="color: #323233">{{
                      item.userName
                    }}</span>
                    <van-rate
                      class="float-left ml-16"
                      color="#F5A623"
                      :count="item.grade"
                      size="15px"
                      readonly
                      v-model="item.grade"
                    />
                  </div>
                </div>
                <div
                  class="float-right"
                  style="color: #1989FA"
                  :style="{
                    color: item.likeStatus == 0 ? '#1989FA' : '#969799'
                  }"
                  @click="likeClick(item, index)"
                >
                  <img
                    class="dianzan"
                    v-if="Number(item.likeStatus) === 0"
                    src="@/assets/images/dianzanAct.png"
                    alt=""
                  />
                  <img
                    class="dianzan"
                    v-if="Number(item.likeStatus) === 1"
                    src="@/assets/images/dianzan.png"
                    alt=""
                  />
                  {{ item.likeNum }}
                </div>
              </div>
              <div style="color: #969799" class="company mt-6 mb-6 fs-12">
                <div
                  @click.stop="checkTip(index)"
                  style="width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                >
                  <span :id="gernerateId(index)"
                    >{{ item.companyAbbreviation }}
                    <span
                      v-if="
                        item.companyAbbreviation && item.departmentAbbreviation
                      "
                      >-</span
                    >
                    {{ item.departmentAbbreviation }}</span
                  >
                </div>
                <div v-show="item.isShow && item.iswidth" class="content">
                  {{ item.companyAbbreviation }}
                  <span
                    v-if="
                      item.companyAbbreviation && item.departmentAbbreviation
                    "
                    >-</span
                  >
                  {{ item.departmentAbbreviation }}
                </div>
              </div>
              <div style="color: #7D7E80" class="mt-6 mb-6 fs-13">
                {{ item.content }}
              </div>
              <div style="color: #969799" class="fs-12">
                {{ item.createTime | date1("yyyy-MM-dd") }}
              </div>
            </div>
          </div>
          <div
            v-if="tableList.length == 0"
            class="fs-13 color-brown mt-10 pb-10"
          >
            暂无评价
          </div>
        </div>
      </div>
      <div class="layout-block"></div>
      <lecturerPopup ref="lecturerPopup"></lecturerPopup>
      <progressPopup ref="progressPopup"></progressPopup>
      <jobSubmit @submit="submitHomeWork" ref="submit"></jobSubmit>
      <course-detail-foot
        @comments="comments"
        @buttonClick="footButton"
        ref="courseDetailFoot"
      ></course-detail-foot>
      <van-action-sheet v-model="testShow" :title="testName" @cancel="onCancel">
        <div style="height: 460px;">
          <iframe
            :src="testUrl"
            :style="{ height: '100%', width: '100%' }"
            frameborder="0"
            border="0"
          >
          </iframe>
        </div>
      </van-action-sheet>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Col, Row, Button, Toast, CountDown, Dialog } from "vant";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import courseRecommend from "@/components/course-recommend/course-recommend.vue";
import courseDetailFoot from "@/components/course-detail/course-detail-foot/course-detail-foot.vue";
import lecturerPopup from "@/components/course-detail/lecturer-popup/lecturer-popup.vue";
import progressPopup from "@/components/course-detail/progress-popup/progress-popup.vue";
import jobSubmit from "@/components/job-submit/job-submit.vue";
import VideoPlayer from "@/components/VideoPlayer";
import JSH from "@/core";
import { CloudMarketing } from "@/request";
import { UEditorBox } from "@jsh/helper/components";

Vue.use(Col);
Vue.use(Row);
Vue.use(Button);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(Dialog);

export default {
  name: "liveCourse",
  components: {
    courseRecommend,
    jshHeader,
    courseDetailFoot,
    lecturerPopup,
    jobSubmit,
    progressPopup,
    VideoPlayer,
    UEditorBox
  },
  data() {
    return {
      recommendList: [],
      //标题栏
      header: {
        title: "课程详情",
        backType: true
      },
      id: "",
      sourceId: "", // 系列课的id
      detailObj: {}, // 详情对象
      lecturerObj: {}, // 讲师
      sysCourseList: [],
      // 下拉刷新加载
      isPullLoading: false,
      //列表数据加载
      listDataLoading: false,
      // 列表数据加载完成
      listDataFinished: true,
      // 分页
      page: 0,
      // 列表数据
      list: [],
      nowTime: "",
      testShow: false,
      testName: "",
      testUrl: "",
      testShowStatus: false,
      taskShowStatus: false,
      pkShowStatus: false,
      jobObj: {},
      playBack: "", // 回放信息
      videoShowFlag: false,
      vhallObj: "",
      modify: true,
      signUpStatus: false, // 报名状态
      viewurl: null,
      isNetwork: false,
      videoshowto: false, //视频加载
      courseImg: "", //封面地址
      tableList: [],
      evaluateTotal: 0,
      reviewStatus: 0,
      yuanRate: 0,
      rate: 0
    };
  },
  methods: {
    handleYear(data) {
      let date = new Date(data);
      return date.getFullYear();
    },
    getListLength(data) {
      this.recommendList = data;
    },
    gernerateId: function(index) {
      return "company_" + index;
    },
    // 倒计时结束
    countdownFin() {
      const owner = this;
      owner.detailObj.leftStatus = 1;
      owner.getvhallCode(owner.detailObj.vhallLiveId);
      owner.$forceUpdate();
    },
    removeClass(item) {
      let styleContent = document.getElementById("lypl" + item.id);
      styleContent.style.cssText = "display: block;overflow:inherit";
    },
    // 评价列表
    toEvaluate() {
      this.$router.push({
        path: "/public/courseEvaluation",
        query: {
          id: this.id
        }
      });
    },
    // 获取列表数据
    getReviewList() {
      const that = this;
      JSH.request({
        url: CloudMarketing.listappreviews,
        method: "post",
        params: {
          pageNum: 1,
          pageSize: 5,
          baseId: that.id
        },
        success(data) {
          if (data.success) {
            if (data.data.reviewList) {
              that.tableList = data.data.reviewList;
            }
            that.evaluateTotal = data.data.total;
            that.tableList.forEach(item => {
              item.isClick = true;
              item.isShow = false;
            });
            setTimeout(() => {
              that.tableList.forEach((item, index) => {
                let o = document.getElementById("company_" + index);
                if (!o) {
                  item.iswidth = false;
                  return;
                }
                let w = o.clientWidth || o.offsetWidth;
                if (w > 299) {
                  item.iswidth = true;
                } else {
                  item.iswidth = false;
                }
              });
            }, 1500);
            that.yuanRate = Number(data.data.averageGrade).toFixed(1);
            that.rate = that.getStarNum(data.data.averageGrade);
            Toast.clear();
          } else {
            Toast(data.errorMsg);
            setTimeout(() => {
              Toast.clear();
            }, 1000);
          }
          that.getCourseDetail(that.id);
        },
        error(e) {
          console.error(e);
          Toast("接口异常");
        }
      });
    },
    /**
     * 是否展示公司提示信息
     * @param index
     */
    checkTip(index) {
      this.tableList.forEach((item, i) => {
        if (index !== i) {
          item.isShow = false;
        }
      });
      if (this.tableList[index].isShow) {
        this.tableList[index].isShow = false;
      } else {
        this.tableList[index].isShow = true;
      }
      this.$forceUpdate();
    },
    likeClick(item, index) {
      if (item.isClick) {
        this.tableList[index].isClick = false;
        // 取消点赞
        if (item.likeStatus == 0) {
          this.tableList[index].likeStatus = 1;
          this.tableList[index].likeNum -= 1;
          this.like(2, index, item);
        } else {
          // 点赞
          this.tableList[index].likeStatus = 0;
          this.tableList[index].likeNum += 1;
          this.like(1, index, item);
        }
      }
    },
    // 获取平均星星数量
    getStarNum(nums) {
      const num = Number(nums);
      if (num <= 1) {
        return 1;
      }
      if (num > 1 && num <= 2) {
        return 2;
      }
      if (num > 2 && num <= 3) {
        return 3;
      }
      if (num > 3 && num <= 4) {
        return 4;
      }
      if (num > 4 && num <= 5) {
        return 5;
      }
    },
    // 点赞
    like(type, index, item) {
      const that = this;
      JSH.request({
        url: CloudMarketing.addreviewslike,
        method: "post",
        params: {
          status: type,
          reviewId: item.reviewId
        },
        success(data) {
          if (data.success) {
            if (data.data) {
              that.tableList[index].isClick = true;
            }
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
          Toast("接口异常");
        }
      });
    },
    comments(data) {
      const owner = this;
      console.log(111111);
      console.log(data);
      data.baseId = this.id;
      JSH.request({
        url: CloudMarketing.addreviews,
        method: "post",
        params: data,
        success(res) {
          if (res.success) {
            Toast("新增评价成功");
            owner.$router.push({
              path: "/public/courseEvaluation",
              query: {
                id: owner.id,
                type: true
              }
            });
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    footButton(status) {
      const owner = this;
      if (status == 1) {
        // 立即预约
        Dialog.confirm({
          title: "确定预约提醒此课程",
          message: "本课程将于开课前2小时短信提醒"
        })
          .then(() => {
            owner.toStudy(3);
          })
          .catch(() => {});
      } else if (status == 6) {
        // 立即报名
        owner.toStudy(2);
      } else if (status == 8) {
        // 加入学习
        owner.toStudy(1);
      } else if (status == 4) {
        // 观看直播
        owner.viewPlay();
      } else if (status == 5) {
        // 直播回放
        owner.viewPlay();
      }
    },
    toView() {
      this.$refs.lecturerPopup.initData(this.lecturerObj);
    },
    toProgress() {
      this.$refs.progressPopup.initData(2);
    },
    // 已考试
    goToAlreadyExam() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getexamresulturl,
        method: "get",
        params: {
          examId: owner.detailObj.testId,
          examJoinid: owner.detailObj.examJoinid
        },
        success(res) {
          if (res.success) {
            owner.testUrl = res.data;
            owner.testName = "考试结果";
            owner.testShow = true;
          } else {
            Toast(res.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    //去考试
    goToExam() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getexamurl,
        method: "get",
        params: {
          baseId: owner.detailObj.id,
          examJoinid: owner.detailObj.examJoinid,
          type: 1
        },
        success(res) {
          if (res.success) {
            owner.testUrl = res.data;
            // owner.testName = "考试";
            // owner.testShow = true;
            owner.$router.push({
              path: "/public/examQuestions",
              query: {
                testUrl: owner.testUrl
              }
            });
          } else {
            Toast(res.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    // 查询考试状态
    getExamStatus() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getExamStatus,
        method: "get",
        params: {
          courseId: owner.detailObj.id,
          examId: owner.detailObj.testId
        },
        success(res) {
          if (res.success) {
            owner.detailObj.accountTest = res.data;
            owner.$forceUpdate();
          } else {
            Toast(res.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    onCancel() {
      const owner = this;
      owner.getExamStatus();
    },
    // 跳原生直播
    viewPlay() {
      const owner = this;
      if (owner.detailObj.leftStatus == 1) {
        // 目睹直播
        if (owner.detailObj.courseLiveType === "APP") {
          let key = this.$md5(
            localStorage.getItem("accountId") + this.detailObj.anthCode
          );
          // key = this.$md5(localStorage.getItem("accountId") + "RSP1uhTeVmP4");
          let liveUrl =
            "http://mudu.tv/activity.php?id=" +
            owner.detailObj.vhallLiveId +
            "&userid=" +
            localStorage.getItem("accountId") +
            "&name=" +
            localStorage.getItem("accountName") +
            "&expire=36000000" +
            "&a=userAssign" +
            "&key=" +
            key;
          console.log(liveUrl);
          //安卓调用方式  nativeRoute是具体的方法名,
          if (window.collegeNative) {
            window.collegeNative.loadMuduLive(
              liveUrl,
              owner.detailObj.vhallLiveId,
              owner.id,
              owner.sourceId
            );
          }
          //ios调用方式  nativeRoute是具体的方法名,
          if (window.webkit && window.webkit.messageHandlers) {
            let params = {
              baseId: owner.id,
              sourceId: owner.sourceId,
              eduId: owner.detailObj.vhallLiveId,
              url: liveUrl
            };
            console.log(params);
            window.webkit.messageHandlers.loadMuduLive.postMessage(
              JSON.stringify(params)
            );
          }
        } else {
          let prems = {
            param: {
              baseId: owner.id,
              sourceId: owner.sourceId,
              eduId: owner.detailObj.vhallLiveId,
              invitationCode: owner.vhallObj.student_pwd,
              lecturerId: owner.detailObj.lecturerId.toString(),
              lecturerName: owner.detailObj.lecturerName
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
        }
      } else if (owner.detailObj.leftStatus == 2) {
        if (owner.playBack) {
          if (owner.playBack.liveId) {
            owner.videoShowFlag = true;
          } else {
            Toast("讲师还未上传回放，请稍后再来");
          }
        } else {
          Toast("讲师还未上传回放，请稍后再来");
        }
      } else if (owner.detailObj.leftStatus == 3) {
        Toast("直播还未开始，请稍后再来");
      }
    },
    gotoSeriseCourse(item) {
      const owner = this;
      if (owner.detailObj.studyStartTime && owner.detailObj.studyEndTime) {
        if (owner.nowTime < owner.detailObj.studyStartTime) {
          Toast("学习未开始");
          return;
        }
        if (owner.nowTime > owner.detailObj.studyEndTime) {
          Toast("哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程");
          return;
        }
      }
      owner.$router.push({
        path: "series-course",
        query: {
          id: item.baseId
        }
      });
    },
    toStudy(type) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.toStudy,
        method: "post",
        params: { type: type, baseId: owner.detailObj.id },
        success(res) {
          if (res.success) {
            if (type == 1) {
              Toast("已加入到任务-【待学习】");
            } else if (type == 2) {
              Toast("报名成功");
            } else if (type == 3) {
              Toast("预约成功");
            }
            owner.getCourseDetail(owner.detailObj.id);
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    // 跳转到作业详情
    gotoHomeWork() {
      const owner = this;
      owner.$router.push({
        path: "taskDetails",
        query: {
          homeworkId: owner.detailObj.taskId,
          courseId: owner.detailObj.id,
          homeworkSubmitId: owner.detailObj.taskSubmitId
        }
      });
    },
    // 交作业
    handHomeWork(type) {
      const owner = this;
      // 提交作业
      if (type === 1 && owner.detailObj.id && owner.detailObj.taskId) {
        owner.jobObj = {
          courseId: owner.detailObj.id,
          homeworkId: owner.detailObj.taskId
        };
        owner.$refs.submit.show(owner.jobObj);
      }
      // 修改作业
      if (
        type === 2 &&
        owner.detailObj.id &&
        owner.detailObj.taskId &&
        owner.detailObj.taskSubmitId
      ) {
        owner.jobObj = {
          courseId: owner.detailObj.id,
          homeworkId: owner.detailObj.taskId,
          homeworkSubmitId: owner.detailObj.taskSubmitId,
          type: true
        };
        owner.$refs.submit.show(owner.jobObj);
      }
    },
    submitHomeWork(data) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.saveHomework,
        method: "post",
        params: data,
        success(res) {
          if (res.data) {
            Toast("提交成功");
            owner.$refs.submit.close();
            owner.$refs.submit.againTrigger = false;
            owner.getCourseDetail(owner.detailObj.id);
          } else {
            Toast(res.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    // 参与PK
    updatePkStatus() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.updatePkStatus,
        method: "get",
        params: { homeworkId: owner.detailObj.taskId },
        success(res) {
          if (res.success) {
            Toast("参与PK成功");
            owner.getCourseDetail(owner.detailObj.id);
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    getlecturerInfo(id) {
      const owner = this;
      //获取讲师介绍
      JSH.request({
        url: CloudMarketing.getlecturerInfo,
        method: "get",
        params: { baseId: id, type: "APP" },
        success(res) {
          if (res.success) {
            owner.lecturerObj = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    attributionQry(id) {
      const owner = this;
      //查询归属系列课
      JSH.request({
        url: CloudMarketing.attributionQry,
        method: "get",
        params: { id: id },
        success(res) {
          if (res.success) {
            owner.sysCourseList = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    // 获取回放信息
    getPlayBack(id) {
      const owner = this;
      //获取回放信息
      JSH.request({
        url: CloudMarketing.getPlayBack,
        method: "get",
        params: { baseId: id },
        success(res) {
          if (res.success) {
            owner.playBack = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    // 获取口令
    getvhallCode(id) {
      const owner = this;
      //获取口令
      JSH.request({
        url: CloudMarketing.getvhallCode,
        method: "get",
        params: { classId: id },
        success(res) {
          if (res.success) {
            owner.vhallObj = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    // 获取当前课程是否报名
    getSignUpStatus(id) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getSignUpStatus,
        method: "get",
        params: { baseId: id },
        success(res) {
          if (res.success) {
            owner.signUpStatus = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    getCourseDetail(id) {
      const owner = this;
      // owner.$loading.show(5000);
      owner.ht.$emit("loading", true);
      //获取课程详情
      JSH.request({
        url: CloudMarketing.getCourseDetail,
        method: "get",
        params: {
          id: id
        },
        success(res) {
          owner.isNetwork = false;
          if (res.success) {
            // owner.$loading.hide();
            owner.getNowDateTime();
            if (res.data.isQualified == 0) {
              if (res.data.taskEndTime) {
                if (Number(res.data.taskEndTime) < Number(owner.nowTime)) {
                  owner.modify = false;
                }
              } else {
                owner.modify = true;
              }
            } else {
              owner.modify = false;
            }
            let detailObj = res.data;
            owner.reviewStatus = res.data.reviewStatus;
            let value = res.data.courseImg ? res.data.courseImg : "";
            if (value && value !== "") {
              let index = value.lastIndexOf(".");
              if (index < 0 || value.length - index > 5) {
                console.log(value);
              } else {
                let start = value.substring(0, index);
                let end = value.substring(index, value.length);
                owner.courseImg = start + "_w300" + end;
              }
            }
            owner.getlecturerInfo(detailObj.id);
            owner.attributionQry(detailObj.id);
            owner.getSignUpStatus(detailObj.id);
            owner.$nextTick(() => {
              owner.$refs.courseDetailFoot.initData({
                status: detailObj.status,
                isComment: owner.reviewStatus,
                evaluateTotal: owner.evaluateTotal
              });
              // 1 直播中 2 直播结束  3直播未开始
              if (detailObj.leftStatus == 1) {
                // 直播去查口令
                owner.getvhallCode(detailObj.vhallLiveId);
              } else if (detailObj.leftStatus == 2) {
                // 如果直播结束则去查回放信息
                owner.getPlayBack(detailObj.id);
              }
              if (detailObj.testStatus == 1) {
                if (
                  owner.nowTime > detailObj.testStartTime &&
                  owner.nowTime < detailObj.testEndTime
                ) {
                  owner.testShowStatus = true;
                }
              }
              if (detailObj.taskStatus == 1) {
                if (
                  owner.nowTime > detailObj.taskStartTime &&
                  owner.nowTime < detailObj.taskEndTime
                ) {
                  owner.taskShowStatus = true;
                }
                // 没有作业时间
                if (!detailObj.taskStartTime && !detailObj.taskEndTime) {
                  owner.taskShowStatus = true;
                }
              }
              if (detailObj.pkStatus == 1) {
                if (
                  owner.nowTime > detailObj.pkStartTime &&
                  owner.nowTime < detailObj.pkEndTime
                ) {
                  owner.pkShowStatus = true;
                }
                // 没有PK时间
                if (!detailObj.pkStartTime && !detailObj.pkEndTime) {
                  owner.pkShowStatus = true;
                }
              }
            });
            owner.detailObj = detailObj;
            owner.ht.$emit("loading", false);
          } else {
            // owner.$loading.hide();
            owner.ht.$emit("loading", false);
            Toast(res.errorMsg);
          }
        },
        error() {
          // owner.$loading.hide();
          owner.ht.$emit("loading", false);
          owner.isNetwork = true;
        }
      });
    },
    // 获取当前系统时间
    getNowDateTime() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getNowDateTime,
        method: "post",
        params: {},
        success(res) {
          if (res.success) {
            owner.nowTime = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
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
    refreshClick() {
      const owner = this;
      owner.getNowDateTime();
      owner.getCourseDetail(owner.id);
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
    owner.getNowDateTime();
    owner.id = owner.$route.query.id;
    owner.viewurl = owner.$route.query.viewurl
      ? owner.$route.query.viewurl
      : null;
    if (owner.$route.query.sourceId) {
      owner.sourceId = owner.$route.query.sourceId;
    } else {
      owner.sourceId = owner.id;
    }
    owner.getReviewList();

    document.addEventListener(
      "click",
      function() {
        owner.tableList.forEach(item => {
          item.isShow = false;
        });
        owner.$forceUpdate();
      },
      false
    );
  }
};
</script>
<style lang="scss">
.course-description {
  width: 100%;
  .ql-align-center {
    text-align: center;
  }
  .ql-align-right {
    text-align: right;
  }
  img {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.company {
  position: relative;
  .content {
    /*display: none;*/
    color: white;
    position: absolute;
    background: rgba(50, 50, 51, 0.9);
    box-shadow: 0px 1px 6px 2px rgba(201, 201, 201, 0.48);
    top: 20px;
    left: 0px;
    font-size: 13px;
    padding: 9px 12px;
    border-radius: 5px;
  }
  .content:before {
    content: "";
    color: black;
    position: absolute;
    top: -10px;
    left: 10px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 11px solid rgba(50, 50, 51, 0.9);
  }
}
.course-recommend-box {
  background: #ffffff;
  margin: 10px 0px 10px 15px;
  padding: 15px 0px 0px 10px;
  border-radius: 5px 0px 0px 5px;
  .title {
    padding-left: 10px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #646566;
  }
}
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
    .mt-4 {
      margin-top: 4px;
    }
    .button-height {
      height: 24px;
      line-height: 24px;
    }
    .button-padding {
      padding: 0 8px;
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
  }
  .border-bottom-solid {
    border-bottom: 1px solid #dcdee0;
  }
}
.content {
  background-color: #ffffff;
}
.border-t {
  border-top: 1px solid #dcdee0;
}
.border-b {
  border-bottom: 1px solid #dcdee0;
}
.dianzan {
  width: 18px;
}
.img-right2 {
  width: 14px;
  height: 14px;
  margin-bottom: -2px;
}
.header-cover {
  position: relative;
  width: 100%;
  .header-layer {
    position: absolute;
    width: 100%;
    height: 200px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }
  .header-progress {
    position: absolute;
    right: 0;
    bottom: 4px;
    height: 16px;
    line-height: 16px;
    background: #2780f8;
    font-size: 11px;
    color: #ffffff;
    padding: 0px 5px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 3px 0px 0px 0px;
    z-index: 10;
  }
  .header-img {
    width: 14px;
    height: 14px;
    margin-left: 3px;
    z-index: 10;
  }
  .media-cover {
    width: 100%;
  }
  .back-info {
    width: 70px;
    background: #c0c4cc;
  }
  .play-box {
    position: absolute;
    left: 41%;
    top: 64px;
    text-align: center;
    z-index: 10;
    .play-button {
      margin-bottom: 5px;
      width: 60px;
      height: 60px;
    }
  }
  .play-status {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 54px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 11px;
    color: #ffffff;
    background: #c0c4cc;
    border-radius: 4px;
    z-index: 10;
    img {
      width: 10px;
      height: 10px;
    }
  }
  .live-status {
    width: 54px;
    background: #ffbb00;
  }
  .live-down {
    width: 118px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: linear-gradient(
      127deg,
      rgba(225, 57, 118, 1) 0%,
      rgba(234, 52, 37, 1) 100%
    );
  }
  .circle {
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background: white;
    margin: 0 3px;
  }
  .play-time {
    margin-left: 5px;
    font-size: 10px;
    color: #ffffff;
  }
}
.img-right {
  width: 14px;
  height: 14px;
  margin-left: 5px;
}
.img-right1 {
  width: 14px;
  height: 14px;
  margin-bottom: -3px;
}
.layout-block {
  height: 44px;
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
