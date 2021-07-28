<template>
  <div class="personal">
    <div class="jsh-header">
      <jshHeader :header="header"></jshHeader>
    </div>
    <div class="name d-flex align-items-center">
      <div class="left">
        <img v-if="data.avatarAddress" :src="data.avatarAddress" alt="" />
        <img v-else src="../../../../assets/images/news.png" alt="" />
      </div>
      <div>
        {{ data.accountName }}
      </div>
    </div>
    <div class="detail">
      <div class="d-flex align-items-center des">
        <div class="left">学号</div>
        <div>{{ data.huiHuiNumber }}</div>
      </div>
      <div class="d-flex align-items-center des">
        <div class="left">组织</div>
        <div v-if="data.companyAbbreviation">
          {{
            `${data.companyAbbreviation}${
              data.departmentAbbreviation
                ? "-" + data.departmentAbbreviation
                : ""
            }`
          }}
        </div>
        <div v-else>-</div>
      </div>
      <div class="d-flex align-items-center des">
        <div class="left">中心</div>
        <div class="right" v-if="data.zxyGm">{{ data.zxyGm }}</div>
        <div class="right" v-else>-</div>
      </div>
      <div class="d-flex align-items-center des">
        <div class="left">产业</div>
        <div class="right" v-if="data.zxyCy">{{ data.zxyCy }}</div>
        <div class="right" v-else>-</div>
      </div>
      <div class="d-flex align-items-center des">
        <div class="left">等级</div>
        <div class="right" v-if="data.zxyLevel">{{ data.zxyLevel }}</div>
        <div class="right" v-else>-</div>
      </div>
      <div class="d-flex align-items-center des">
        <div class="left">大渠道</div>
        <div class="right" v-if="data.zxyChannel">{{ data.zxyChannel }}</div>
        <div class="right" v-else>-</div>
      </div>
    </div>
    <div @click="exit()" class="quit-login">退出登录</div>
  </div>
</template>

<script>
import Vue from "vue";
import JSH from "@/core";
import { CloudMarketing } from "@/request";
import jshHeader from "../../../../components/jsh-header/jsh-header.vue";
import { Toast } from "vant";
Vue.use(Toast);
export default {
  components: {
    jshHeader
  },
  name: "personal-data",
  data() {
    return {
      data: {},
      header: {
        title: "个人信息",
        rightType: 0
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    /**
     * 登录信息查询
     */
    getData() {
      const _that = this;
      // 获取一级分类接口
      JSH.request({
        url: CloudMarketing.getZxyDetail,
        method: "post",
        params: {},
        success(data) {
          if (data.success) {
            _that.data = data.data;
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    exit() {
      //安卓调用方式  nativeRoute是具体的方法名,
      if (window.collegeNative) {
        window.collegeNative.loginOut();
      }
      //ios调用方式  nativeRoute是具体的方法名,
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.loginOut.postMessage("");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.personal {
  .left {
    width: 80px;
  }
  .right {
    width: 75%;
  }
  .name {
    padding: 11px 15px;
    background-color: white;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(50, 50, 51, 1);
    img {
      width: 44px;
      height: 44px;
    }
  }
  .detail {
    margin-top: 10px;
    background-color: white;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(50, 50, 51, 1);
  }
  .des {
    padding: 12px 15px;
  }
  .quit-login {
    margin-top: 10px;
    text-align: center;
    padding: 12px 0px;
    background: white;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(39, 128, 248, 1);
  }
}
</style>
