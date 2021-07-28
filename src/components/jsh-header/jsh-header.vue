<!--使用方法:
1.父组件传入
 header:{
        rightType:Number,
        rightText:string,
        title:string
        backType:布尔
      },
2.rightType 0 不显示右边(默认)   1有变显示文字  2右边显示图标
3.rightText  右侧文本
4.title  标题 (必填)
5. rightClick 通过 rightClick 传入右侧点击的事件
6. backType 是否自定义返回按钮 默认false  传true 时传要传入  leftClick
7. leftClick 通过 leftClick 传入左侧点击的事件
8. 父组件调用实例    <jshHeader :header="header" @rightClick="click" @leftClick="click"></jshHeader>
9.leftType左侧按钮默认展示  传0不展示
-->
<template>
  <div class="clearfloat">
    <div style="height: 44px; width: 100%"></div>
    <div class="header">
      <van-row>
        <van-col v-if="header.leftType != 0" span="4">
          <div class="left-content" align="left">
            <van-icon
              @click="back"
              size="5vw"
              color="#227EF7"
              name="arrow-left"
            />
          </div>
        </van-col>
        <van-col v-if="header.leftType == 0" span="4">
          <div class="left-content" align="left"></div>
        </van-col>
        <van-col span="16" align="center">
          <div class="fs-17 fw-500 color-333 center-content">
            {{ header.title }}
          </div>
        </van-col>

        <van-col
          v-if="header.rightType == 1"
          span="4"
          class="fs-13"
          align="right"
        >
          <div class="right-content" @click="rightClick">
            {{ header.rightText }}
          </div>
        </van-col>
        <van-col
          v-if="header.rightType == 2"
          span="4"
          class="fs-13"
          align="right"
        >
          <div class="right-content1">
            <van-icon size="5vw" color="#227EF7" name="ellipsis" />
          </div>
        </van-col>
        <van-col
          span="4"
          class="fs-13"
          align="right"
          v-if="header.rightType === 3"
        >
          <div style="margin-top: 7px; margin-right: 10px">
            <img
              v-if="header.rightTypeSort === 1"
              @click="displayLabel()"
              style="width: 18px; height: 18px; padding-right: 8px"
              src="../../assets/images/classify-icon.png"
              alt=""
            />
            <img
              v-if="header.rightTypeSort === 2"
              @click="displayLabel()"
              style="width: 18px; height: 18px; padding-right: 8px"
              src="../../assets/images/checked-classify-icon.png"
              alt=""
            />
            <van-icon
              @click="toSearchPage(header.routeParams)"
              size="5vw"
              color="#227EF7"
              name="search"
            />
          </div>
        </van-col>
        <van-col
          span="4"
          class="fs-13"
          align="right"
          v-if="header.rightType === 4"
        >
          <div
            @click="rightClick"
            class="right-content"
            style="
              margin-top: 7px;
              margin-right: 10px;
              line-height: 14px;
              text-align: center;
            "
          >
            <img
              style="width: 18px; height: 18px; padding-right: 8px"
              src="../../assets/images/study-report-icon.png"
              alt=""
            />
            <div>学习报告</div>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script src="./jsh-header.js"></script>

<style scoped lang="scss">
.header {
  height: 44px;
  width: 100%;
  line-height: 40px;
  background-color: #ffffff;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  .left-content {
    height: 36px;
    margin-top: 7px;
    margin-left: 10px;
  }
  .right-content {
    margin-right: 10px;
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    font-size: 12px;
    text-overflow: ellipsis;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;
    line-height: 32px;
  }
  .right-content1 {
    height: 36px;
    margin-top: 7px;
    margin-right: 10px;
  }
  .center-content {
    text-align: center;
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
