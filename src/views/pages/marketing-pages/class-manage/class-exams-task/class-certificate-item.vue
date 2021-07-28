<template>
  <div class="class-certificate_item" style="text-align: center">
    <van-image
      :src="item.certificateUrl"
      @click="showCertificate(item)"
      fit="cover"
      width="167px"
      height="117px"
    >
    </van-image>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      require: true
    }
  },
  data() {
    return {};
  },
  methods: {
    showCertificate(item) {
      this.$emit("showCertificate", item);
    }
  }
};
</script>

<style lang="scss" scoped>
.class-certificate_item {
  width: 50%;
  display: inline-block;
  vertical-align: top;
  img {
    width: 167px;
    height: 117px;
  }
}
</style>
