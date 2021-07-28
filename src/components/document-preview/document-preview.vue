<template>
  <div v-if="isshow">
    <div class="mask-layout">
      <div class="mask-info info-1">{{ huihuiNumber }}</div>
      <div class="mask-info info-2">{{ huihuiNumber }}</div>
      <div class="mask-info info-3">{{ huihuiNumber }}</div>
      <div class="mask-info info-4">{{ huihuiNumber }}</div>
      <div class="mask-info info-5">{{ huihuiNumber }}</div>
      <div class="mask-info info-6">{{ huihuiNumber }}</div>
      <div class="mask-info info-7">{{ huihuiNumber }}</div>
    </div>
    <van-list
      v-model="isFinished"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <jshHeader @leftClick="backTo" :header="header1"></jshHeader>
      <div class="mb-5" v-for="(item, index) in workList" :key="index">
        <img :src="item" @click="sceneImgOne(item)" alt="" />
      </div>
    </van-list>
  </div>
</template>
<script src="./document-preview.js"></script>
<style lang="scss" scoped>
img {
  width: 100%;
}
.mask-layout {
  pointer-events: none;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  .mask-info {
    position: absolute;
    transform: rotate(-35deg);
    font-weight: 600;
    font-size: 18px;
    color: rgba(48, 49, 51, 0.1);
  }
  .info-1 {
    top: 103px;
    left: 45px;
  }
  .info-2 {
    top: 163px;
    left: 251px;
  }
  .info-3 {
    top: 272px;
    left: 45px;
  }
  .info-4 {
    top: 332px;
    left: 251px;
  }
  .info-5 {
    top: 441px;
    left: 45px;
  }
  .info-6 {
    top: 501px;
    left: 251px;
  }
  .info-7 {
    top: 610px;
    left: 45px;
  }
}
</style>
