<template>
  <div style="padding-top: 40px;height: 100%">
    <div v-if="isModifyAssignment">
      <jobSubmit @submit="submitHomeWork" ref="submit"></jobSubmit>
    </div>
    <van-pull-refresh
      v-model="isPullLoading"
      @refresh="onRefresh"
      class="pull-warp"
      success-text="加载成功"
    >
      <!--待提-->
      <div v-show="selectStatus === 1" class="content-list">
        <div
          class="list-item"
          v-for="(item, index) in unHomeworkList"
          :key="index"
        >
          <div class="item-top">
            <div class="bodypic">
              <img v-if="item.courseImg" :src="item.courseImg" />
              <img
                v-if="!item.courseImg"
                src="../../../../assets/images/default.png"
              />
            </div>
            <div style="display: inline-block;vertical-align:top;">
              <div class="item-title" @click="goToCourseDatil(item)">
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
              <div style="height: 23px;line-height: 23px;">
                <span class="lecturer">
                  <img
                    style="width: 13px;height: 12px;margin-right: 2px"
                    src="../../../../assets/images/icon-teacher.png"
                    alt=""
                  />
                  {{ item.lecturerName }}</span
                >
                <span
                  v-if="item.showButton"
                  class="item-button"
                  @click="submitTask(item)"
                  >交作业</span
                >
              </div>
            </div>
            <div class="body-right" @click="goToCourseDatil(item)">
              <img
                class="right-img"
                src="../../../../assets/images/arrow-right.png"
                alt=""
              />
            </div>
          </div>
          <div style="clear: both;"></div>
          <div
            class="fs-12 mt-10"
            v-if="item.homeworkStartTime && item.homeworkEndTime"
          >
            <span style="color: #646566">提交时间：</span>
            <span
              v-if="
                handleYear(item.homeworkStartTime) !==
                  handleYear(item.homeworkEndTime)
              "
              style="color: #969799"
              >{{ item.homeworkStartTime | date("yyyy-MM-dd hh:mm") }} 至{{
                item.homeworkEndTime | date("yyyy-MM-dd hh:mm")
              }}
            </span>
            <span v-else style="color: #969799"
              >{{ item.homeworkStartTime | date1("yyyy-MM-dd hh:mm") }} 至{{
                item.homeworkEndTime | date1("yyyy-MM-dd hh:mm")
              }}
            </span>
            <!--<span-->
            <!--style="color: #969799"-->
            <!--v-if="!item.homeworkEndTime && !item.homeworkStartTime"-->
            <!--&gt;不限</span-->
            <!--&gt;-->
          </div>
        </div>
      </div>
      <!--未提-->
      <van-list
        v-model="listDataLoading2"
        :finished="listDataFinished2"
        :finished-text="unSubmitList.length > 3 ? '没有更多了' : ''"
        @load="onLoadListData2"
        v-show="(unSubmitList.length > 0 || page2 === 0) && selectStatus === 2"
      >
        <div class="content-list">
          <div
            class="list-item"
            v-for="(item, index) in unSubmitList"
            :key="index"
          >
            <div class="item-top">
              <div class="bodypic">
                <img v-if="item.courseImg" :src="item.courseImg" />
                <img
                  v-if="!item.courseImg"
                  src="../../../../assets/images/default.png"
                />
              </div>
              <div style="display: inline-block;vertical-align:top;">
                <div class="item-title" @click="goToCourseDatil(item)">
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
                <div style="height: 23px;line-height: 23px;">
                  <span class="lecturer">
                    <img
                      style="width: 13px;height: 12px;margin-right: 2px"
                      src="../../../../assets/images/icon-teacher.png"
                      alt=""
                    />{{ item.lecturerName }}</span
                  >
                  <span style="margin-right: -13px;" class="no-btn-submit"
                    >未提交
                  </span>
                </div>
              </div>
              <div class="body-right" @click="goToCourseDatil(item)">
                <img
                  class="right-img"
                  src="../../../../assets/images/arrow-right.png"
                  alt=""
                />
              </div>
            </div>
            <div style="clear: both;"></div>
            <div class="fs-12 mt-10">
              <span style="color: #646566">提交时间：</span>
              <span
                style="color: #969799"
                v-if="item.homeworkStartTime && item.homeworkEndTime"
              >
                <span
                  v-if="
                    handleYear(item.homeworkStartTime) !==
                      handleYear(item.homeworkEndTime)
                  "
                >
                  {{ item.homeworkStartTime | date("yyyy-MM-dd hh:mm") }} 至{{
                    item.homeworkEndTime | date("yyyy-MM-dd hh:mm")
                  }}
                </span>
                <span v-else>
                  {{ item.homeworkStartTime | date1("yyyy-MM-dd hh:mm") }} 至{{
                    item.homeworkEndTime | date1("yyyy-MM-dd hh:mm")
                  }}
                </span>
              </span>
              <span v-else style="color: #969799">
                不限
              </span>
              <!--<span-->
              <!--style="color: #969799"-->
              <!--v-if="!item.homeworkEndTime && !item.homeworkStartTime"-->
              <!--&gt;不限</span-->
              <!--&gt;-->
            </div>
          </div>
        </div>
      </van-list>
      <!--已提-->
      <van-list
        v-model="listDataLoading"
        :finished="listDataFinished"
        :finished-text="homeworkList.length > 3 ? '没有更多了' : ''"
        @load="onLoadListData"
        v-show="(homeworkList.length > 0 || page === 0) && selectStatus === 3"
      >
        <div class="content-list">
          <div
            class="list-item"
            v-for="(item, index) in homeworkList"
            :key="index"
          >
            <div class="item-top">
              <div class="bodypic">
                <img v-if="item.courseImg" :src="item.courseImg" />
                <img
                  v-if="!item.courseImg"
                  src="../../../../assets/images/default.png"
                />
              </div>
              <div style="display: inline-block;vertical-align:top;">
                <div class="item-title" @click="goToCourseDatil(item)">
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
                <div style="height: 23px;line-height: 23px;">
                  <span class="lecturer">
                    <img
                      style="width: 13px;height: 12px;margin-right: 2px"
                      src="../../../../assets/images/icon-teacher.png"
                      alt=""
                    />{{ item.lecturerName }}</span
                  >
                  <span
                    style="margin-right: -13px;"
                    v-if="item.homeworkSubmitStatus == 1"
                    class="btn-submit"
                  >
                    <span v-if="item.updateStatus == 1">
                      <span class="item-button" @click="handHomeWork(item)"
                        >修改作业</span
                      >
                    </span>
                    <span v-else @click="submitTask(item)">
                      {{ item.score }}分>
                    </span>
                  </span>

                  <span
                    v-if="item.homeworkSubmitStatus == 0"
                    class="btn-submit"
                  >
                    <span @click="submitTask(item)">
                      已交>
                    </span>
                  </span>
                </div>
              </div>
              <div class="body-right" @click="goToCourseDatil(item)">
                <img
                  class="right-img"
                  src="../../../../assets/images/arrow-right.png"
                  alt=""
                />
              </div>
            </div>
            <div style="clear: both;"></div>
            <div
              class="fs-12 mt-10"
              v-if="item.homeworkStartTime && item.homeworkEndTime"
            >
              <span style="color: #646566">提交时间：</span>
              <span
                style="color: #969799"
                v-if="item.homeworkStartTime && item.homeworkEndTime"
              >
                <span
                  v-if="
                    handleYear(item.homeworkStartTime) !==
                      handleYear(item.homeworkEndTime)
                  "
                >
                  {{ item.homeworkStartTime | date("yyyy-MM-dd hh:mm") }} 至{{
                    item.homeworkEndTime | date("yyyy-MM-dd hh:mm")
                  }}
                </span>
                <span v-else>
                  {{ item.homeworkStartTime | date1("yyyy-MM-dd hh:mm") }} 至{{
                    item.homeworkEndTime | date1("yyyy-MM-dd hh:mm")
                  }}
                </span>
              </span>
              <!--<span-->
              <!--style="color: #969799"-->
              <!--v-if="!item.homeworkEndTime && !item.homeworkStartTime"-->
              <!--&gt;不限</span-->
              <!--&gt;-->
            </div>
          </div>
        </div>
      </van-list>
      <!--不合格-->
      <van-list
        v-model="listDataLoading3"
        :finished="listDataFinished3"
        :finished-text="unqualifiedList.length > 3 ? '没有更多了' : ''"
        @load="onLoadListData3"
        v-show="
          (unqualifiedList.length > 0 || page3 === 0) && selectStatus === 4
        "
      >
        <div class="content-list">
          <div
            class="list-item"
            v-for="(item, index) in unqualifiedList"
            :key="index"
          >
            <div class="item-top">
              <div class="bodypic">
                <img v-if="item.courseImg" :src="item.courseImg" />
                <img
                  v-if="!item.courseImg"
                  src="../../../../assets/images/default.png"
                />
              </div>
              <div style="display: inline-block;vertical-align:top;">
                <div class="item-title" @click="goToCourseDatil(item)">
                  <span style="color: #999999" v-if="item.courseType === '2'"
                    >[直播]</span
                  >
                  <span style="color: #999999" v-if="item.courseType === '3'"
                    >[研讨]</span
                  >
                  <span style="color: #999999" v-if="item.courseType === '4'"
                    >[系列]</span
                  >
                  {{ item.courseName }}
                </div>
                <div style="height: 23px;line-height: 23px;">
                  <span class="lecturer">
                    <img
                      style="width: 13px;height: 12px;margin-right: 2px"
                      src="../../../../assets/images/icon-teacher.png"
                      alt=""
                    />{{ item.lecturerName }}</span
                  >
                  <span
                    style="margin-right: -13px;"
                    v-if="item.homeworkSubmitStatus == 1"
                    class="btn-submit"
                  >
                    <span v-if="item.updateStatus == 1">
                      <span class="item-button" @click="handHomeWork(item)"
                        >修改作业</span
                      >
                    </span>
                    <span v-else @click="submitTask(item)">
                      {{ item.score }}分>
                    </span>
                  </span>

                  <span
                    v-if="item.homeworkSubmitStatus == 0"
                    @click="submitTask(item)"
                    class="btn-submit"
                    >已交>
                  </span>
                </div>
              </div>
              <div class="body-right" @click="goToCourseDatil(item)">
                <img
                  class="right-img"
                  src="../../../../assets/images/arrow-right.png"
                  alt=""
                />
              </div>
            </div>
            <div style="clear: both;"></div>
            <div
              class="fs-12 mt-10"
              v-if="item.homeworkStartTime && item.homeworkEndTime"
            >
              <span style="color: #646566">提交时间：</span>
              <span
                style="color: #969799"
                v-if="item.homeworkStartTime && item.homeworkEndTime"
              >
                <span
                  v-if="
                    handleYear(item.homeworkStartTime) !==
                      handleYear(item.homeworkEndTime)
                  "
                >
                  {{ item.homeworkStartTime | date("yyyy-MM-dd hh:mm") }} 至{{
                    item.homeworkEndTime | date("yyyy-MM-dd hh:mm")
                  }}
                </span>
                <span v-else>
                  {{ item.homeworkStartTime | date1("yyyy-MM-dd hh:mm") }} 至{{
                    item.homeworkEndTime | date1("yyyy-MM-dd hh:mm")
                  }}
                </span>
              </span>
              <!--<span-->
              <!--style="color: #969799"-->
              <!--v-if="!item.homeworkEndTime && !item.homeworkStartTime"-->
              <!--&gt;不限</span-->
              <!--&gt;-->
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <!-- 列表无数据-->
    <div
      class="no-list"
      v-show="
        (unHomeworkList.length === 0 && selectStatus === 1) ||
          (unSubmitList.length === 0 && selectStatus === 2) ||
          (homeworkList.length === 0 && selectStatus === 3) ||
          (unqualifiedList.length === 0 && selectStatus === 4)
      "
    >
      <div style="margin-top: 160px;">
        <img src="../../../../assets/images/no-search-data.png" alt="" />
        <span style="padding-top: 10px;display: block;"
          >暂无课程，先学习其他课程吧~</span
        >
      </div>
    </div>
    <div class="no-network" v-show="isFlag">
      <div>
        <div class="set">
          <div>
            <img src="@/assets/images/network.png" alt="" />
          </div>
          <div style="padding-top: 30px;color: #646566;font-size: 14px">
            网络请求失败
          </div>
          <div style="padding-top: 10px">请检查您的网络，重新加载试试吧</div>
          <div class="refresh" @click="onRefresh">刷新</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast, NavBar, Cell, CellGroup, List, PullRefresh } from "vant";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import jobSubmit from "@/components/job-submit/job-submit.vue";

Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
export default {
  name: "homework-list",
  components: { jobSubmit },
  props: ["selectStatus"],
  data() {
    return {
      dataLength: null,
      homeworkList: [],
      unHomeworkList: [],
      unSubmitList: [],
      unqualifiedList: [],
      isFlag: false,
      totalCount: null,
      isPullLoading: false, // 下拉刷新loading
      listDataLoading: false, // 上拉加载loading
      listDataFinished: false, // 上拉加载数据完成
      page: 1, // 页数
      isPullLoading2: false, // 下拉刷新loading
      listDataLoading2: false, // 上拉加载loading
      listDataFinished2: false, // 上拉加载数据完成
      page2: 1, // 页数
      isPullLoading3: false, // 下拉刷新loading
      listDataLoading3: false, // 上拉加载loading
      listDataFinished3: false, // 上拉加载数据完成
      page3: 1, // 页数
      isModifyAssignment: false
    };
  },
  methods: {
    handleYear(data) {
      let date = new Date(data);
      return date.getFullYear();
    },
    //交作业
    submitTask(items) {
      console.log(items);
      this.$router.push({
        path: "/public/taskDetails",
        query: {
          homeworkId: items.homeworkId,
          courseId: items.courseId,
          homeworkSubmitId: items.homeworkSubmitId,
          isType: items.homeworkSubmitId == null ? true : false
        }
      });
    },
    // 修改作业
    handHomeWork(item) {
      const owner = this;
      owner.isModifyAssignment = true;
      owner.jobObj = {
        courseId: item.courseId,
        homeworkId: item.homeworkId,
        homeworkSubmitId: item.homeworkSubmitId,
        type: true
      };
      owner.$nextTick(() => {
        owner.$refs.submit.show(owner.jobObj);
      });
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
            owner.isModifyAssignment = false;
            owner.onRefresh();
          } else {
            Toast(res.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },

    //跳转到课程详情
    goToCourseDatil(obj) {
      if (obj.status == 1 || obj.status == 3 || obj.deleteFlg == 1) {
        this.$toast(
          "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
        );
        return;
      }
      if (obj.studyWarningMsg) {
        this.$toast(obj.studyWarningMsg);
        return;
      } else {
        let url = "";
        if (obj.courseType == 1) {
          url = "/public/recorded-course";
        } else if (obj.courseType == 2) {
          url = "/public/live-course";
        } else if (obj.courseType == 3) {
          url = "/public/discussion-course";
        } else {
          url = "/public/series-course";
        }
        this.$router.push({
          path: url,
          query: {
            id: obj.courseId
          }
        });
      }
    },

    //作业未完成
    getTaskList(type) {
      let owner = this;
      if (type == 1) {
        owner.ht.$emit("loading", true);
      }
      JSH.request({
        url: CloudMarketing.homeworktaskHomework,
        method: "get",
        params: {},
        success(data) {
          console.log(data);
          if (data.success) {
            owner.ht.$emit("loading", false);
            owner.isFlag = false;
            owner.unHomeworkList = data.data;
            owner.totalCount = owner.unHomeworkList.length;
          } else {
            owner.unHomeworkList = [];
            owner.isFlag = false;
            owner.ht.$emit("loading", false);
          }
        },
        error(e) {
          owner.isFlag = true;
          owner.ht.$emit("loading", false);
          console.log(e);
        }
      });
    },
    //作业未提交
    getUnfinishAbandon(page, callback) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.unfinishAbandon,
        method: "get",
        params: {
          pageNum: page,
          pageSize: 10
        },
        success(res) {
          if (res.success) {
            owner.isFlag = false;
            callback(res);
            owner.page2 = page; // 赋值分页
            // 数据是否加载完成
            owner.listDataFinished2 = owner.page >= res.data.pages;
          } else {
            owner.page = 1;
            owner.unSubmitList = [];
            owner.isFlag = false;
          }
        },
        error() {
          owner.isFlag = true;
        }
      });
    },
    //作业已完成
    getTaskfinishList(page, callback) {
      console.log("0000000000000000");
      const owner = this;
      JSH.request({
        url: CloudMarketing.taskHomeworkList,
        method: "get",
        params: {
          pageNum: page,
          pageSize: 10
        },
        success(res) {
          if (res.success) {
            owner.isFlag = false;
            callback(res);
            owner.page = page; // 赋值分页
            // 数据是否加载完成
            owner.listDataFinished = owner.page >= res.data.pages;
          } else {
            owner.page = 1;
            owner.homeworkList = [];
            owner.isFlag = false;
          }
        },
        error() {
          owner.isFlag = true;
        }
      });
    },
    //作业不合格
    getUnqualifiedList(page, callback) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.listHomeworksByAccountIdUnqualified,
        method: "get",
        params: {
          pageNum: page,
          pageSize: 10
        },
        success(res) {
          if (res.success) {
            owner.isFlag = false;
            callback(res);
            owner.page3 = page; // 赋值分页
            // 数据是否加载完成
            owner.listDataFinished3 = owner.page3 >= res.data.pages;
          } else {
            owner.page3 = 1;
            owner.unqualifiedList = [];
            owner.isFlag = false;
          }
        },
        error() {
          owner.isFlag = true;
        }
      });
    },

    //下拉刷新方法
    onRefresh() {
      console.log("====================");
      const owner = this;
      this.getTaskfinishList(1, data => {
        owner.isPullLoading = false;
        owner.homeworkList = data.data.list;
      });
      owner.getTaskList(1);
      this.getUnfinishAbandon(1, data => {
        owner.isPullLoading2 = false;
        owner.unSubmitList = data.data.list;
      });
      this.getUnqualifiedList(1, data => {
        owner.isPullLoading3 = false;
        owner.unqualifiedList = data.data.list;
      });
    },

    //已完成数据加载方法
    onLoadListData() {
      const owner = this;
      this.getTaskfinishList(this.page + 1, data => {
        // 加载状态结束
        owner.listDataLoading = false;
        console.log(data);
        owner.homeworkList = owner.homeworkList.concat(data.data.list);
      });
    },
    //未提交数据加载方法
    onLoadListData2() {
      const owner = this;
      this.getUnfinishAbandon(this.page + 1, data => {
        // 加载状态结束
        owner.listDataLoading2 = false;
        console.log(data);
        owner.unSubmitList = owner.unSubmitList.concat(data.data.list);
      });
    },
    //不合格数据加载方法
    onLoadListData3() {
      const owner = this;
      this.getUnqualifiedList(this.page3 + 1, data => {
        // 加载状态结束
        owner.listDataLoading3 = false;
        console.log(data);
        owner.unqualifiedList = owner.unqualifiedList.concat(data.data.list);
      });
    }
  },
  watch: {
    totalCount(val) {
      this.$emit("getDataFromC", val);
    },
    selectStatus(val) {
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
      }, 100);
      let owner = this;
      console.log("1");
      if (val === 1) {
        this.getTaskList();
      } else if (val === 2) {
        this.getUnfinishAbandon(1, data => {
          owner.isPullLoading2 = false;
          owner.unSubmitList = data.data.list;
        });
      } else if (val === 3) {
        this.getTaskfinishList(1, data => {
          owner.isPullLoading = false;
          owner.homeworkList = data.data.list;
        });
      } else if (val === 4) {
        this.getUnqualifiedList(1, data => {
          owner.isPullLoading3 = false;
          owner.unqualifiedList = data.data.list;
        });
      }
    }
  },
  created() {
    const owner = this;
    owner.onRefresh();
  },
  activated() {
    const owner = this;
    owner.onRefresh();
    document.documentElement.scrollTop = 0;
  }
};
</script>
<style scoped>
/deep/.van-pull-refresh__track {
  position: relative;
  height: 100%;
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  transition-property: transform;
  transition-property: transform, -webkit-transform;
  min-height: 500px;
}
</style>
<style lang="scss" scoped>
.content-top {
  color: #969799;
  font-size: 14px;
  padding-left: 20px;
  width: 375px;
  height: 34px;
  line-height: 34px;
}
.no-list {
  text-align: center;
  position: absolute;
  margin: 0 auto;
  margin-top: -500px;
  min-height: 700px;
  width: 100%;
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
.content-list {
  width: 100%;
  .list-item {
    padding: 10px;
    margin: 10px 10px 0px 10px;
    background-color: #ffffff;
    border-radius: 10px;

    .item-top {
      position: relative;
      .bodypic {
        width: 144px;
        height: 90px;
        margin-right: 10px;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
      }

      .body-right {
        display: inline-block;
        width: 14px;
        text-align: right;
        vertical-align: top;
      }

      .right-img {
        margin-top: 3px;
        width: 7px;
        height: 10px;
        vertical-align: top;
      }
      .item-title {
        margin-bottom: 8px;
        font-size: 14px;
        color: #323233;
        width: 161px;
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: ellipsis;
        min-height: 25px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .item-title-pk {
        font-size: 14px;
        color: #323233;
        width: 215px;
        text-align: left;
      }

      .item-tname {
        font-size: 13px;
        color: #7d7e80;
        text-align: left;
        margin-top: 6px;
      }

      .item-tname-pk {
        position: absolute;
        bottom: 5px;
        left: 130px;
        font-size: 13px;
        color: #7d7e80;
        text-align: left;
      }

      .item-button {
        position: absolute;
        right: 0;
        border: 1px solid #2780f8;
        width: 70px;
        height: 22px;
        line-height: 22px;
        color: #2780f8;
        border-radius: 15px;
        text-align: center;
        font-size: 14px;
      }
      .btn-submit {
        color: #227ef7;
        font-size: 14px;
        float: right;
      }
      .no-btn-submit {
        font-size: 14px;
        float: right;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(125, 126, 128, 1);
        background: rgba(242, 243, 245, 1);
        border-radius: 30px;
        padding: 2px 15px;
      }
      .lecturer {
        font-size: 13px;
        color: #7d7e80;
      }
      .item-button-pk {
        /*position: absolute;*/
        bottom: 0;
        right: 0;
        background-color: #f2f3f5;
        color: #7d7e80;
        font-size: 14px;
        width: 72px;
        height: 24px;
        line-height: 24px;
        border-radius: 15px;
        text-align: center;
        float: right;
      }

      .score {
        position: absolute;
        bottom: 5px;
        right: 0;
        font-size: 16px;
        font-weight: 500;
        color: #227ef7;

        img {
          margin-left: 5px;
          width: 7px;
          height: 10px;
        }
      }
    }
  }
}
.no-network {
  padding-top: 73px;
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
