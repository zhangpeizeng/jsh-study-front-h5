<template>
  <div style="background-color: #F2F2F2">
    <!--    <pdf-->
    <!--      class="mt-10"-->
    <!--      v-for="item in numberOfPages"-->
    <!--      :key="item"-->
    <!--      :src="pdfSrc"-->
    <!--      :page="item"-->
    <!--    ></pdf>-->
    <!--    <div v-for="item in numberOfPages" :key="item">-->
    <!--      <pdf class="mt-10" :src="pdfSrc"></pdf>-->
    <!--        {{item}}-->
    <!--    </div>-->
    <!--      <pdf class="mt-10" :src="pdfSrc"></pdf>-->
    <!--      <pdf class="mt-10" :src="pdfSrc" :page="2"></pdf>-->
    <!--      <pdf class="mt-10" :src="pdfSrc" :page="3"></pdf>-->
    <!--      <pdf class="mt-10" :src="pdfSrc" :page="4"></pdf>-->
    <!--      <pdf class="mt-10" :src="pdfSrc" :page="5"></pdf>-->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="item in addQuantity" :key="item">
        <pdf class="mt-10" :src="pdfSrc" :page="item"></pdf>
      </div>
    </van-list>
  </div>
</template>
<script>
import Vue from "vue";
import JSH from "@/core";
import { CloudMarketing } from "@/request";
import pdf from "vue-pdf";
import { Toast, List } from "vant";
Vue.use(Toast).use(List);

export default {
  name: "pdfLook",
  components: { pdf },
  props: {
    url: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      numberOfPages: 1,
      pdfSrc: "",
      loading: false,
      finished: false,
      addQuantity: 1
    };
  },
  methods: {
    onLoad() {
      setTimeout(() => {
        this.addQuantity += 1;
        this.loading = false;
      }, 5000);
    },
    convertBase64UrlToBlob(urlData) {
      let arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    getBase() {
      const that = this;
      JSH.request({
        url: CloudMarketing.getPicture,
        method: "get",
        params: {
          url: this.url
        },
        success(data) {
          if (data.success) {
            console.log(123);
            console.log(data.data.base64);
            that.pdfSrc = URL.createObjectURL(
              that.convertBase64UrlToBlob(
                "data:/pdf;base64," + data.data.base64
              )
            );
            console.log(that.pdfSrc);
            that.numberOfPages = data.data.count;
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
          Toast("接口异常");
        }
      });
    }
  },
  created() {
    this.getBase();
  }
};
</script>
<!-- sts -->
<style lang="scss"></style>
