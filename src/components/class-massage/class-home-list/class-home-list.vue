<template>
  <div v-show="list.length > 0" class="class-list w-100 no-line-to">
    <div
      class="item"
      v-for="(item, index) of list"
      :key="index"
      @click="goClassDetail(item)"
    >
      <div class="des">
        <!-- <span class="tag">{{ item.classifyName }}</span> -->
        <span class="class-title pl-5">{{ item.className }}</span>
      </div>
      <div class="time">
        <span
          v-if="
            handleYear(item.classStartTime) !== handleYear(item.classEndTime)
          "
        >
          {{ item.classStartTime | date("yyyy-MM-dd") }}
          至{{ item.classEndTime | date("yyyy-MM-dd") }}
        </span>
        <span v-else>
          {{ item.classStartTime | date1("yyyy-MM-dd") }}
          至{{ item.classEndTime | date1("yyyy-MM-dd") }}
        </span>
      </div>
      <div>
        <!--(1:显示报名人数（未开始），2:正在上课，3：已结束) -->
        <div v-if="item.status === 2" class="status">
          <img
            style="width: 15px;height: 14px"
            src="@/assets/images/loading-progress.png"
            alt=""
          />
          {{ item.statusName }}
        </div>
        <!-- <div v-if="item.status === 2" class="status2">
          <img
            style="width: 15px;height: 14px"
            src="@/assets/images/loading-time.png"
            alt=""
          />
          下次课04年12日
        </div> -->
        <div v-if="item.status === 1" class="status3">
          <img
            style="width: 15px;height: 14px"
            src="@/assets/images/loading-hot.png"
            alt=""
          />
          {{ item.signUpCount }}学员已报名
        </div>
        <div v-if="item.status === 3" class="status4">
          <img
            style="width: 15px;height: 14px"
            src="@/assets/images/loading-end.png"
            alt=""
          />
          {{ item.statusName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Image, List, Popup, Field, Loading, Toast, Dialog } from "vant";

import { CloudMarketing } from "@/request";
import JSH from "@/core";

Vue.use(Image)
  .use(List)
  .use(Popup)
  .use(Field)
  .use(Loading)
  .use(Dialog)
  .use(Toast);

export default {
  name: "course-recommend",
  props: {
    baseId: null
  },
  data() {
    return {
      nowDateTime: null,
      studyTerminalCode: "",
      againTrigger: false, //防重复点击
      list: []
    };
  },
  created() {
    //获取当前时间
    this.nowDateTime = Date.parse(new Date());
    this.studyTerminalCode = localStorage.getItem("studyTerminalCode");
    this.getClassList();
  },
  activated() {},
  methods: {
    handleYear(data) {
      let date = new Date(data);
      return date.getFullYear();
    },
    /**
     * 班级列表
     */
    getClassList() {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getClassList,
        method: "post",
        params: { classifyId: null },
        success(res) {
          if (res.success) {
            owner.list = res.data;
            owner.$emit("classList", owner.list);
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
     * 跳转到班级详情
     */
    goClassDetail(item) {
      this.$router.push({
        path: "/public/class-details",
        query: {
          classId: item.id,
          searchType: item.status
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.class-list {
  width: 100%;
  padding: 15px 5px 10px 15px;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 10;
  align-items: center;

  .item {
    white-space: initial;
    display: inline-block;
    vertical-align: middle;
    width: 308px !important;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(150, 151, 153, 1);
    padding: 10px 10px 10px 10px;
    margin-right: 10px;
    background: white;
    border-radius: 7px;

    .tag {
      width: 58px;
      text-align: center;
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff751f;
      background: #feeed7;
      border-radius: 4px;
    }

    .des {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .class-title {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323233;
      width: 220px;
    }

    .time {
      margin-top: 5px;
      display: inline-block;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #969799;
      background: #f7f9fd;
      border-radius: 4px;
      padding: 1px 6px;
    }

    .status {
      margin-top: 12px;
      padding: 5px 10px;
      display: inline-block;
      background: linear-gradient(270deg, #ffffff 0%, #e5f8ff 100%);
      border-radius: 8px;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #323233;
    }
    .status2 {
      margin-top: 12px;
      padding: 7px 10px;
      display: inline-block;
      background: linear-gradient(270deg, #ffffff 0%, #e5fff0 100%);
      border-radius: 4px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323233;
    }
    .status3 {
      margin-top: 12px;
      padding: 7px 10px;
      display: inline-block;
      background: linear-gradient(270deg, #ffffff 0%, #ffeff2 100%);
      border-radius: 4px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323233;
    }
    .status4 {
      margin-top: 12px;
      padding: 7px 10px;
      display: inline-block;
      background: linear-gradient(270deg, #ffffff 0%, #ebeef5 100%);
      border-radius: 4px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323233;
    }
  }
}
</style>
