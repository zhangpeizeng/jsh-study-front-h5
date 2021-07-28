<template>
  <div style="background-color: #F2F2F2">
    <div
      class="mt-10"
      v-for="(item, index) in workList"
      :key="index"
      @click="preview(index)"
    >
      <img style="width: 100%" :src="item" alt="" />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import JSH from "@/core";
import { CloudMarketing } from "@/request";
import { Toast, List, ImagePreview } from "vant";
Vue.use(Toast)
  .use(List)
  .use(ImagePreview);

export default {
  name: "synopsisOpenUp",
  components: {},
  props: {
    etag: {
      type: String,
      default: ""
    },
    pageCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      page: 0,
      workList: []
    };
  },
  methods: {
    //获取文档流
    getMsg(i) {
      let that = this;
      JSH.request({
        url: CloudMarketing.searchDocPicUrl,
        method: "get",
        params: {
          etag: that.etag,
          pageIndex: i,
          sysName: "goods"
        },
        success(res) {
          if (res.success) {
            that.workList[i - 1] = res.data.url;
            that.$forceUpdate();
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    // 预览pdf
    preview(index) {
      ImagePreview({
        images: this.workList,
        startPosition: index,
        closeable: true
      });
    },
    // 获取全部图片
    getAll() {
      for (let i = 1; i <= this.pageCount; i += 1) {
        this.getMsg(i);
      }
    }
  },
  created() {
    // 获取全部图片
    this.getAll();
  }
};
</script>
<!-- sts -->
<style lang="scss"></style>
