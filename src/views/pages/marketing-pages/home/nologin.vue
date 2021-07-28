<template>
  <div style="background-color: white;height: 100vh;">
    <van-nav-bar
      title="营销学院"
      left-text=""
      left-arrow
      @click-left="goback"
    />
    <div style="width: 100%;text-align: center;padding-top: 169px;">
      <div
        style="width: 100%;text-align: center;font-size: 16px;color: #646566;padding-top: 40px;"
      >
        <img
          src="@/assets/images/nologinshow.png"
          style="width: 100px;display: inline-block;"
        />
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 14px;font-weight: bold;color: #646566;padding-top: 30px;"
      >
        <div>登录超时</div>
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 12px;color: #969799;padding-top: 8px;"
      >
        <div>请重新登录后进入</div>
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 16px;padding: 30px 15px 0 15px;"
      >
        <van-button
          round
          plain
          type="info"
          size="small"
          @click="goback"
          style="width: 100px;"
          >重新登录</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import { Field, CellGroup } from "vant";

Vue.use(Field);
Vue.use(CellGroup);

export default {
  name: "nologin",
  components: {},
  data() {
    return {
      notice: "",
      accountName: "",
      password: "",
      oldtoken: "",
      loading: false,
      jihuoshow: false,
      expid: null,
      expurl: "/public/home-page",
      expdata: null,
      expdataid: null
    };
  },
  methods: {
    goback() {
      //安卓调用方式  nativeRoute是具体的方法名,
      if (window.collegeNative) {
        window.collegeNative.backToNative();
      }
      //ios调用方式  nativeRoute是具体的方法名,
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.backToNative.postMessage("");
      }
    }
  },
  created() {}
};
</script>
