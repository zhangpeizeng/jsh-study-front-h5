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
      v-if="loading"
    >
      <van-loading type="spinner" color="#1989fa" />
    </div>
    <div style="width: 100%;text-align: center;padding-top: 40px;">
      <div
        style="width: 100%;text-align: center;font-size: 20px;font-weight: bold;color: #323233;"
      >
        <div>亲爱的学员</div>
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 16px;color: #646566;padding-top: 15px;"
      >
        <div>您的账号被冻结，如有问题，请联系</div>
        <div>
          {{ phone }}
        </div>
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 16px;color: #646566;padding-top: 39px;"
      >
        <img
          src="@/assets/images/dongjie.png"
          style="width: 100%;display: inline-block;"
        />
      </div>
      <div
        style="width: 100%;text-align: center;font-size: 16px;color: #999999;padding: 70px 15px 50px 15px; position: fixed;bottom: 0;left: 0;"
      >
        <div
          style="width:calc(100% - 30px);height:44px;line-height:44px;border-radius: 22px;padding: 0 7px;display: inline-block;vertical-align: middle;color: white;background-color: #227EF7;"
          @click="jihuo()"
        >
          <span v-if="studyTerminalCode == '1'">返回易理货</span>
          <span
            v-if="
              studyTerminalCode == '3' ||
                studyTerminalCode == '2' ||
                studyTerminalCode == '4'
            "
            >返回</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import { Field, CellGroup, Toast } from "vant";
import { CloudMarketing } from "@/request";
import JSH from "@/core";

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
      loading: false,
      expid: null,
      expdata: null,
      expdataid: null,
      studyTerminalCode: null,
      phone: "" // 获取客服手机号码
    };
  },
  methods: {
    // 激活
    jihuo() {
      this.goback();
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
    },
    getPhone() {
      const _that = this;
      // 获取一级分类接口
      JSH.requestto({
        url: CloudMarketing.listStudyTerminalPhone,
        method: "get",
        params: { studyTerminal: _that.studyTerminalCode },
        success(data) {
          if (data.success) {
            _that.phone = data.data[0].phone;
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    }
  },
  created() {
    const owner = this;
    owner.studyTerminalCode = owner.$route.query.studyTerminalCode; // 登录终端
    this.getPhone();
  }
};
</script>
