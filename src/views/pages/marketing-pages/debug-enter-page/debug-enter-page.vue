<template>
  <div>
    <van-field
      v-model="address"
      rows="1"
      autosize
      type="textarea"
      placeholder="请输入局域网页面地址"
    />
    <div class="p-30">
      <van-button
        type="info"
        hairline
        round
        block
        @click="tpDebugPageForLocation"
      >
        Location 跳转
      </van-button>
    </div>
    <div class="p-30 fs-14 color-888">
      示例：http://10.168.5.179:8081/h5/#/demo
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Field, Button } from "vant";
import mix from "./debug-enter-page-mixins";

Vue.use(Field).use(Button);

export default {
  mixins: [mix]
};
</script>
<style lang="scss" scoped>
.code {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
}
</style>
