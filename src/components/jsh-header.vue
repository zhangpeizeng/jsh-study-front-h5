<template>
  <div class="jsh-header" :style="{ top: headertop + 'px' }">
    <div class="header" :class="type">
      <div class="left" @click="goBack">
        <slot name="left">
          <van-icon name="arrow-left" />
        </slot>
      </div>
      <div class="title">{{ titleWithPrefix }}</div>
      <div class="right1" v-if="classnub === '1'">
        <slot name="right"></slot>
      </div>
      <div
        class="right"
        v-if="classnub === '2'"
        @click="
          () => {
            $emit('clickright2');
          }
        "
      >
        <slot name="right">
          <span>{{ right }}</span>
        </slot>
      </div>
      <div
        class="right"
        v-if="classnub === '3'"
        @click="
          () => {
            $emit('clickright3');
          }
        "
      >
        <slot name="right">
          <img
            src="../assets/images/fenxiang.png"
            style="display: inline-block;vertical-align:middle;width: 24px;height: 24px;"
          />
        </slot>
      </div>
      <div
        class="right"
        v-if="classnub === '4'"
        @click="
          () => {
            $emit('clickright4');
          }
        "
      >
        <slot name="right">
          <span>{{ right }}</span>
          <van-icon
            style="display: inline-block;vertical-align: middle;"
            size="10"
            name="arrow-down"
          />
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Icon } from "vant";
import JSH from "@/core";
import { CloudBase } from "@/request";

Vue.use(Icon);
/*
 * classnub 1没有right按钮  2 文本right  3  分享按钮  4 选择地址
 *  4 @clickright4                Function              右侧按钮触发方法
 *  3 @clickright3                Function              右侧按钮触发方法
 *  2 @clickright2                Function              右侧按钮触发方法
 * */

export default {
  name: "jshheader",
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      }
    },
    type: {
      type: String,
      default: () => {
        return "default";
      }
    },
    classnub: {
      type: String,
      default: () => {
        return "1";
      }
    },
    right: {
      type: String,
      default: () => {
        return "";
      }
    },
    headertop: {
      type: String,
      default: () => {
        return "0";
      }
    },
    customback: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      titleWithPrefix: this.title + CloudBase.titlePrefix
    };
  },
  methods: {
    goBack() {
      if (this.customback) {
        this.$emit("backmethod");
      } else {
        JSH.goBack(this.$router);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
    position: relative;
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
      padding: 0 17px;
      font-size: 14px;
      color: #333;
    }
    .right {
      padding: 0 12px;
      font-size: 14px;
      color: #666666;
    }
    .right1 {
      padding: 0 12px;
      font-size: 14px;
      color: #666666;
    }
  }
}
</style>
