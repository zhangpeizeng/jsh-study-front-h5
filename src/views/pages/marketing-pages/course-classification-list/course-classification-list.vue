<template>
  <div class="course-classification">
    <!--        一级标题-->
    <div class="jsh-header">
      <jshHeader :header="header"></jshHeader>
    </div>
    <div id="viewbottom"></div>
    <!--        分类列表有二级时----二级标题-->
    <div
      v-if="isTitle && list.length > 0"
      id="transTitle"
      class="trans1 no-line-to"
      style="margin-top: 40px"
    >
      <div
        v-for="(item, index) in secondTitle"
        :key="index"
        @click="checkList(item, index)"
        :class="{ fontSizeCurrent: index === nextFlag }"
        class="box1"
      >
        <div class="name">{{ item.classifyName }}</div>
        <div :class="{ borderBlue: index === nextFlag }"></div>
      </div>
    </div>
    <!--        分类列表有二级时-->
    <div v-if="isTitle && list.length > 0" class="classification-list">
      <div
        class="classification-item"
        v-for="(item, index) of list"
        :class="{ pT15: item.classifyName, pB15: item.isOpen === 2 }"
        :key="index"
      >
        <div v-if="item.classifyName" class="item-title">
          <div>{{ item.classifyName }}</div>
          <div
            @click="isOpenList(index, 2)"
            v-show="item.isOpen === 1"
            style="color: #2780F8"
          >
            <span style="vertical-align: middle;padding-right: 4px">收起</span>
            <img
              style="width: 14px;height: 14px;vertical-align: middle"
              src="../../../../assets/images/arrow-up.png"
              alt=""
            />
          </div>
          <div
            @click="isOpenList(index, 1)"
            v-show="item.isOpen === 2"
            style="color: #2780F8"
          >
            <span style="vertical-align: middle;padding-right: 4px">展开</span>
            <img
              style="width: 14px;height: 14px;vertical-align: middle"
              src="../../../../assets/images/arrow-down.png"
              alt=""
            />
          </div>
        </div>
        <div
          v-if="item.course.length > 0"
          class="list"
          v-show="item.isOpen === 1"
        >
          <div
            class="item"
            v-for="(item1, index1) of item.course"
            :key="index1"
            @click="goClassDetail(item1)"
            :class="{ lastBorder: index1 === item.course.length - 1 }"
          >
            <div class="introduce d-flex align-items-start">
              <div class="pic">
                <div
                  v-if="item1.leftTopStatusCode === 3"
                  class="live-down d-flex align-items-center"
                >
                  <div class="circle"></div>
                  <div class="d-flex align-items-center">
                    <div style="line-height: 14px">距开播:</div>
                    <van-count-down
                      @finish="reviseStatus(item1.id)"
                      :time="item1.countdown"
                    />
                  </div>
                </div>
                <div v-if="item1.leftTopStatusCode === 1" class="live-now">
                  <img src="../../../../assets/images/live-now.png" alt="" />
                  <span>直播中</span>
                </div>
                <div
                  v-if="item1.leftTopStatusCode === 2"
                  style="background-color: #c0c4cc"
                  class="live-now"
                >
                  <span>直播结束</span>
                </div>
                <img v-if="item1.courseImg" :src="item1.courseImg" alt="" />
                <img
                  v-if="!item1.courseImg"
                  src="../../../../assets/images/backlogo.png"
                  alt=""
                />
              </div>
              <div style="padding-left: 10px;flex-grow: 1;">
                <div style="min-height:55px">
                  <div class="title">
                    <span style="color: #999;" v-if="item1.courseType === '2'"
                      >[直播]</span
                    >
                    <span style="color: #999;" v-if="item1.courseType === '3'"
                      >[研讨]</span
                    >
                    <span style="color: #999;" v-if="item1.courseType === '4'"
                      >[系列]</span
                    >{{ item1.courseName }}
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="name">讲师：{{ item1.lecturerName }}</div>
                  <div
                    v-if="item1.rightBottomStatusCode"
                    class="tip"
                    :class="{
                      tip3:
                        item1.rightBottomStatusCode === 3 ||
                        item1.rightBottomStatusCode === 2 ||
                        item1.rightBottomStatusCode === 7
                    }"
                  >
                    <!--                                <img style="width: 14px;height: 14px;vertical-align: middle" src="../../../../assets/images/clock.png" alt="">-->
                    <!--                                <span style="vertical-align: middle">提醒我</span>-->
                    <span
                      @click.stop="nowAppointment(item1)"
                      v-if="item1.rightBottomStatusCode === 1"
                      style="vertical-align: middle"
                      >立即预约</span
                    >
                    <span
                      v-if="item1.rightBottomStatusCode === 2"
                      style="vertical-align: middle"
                      >已预约</span
                    >
                    <span
                      v-if="item1.rightBottomStatusCode === 3"
                      style="vertical-align: middle"
                      >报名截止</span
                    >
                    <span
                      @click.stop="viewPlay(item1)"
                      v-if="item1.rightBottomStatusCode === 4"
                      style="vertical-align: middle"
                      >观看直播</span
                    >
                    <span
                      v-if="item1.rightBottomStatusCode === 5"
                      style="vertical-align: middle"
                      >直播回放</span
                    >
                    <span
                      @click.stop="signUp(item1)"
                      v-if="item1.rightBottomStatusCode === 6"
                      style="vertical-align: middle"
                      >立即报名</span
                    >
                    <span
                      v-if="item1.rightBottomStatusCode === 7"
                      style="vertical-align: middle"
                      >已报名</span
                    >
                    <span
                      @click.stop="addStudy(item1)"
                      v-if="item1.rightBottomStatusCode === 8"
                      style="vertical-align: middle"
                      >加入学习</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="
                (item1.liveStartTime || item1.liveEndTime) &&
                  item1.liveEndTime > nowDateTime
              "
              class="time"
            >
              直播时间:{{ item1.liveStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
                item1.liveEndTime | date1("yyyy-MM-dd hh:mm")
              }}
            </div>
            <div
              v-else-if="item1.studyStartTime || item1.studyEndTime"
              class="time"
            >
              学习时间:{{
                item1.studyStartTime | date1("yyyy-MM-dd hh:mm")
              }}至{{ item1.studyEndTime | date1("yyyy-MM-dd hh:mm") }}
            </div>
            <!--<div  v-else class="time">学习时间:不限</div>-->
          </div>
        </div>
        <!--                <div  v-else style="height: 500px" v-else>-->
        <!--                    暂无课程先学习-->
        <!--                </div>-->
      </div>
    </div>
    <!--        当分类列表只有一级时-->
    <div v-if="!isTitle && list.length > 0">
      <div class="first-list">
        <div
          class="item"
          v-for="(item, index) of list"
          :key="index"
          @click="goClassDetail(item)"
          :class="{ lastBorder: index === list.length - 1 }"
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
                v-if="item.leftTopStatusCode === 3"
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
              <div v-if="item.leftTopStatusCode === 1" class="live-now">
                <img src="../../../../assets/images/live-now.png" alt="" />
                <span>直播中</span>
              </div>
              <div
                v-if="item.leftTopStatusCode === 2"
                style="background-color: #c0c4cc"
                class="live-now"
              >
                <span>直播结束</span>
              </div>
            </div>
            <div style="padding-left: 10px;flex-grow: 1">
              <div style="min-height: 55px">
                <div class="title">
                  <span style="color: #999;" v-if="item.courseType === '2'"
                    >[直播]</span
                  >
                  <span style="color: #999;" v-if="item.courseType === '3'"
                    >[研讨]</span
                  >
                  <span style="color: #999;" v-if="item.courseType === '4'"
                    >[系列]</span
                  >
                  {{ item.courseName }}
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div class="name">讲师：{{ item.lecturerName }}</div>
                <div
                  v-if="item.rightBottomStatusCode"
                  class="tip"
                  :class="{
                    tip3:
                      item.rightBottomStatusCode === 3 ||
                      item.rightBottomStatusCode === 2 ||
                      item.rightBottomStatusCode === 7
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
            直播时间:{{ item.liveStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
              item.liveEndTime | date1("yyyy-MM-dd hh:mm")
            }}
          </div>
          <div
            v-else-if="item.studyStartTime || item.studyEndTime"
            class="time"
          >
            学习时间:{{ item.studyStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
              item.studyEndTime | date1("yyyy-MM-dd hh:mm")
            }}
          </div>
          <!--<div  v-else class="time">学习时间:不限</div>-->
        </div>
      </div>
    </div>
    <!--        分类列表无数据-->
    <div class="no-list-data" v-if="list.length === 0">
      <div class="set">
        <div style="padding-top: 50%">
          <img src="../../../../assets/images/no-search-data.png" alt="" />
        </div>
        <div style="padding-top: 10px">暂无课程，先学习其他课程吧～</div>
      </div>
    </div>
    <!--        直播提示框-->
    <div v-show="isNav" style="position: fixed;bottom: 2%;left: 15px;">
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
          <div class="refresh" @click="classificationList()">刷新</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import liveFrame from "../../../../components/live-frame/live-frame.vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import { formatDate } from "../../../../utils/utils";
