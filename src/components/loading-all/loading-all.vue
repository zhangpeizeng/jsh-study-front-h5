<template>
  <div class="loadingI" v-show="isShowLoading">
    <div>
      <img
        src="../../assets/images/loadingNew.png"
        style="width: 38px;height: 38px"
        alt=""
      />
    </div>
    <span style="color:#FFFFFF;font-size:14px">加载中...</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowLoading: false,
      time: 1000
    };
  },
  mounted() {
    // 时间控制
    setTimeout(() => {
      this.isShowLoading = false;
    }, this.time);
  }
};
</script>

<style lang="scss">
.loadingI {
  z-index: 1000;
  text-align: center;
  width: 78px;
  height: 90px;
  background: rgba(0, 0, 0, 1);
  border-radius: 12px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.6;
  img {
    animation: rotate 1s linear infinite;
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    margin-top: 13px;
    margin-bottom: 4px;
  }
}
</style>
