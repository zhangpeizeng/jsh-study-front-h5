<template>
  <div class="class-list w-100 no-line-to">
    <div
      class="item"
      :class="{ itemBackground: index % 2 !== 0 }"
      v-for="(item, index) of list"
      :key="index"
      @click="goClassDetail(item)"
    >
      <div>
        <img
          style="width: 15px;height: 14px"
          src="@/assets/images/loading-progress.png"
          alt=""
        />
        <span class="class-title pl-5">{{ item.className }}</span>
      </div>
      <div>
        <!-- <span class="tag">{{ item.className }}</span> -->
        <span class="time" :class="{ time2: index % 2 !== 0 }">
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
        </span>
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
    classifyId: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getClassList();
  },
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
        params: {
          classifyId: owner.classifyId
        },
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
          classifyId: this.classifyId,
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
  .itemBackground {
    box-shadow: 0px 2px 21px 0px #e7fff1 !important;
    border: 1px solid #8cffa0 !important;
    background: #f3fff8 !important;
  }
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
    border-radius: 7px;
    background: #eefbff;
    box-shadow: 0px 2px 21px 0px #eefbff;
    border: 1px solid #8fe5ff;
    .tag {
      margin-right: 10px;
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
    .class-title {
      display: inline-block;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323233;
      width: 255px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .time {
      margin-top: 5px;
      display: inline-block;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #969799;
      background: #d4f5ff;
      border-radius: 4px;
      padding: 1px 6px;
    }
    .time2 {
      background: #ddffeb;
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
  }
}
</style>
