<template>
  <div class="containera">
    <jshHeader :header="header"></jshHeader>
    <div class="containerji">
      <div class="contentji">
        <div class="textaji">
          <u-editor-box :content="content"></u-editor-box>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  NavBar,
  List,
  PullRefresh,
  Toast,
  Dialog,
  Popup,
  CountDown
} from "vant";
import Vue from "vue";
// import JSH from "@/core";
// import liveFrame from "@/components/live-frame/live-frame.vue";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
// import CloudMarketing from "../../../../request/interface/cloud-marketing";
import { UEditorBox } from "@jsh/helper/components";
Vue.use(NavBar);
Vue.use(List);
Vue.use(Toast);
Vue.use(PullRefresh);
Vue.use(CountDown);
Vue.use(Dialog);
Vue.use(Popup);
export default {
  components: {
    // liveFrame,
    jshHeader,
    UEditorBox
  },
  data() {
    return {
      i: null,
      haha: null,
      header: {
        title: ""
      },
      title: "",
      content: ""
    };
  },
  created() {
    const u = navigator.userAgent;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isiOS) {
      //    ios
      this.isIos = true;
      console.log("ios");
    } else {
      this.isIos = false;
      console.log("android");
    }
    const owner = this;
    owner.$loading.show(1000);
    this.content = this.$route.query.content;
    this.title = this.$route.query.title;
  },
  methods: {}
};
</script>
<style lang="scss">
.containerji {
  background: white;
  text-align: center;
  margin: 14px 12px;
  min-height: 740px;
  border-radius: 6px;
  padding: 20px 15px;
}
.titleji {
  color: #323233;
  font-size: 16px;
  font-weight: 500;
}
.contentji {
  text-align: left;
  margin-top: 20px;
  .textaji {
    width: 100%;
    .ql-align-center {
      text-align: center;
    }
    .ql-align-right {
      text-align: right;
    }
    img {
      width: 100%;
    }
  }
}
</style>