import { Toast, CountDown, Dialog } from "vant";
import Vue from "vue";
import jshHeader from "../../../../components/jsh-header/jsh-header.vue";
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(CountDown);
export default {
  name: "course-classification-list",
  components: {
    liveFrame,
    jshHeader
  },
  filters: {
    Date: function(value) {
      return formatDate(value, "yyyy/MM/dd hh:mm");
    }
  },
  data() {
    return {
      i: 0,
      isNav: true,
      isNetwork: false,
      // 二级标题
      secondTitle: [],
      // 判断页面有没有二级标题
      isTitle: true,
      // 中转list
      transferList: [],
      // 接收上个页面传过来的id
      id: null,
      nextFlag: 0,
      scrollNum: 0,
      data: null,
      list: [],
      header: {
        title: "哈哈课程分类",
        rightType: 3
      },
      //按钮防止二次点击
      againTrigger: false,
      isFirstEnter: true, // 是否第一次进页面
      temID: "",
      nowDateTime: null
    };
  },
  activated() {
    // 获取当前时间
    this.nowDateTime = Date.parse(new Date());
    const owner = this;
    //上滑，下滑的监听
    if (owner.scrollNum) {
      document.getElementById("transTitle").scrollLeft = owner.scrollNum;
    }
    console.log(owner.scrollNum, "666666666666666666");
    window.addEventListener("scroll", owner.handleScroll, true);
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
            console.log(owner.data);
            if (owner.data) {
              if (owner.data.course && owner.data.course.length > 0) {
                owner.data.course.forEach(value => {
                  if (value.id == data.data.id) {
                    value.rightBottomStatusCode = data.data.status;
                    value.rightBottomStatus = data.data.labelRight;
                    value.leftTopStatus = data.data.leftStatus;
                    value.leftTopStatusCode = data.data.leftStatusCode;
                    value.countdown = data.data.countdown;
                  }
                });
              } else {
                owner.data.children.forEach(value => {
                  if (value.course && value.course.length > 0) {
                    value.course.forEach(valueItem => {
                      if (valueItem.id == data.data.id) {
                        valueItem.rightBottomStatusCode = data.data.status;
                        valueItem.rightBottomStatus = data.data.labelRight;
                        valueItem.leftTopStatus = data.data.leftStatus;
                        valueItem.leftTopStatusCode = data.data.leftStatusCode;
                        valueItem.countdown = data.data.countdown;
                      }
                    });
                  } else {
                    value.children.forEach(value => {
                      if (value.course && value.course.length > 0) {
                        value.course.forEach(valueItem => {
                          if (valueItem.id == data.data.id) {
                            valueItem.rightBottomStatusCode = data.data.status;
                            valueItem.rightBottomStatus = data.data.labelRight;
                            valueItem.leftTopStatus = data.data.leftStatus;
                            valueItem.leftTopStatusCode =
                              data.data.leftStatusCode;
                            valueItem.countdown = data.data.countdown;
                          }
                        });
                      }
                    });
                  }
                });
              }
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
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  created() {
    this.nextFlag = 0;
    this.list = [];
    this.secondTitle = [];
    this.id = this.$route.query.id;
    this.header.title = this.$route.query.classifyName;
    this.classificationList();
  },
  methods: {
    /**
     * 监听上滑下滑
     */
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
      if (scroll > 10) {
        this.i = scrollTop;
        this.isNav = true;
      } else if (scroll < -10) {
        this.i = scrollTop;
        this.isNav = false;
      }
    },
    /**
     *
     * 点击收起展开列表
     */
    isOpenList(index, type) {
      const _that = this;
      for (let i = 0; i < _that.list.length; i++) {
        if (i === index) {
          _that.list[i].isOpen = type;
        }
      }
      _that.$forceUpdate();
    },

    /**
     *
     * 修改列表标签的状态
     */
    reviseStatus(id) {
      const _that = this;
      //页面有二级标题时
      if (_that.isTitle) {
        _that.list.forEach(item => {
          item.course.forEach(item1 => {
            if (item1.id === id) {
              item1.leftTopStatusCode = 1;
            }
          });
        });
      }
      //页面只有一级
      else {
        _that.list.forEach(item => {
          if (item.id === id) {
            item.leftTopStatusCode = 1;
          }
        });
      }
    },
    /**
     * 获取分类列表
     */
    classificationList() {
      this.$loading.show(5000);
      const _that = this;
      // 获取一级分类接口
      JSH.request({
        url: CloudMarketing.listClassClassifyCourses,
        method: "get",
        params: {
          id: this.id
        },
        success(data) {
          _that.isNetwork = false;
          _that.againTrigger = false;
          if (data.success) {
            _that.$loading.hide();
            _that.data = data.data;
            //判断是否有二级分类
            if (_that.data.children.length > 0) {
              //将课程列表处理成相同的数据结构
              _that.isTitle = true;
              _that.data.children.forEach(item => {
                if (item.course) {
                  item.children = [];
                  let creatObj = {
                    classifyName: "",
                    course: item.course,
                    isOpen: 1
                  };
                  item.children.push(creatObj);
                } else if (item.children.length === 0 && !item.course) {
                  let creatObj = {
                    classifyName: "",
                    course: [],
                    isOpen: 1
                  };
                  item.children.push(creatObj);
                } else {
                  item.children.forEach(item1 => {
                    item1.isOpen = 1;
                  });
                }
              });
              //判断三级分类里面有没有值，没有值就踢出
              for (let i = _that.data.children.length - 1; i >= 0; i--) {
                for (
                  let j = _that.data.children[i].children.length - 1;
                  j >= 0;
                  j--
                ) {
                  if (
                    _that.data.children[i].children[j].course === null ||
                    _that.data.children[i].children[j].course.length === 0
                  ) {
                    _that.data.children[i].children.splice(j, 1);
                  }
                }
                if (_that.data.children[i].children.length === 0) {
                  _that.data.children.splice(i, 1);
                }
              }
              console.log(_that.data.children, "hahahahahah哈哈哈哈哈");
              //拿二级标题
              _that.secondTitle = _that.data.children;

              //展示页面列表
              if (_that.data.children.length > 0) {
                _that.list = _that.data.children[0].children;
              }

              // _that.list.forEach(item=>{
              //     item.course.forEach(item1=>{
              //         item1.countdown = 10000
              //     })
              // })
              console.log(_that.list);
            } else {
              _that.isTitle = false;
              _that.list = _that.data.course;
              // _that.list.forEach(item=>{
              //     item.countdown = 10000
              // })
            }
          } else {
            _that.$loading.hide();
            Toast(data.errorMsg);
          }
          setTimeout(() => {
            let aa = document.getElementById("transTitle").scrollLeft;
            console.log("xixiixixixixixixixixixixixi", aa);
          }, 5000);
        },
        error(e) {
          _that.isNetwork = true;
          _that.againTrigger = false;
          console.log(e);
        }
      });
    },
    /**
     * 点击二级分类切换列表
     */
    checkList(item, index) {
      const _that = this;
      this.nextFlag = index;
      _that.list = _that.data.children[index].children;
      console.log(_that.list, "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈");
      this.scrollNum = document.getElementById("transTitle").scrollLeft;
      console.log(this.scrollNum, "嘻嘻嘻嘻嘻嘻嘻");
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
            if (type === 1) {
              Toast("已加入到任务-【待学习】");
            } else if (type === 2) {
              Toast("报名成功");
            } else if (type === 3) {
              Toast("预约成功");
            }
            owner.classificationList();
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

<style scoped lang="scss">
.course-classification {
  word-break: break-all;
  .lastBorder {
    border: none !important;
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
  .first-list {
    padding-top: 55px;

    .item {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(150, 151, 153, 1);
      padding: 15px;
      background-color: white;
      border-bottom: 1px solid rgba(220, 222, 224, 1);

      .pic {
        position: relative;

        img {
          width: 120px;
          height: 75px;
          border-radius: 6px;
        }
        .live-down {
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
      .name {
        width: 120px;
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
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .tip {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(39, 128, 248, 1);
        background: rgba(225, 238, 255, 1);
        border-radius: 30px;
        padding: 3px 10px;
      }
      .tip3 {
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

  .trans1 {
    width: 100%;
    background: #ffffff;
    position: fixed;
    padding: 12px 5px 10px 5px;
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    z-index: 10;
    display: flex;
    align-items: center;

    .box1 {
      .name {
        min-width: 85px;
        padding: 0px 5px;
      }

      background: #fff;
      text-align: center;
      font-size: 14px;
      color: #333333;
      position: relative;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(50, 50, 51, 1);
      line-height: 20px;

      .borderBlue {
        position: absolute;
        bottom: -10px;
        left: 33%;
        width: 30px;
        height: 3px;
        background: #2283e2;
        border-radius: 2px;
      }
    }

    .fontSizeCurrent {
      font-weight: 600;
    }
  }

  .classification-list {
    padding-top: 83px;

    .classification-item {
      border-radius: 10px;
      background-color: white;
      margin: 15px 15px 0px 15px;
      padding: 0px 15px 0px 15px;

      .item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(50, 50, 51, 1);
        /*padding-bottom: 15px;*/
      }

      .list {
        .lastBorder {
          border-bottom: none;
        }
        .item {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(150, 151, 153, 1);
          padding: 15px 0px;
          background-color: white;
          border-bottom: 1px solid rgba(220, 222, 224, 1);

          .pic {
            position: relative;
            img {
              width: 120px;
              height: 75px;
              border-radius: 6px;
            }
            .live-down {
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
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(50, 50, 51, 1);
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .tip {
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(39, 128, 248, 1);
            background: rgba(225, 238, 255, 1);
            border-radius: 30px;
            padding: 3px 10px;
          }
          .tip3 {
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
    }
    .pT15 {
      padding-top: 15px;
    }
    .pB15 {
      padding-bottom: 15px;
    }
  }

  .no-list-data {
    padding-top: 50px;
    text-align: center;
    width: 100%;
    height: 100%;

    .set {
      height: 570px;
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
