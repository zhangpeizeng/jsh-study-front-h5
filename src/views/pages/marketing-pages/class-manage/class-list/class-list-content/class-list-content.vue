<template>
  <div style="height: 100%">
    <!--        列表-->
    <van-pull-refresh
      v-model="isPullLoading"
      @refresh="onRefresh"
      success-text="加载成功"
    >
      <div class="new-list" @click="closeUninterested">
        <!-- 课表在班级列表显示，搜索列表不显示 -->
        <div
          v-if="pageType === 1"
          @click="goTimeTable()"
          class="time-table d-flex align-items-center justify-content-between"
        >
          <div>
            <img
              src="@/assets/images/icon-schedule.png"
              style="
                width: 18px;
                height: 18px;
                display: inline-block;
                vertical-align: middle;
                padding-left: 3px;
                vertical-align: middle;
              "
            />
            <span style="vertical-align: middle">我的课程表</span>
          </div>
          <div>
            <img
              src="@/assets/images/right.png"
              style="
                width: 8px;
                height: 10px;
                display: inline-block;
                vertical-align: middle;
                padding-left: 3px;
              "
            />
          </div>
        </div>
        <div v-for="(value, key) in classList" :key="key">
          <div v-if="value.type === selectCourseStatus || !selectCourseStatus">
            <div class="status-title" v-if="value.classList.length">
              {{ value.classStatus }}
            </div>
            <class-list-item
              ref="classListItem"
              v-for="(item, index) in value.classList"
              :key="index"
              :index="index"
              :item="item"
              :type="value.type"
              @updateList="onRefresh"
              @closeUninterested="closeUninterested"
            ></class-list-item>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <!--        列表无数据-->
    <nodata-page :contentTxt="'暂无班级~'" v-if="noData"></nodata-page>
    <!--        网络有问题展示-->
    <network-error :onRefresh="onRefresh" v-if="isNetwork"></network-error>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast, List, PullRefresh, CountDown, Dialog } from "vant";
import classListItem from "../class-list-item/class-list-item.vue";
import nodataPage from "@/components/nodata-page/nodata-page.vue";
import networkError from "@/components/network-error/network-error.vue";

Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(Dialog);
export default {
  props: {
    classList: {
      type: Object,
      require: true
    },
    isNetwork: {
      type: Boolean,
      require: true
    },
    noData: {
      type: Boolean,
      require: true
    },
    isPullLoading: {
      type: Boolean,
      require: true
    },
    selectCourseStatus: {
      type: Number,
      require: true
    },
    pageType: {
      type: Number,
      require: true
    }
  },
  components: { classListItem, nodataPage, networkError },
  methods: {
    onRefresh() {
      this.$emit("onRefresh");
    },

    closeUninterested() {
      this.$refs.classListItem.forEach(item => {
        item.isShow = false;
      });
    },
    /**
     * 跳转到课程表
     */
    goTimeTable() {
      this.$router.push("/public/class-timetable");
    }
  }
};
</script>

<style lang="scss" scoped>
.new-list {
  .time-table {
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #323233;
    margin: 0 10px;
    padding: 12px;
    background: white;
    border-radius: 10px;
  }
  .status-title {
    padding: 10px 16px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #2780f8;
    background: #ecf4ff;
  }
  .itemMb {
    margin-bottom: 0px !important;
  }

  .content {
    /*display: none;*/
    color: white;
    position: absolute;
    background: rgba(50, 50, 51, 0.9);
    box-shadow: 0px 1px 6px 2px rgba(201, 201, 201, 0.48);
    top: 30px;
    right: -15px;
    font-size: 13px;
    padding: 9px 12px;
    border-radius: 5px;
  }
  .content:before {
    content: "";
    color: black;
    position: absolute;
    top: -10px;
    right: 12px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 11px solid rgba(50, 50, 51, 0.9);
  }
}
</style>
