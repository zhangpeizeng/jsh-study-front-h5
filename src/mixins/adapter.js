import Vue from "vue";

Vue.mixin({
  data() {
    return {
      // 是否需要iphone虚拟按键适配
      isIphoneX: false
    };
  },
  created() {
    if (
      /iphone/gi.test(navigator.userAgent) &&
      screen.height == 812 &&
      screen.width == 375
    ) {
      this.isIphoneX = true;
    } else {
      this.isIphoneX = false;
    }
  }
});
