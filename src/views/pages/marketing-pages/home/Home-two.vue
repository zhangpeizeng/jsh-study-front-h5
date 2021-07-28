<template>
  <div style="background-color: white;height: 100vh;">
    <van-nav-bar
      title="营销学院"
      left-text=""
      left-arrow
      @click-left="goback"
    />
    <div style="width: 100%;height: 10px;background-color: #F2F2F2;"></div>
    <div
      style="width: 100%;text-align: center;padding-top: 50%;position: fixed;top: 10px;left: 0;z-index: 2;"
      v-if="loading && !jihuoshow"
    >
      <van-loading type="spinner" color="#1989fa" />
    </div>
    <div
      style="width: 100%;text-align: center;padding-top: 40px;"
      v-if="jihuoshow"
    >
      <div
        style="width: 100%;text-align: center;font-size: 20px;font-weight: bold;color: #323233;"
      >
        <div>尊敬的{{ accountName }}</div>
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 16px;color: #646566;padding-top: 15px;"
      >
        <div>欢迎进入营销学院</div>
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 16px;color: #646566;padding-top: 39px;"
      >
        <img
          src="@/assets/images/jihuo.png"
          style="width: 100%;display: inline-block;"
        />
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 16px;color: #999999;padding: 70px 15px 50px 15px; position: fixed;bottom: 0;left: 0;"
      >
        <div
          style="width:calc(100% - 30px);height:44px;line-height:44px;border-radius: 22px;padding: 0 7px;display: inline-block;vertical-align: middle;color: white;background-color: #227EF7;"
          @click="jihuo(oldtoken)"
        >
          开启我的学习之旅
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import { Field, CellGroup } from "vant";
import JSH from "@/core";
import CloudMarketing from "../../../../request/interface/cloud-marketing";
import jwtto from "jwt-decode";

Vue.use(Field);
Vue.use(CellGroup);

