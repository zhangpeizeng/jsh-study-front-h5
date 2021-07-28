<template>
  <div>
    <jshheader title="视频播放" />
    <div>
      <VideoPlayer
        vid="75c07d47003f4d3ea5649c36d33306ef"
        :video-container-height="videoHeight"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import JSH from "@/core";
import Jshheader from "@/components/jsh-header";
import VideoPlayer from "@/components/VideoPlayerTwo";

export default {
  name: "VideoDemo",
  components: { VideoPlayer, Jshheader },
  data() {
    return {
      videoHeight: (document.documentElement.clientHeight / 3) * 2
    };
  },
  created() {
    // eslint-disable-next-line no-console
    console.log("screenHeight:" + this.videoHeight);
  },
  methods: {
    goBack() {
      // JSH.reportSelfPageChange("BACK", "/", "首页");
      this.$router.go(-1);
    },
    backToNative() {
      JSH.backToNative();
    }
  }
};
</script>
