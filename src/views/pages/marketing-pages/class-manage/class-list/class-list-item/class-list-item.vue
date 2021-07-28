<template>
  <div>
    <div class="item" @click="toClassDetail(item.id)">
      <div class="d-flex justify-content-between">
        <div>
          <!-- <span class="tag">{{ item.classifyName }}</span> -->
          <span class="class-name">
            {{ item.className }}
          </span>
        </div>
        <div
          @click.stop="checkTip(index)"
          v-if="type === SEARCH_TYPE.NOT_JOINED"
          class="uninterested"
        >
          <img
            src="@/assets/images/loading-more.png"
            style="
              width: 10px;
              height: 12px;
              display: inline-block;
              vertical-align: middle;
              padding-left: 3px;
            "
          />
          <div v-show="isShow" class="content color-fff">
            <span @click.stop="noInterest(item.id, item.className)">
              不感兴趣
            </span>
          </div>
        </div>
      </div>
      <div class="dec d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <div>
            <img :src="item.lecturerUrl || defaultLecturerUrl" alt="" />
          </div>
          <div class="pl-5">{{ item.lecturerName }}</div>
          <div class="pl-5">班主任</div>
        </div>
        <span
          class="time"
          v-if="
            handleYear(item.classStartTime) !== handleYear(item.classEndTime)
          "
          >{{ item.classStartTime | date("yyyy-MM-dd hh:mm") }}至{{
            item.classEndTime | date("yyyy-MM-dd hh:mm")
          }}</span
        >
        <span class="time" v-else
          >{{ item.classStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
            item.classEndTime | date1("yyyy-MM-dd hh:mm")
          }}</span
        >
      </div>
      <!-- 正在学 -->
      <div
        v-if="type === SEARCH_TYPE.LEARNING"
        class="effect d-flex align-items-center justify-content-between"
      >
        <div
          class="status"
          v-if="item.operationStatus === OPERATIONSTATUS.GO_TO_CLASS"
        >
          <img
            style="width: 15px; height: 14px"
            src="@/assets/images/loading-progress.png"
            alt=""
          />
          进行中
        </div>
        <div
          class="tip"
          v-if="item.operationStatus === OPERATIONSTATUS.GO_TO_CLASS"
        >
          去上课
        </div>
        <div
          class="status"
          v-if="item.operationStatus === OPERATIONSTATUS.REGISTERED_NOT_OPEN"
        >
          <img
            style="width: 15px; height: 14px"
            src="@/assets/images/loading-hot.png"
            alt=""
          />
          {{ item.signUpCount || 0 }}名学员已报名
        </div>
      </div>
      <!-- 未加入 -->

      <div
        v-if="type === SEARCH_TYPE.NOT_JOINED"
        class="effect d-flex align-items-center justify-content-between"
      >
        <div class="status">
          <img
            style="width: 15px; height: 14px"
            src="@/assets/images/loading-hot.png"
            alt=""
          />
          {{ item.signUpCount || 0 }}名学员已报名
        </div>
        <div>
          <div
            class="tip"
            v-if="item.operationStatus === OPERATIONSTATUS.SIGN_UP"
            @click.stop="updateClassStudentStatus(item.id, 1)"
          >
            报名
          </div>
          <div
            class="tip"
            v-if="item.operationStatus === OPERATIONSTATUS.JOIN_LEARNING"
            @click.stop="updateClassStudentStatus(item.id, 2)"
          >
            加入学习
          </div>
          <div
            class="tip1"
            v-if="item.operationStatus === OPERATIONSTATUS.REJECTED"
          >
            报名驳回
          </div>
          <div
            class="tip1"
            v-if="
              item.operationStatus ===
                OPERATIONSTATUS.REGISTERED_BEING_CONFIRMED
            "
          >
            已报名等待审核
          </div>
        </div>
      </div>

      <!-- 已完成 -->
      <div
        v-if="type === SEARCH_TYPE.FINISHED"
        class="effect d-flex align-items-center justify-content-between"
      >
        <div class="status end-class">已结束</div>
        <div class="tip1">
          {{ ["", "未评定", "合格", "不合格"][item.studyStatus || 1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleYear } from "@/utils/utils.js";
import { Dialog, Toast } from "vant";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import TYPE from "../type";
const defaultLecturerUrl = require("@/assets/images/default_avatar.png");
export default {
  name: "classListItem",
  data() {
    return {
      handleYear: handleYear,
      isShow: false,
      defaultLecturerUrl: defaultLecturerUrl,
      SEARCH_TYPE: TYPE.SEARCH_TYPE,
      OPERATIONSTATUS: TYPE.OPERATIONSTATUS
    };
  },
  props: {
    item: {
      require: true,
      type: Object
    },
    index: {
      require: true,
      type: Number
    },
    type: {
      require: true,
      type: Number
    }
  },
  methods: {
    /**
     * 是否展示不感兴趣提示信息
     */
    checkTip() {
      this.isShow = !this.isShow;
      this.$forceUpdate();
    },
    /**
     * 不感兴趣提示框
     */
    noInterest(classId, className) {
      Dialog.confirm({
        title: "不感兴趣的班级将不能再次学习，确认不感兴趣？",
        message: "确认后不可以恢复",
        className
      })
        .then(() => {
          // on confirm
          this.updateClassStudentStatus(classId, 3);
          this.isShow = false;
        })
        .catch(() => {
          // on cancel
        });
    },

    updateClassStudentStatus(classId, type) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.updateClassStudentStatus,
        method: "get",
        params: { classId, type },
        success(res) {
          if (res.success) {
            owner.$emit("updateList");
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {}
      });
      this.$emit("closeUninterested");
    },
    toClassDetail(classId) {
      this.$router.push({
        path: "/public/class-details",
        query: {
          classId,
          searchType: this.type
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  margin: 0 10px 10px 10px;
  padding: 15px 10px;
  background: white;
  border-radius: 10px;
  .tag {
    font-size: 12px;

    font-weight: 400;
    color: #ff751f;
    background: #feeed7;
    border-radius: 4px;
    padding: 2px 5px;
  }
  .class-name {
    font-size: 14px;
    font-weight: 600;
    color: #323233;
  }
  .dec {
    margin-top: 8px;
    font-size: 12px;

    font-weight: 400;
    color: #646566;
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .time {
      font-size: 12px;

      font-weight: 400;
      color: #969799;
      background: #f7f9fd;
      border-radius: 2px;
      padding: 2px 6px;
    }
  }
  .effect {
    padding-top: 10px;
    .status {
      padding: 7px 10px;
      display: inline-block;
      background: linear-gradient(270deg, #ffffff 0%, #e5f8ff 100%);
      border-radius: 4px;
      font-size: 13px;
      font-weight: 400;
      color: #323233;
    }
    .tip {
      background: #2780f8;
      border-radius: 30px;
      font-size: 13px;
      font-weight: 400;
      color: #ffffff;
      padding: 3px 15px !important;
    }
    .tip1 {
      font-size: 13px;
      color: #323233;
    }
  }
  .uninterested {
    position: relative;
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
    width: 80px;
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
