<template>
  <div>
    <jshheader :title="notice + '++'" :classnub="'4'" :right="'青岛'">
    </jshheader>
    <van-cell-group style="padding:44px 20px">
      <van-radio-group v-model="radio" direction="horizontal">
        <van-radio name="1">本地登录</van-radio>
        <van-radio name="2">aid登录</van-radio>
        <van-radio name="3">原生测试</van-radio>
      </van-radio-group>
      <div v-show="radio === '1'" style="margin-top:15px">
        <div style="padding:5px 10px;color:black">
          账号
        </div>
        <van-field v-model="userId" placeholder="请输账号" />
        <div style="padding:5px 10px;color:reblackd">
          密码
        </div>
        <van-field v-model="password" placeholder="请输密码" />
        <div style="padding:5px 10px;color:black">
          访问终端type
        </div>
        <van-field v-model="studyType" placeholder="请输入终端type" />
        <van-button plain type="info" @click="loginClick">登录</van-button>
      </div>
      <div v-show="radio === '2'" style="margin-top:15px">
        <div style="width: 100%;margin-top：10px">
          <div style="padding:5px 10px;color:black">
            aid
          </div>
          <van-field v-model="aid" placeholder="请输aid" />
          <div style="padding:5px 10px;color:black">
            学习终端
          </div>
          <van-field v-model="studyTerminalCode" placeholder="请输学习终端" />
          <van-button plain type="info" @click="gotoHome"
            >跳转到首页</van-button
          >
        </div>
      </div>
      <div style="margin-top:15px" v-show="radio === '3'">
        <van-button plain type="info" @click="yuansheng"
          >测试原生jumpMarketCollage</van-button
        >
        <van-button plain type="info" @click="alertyuansheng"
          >测试原生nativeRoute</van-button
        >
        <van-field v-model="url" placeholder="请输本地域名" />
        <van-button plain type="info" @click="gotoLocal">跳转访问</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import { Field, CellGroup, NavBar, Cell, RadioGroup, Radio, Toast } from "vant";
import JSH from "@/core";
// eslint-disable-next-line no-unused-vars
import { CloudMarketing } from "@/request";
import Jshheader from "../components/jsh-header";

Vue.use(Field);
Vue.use(CellGroup);
Vue.use(NavBar);
Vue.use(Cell);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Toast);

export default {
  name: "Demo",
  components: { Jshheader },
  data() {
    return {
      show1: false,
      show: false,
      notice: "海尔智家成套首页VUE测试",
      deviceReady: "",
      expid: "",
      userId: "01418107",
      password: "123qwe",
      ylhtoken: "",
      studyType: "ylh",
      aid: "",
      studyTerminalCode: "1",
      url: "",
      radio: "1"
    };
  },
  created() {
    console.log(window.navigator.userAgent);
  },
  methods: {
    goBack() {
      JSH.reportSelfPageChange("BACK", "/", "首页");
      this.$router.go(-1);
    },
    loginClick() {
      const owner = this;
      let loginUrl = `/ylh-cloud-service-user${process.env.VUE_APP_SERVER_SUFFIX}/api/token/get-by-username-and-password`;
      JSH.requestto({
        url: loginUrl,
        method: "get",
        params: {
          username: "ylhtest",
          systemName: "ylh",
          password: owner.password
        },
        success(res) {
          if (res) {
            owner.ylhtoken = res.replace("bearer ", "");
            owner.checkAid(owner.ylhtoken);
          }
        },
        error() {}
      });
    },
    checkAid(ylhtoken) {
      const owner = this;
      let getAidUrl = `/ylh-cloud-service-user${process.env.VUE_APP_SERVER_SUFFIX}/api/page/meeting/auth/token/get-auth-token`;
      JSH.requestto({
        url: getAidUrl,
        method: "post",
        tokens: ylhtoken,
        params: {
          type: owner.studyType,
          userId: owner.userId
        },
        success(res) {
          if (res.success) {
            owner.expid = res.data.aid;
            owner.studyTerminalCode = res.data.studyTerminalCode;
            if (owner.studyType === "hwork") {
              owner.studyTerminalCode = "3";
            }
            // 1为客户端,2为员工端,3为直销员端 4 售后端
            owner.$router.push({
              name: "hometo",
              query: {
                expid: owner.expid,
                studyTerminalCode: owner.studyTerminalCode
              }
            });
          }
        },
        error() {}
      });
    },
    gotoHome() {
      const owner = this;
      if (!owner.aid) {
        Toast("请输入aid");
        return;
      }
      owner.$router.push({
        name: "hometo",
        query: {
          expid: owner.aid,
          studyTerminalCode: owner.studyTerminalCode
        }
      });
    },
    gotoLocal() {
      window.location.href = this.url;
    },
    yuansheng() {
      console.log("jumpMarketCollage", window.collegeNative);
      alert("jumpMarketCollage");
      //安卓调用方式  jumpMarketCollage是具体的方法名,
      if (window.collegeNative) {
        window.collegeNative.jumpMarketCollage("edu_6d4acaf0", "924839");
      }
      //ios调用方式   jumpMarketCollage是具体的方法名,
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.jumpMarketCollage.postMessage(
          "edu_6d4acaf0",
          "924839"
        );
      }
    },
    alertyuansheng() {
      console.log("jumpMarketCollage", window.collegeNative);
      alert("nativeRoute");
      let prems = {
        param: {
          baseId: "101748",
          sourceId: "101762",
          eduId: "edu_7eb53b30",
          invitationCode: "607435"
        },
        routePath: "com.jsh.marketingcollege.ui.VhLiveClassActivity"
      };
      //安卓调用方式  nativeRoute是具体的方法名,
      if (window.collegeNative) {
        window.collegeNative.nativeRoute(JSON.stringify(prems));
      }
      //ios调用方式  nativeRoute是具体的方法名,
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.nativeRoute.postMessage(
          JSON.stringify(prems)
        );
      }
    }
  }
};
</script>
