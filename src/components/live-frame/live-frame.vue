<template>
  <div v-if="this.GLOBAL.liveFrame" class="live-frame">
    <div class="live-info">
      <div class="close" @click="closeShow()">
        <img src="../../assets/images/close.png" alt="" />
      </div>
      <div class="line"></div>
      <div class="pic">
        <img
          v-if="data.courseImg"
          style="width:35px;height:35px;"
          :src="data.courseImg"
          alt=""
        />
        <img
          v-if="!data.courseImg"
          style="width:35px;height:35px;"
          src="../../assets/images/video-start.png"
          alt=""
        />
      </div>
      <div v-if="data.courseName" class="title">{{ data.courseName }}</div>
    </div>
    <div class="entry" @click="goClassDetail()">
      <span>进入</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Image, List, Popup, Field, Loading, Toast } from "vant";

import { CloudMarketing } from "@/request";
import JSH from "@/core";

Vue.use(Image)
  .use(List)
  .use(Popup)
  .use(Field)
  .use(Loading)
  .use(Toast);

export default {
  name: "live-frame",
  props: {},
  data() {
    return {
      //悬浮框是否展示
      isShow: this.GLOBAL.liveFrame,
      data: {}
    };
  },
  methods: {
    /**
     * 跳转到课程详情页面
     */
    goClassDetail(item) {
      item = this.data;
      if (item.isOver) {
        Toast("哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程");
        return;
      }
      if (item.unStart) {
        Toast("学习未开始");
        return;
      }
      //路由地址需要之后再改
      if (item.courseType === "1") {
        this.$router.push({
          path: "/public/recorded-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      } else if (item.courseType === "2") {
        this.$router.push({
          path: "/public/live-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      } else if (item.courseType === "3") {
        this.$router.push({
          path: "/public/discussion-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      } else if (item.courseType === "4") {
        this.$router.push({
          path: "/public/series-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      } else if (item.courseType === "5") {
        this.$router.push({
          path: "/public/class-detail",
          query: {
            courseImg: JSON.stringify(item.courseImg),
            id: item.id
          }
        });
      }
    },
    /**
     * 悬浮框不展示
     */
    closeShow() {
      this.GLOBAL.liveFrame = false;
      this.$forceUpdate();
      console.log(this.GLOBAL.liveFrame, "111111111111111111");
    },
    /**
     * 最近观看课程
     */
    getLiveFrame() {
      const owner = this;
      // 获取悬浮框的内容
      JSH.request({
        url: CloudMarketing.lastLiveCourseIndex,
        method: "get",
        params: {},
        success(data) {
          if (data.success) {
            if (data.data) {
              owner.data = data.data;
              owner.$forceUpdate();
            } else {
              owner.GLOBAL.liveFrame = false;
              owner.$forceUpdate();
            }
          } else {
            owner.GLOBAL.liveFrame = false;
          }
        },
        error(e) {
          owner.GLOBAL.liveFrame = false;
          console.log(e);
        }
      });
    }
  },
  created() {
    console.log(
      this.GLOBAL.liveFrame,
      "全局啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
    );
    this.isShow = this.GLOBAL.liveFrame;
    this.getLiveFrame();
  },
  activated() {
    this.getLiveFrame();
  }
};
</script>

<style scoped lang="scss">
.live-frame {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background: rgba(50, 50, 51, 0.89);
  border-radius: 61px;

  .live-info {
    display: flex;
    align-items: center;

    .close {
      img {
        width: 18px;
        height: 18px;
      }
    }

    .line {
      width: 1px;
      height: 20px;
      background-color: #ffffff;
      margin: 0px 10px;
      opacity: 0.5;
    }

    .pic {
      border-radius: 44px;
      padding-right: 10px;
      position: relative;

      img {
        border-radius: 44px;
      }
    }

    .title {
      color: white;
      width: 170px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .entry {
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      padding: 6px 12px;
      background-color: #227ef7;
      border-radius: 28px;
    }
  }
}
</style>
