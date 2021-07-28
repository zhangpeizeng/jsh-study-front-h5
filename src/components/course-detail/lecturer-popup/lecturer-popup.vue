<template>
  <div class="lecturer">
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper">
        <div class="block" @click.stop>
          <div style="width: 100%;position: relative;min-height: 155px;">
            <div class="block-img">
              <van-image
                width="120px"
                height="140px"
                fit="cover"
                :src="popupObj.lecturerImg"
              >
              </van-image>
            </div>
            <div>
              <div class="fs-14 mb-16" style="color:#606266;padding-top: 30px;">
                姓名:
                <span style="color:#303133">{{ popupObj.lecturerName }}</span>
              </div>
              <div class="fs-14 mb-16" style="color:#606266">
                头衔:
                <span style="color:#303133" v-if="popupObj.lecturerTitle">{{
                  popupObj.lecturerTitle
                }}</span>
                <span style="color:#303133" v-else>-</span>
              </div>
            </div>
          </div>
          <div style="width: 100%;">
            <div class="fs-14" style="color:#606266">
              介绍:
            </div>
            <div>
              <span class="fs-13" style="color:#909399">
                {{ popupObj.lecturerDesc }}
              </span>
            </div>
          </div>
        </div>
        <img
          src="../../../assets/images/cancel.png"
          class="wrapper-img"
          @click="show = false"
        />
      </div>
    </van-overlay>
  </div>
</template>
<script>
import Vue from "vue";
import { Overlay } from "vant";

Vue.use(Overlay);
/*
 * 111
 * */

export default {
  name: "courseDetailFoot",
  data() {
    return {
      show: false,
      value: "",
      showFlag: false,
      textButton: "",
      popupObj: {}
    };
  },
  methods: {
    initData(data) {
      this.show = true;
      this.popupObj = data;
    }
  }
};
</script>
<style lang="scss">
.lecturer {
  .van-overlay {
    z-index: 11;
  }
}
</style>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 281px;
  height: 379px;
  background-color: #fff;
  padding: 24px;
  border-radius: 4px;
  box-sizing: border-box;
  .block-img {
    float: left;
    width: 120px;
    height: 140px;
    margin-right: 15px;
  }
}
.wrapper-img {
  margin-top: 15px;
  width: 40px;
  height: 40px;
}
</style>
