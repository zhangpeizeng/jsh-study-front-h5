<template>
  <div>
    <!--    <van-overlay :show="getwork" style="z-index: 9999">-->
    <!--      <div style="margin-top: 350px;height: 100%;width: 100%">-->
    <!--        <van-loading size="24px" vertical>加载中...</van-loading>-->
    <!--      </div>-->
    <!--    </van-overlay>-->
    <div style="height: 50px; width: 100%" />
    <div style="position: fixed; top: 83px; left: 0; right: 0; z-index: 50">
      <div style="width: 100%; background-color: #ffffff; padding: 10px 0">
        <div class="seach" @click="seachClick">
          <div
            style="
              color: #969799;
              margin-left: 15px;
              font-size: 14px;
              position: relative;
            "
          >
            <van-icon
              style="position: absolute; left: 0; top: 10px"
              name="search"
            />
            <span style="margin-left: 18px">{{ searchMsg }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isWifi && preLiveList != null && preLiveList.length != 0"
      style="min-height: 500px"
    >
      <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
        <van-list
          v-model="isFinished"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-if="preLiveList && preLiveList.length > 0">
            <div
              class="content-list"
              v-for="(item, index) in preLiveList"
              :key="index"
            >
              <div class="list-item" @click.stop="Todetails(item)">
                <div class="item-top d-flex">
                  <div
                    style="
                      position: relative;
                      display: inline-block;
                      width: 144px;
                      height: 90px;
                      margin-right: 10px;
                    "
                  >
                    <div
                      class="tag"
                      :class="{
                        liveNow: item.courseType == 2 || item.courseType == 3
                      }"
                      v-if="item.taskStatus == 1"
                    >
                      <img
                        class="compulsory"
                        src="@/assets/images/compulsory-icon.png"
                        alt=""
                      />
                      <div class="test1">必修</div>
                    </div>
                    <div
                      v-if="
                        (item.courseType == 2 || item.courseType == 3) &&
                          item.leftStatus == 3
                      "
                      class="time pl-5"
                      :class="{ timeLeft: item.taskStatus == 1 }"
                    >
                      <div class="dian mr-5"></div>
                      <div class="pl-10 pr-2" style="display: inline-block">
                        距开播<van-count-down
                          class="fs-10 h-15"
                          style="
                            color: #ffffff;
                            display: inline-block;
                            padding: 0;
                            margin: 0;
                          "
                          :time="item.liveStartTime - item.currentDate"
                          @finish="finishTime(index)"
                        />
                      </div>
                    </div>
                    <div
                      v-if="
                        (item.courseType == 2 || item.courseType == 3) &&
                          item.leftStatus == 1
                      "
                      class="time1 pl-5"
                      :class="{ timeLeft: item.taskStatus == 1 }"
                    >
                      <div class="h-15 pr-2" style="display: inline-block">
                        <img src="@/assets/images/live-now.png" alt="" />
                        直播中
                      </div>
                    </div>
                    <div
                      v-if="
                        (item.courseType == 2 || item.courseType == 3) &&
                          item.leftStatus == 2
                      "
                      class="time2 pl-5"
                      :class="{ timeLeft: item.taskStatus == 1 }"
                    >
                      <div class="dian mr-5"></div>
                      <div
                        class="h-15 pl-10 pr-2"
                        style="display: inline-block"
                      >
                        直播结束
                      </div>
                    </div>
                    <img
                      v-if="item.courseImg == ''"
                      class="bodypic"
                      src="@/assets/images/imgfengmian.png"
                      alt=""
                    />
                    <img
                      v-if="item.courseImg != ''"
                      class="bodypic"
                      :src="item.courseImg"
                      alt=""
                    />
                  </div>
                  <div style="display: inline-block; vertical-align: top">
                    <div style="min-height: 50px">
                      <div class="item-title-pk">
                        <img
                          v-if="item.courseType === '2'"
                          style="
                            width: 26px;
                            height: 15px;
                            vertical-align: middle;
                          "
                          src="@/assets/images/icon-live.png"
                          alt=""
                        />
                        <img
                          v-if="item.courseType === '3'"
                          style="
                            width: 26px;
                            height: 15px;
                            vertical-align: middle;
                          "
                          src="@/assets/images/icon-discuss.png"
                          alt=""
                        />
                        <img
                          v-if="item.courseType === '4'"
                          style="
                            width: 26px;
                            height: 15px;
                            vertical-align: middle;
                          "
                          src="@/assets/images/icon-series.png"
                          alt=""
                        />
                        {{ item.courseName }}
                      </div>
                    </div>
                    <div class="item-tname-pk">
                      <img
                        style="width: 13px; height: 12px; margin-right: 2px"
                        src="../../../assets/images/icon-teacher.png"
                        alt=""
                      />
                      {{ item.lecturerName }}
                    </div>
                    <div
                      class="icon-right"
                      v-if="
                        item.status == 7 &&
                          item.status != null &&
                          item.status != ''
                      "
                    >
                      <img
                        align="absmiddle"
                        src="@/assets/images/Rectang.png"
                        alt=""
                      />
                      <div class="pl-10">
                        {{ item.status | classButton }}
                      </div>
                    </div>
                    <div
                      class="icon-right1"
                      @click.stop="appointment(item)"
                      v-if="
                        item.status == 1 &&
                          item.status != null &&
                          item.status != ''
                      "
                    >
                      <div>
                        {{ item.status | classButton }}
                      </div>
                    </div>
                    <div
                      class="icon-right2"
                      v-if="
                        item.status == 3 &&
                          item.status != null &&
                          item.status != ''
                      "
                    >
                      <div>
                        {{ item.status | classButton }}
                      </div>
                    </div>
                    <div
                      class="icon-right2"
                      v-if="
                        item.status == 2 &&
                          item.status != null &&
                          item.status != ''
                      "
                    >
                      <div>
                        {{ item.status | classButton }}
                      </div>
                    </div>
                    <!--                  @click.stop="viewPlay(item)"-->
                    <div
                      class="icon-right1"
                      v-if="
                        item.status == 4 &&
                          item.status != null &&
                          item.status != ''
                      "
                    >
                      <div>
                        {{ item.status | classButton }}
                      </div>
                    </div>
                    <div
                      class="icon-right1"
                      v-if="
                        item.status == 5 &&
                          item.status != null &&
                          item.status != ''
                      "
                    >
                      <div>
                        {{ item.status | classButton }}
                      </div>
                    </div>
                    <div
                      @click.stop="signUp(item)"
                      class="icon-right1"
                      v-if="
                        item.status == 6 &&
                          item.status != null &&
                          item.status != ''
                      "
                    >
                      <div>
                        {{ item.status | classButton }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="fs-12 mt-10"
                  v-if="
                    item.liveStartTime != null &&
                      item.liveStartTime != '' &&
                      item.liveEndTime != null &&
                      item.liveEndTime != '' &&
                      item.liveEndTime > nowDateTime
                  "
                >
                  <span style="color: #646566">直播时间：</span>
                  <span
                    v-if="
                      handleYear(item.liveStartTime) !==
                        handleYear(item.liveEndTime)
                    "
                    style="color: #969799"
                    >{{ item.liveStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                      item.liveEndTime | date("yyyy-MM-dd hh:mm")
                    }}</span
                  >
                  <span v-else style="color: #969799"
                    >{{ item.liveStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
                      item.liveEndTime | date1("yyyy-MM-dd hh:mm")
                    }}</span
                  >
                </div>
                <div
                  class="fs-12 mt-10"
                  v-else-if="
                    item.studyStartTime != null &&
                      item.studyStartTime != '' &&
                      item.studyEndTime != null &&
                      item.studyEndTime != ''
                  "
                >
                  <div>
                    <img
                      style="
                        width: 12px;
                        height: 12px;
                        margin-right: 4px;
                        vertical-align: middle;
                      "
                      src="../../../assets/images/icon-time.png"
                      alt=""
                    />
                    <span
                      v-if="
                        handleYear(item.studyStartTime) !==
                          handleYear(item.studyEndTime)
                      "
                      style="color: #969799; vertical-align: middle"
                      >{{ item.studyStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                        item.studyEndTime | date("yyyy-MM-dd hh:mm")
                      }}</span
                    >
                    <span v-else style="color: #969799; vertical-align: middle"
                      >{{ item.studyStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
                        item.studyEndTime | date1("yyyy-MM-dd hh:mm")
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <!--    分类弹框-->
    <div>
      <van-action-sheet v-model="dropDown" title="搜索">
        <div class="clearMsg" @click="clearMsg">清除</div>
        <div class="clearfloat" style="background-color: #f7f8fa">
          <van-row>
            <van-col align="center" span="8">
              <div class="sidebar-down">
                <div
                  :class="[index == activeIndex ? 'active-one' : 'nomal-one']"
                  v-for="(item, index) in typeList"
                  :key="index"
                  @click="sidebarClick(item, index)"
                >
                  {{ item.classifyName }}
                </div>
              </div>
            </van-col>
            <van-col
              v-if="typeList[activeIndex] !== undefined"
              span="8"
              align="center "
            >
              <div class="sidebar-down">
                <div
                  :class="[index == searchIndex ? 'active-two' : 'nomal-two']"
                  v-for="(item, index) in typeList[activeIndex].children"
                  :key="index"
                  @click="sidebarCenterClick(item, index)"
                >
                  {{ item.classifyName }}
                </div>
              </div>
            </van-col>
            <van-col
              v-if="
                typeList[activeIndex] !== undefined &&
                  typeList[activeIndex].children[searchIndex] !== undefined
              "
              span="8"
              align="center "
              style="background-color: #ffffff"
            >
              <div class="sidebar-down">
                <div
                  :class="[index == lastIndex ? 'active-two' : 'nomal-two']"
                  style="background-color: #ffffff"
                  v-for="(item, index) in typeList[activeIndex].children[
                    searchIndex
                  ].children"
                  :key="index"
                  @click="sidebarLastClick(item, index)"
                >
                  {{ item.classifyName }}
                  <van-icon v-if="index == lastIndex" name="success" />
                </div>
              </div>
            </van-col>
          </van-row>
        </div>
      </van-action-sheet>
    </div>
    <!--    没有课程-->
    <div
      class="no-list-data"
      v-if="(preLiveList == null || preLiveList.length == 0) && isWifi"
    >
      <div class="set">
        <div style="padding-top: 50%">
          <img src="../../../assets/images/no-search-data.png" alt="" />
        </div>
        <div style="padding-top: 10px">暂无课程，先学习其他课程吧～</div>
      </div>
    </div>
    <!--        网络有问题展示-->
    <div class="no-network" v-if="!isWifi">
      <div>
        <div class="set">
          <div style="padding-top: 30%">
            <img src="../../../assets/images/network.png" alt="" />
          </div>
          <div style="padding-top: 30px; color: #646566; font-size: 14px">
            网络请求失败
          </div>
          <div style="padding-top: 10px">请检查您的网络，重新加载试试吧</div>
          <div class="refresh" @click="wifiGo">刷新</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./tasks-to-learn.js"></script>
<style scoped>
/deep/[class*="van-hairline"]::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border: none;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}
/deep/.van-field__left-icon .van-icon,
.van-field__right-icon .van-icon {
  display: block;
  min-width: 1em;
  font-size: 16px;
  line-height: inherit;
  color: #969799;
}
/deep/.van-pull-refresh__track {
  position: relative;
  height: 100%;
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  transition-property: transform;
  transition-property: transform, -webkit-transform;
  min-height: 500px;
}
/deep/.van-sidebar-item--select {
  color: #323233;
  font-weight: 500;
  border-color: #227ef7;
  background-color: #fff;
}
/deep/.van-count-down {
  line-height: 15px;
}
/deep/.van-field__control:disabled {
  color: #323233;
  background-color: transparent;
  cursor: not-allowed;
  opacity: 1;
  -webkit-text-fill-color: currentColor;
}
</style>
<style lang="scss" scoped>
.sidebar-down {
  height: 300px;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
}
.sidebar-down::-webkit-scrollbar {
  display: none;
}
.no-network {
  padding-top: 83px;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 100%;
  background: white;
  .refresh {
    display: inline-block;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(39, 128, 248, 1);
    margin-top: 30px;
    padding: 7px 35px;
    border-radius: 40px;
    border: 1px solid #2780f8;
  }

  img {
    width: 100px;
    height: 70px;
  }

  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(150, 151, 153, 1);
}
.seach {
  width: 90%;
  background-color: rgba(247, 248, 250, 1);
  height: 34px;
  line-height: 34px;
  border-radius: 35px;
  margin: 0 auto;
}
.active-one {
  padding: 10px 0;
  font-size: 13px;
  border-left: 3px solid #227ef7;
  background-color: #ffffff;
}
.beijing {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
}
.no-list-data {
  text-align: center;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  .set {
    height: 620px;
    background: white;
  }
  img {
    width: 67px;
    height: 49px;
  }
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.active-two {
  padding: 10px 0;
  font-size: 13px;
  color: #227ef7;
  background-color: #ffffff;
}
.time1 {
  display: block;
  position: absolute;
  left: 0px;
  padding: 0 5px;
  top: 0px;
  color: #ffffff;
  font-size: 9px;
  border-radius: 6px 0 10px 0;
  background: #ffbb00;
  line-height: 8px;
  height: 15px;
  img {
    width: 6px;
  }
}
.time2 {
  display: block;
  position: absolute;
  left: 0px;
  padding: 0 5px;
  top: 0px;
  line-height: 8px;
  height: 15px;
  color: #ffffff;
  font-size: 9px;
  border-radius: 6px 0 10px 0;
  background: #c0c4cc;
  .dian {
    position: absolute;
    left: 8px;
    top: 5px;
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: #ffffff;
    border-radius: 50%;
  }
}
.nomal-two {
  padding: 10px 0;
  font-size: 13px;
  color: #7d7e80;
}
.nomal-one {
  padding: 10px 0;
  font-size: 13px;
  color: #323233;
}
.clearMsg {
  position: absolute;
  left: 15px;
  top: 15px;
  color: #227ef7;
  font-size: 14px;
}
.classification-active {
  display: inline-block;
  padding: 5px 10px;
  background-color: #227ef7;
  color: #ffffff;
  border-radius: 20px;
  font-size: 13px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.classification {
  display: inline-block;
  padding: 5px 10px;
  background-color: #f2f3f5;
  color: #323233;
  border-radius: 20px;
  font-size: 13px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.border-b {
  border-bottom: 1px solid #dcdee0;
}
.top-header {
  background-color: #ffffff;
  width: 100%;
  height: 54px;
  line-height: 34px;
  padding: 10px 15px;

  .tab-container {
    display: flex;
    align-items: center;

    .test {
      flex: 1;
      text-align: center;
      border-radius: 17.5px 0px 0px 17.5px;
      border: 1px solid rgba(34, 126, 247, 1);
    }

    .homework {
      flex: 1;
      text-align: center;
      border: 1px solid rgba(34, 126, 247, 1);
      border-left: 0;
      border-right: 0;
    }

    .pkwall {
      flex: 1;
      text-align: center;
      border-radius: 0px 50px 50px 0px;
      border: 1px solid rgba(34, 126, 247, 1);
    }
  }
}

.content-top {
  color: #969799;
  font-size: 14px;
  padding-left: 20px;
  width: 375px;
  height: 34px;
  line-height: 39px;
}
.h-15 {
  height: 15px;
  line-height: 16px;
}
.time {
  display: block;
  position: absolute;
  left: 0px;
  padding-right: 4px;
  top: 0px;
  height: 15px;
  line-height: 8px;
  color: #ffffff;
  font-size: 9px;
  border-radius: 6px 0 10px 0;
  background: linear-gradient(
    127deg,
    rgba(225, 57, 118, 1) 0%,
    rgba(234, 52, 37, 1) 100%
  );

  .dian {
    position: absolute;
    left: 7px;
    top: 5px;
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: #ffffff;
    border-radius: 50%;
  }
}
.timeLeft {
  left: 30px;
}

.icon-right {
  position: absolute;
  right: 0;
  bottom: 20px;
  margin-top: 6px;
  float: right;
  width: 75px;
  height: 22px;
  background-color: rgba(242, 243, 245, 1);
  border-radius: 30px;
  text-align: center;
  line-height: 22px;
  font-size: 13px;
  color: #7d7e80;
  img {
    position: absolute;
    left: 7px;
    top: 3px;
    height: 15px;
    width: 15px;
  }
}
.icon-right1 {
  position: absolute;
  right: 0;
  bottom: 20px;
  margin-top: 6px;
  width: 72px;
  height: 22px;
  background-color: #e1eeff;
  border-radius: 30px;
  text-align: center;
  line-height: 22px;
  font-size: 13px;
  color: #2780f8;
}
.icon-right2 {
  position: absolute;
  right: 0;
  bottom: 20px;
  margin-top: 6px;
  width: 75px;
  height: 22px;
  background-color: rgba(242, 243, 245, 1);
  border-radius: 30px;
  text-align: center;
  line-height: 22px;
  font-size: 13px;
  color: #7d7e80;
}
.tag {
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
  background: #ff7406;
  height: 15px;
  line-height: 15px;
  color: #ffffff;
  border-radius: 6px 0 10px 0;
  z-index: 5;
  width: 37px;
  font-size: 0;
  .compulsory {
    width: 10px;
    margin-top: 3px;
    vertical-align: top;
  }
  &.liveNow {
    &:after {
      content: "";
      position: absolute;
      top: 0px;
      left: 26px;
      border: 6px transparent solid;
      border-left: 0px transparent solid;
      border-top: 15px #ff7406 solid;
      width: 8px;
    }
  }
  .test1 {
    position: relative;
    z-index: 1;
    display: inline-block;
    color: #ffffff;
    font-size: 9px;
    vertical-align: super;
  }
}
.left {
  float: left;
}
.right {
  float: right;
}
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}

.clearfloat {
  zoom: 1;
}
.content-list {
  width: 100%;

  .list-item {
    background-color: #ffffff;
    padding: 10px;
    margin: 10px 10px 0px 10px;
    border-radius: 10px;

    .item-top {
      position: relative;
      .bodypic {
        width: 144px;
        height: 90px;
        border-radius: 6px;
        margin-right: 10px;
      }

      .body-right {
        display: inline-block;
        width: 14px;
        text-align: right;
        vertical-align: top;
      }

      .right-img {
        margin-top: 3px;
        width: 7px;
        height: 10px;
        vertical-align: top;
      }

      .item-title {
        font-size: 14px;
        color: #323233;
        width: 200px;
        text-align: left;
      }
      .item-title-pk {
        font-size: 14px;
        color: #323233;
        width: 191px;
        text-align: left;
        white-space: normal;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .item-tname {
        font-size: 13px;
        color: #7d7e80;
        text-align: left;
        margin-top: 6px;
      }

      .item-tname-pk {
        font-size: 13px;
        color: #7d7e80;
        text-align: left;
      }

      .item-button {
        position: absolute;
        bottom: 0;
        right: 0;
        border: 1px solid #2780f8;
        width: 72px;
        height: 24px;
        line-height: 24px;
        color: #2780f8;
        border-radius: 15px;
        text-align: center;
        font-size: 14px;
      }
      .score {
        position: absolute;
        bottom: 0;
        right: 0;
        font-size: 16px;
        font-weight: 500;
        color: #227ef7;

        img {
          margin-left: 5px;
          width: 7px;
          height: 10px;
        }
      }
    }
  }
}
</style>
