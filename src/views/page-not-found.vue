<template>
  <div style="height: 100vh;background-color: white;">
    <!--<jshheader title="404" :classnub="'1'"> </jshheader>-->
    <div style="padding-top: 100px;text-align: center;">
      <img
        src="../assets/images/404to.png"
        style="width: 80%;display: inline-block;"
        @click="lookClick"
      />
      <div
        style="width: 100%;text-align: center;font-size: 14px;font-weight: bold;color: #333333;padding-top: 10px;"
      >
        <div>错误404</div>
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 12px;color: #999999;padding-top: 10px;"
      >
        <div @click="gotoPage">服务器找不到请求页面</div>
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 12px;color: #999999;padding-top: 10px;"
      >
        <div
          style="border-radius: 4px;padding: 3px 7px;display: inline-block;vertical-align: middle;color: white;background-color: #666666;"
          @click="goBack"
        >
          返回
        </div>
      </div>
      <div style="margin-top:20px;color:red" v-if="lookFlag">
        <div>接受参数对象</div>
        <div>{{ transferInfo }}</div>
        <div>请求接口</div>
        <div>{{ transferCode }}</div>
        <div>访问链接</div>
        <div>{{ transferUrl }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Jshheader from "../components/jsh-header";
import Vue from "vue";
import { Image, Grid, GridItem, NoticeBar } from "vant";

Vue.use(Image)
  .use(Grid)
  .use(GridItem)
  .use(NoticeBar);

export default {
  name: "NoPage",
  components: {},
  data() {
    return {
      lookFlag: false,
      numView: 0,
      transferInfo: "",
      transferCode: "",
      transferUrl: ""
    };
  },
  created() {
    const owner = this;
    console.log(owner.$route.query);
  },
  methods: {
    goBack() {
      //安卓调用方式  nativeRoute是具体的方法名,
      if (window.collegeNative) {
        window.collegeNative.backToNative();
      }
      //ios调用方式  nativeRoute是具体的方法名,
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.backToNative.postMessage("");
      }
    },
    lookClick() {
      const owner = this;
      owner.numView++;
      if (owner.numView > 5) {
        owner.lookFlag = true;
        owner.transferInfo = JSON.stringify(owner.$route.query.transferInfo);
        owner.transferCode = owner.$route.query.transferCode;
        owner.transferUrl = owner.$route.query.transferUrl;
      }
    },
    gotoPage() {
      const owner = this;
      if (owner.numView > 6) {
        owner.$router.replace({
          path: "/home"
        });
      }
    }
  }
};
</script>
