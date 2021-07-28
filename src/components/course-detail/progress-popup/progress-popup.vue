<template>
  <div>
    <van-dialog
      v-model="show"
      title="学习进度计算规则"
      confirmButtonText="知道了"
    >
      <div class="dialog-content" v-if="type == 1">
        1.单视频学习进度=视频最大学习时长/视频总时长*100%；<br />
        2.单音频学习进度=音频最大学习时长/音频总时长*100%；<br />
        3.单文档学习进度：文档内容全部阅读完成，则学习进度=100%;<br />
        4.单详情学习进度：详情内容全部阅读完成，则学习进度=100%;<br />
        5.录播/文档课课程学习进度=所有课程内容学习进度的平均数。
      </div>
      <div class="dialog-content" v-if="type == 2 || type == 3">
        1.直播未开始及直播中：不显示学习进度<br />
        2.仅对直播进行了观看，当达到要求观看时长，则学习进度为100%，反之，学习进度=累计观看时长/要求观看时长*100%；<br />
        3.未观看直播，但观看回放，则学习进度=回放观看时长/回放总时长*100%；<br />
        4.既观看了直播又观看了回放，则学习进度取规则2和规则3中最大值。
      </div>
      <div class="dialog-content" v-if="type == 4">
        1.若课时内容为课程，则课时学习进度=对应课程的学习进度；<br />
        2.若课时内容为资料，则单视频学习进度=视频最大学习时长/视频总时长*100%；<br />
        3.若课时内容为资料，则单音频学习进度=音频最大学习时长/音频总时长*100%；<br />
        4.若课时内容为资料，则单文档学习进度为：文档内容全部阅读完成，学习进度=100%；<br />
        5.系列课课程学习进度：展示已100%学完的课时数/课时总数。
      </div>
    </van-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import { Dialog } from "vant";

Vue.use(Dialog);
/*
 * 学习进度计算规则
 * */

export default {
  name: "progressPopup",
  data() {
    return {
      show: false,
      type: ""
    };
  },
  methods: {
    initData(type) {
      this.show = true;
      this.type = type;
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-content {
  padding: 8px 24px;
  color: #7d7e80;
  font-size: 14px;
}
</style>