export default {
  name: "home",
  components: {},
  data() {
    return {
      notice: "",
      accountName: "",
      password: "",
      oldtoken: "",
      tokenObj: "",
      loading: false,
      jihuoshow: false,
      studyTerminalCode: null, // 学习终端：3直销员端
      expurl: "/public/home-page",
      expdata: null,
      expdataid: null,
      firstEnter: false, // 用户是否第一次进营销学院
      fangdabuy: true //防重复点击
    };
  },
  methods: {
    // 获取token
    getNativeToken() {
      const owner = this;
      if (window.collegeNative) {
        // 获取原生传的token
        owner.tokenObj = JSON.parse(window.collegeNative.getToken());
        owner.refreshTokenFun(owner.tokenObj.accessToken);
      }
      //ios调用方式
      if (window.webkit && window.webkit.messageHandlers) {
        let data = prompt("accessToken");
        owner.tokenObj = JSON.parse(data);
        owner.refreshTokenFun(owner.tokenObj.accessToken);
      }
    },
    refreshTokenFun(token) {
      const owner = this;
      JSH.requestto({
        url: CloudMarketing.refreshtoken,
        method: "post",
        tokens: token,
        params: { refreshToken: owner.tokenObj.refreshToken },
        success(res) {
          if (res.success) {
            owner.oldtoken = res.data.access_token;
            localStorage.setItem("oldtoken", owner.oldtoken);
            owner.login(owner.oldtoken);
            let userString = jwtto(owner.oldtoken);
            let accountName = userString.name ? userString.name : null;
            owner.accountName = accountName;
          }
        }
      });
    },
    // 登录
    login(token) {
      const owner = this;
      owner.loading = true;
      JSH.requestto({
        url: CloudMarketing.checkauthtoken,
        method: "get",
        tokens: token,
        params: { studyTerminal: owner.studyTerminalCode },
        success(res) {
          owner.loading = false;
          console.log(res);
          if (res.success) {
            if (res.code === 100) {
              owner.jihuoshow = true;
            } else if (res.code === 300) {
              // 冻结
              owner.$router.replace({
                path: "/public/freeze",
                query: {
                  studyTerminalCode: owner.studyTerminalCode
                }
              });
            } else if (res.code === 3) {
              // 登录不是直销员
              owner.$router.replace({
                path: "/public/noDirect",
                query: {
                  studyTerminalCode: owner.studyTerminalCode
                }
              });
            } else {
              if (res.data && res.data != "") {
                let data = res.data.access_token ? res.data.access_token : null;
                let accountId = res.data.accountId
                  ? res.data["accountId"]
                  : null;

                if (accountId) {
                  localStorage.setItem("accountId", accountId);
                }
                if (data && data != "") {
                  localStorage.setItem("accessToken", data);
                  if (window.collegeNative) {
                    window.collegeNative.initToken(data);
                  }
                  if (window.webkit && window.webkit.messageHandlers) {
                    window.webkit.messageHandlers.initToken.postMessage(data);
                  }
                  // let userString = decodeURIComponent(
                  //   escape(window.atob(data.split(".")[1]))
                  // );
                  let userString = jwtto(data);
                  let time = userString.exp ? userString.exp : null;
                  if (time && time != "") {
                    localStorage.setItem("accessexp", time);
                    console.log(time);
                  }
                  let accountName = userString.name ? userString.name : null;
                  owner.accountName = accountName;
                  if (accountName) {
                    localStorage.setItem("accountName", accountName);
                  }
                  let accountUrl = userString.avatar_address
                    ? userString.avatar_address
                    : null;
                  if (accountUrl) {
                    localStorage.setItem("accountUrl", accountUrl);
                  }
                  let refreshToken = res.data.refresh_token
                    ? res.data.refresh_token
                    : null;
                  if (refreshToken) {
                    localStorage.setItem("refreshToken", refreshToken);
                  }
                }
                console.log(owner.expurl);
                owner.$router.replace({
                  path: owner.expurl,
                  query: {
                    id: owner.expdataid,
                    viewurl: 1,
                    studyTerminalCode: owner.studyTerminalCode,
                    firstEnter: owner.firstEnter
                  }
                });
                console.log("accountId++", accountId);
                console.log("accessToken++", data);
                console.log(
                  "accountName++",
                  localStorage.getItem("accountName")
                );
                console.log("accountUrl++", localStorage.getItem("accountUrl"));
              } else {
                owner.$router.replace("/public/nologin");
              }
            }
          } else {
            if (owner.studyTerminalCode == 3) {
              owner.goback();
            } else {
              owner.$router.replace("/404");
            }
          }
        },
        error(e) {
          owner.loading = false;
          console.log(e);
        }
      });
    },
    // 激活
    jihuo(token) {
      const owner = this;
      if (owner.fangdabuy) {
        owner.loading = true;
        owner.fangdabuy = false;
        JSH.requestto({
          url: CloudMarketing.getactivattoken,
          method: "get",
          tokens: token,
          params: { studyTerminal: owner.studyTerminalCode },
          success(res) {
            owner.loading = false;
            console.log(res);
            if (res.success) {
              if (res.data && res.data != "") {
                let data = res.data.access_token ? res.data.access_token : null;
                let accountId = res.data.accountId
                  ? res.data["accountId"]
                  : null;

                if (accountId) {
                  localStorage.setItem("accountId", accountId);
                }
                if (data && data != "") {
                  localStorage.setItem("accessToken", data);
                  if (window.collegeNative) {
                    window.collegeNative.initToken(data);
                  }
                  if (window.webkit && window.webkit.messageHandlers) {
                    window.webkit.messageHandlers.initToken.postMessage(data);
                  }
                  // let userString = decodeURIComponent(
                  //   escape(window.atob(data.split(".")[1]))
                  // );
                  let userString = jwtto(data);
                  let time = userString.exp ? userString.exp : null;
                  if (time && time != "") {
                    localStorage.setItem("accessexp", time);
                    console.log(time);
                  }
                  let accountName = userString.name ? userString.name : null;
                  owner.accountName = accountName;
                  if (accountName) {
                    localStorage.setItem("accountName", accountName);
                  }
                  let accountUrl = userString.avatar_address
                    ? userString.avatar_address
                    : null;
                  if (accountUrl) {
                    localStorage.setItem("accountUrl", accountUrl);
                  }
                  let refreshToken = res.data.refresh_token
                    ? res.data.refresh_token
                    : null;
                  if (refreshToken) {
                    localStorage.setItem("refreshToken", refreshToken);
                  }
                }
                owner.$router.replace({
                  path: owner.expurl,
                  query: {
                    id: owner.expdataid,
                    viewurl: 1,
                    studyTerminalCode: owner.studyTerminalCode,
                    firstEnter: owner.firstEnter
                  }
                });
                console.log("accountId++", accountId);
                console.log("accessToken++", data);
                console.log(
                  "accountName++",
                  localStorage.getItem("accountName")
                );
                console.log("accountUrl++", localStorage.getItem("accountUrl"));
              } else {
                if (owner.studyTerminalCode == 3) {
                  owner.goback();
                } else {
                  owner.$router.replace("/404");
                }
              }
            } else {
              if (owner.studyTerminalCode == 3) {
                owner.goback();
              } else {
                owner.$router.replace("/404");
              }
            }
            owner.fangdabuy = true;
          },
          error(e) {
            owner.fangdabuy = true;
            owner.loading = false;
            console.log(e);
          }
        });
      }
    },
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
  created() {
    const owner = this;
    // 清空本地存储
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessexp");
    localStorage.removeItem("accountId");
    localStorage.removeItem("oldtoken");
    localStorage.removeItem("accountName");
    localStorage.removeItem("accountUrl");
    console.log("owner.$route.query", owner.$route.query);
    owner.studyTerminalCode = owner.$route.query.studyTerminalCode
      ? owner.$route.query.studyTerminalCode
      : 3; // 登录终端没传默认传直销员端
    owner.firstEnter = owner.$route.query.firstEnter
      ? owner.$route.query.firstEnter
      : false; // 用户是否第一次进营销学院
    owner.expurl = owner.$route.query.expurl
      ? owner.$route.query.expurl
      : "/public/home-page";
    owner.expdata = owner.$route.query.expdata
      ? owner.$route.query.expdata
      : null;
    owner.expdataid = owner.$route.query.expdataid
      ? owner.$route.query.expdataid
      : null;
    owner.getNativeToken();
  }
};
</script>
