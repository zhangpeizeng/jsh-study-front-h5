<template>
  <div class="tabbar">
    <div class="item" @click="switchTab('/public/home-page')">
      <div>
        <img v-if="type === '1'" src="../../assets/images/home2.png" alt="" />
        <img v-else src="../../assets/images/home1.png" alt="" />
      </div>
      <div :class="{ fontColor: type === '1' }">首页</div>
    </div>
    <div class="item" @click="switchTab('/public/taskList')">
      <div>
        <img v-if="type === '1'" src="../../assets/images/task1.png" alt="" />
        <img v-else src="../../assets/images/task2.png" alt="" />
      </div>
      <div :class="{ fontColor: type !== '1' }">任务</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tabbar",
  props: {
    type: null
  },
  data() {
    return {
      studyTerminalCode: ""
    };
  },
  created() {
    this.studyTerminalCode = localStorage.getItem("studyTerminalCode");
  },
  methods: {
    switchTab(path) {
      this.$router.push({
        path: path,
        query: {
          studyTerminalCode: this.studyTerminalCode
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.tabbar {
  border-top: 1px solid #f2f3f5;
  color: #c0c4cc;
  font-size: 10px;
  padding: 10px 0px;
  background-color: white;
  width: 100%;
  display: flex;
  text-align: center;
  position: fixed;
  bottom: 0;
  z-index: 999;
  .item {
    width: 50%;

    img {
      width: 21px;
      height: 21px;
    }
  }

  .fontColor {
    color: #227ef7;
  }
}
</style>
