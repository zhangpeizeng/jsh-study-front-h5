<template>
  <div>
    <van-pull-refresh
      v-model="isPullLoading"
      @refresh="onRefresh"
      class="pull-warp"
      success-text="加载成功"
    >
      <van-list
        v-model="listDataLoading"
        :finished="listDataFinished"
        :finished-text="pkList.length > 3 ? '没有更多了' : ''"
        @load="onLoadListData"
        v-if="pkList.length > 0 || page === 0"
      >
        <div class="content-list" v-if="pkList.length > 0 && !isFlag">
          <div class="list-item" v-for="(item, index) in pkList" :key="index">
            <div class="item-top">
              <div class="bodypic">
                <img v-if="item.courseImg" :src="item.courseImg" />
                <img
                  v-if="!item.courseImg"
                  src="../../../../assets/images/default.png"
                />
              </div>
              <div style="float: right;">
                <div style="min-height: 45px">
                  <div class="item-title-pk" @click="goToCourseDatil(item)">
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
                <div style="height: 23px;line-height: 23px;">
                  <span class="lecturer">
                    <img
                      style="width: 13px;height: 12px;margin-right: 6px"
                      src="../../../../assets/images/icon-teacher.png"
                      alt=""
                    />{{ item.lecturerName }}</span
                  >
                  <span
                    v-if="item.isPk == 1"
                    class="item-button-pk"
                    @click="goTopkWall(item)"
                    >已参与</span
                  >
                </div>
              </div>
            </div>
            <div style="clear: both;"></div>
            <div class="fs-12 mt-10" v-if="item.pkTime">
              <span style="color: #646566">PK时间：</span>
              <span style="color: #969799">{{
                item.pkTime | date1("yyyy-MM-dd hh:mm")
              }}</span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <!-- 列表无数据-->
    <div class="no-list" v-if="pkList.length === 0 && !isFlag">
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

Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
export default {
  name: "pk-wall-list",
  comments: {},
  data() {
    return {
      pkList: [],
      total: null,
      isPullLoading: false, // 下拉刷新loading
      isFlag: false, //网络请求加载
      listDataLoading: false, // 上拉加载loading
      listDataFinished: false, // 上拉加载数据完成
      page: 1 // 页数
    };
  },
  methods: {
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

    goTopkWall(items) {
      this.$router.push({
        path: "/public/taskDetails",
        query: {
          homeworkId: items.homeworkId,
          courseId: items.courseId,
          homeworkSubmitId: items.homeworkSubmitId
        }
      });
    },

    //作业已完成
    getPkWallList(page, callback) {
      const owner = this;
      owner.ht.$emit("loading", true);
      JSH.request({
        url: CloudMarketing.homeworktaskPkWall,
        method: "get",
        params: {
          pageNum: page,
          pageSize: 2
        },
        success(res) {
          owner.ht.$emit("loading", false);
          console.log(res);
          if (res.success) {
            callback(res);
            owner.page = page; // 赋值分页
            // 数据是否加载完成
            owner.listDataFinished = owner.page >= res.data.pages;
            owner.isFlag = false;
          } else {
            owner.isFlag = false;
            owner.page = 1;
            owner.pkList = [];
          }
        },
        error() {
          owner.isFlag = true;
          owner.ht.$emit("loading", false);
        }
      });
    },

    //下拉刷新方法
    onRefresh() {
      const owner = this;
      this.getPkWallList(1, data => {
        owner.isPullLoading = false;
        owner.pkList = data.data.list;
      });
    },

    //列表数据加载方法
    onLoadListData() {
      const owner = this;

      this.getPkWallList(this.page + 1, data => {
        // 加载状态结束
        owner.listDataLoading = false;
        console.log(data);
        owner.pkList = owner.pkList.concat(data.data.list);
      });
    }
  },
  created() {
    const owner = this;
    owner.onRefresh();
  },

  activated() {
    const owner = this;
    owner.onRefresh();
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
  margin-top: -488px;
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
  margin-top: 10px;
  width: 100%;

  .list-item {
    padding: 10px;
    margin: 10px 10px 0px 10px;
    border-radius: 10px;
    background-color: #ffffff;

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
        font-size: 14px;
        color: #323233;
        width: 156px;
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: ellipsis;
        min-height: 40px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .item-title-pk {
        font-size: 14px;
        color: #323233;
        width: 176px;
        text-align: left;
        white-space: normal;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .item-tname {
        font-size: 13px;
        color: #7d7e80;
        text-align: left;
        margin-top: 6px;
      }

      .item-tname-pk {
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
        line-height: 14px;
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
