import Vue from "vue";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import classDetailsHeader from "./class-details-header.vue";
import { Toast, List, PullRefresh, CountDown, Dialog } from "vant";
import { handleYear } from "@/utils/utils.js";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import TYPE from "./type";
import { UEditorBox } from "@jsh/helper/components";
import networkError from "@/components/network-error/network-error.vue";
import nodataPage from "@/components/nodata-page/nodata-page.vue";
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(Dialog);

const defaultLecturerUrl = require("@/assets/images/default_avatar.png");

export default {
  name: "ClassDetails",
  data() {
    return {
      header: { title: "班级详情", rightTypeSort: 1 },
      // 班级基本信息
      classBasicInfo: {},
      // 班级id
      classId: "",
      // 班级课表
      classTimetable: [],
      COURSE_TYPE: TYPE.COURSE_TYPE,
      COURSE_STATUS: TYPE.COURSE_STATUS,
      handleYear: handleYear,
      dropDownFlag: false,
      systemTime: null,
      classStartTime: null,
      // 讲师信息
      lecturerObj: {},
      defaultLecturerUrl: defaultLecturerUrl,
      isPullLoading: false
    };
  },
  components: {
    jshHeader,
    classDetailsHeader,
    UEditorBox,
    networkError,
    nodataPage
  },
  filters: {
    getSerialNumber: index => {
      return (index + 1 > 9 ? "" : "0") + (index + 1) + "";
    }
  },
  created() {
    this.classId = parseInt(this.$route.query.classId);
    this.searchType = parseInt(this.$route.query.searchType);

    this.getClassBasicInfo();
    this.getClassTimetable();
  },
  computed: {
    classTimetableinList() {
      return this.dropDownFlag
        ? this.classTimetable
        : this.classTimetable.slice(0, 3);
    },
    noData() {
      return this.classTimetable.length === 0;
    }
  },
  methods: {
    onRefresh(toastType) {
      this.isPullLoading = true;
      this.getClassBasicInfo(toastType);
      this.getClassTimetable();
    },
    // 获取班级基本信息
    // toastType === 1 代表点击按钮后刷新页面
    getClassBasicInfo(toastType) {
      this.isNetworkError = false;
      const owner = this;
      JSH.request({
        url: CloudMarketing.classBaseInfoById,
        method: "post",
        params: {
          id: owner.classId,
          searchType: owner.searchType
        },
        success(data) {
          if (data.success) {
            console.log(data);
            owner.classBasicInfo = data.data;
            owner.getlecturerInfo(data.data.lecturerId);
            if (toastType) {
              if (
                owner.classBasicInfo.status === TYPE.COURSE_STATUS.JOINED ||
                owner.classBasicInfo.status ===
                  TYPE.COURSE_STATUS.REFISTRATION_APPROVED
              ) {
                // 学员已加入
                if (toastType === 1) {
                  Toast("已报名");
                }
                if (owner.searchType === 1) {
                  // 替换当前路由;
                  owner.$router.replace({
                    path: "/public/class-details",
                    query: {
                      classId: owner.classId,
                      searchType: 2
                    }
                  });
                }
              } else {
                Toast("您已报名，待班主任确认后即可开始学习");
              }
            }
          } else {
            owner.$toast(data.errorMsg);
          }
          owner.isPullLoading = false;
        },
        error() {
          owner.isPullLoading = false;
          owner.isNetworkError = true;
        }
      });
    },
    // 获取班级课表
    getClassTimetable() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.listClassManagementCoursesRela,
        method: "post",
        params: {
          classId: owner.classId,
          searchType: owner.searchType
        },
        success(data) {
          if (data.success) {
            owner.classTimetable = data.data;
          } else {
            owner.$toast(data.errorMsg);
          }
        },
        error() {}
      });
    },
    // 课表展开隐藏
    dropDown() {
      // 班级状态是未开始时,不展示全部课程
      if (this.searchType === 1) {
        return;
      }
      this.dropDownFlag = !this.dropDownFlag;
    },
    // 查看课程详情
    viewCourse(item) {
      const { studyStartTime, studyEndTime } = item;
      const { systemTime, classStartTime } = this.classBasicInfo;
      switch (this.searchType) {
        case TYPE.SEARCH_TYPE.NOT_JOINED: // 未加入
          console.log("未加入班级");
          return;
        case TYPE.SEARCH_TYPE.LEARNING: // 正在学
          if (classStartTime > systemTime) {
            Toast("班级学习未开始");
            return;
          }
          if (studyStartTime > systemTime) {
            Toast("学习未开始");
            return;
          }
          if (systemTime > studyEndTime) {
            Toast(
              "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
            );
            return;
          }
          break;
        case TYPE.SEARCH_TYPE.FINISHED: // 已学完
          Toast("班级学习已结束");
          return;

        default:
          break;
      }
      let path = "";
      switch (item.courseType) {
        case "1":
          path = "/public/recorded-course";
          break;
        case "2":
          path = "/public/live-course";
          break;
        case "3":
          path = "/public/discussion-course";
          break;
        case "4":
          path = "/public/series-course";
          break;
        case "6":
          path = "/public/class-detail";
          break;
        default:
          break;
      }
      // 路由跳转
      this.$router.push({
        path,
        query: {
          id: item.baseId
        }
      });
    },
    /**
     * 修改班级状态
     * @param {*} classId 班级id
     * @param {*} type 学生状态更新为
     * @param {*} currentType 当前学生的状态
     * type 和currentType值得意义不一样,type查看接口文档，currentType参考变量COURSE_STATUS
     */
    updateClassStudentStatus(classId, type, currentType) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.updateClassStudentStatus,
        method: "get",
        params: { classId, type },
        success(res) {
          if (res.success) {
            if (currentType === TYPE.COURSE_STATUS.TO_BE_CONFIRMED_BY_STUDENT) {
              Toast("已加入该班级学习");
              owner.onRefresh(2);
            }
            if (currentType === TYPE.COURSE_STATUS.SIGN_UP_NOW) {
              owner.onRefresh(1);
              return;
            }
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    },
    // 查看讲师详情
    getlecturerInfo(id) {
      const owner = this;
      //获取讲师介绍
      JSH.request({
        url: CloudMarketing.getLecturerById,
        method: "get",
        params: { lecturerId: id },
        success(res) {
          if (res.success) {
            owner.lecturerObj = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
    }
  }
};
