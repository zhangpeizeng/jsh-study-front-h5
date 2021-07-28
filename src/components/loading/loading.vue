<template>
  <div class="loading-mark" v-show="loading">
    <div class="loading-page">
      <img src="@/assets/images/cun1.gif" alt="" />
      <div class="text">加载中...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loading.vue",
  data() {
    return {
      loading: false
    };
  },
  created() {
    let that = this;
    this.ht.$on("loading", function(data) {
      setTimeout(() => {
        that.loading = data;
      }, 100);
      // setTimeout(()=>{
      //     that.loading = false;
      // },6000)
    });
  }
};
</script>

<style scoped lang="scss">
.loading-mark {
  width: 100%;
  height: 100%;
  z-index: 9999;
  top: 0;
  position: fixed;
  background: rgba(245, 245, 245, 0);
}
.loading-page {
  padding: 10px;
  color: white;
  text-align: center;
  position: fixed;
  top: 40%;
  left: 37%;
  width: 100px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  border-radius: 10px;
  img {
    width: 50px;
    height: 50px;
  }
  .text {
    padding: 5px 0 8px 0;
    font-size: 13px;
  }
}
</style>
