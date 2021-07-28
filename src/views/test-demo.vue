<template>
  <div>
    <jshheader title="日历控件" />
    <div style="margin-top:44px">
      <canlen></canlen>
    </div>
  </div>
</template>

<script>
import Jshheader from "@/components/jsh-header";
import canlen from "@/components/data-calendar/data-calendar.vue";

export default {
  name: "VideoDemo",
  components: { Jshheader, canlen },
  data() {
    return {
      videoHeight: ""
    };
  },
  created() {},
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped></style>
