<template>
  <div>
    <div class="detail-foot" v-if="!showFlag">
      <div class="detail-button" @click="commentsClick" v-if="isComment == 0">
        <img src="../../../assets/images/pingjia.png" class="icon" />
        <span>评价({{ evaluateTotal }})</span>
      </div>
      <div
        class="operation"
        @click="buttonClick"
        :disabled="disabledFlag"
        v-if="
          status == 1 ||
            status == 4 ||
            status == 5 ||
            status == 6 ||
            status == 8
        "
      >
        {{ textButton }}
      </div>
      <div
        class="operation background-gray"
        @click="buttonClick"
        v-if="status == 2 || status == 3 || status == 7"
      >
        {{ textButton }}
      </div>
    </div>
    <div class="detail-foot-block" v-if="showFlag && isComment == 0">
      <div class="detail-comments" @click="commentsClick">
        请输入评价内容
      </div>
      <div class="detail-button" @click="commentsClick">
        <img src="../../../assets/images/pingjia.png" class="icon" />
        <span>评价({{ evaluateTotal }})</span>
      </div>
    </div>
    <van-popup
      v-model="show"
      position="bottom"
      round
      closeable
      get-container="body"
    >
      <div class="popup-title">撰写评价</div>
      <div class="popup-content">
        <div style="text-align: center">
          <van-rate color="#F5A623" v-model="rate" />
          <div style="color: #969799;" class="fs-14 mt-10 pb-10 border-b">
            点击星星来评分
          </div>
        </div>
        <van-field
          type="textarea"
          maxlength="200"
          rows="4"
          v-model="value"
          placeholder="请输入5-200个字"
          :autosize="{ maxHeight: 120 }"
        />
        <div class="content-foot">
          <div class="content-button" @click="send">提交评价</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import Vue from "vue";
import { Popup, Field, Toast, Rate } from "vant";

Vue.use(Popup);
Vue.use(Field);
Vue.use(Toast);
Vue.use(Rate);
/*
 * 课程详情底部状态留言栏
 * */

export default {
  name: "courseDetailFoot",
  props: {
    nowTime: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      show: false,
      value: "",
      showFlag: false,
      textButton: "",
      disabledFlag: false, // 放重复点击标识
      status: "",
      rate: 0,
      isComment: 0,
      evaluateTotal: 0
    };
  },
  methods: {
    initData(data) {
      console.log(data.status);
      this.status = data.status;
      this.evaluateTotal = data.evaluateTotal;
      this.isComment = data.isComment;
      if (data.status) {
        this.showFlag = false;
        if (data.status == "1") {
          this.textButton = "立即预约";
        } else if (data.status == "2") {
          this.textButton = "已预约";
        } else if (data.status == "3") {
          this.textButton = "报名截止";
        } else if (data.status == "4") {
          this.textButton = "观看直播";
        } else if (data.status == "5") {
          this.textButton = "直播回放";
        } else if (data.status == "6") {
          this.textButton = "立即报名";
        } else if (data.status == "7") {
          this.textButton = "已报名";
        } else if (data.status == "8") {
          this.textButton = "加入学习";
        }
      } else {
        this.showFlag = true;
      }
    },
    commentsClick() {
      this.show = true;
      this.value = "";
    },
    send() {
      if (!this.value && this.rate === 0) {
        Toast("请填写评价内容");
        return;
      }
      if (!this.value) {
        Toast("请填写评价内容");
        return;
      }
      if (this.rate === 0) {
        Toast("请点击星星进行评分");
        return;
      }
      if (this.value.length < 5 || this.value.length > 200) {
        Toast("评价不能少于5个字");
        return;
      }
      const obj = {
        content: this.value,
        grade: this.rate
      };
      this.show = false;
      this.$emit("comments", obj);
    },
    buttonClick() {
      if (!this.disabledFlag) {
        this.disabledFlag = true;
        // 5秒放开，防止接口报错不能继续提交
        setTimeout(() => {
          this.disabledFlag = false;
        }, 5000);
        this.$emit("buttonClick", this.status);
      }
    }
  }
};
</script>
<style>
.van-cell::after {
  border: 0;
}
</style>
<style lang="scss" scoped>
.detail-foot {
  width: 100%;
  position: fixed;
  bottom: 0px;
  background: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 44px;
  z-index: 11;
  .detail-button {
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 44px;
    span {
      color: #323233;
      font-size: 14px;
    }
  }
  .operation {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #2780f8;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    height: 44px;
  }
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .background-gray {
    background: #909399;
  }
}
.border-b {
  border-bottom: 1px solid #ebedf0;
}
.detail-foot-block {
  padding: 0px 15px;
  width: 100%;
  position: fixed;
  z-index: 11;
  bottom: 0px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .detail-comments {
    width: 295px;
    padding: 8px 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #f2f3f5;
    color: #c0c4cc;
    border-radius: 30px;
    font-size: 13px;
  }
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .detail-button {
    width: 130px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 44px;
    span {
      color: #323233;
      font-size: 14px;
    }
  }
}
.popup-title {
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-content {
  border-top: 1px solid #ebedf0;
  padding: 10px 15px 15px 15px;
  .popup-input {
    height: 120px;
    font-size: 13px;
    color: #c0c4cc;
  }
  .content-foot {
    border-top: 1px solid #ebedf0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 15px;
    .content-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 36px;
      background: #2780f8;
      border-radius: 15px;
      border: 1px solid #2780f8;
      color: #ffffff;
      font-size: 14px;
    }
  }
}
</style>
