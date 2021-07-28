<template>
  <div>
    <div v-if="!isDocShow">
      <jshHeader :header="header"></jshHeader>
      <div v-if="isWifi">
        <div class="beijing" v-if="getwork && getpk">
          <div style="margin-top: 350px">
            <van-loading size="24px" vertical>加载中...</van-loading>
          </div>
        </div>

        <van-overlay :show="overlay">
          <div class="loading">
            <van-loading type="spinner" style="color: #FFFFFF"
              ><div class="loadingmsg">{{ loadMsg }}</div></van-loading
            >
          </div>
        </van-overlay>
        <div
          class="ml-10 mr-10 mt-10 pl-10 pb-10 pr-10 pt-10"
          style="background-color: #FFFFFF;border-radius: 3px"
        >
          <div class="fs-15 fw-600 pb-10">
            {{ classJump ? classMsg.courseName : homework.homeworkTheme }}
          </div>
          <div v-if="classJump">
            <span class="fs-12" style="color: #646566">提交时间: </span>
            <span v-if="homework.homework" class="fs-12" style="color: #969799">
              {{ homework.homework.startTime }}至{{
                homework.homework.endTime
              }}</span
            >
          </div>

          <div
            class="pb-12 border-b"
            v-else-if="
              classMsg.taskStartTime != '' &&
                classMsg.taskStartTime != null &&
                classMsg.taskEndTime != '' &&
                classMsg.taskEndTime != null
            "
          >
            <span class="fs-12" style="color: #646566">提交时间: </span>
            <span
              v-if="
                handleYear(classMsg.taskStartTime) !==
                  handleYear(classMsg.taskEndTime)
              "
              class="fs-12"
              style="color: #969799"
            >
              {{ classMsg.taskStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                classMsg.taskEndTime | date("yyyy-MM-dd hh:mm")
              }}</span
            >
            <span v-else class="fs-12" style="color: #969799">
              {{ classMsg.taskStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
                classMsg.taskEndTime | date1("yyyy-MM-dd hh:mm")
              }}</span
            >
          </div>
          <div class="fs-14 fw-400 pt-12  clearfloat">
            <div class="left fw-600" style="color: #646566">
              作业要求
            </div>
            <div
              v-if="isRequirement"
              @click="isRequirement = false"
              class="right fs-13 requirement"
              style="color:#2780F8 "
            >
              <div class="pr-20">
                收起
              </div>
              <img
                class="requirement-img"
                align="absmiddle"
                src="@/assets/images/up.png"
                alt=""
              />
            </div>
            <div
              v-if="!isRequirement"
              @click="isRequirement = true"
              class="right fs-13 requirement"
              style="color:#2780F8 "
            >
              <div class="pr-20">
                展开
              </div>
              <img
                class="requirement-img"
                align="absmiddle"
                src="@/assets/images/down.png"
                alt=""
              />
            </div>
          </div>
          <div class="lai-active ">
            <div
              v-if="isRequirement"
              class="fs-13 pt-10"
              style="color: #969799"
            >
              <u-editor-box
                v-if="classJump"
                :content="
                  homework.homework.desc != '' && homework.homework.desc != null
                    ? homework.homework.desc
                    : '暂无作业要求'
                "
              ></u-editor-box>
              <u-editor-box
                v-else
                :content="
                  classMsg.taskDescription != '' &&
                  classMsg.taskDescription != null
                    ? classMsg.taskDescription
                    : '暂无作业要求'
                "
              ></u-editor-box>
            </div>
          </div>
        </div>
        <div
          class="ml-10 mr-10 mt-10 pl-10 pb-10 pr-10 pt-10 mb-10"
          style="background-color: #FFFFFF;border-radius: 3px"
        >
          <div class="fs-14 fw-400 clearfloat">
            <div class="left fw-600" style="color: #646566">
              我的作业
            </div>
            <div
              v-if="isWork"
              @click="isWork = false"
              class="right fs-13 requirement"
              style="color:#2780F8 "
            >
              <div class="pr-20">
                收起
              </div>
              <img
                class="requirement-img"
                align="absmiddle"
                src="@/assets/images/up.png"
                alt=""
              />
            </div>
            <div
              v-if="!isWork"
              @click="isWork = true"
              class="right fs-13 requirement"
              style="color:#2780F8 "
            >
              <div class="pr-20">
                展开
              </div>
              <img
                class="requirement-img"
                align="absmiddle"
                src="@/assets/images/down.png"
                alt=""
              />
            </div>
          </div>

          <div v-if="isWork" class="fs-13 pt-10" style="color: #969799;">
            <div v-if="homework.id != '' && homework.id != null">
              <div>
                <div
                  v-if="isVideo && homework.dates != null"
                  class="fs-13 pt-10 pb-10"
                  style="color: #7D7E80"
                >
                  视频
                </div>
                <div
                  v-if="isVideo && homework.dates != null"
                  class="w-100 no-line-to border-b pb-10"
                  style="width: 100%;white-space: nowrap;overflow-x: auto;-webkit-overflow-scrolling:touch;z-index: 1;"
                >
                  <div
                    v-for="(item, index) of VideoBox"
                    :key="index"
                    class="swipe-loder mr-12"
                  >
                    <div>
                      <img
                        style="width: 210px;height: 125px"
                        src="@/assets/images/video.png"
                        alt=""
                        @click="videoPlay(item, 1)"
                      />
                    </div>
                  </div>
                </div>
                <div
                  v-if="isMsg && homework.dates != null"
                  class="fs-13 pt-10 pb-10"
                  style="color: #7D7E80"
                >
                  图片
                </div>
                <!--                图片的水印-->
                <div v-if="picWaterMark && !classJump" class="mask-water">
                  <div class="mask-info info-1">
                    {{ classMsg.huihuiNumber }}
                  </div>
                  <div class="mask-info info-2">
                    {{ classMsg.huihuiNumber }}
                  </div>
                  <div class="mask-info info-3">
                    {{ classMsg.huihuiNumber }}
                  </div>
                  <div class="mask-info info-4">
                    {{ classMsg.huihuiNumber }}
                  </div>
                  <div class="mask-info info-5">
                    {{ classMsg.huihuiNumber }}
                  </div>
                  <div class="mask-info info-6">
                    {{ classMsg.huihuiNumber }}
                  </div>
                  <div class="mask-info info-7">
                    {{ classMsg.huihuiNumber }}
                  </div>
                </div>
                <div
                  v-if="isMsg && homework.dates != null"
                  class="w-100 no-line-to border-b pb-10"
                  style="width: 100%;white-space: nowrap;overflow-x: auto;-webkit-overflow-scrolling:touch;z-index: 1;"
                >
                  <div
                    v-for="(item, index) of msgBox"
                    :key="index"
                    class="swipe-loder mr-12"
                  >
                    <div>
                      <img
                        style="width: 210px;height: 125px"
                        :src="item.value"
                        @click="sceneImgOne(item.value)"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div
                  v-if="isAudio && homework.dates != null"
                  class="fs-13 pt-10 pb-10"
                  style="color: #7D7E80"
                >
                  音频
                </div>
                <div
                  v-if="isAudio && homework.dates != null"
                  class="w-100 no-line-to border-b pb-10"
                  style="width: 100%;white-space: nowrap;overflow-x: auto;-webkit-overflow-scrolling:touch;z-index: 1;"
                >
                  <div
                    v-for="(item, index) of AudioBox"
                    :key="index"
                    class="swipe-loder mr-12"
                  >
                    <div>
                      <img
                        v-if="item.type == 2"
                        style="width: 210px;height: 125px"
                        src="@/assets/images/music.png"
                        @click="videoPlay(item, 2)"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div
                  v-if="isDoc && homework.dates != null"
                  class="fs-13 pt-10 pb-10"
                  style="color: #7D7E80"
                >
                  文档
                </div>
                <div
                  v-if="isDoc && homework.dates != null"
                  class="w-100 no-line-to border-b pb-10"
                  style="width: 100%;white-space: nowrap;overflow-x: auto;-webkit-overflow-scrolling:touch;z-index: 1;"
                >
                  <div
                    v-for="(item, index) of docBox"
                    :key="index"
                    class="swipe-loder mr-12"
                  >
                    <div
                      style="width: 210px;height: 125px;text-align: center;background-color: #F2F3F5;border-radius: 5px"
                    >
                      <img
                        style="width: 90px;height: 100px;margin-top: 13px"
                        src="@/assets/images/file.png"
                        @click="computerFileShow(item.value)"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div style="position: relative" id="waterMark">
                  <div
                    v-if="homework.desc !== null && homework.desc !== ''"
                    class="fs-13 pt-10 pb-10"
                    style="color: #7D7E80"
                  >
                    描述内容
                  </div>
                  <div
                    v-if="
                      homework.desc &&
                        homework.desc !== null &&
                        homework.desc !== ''
                    "
                    class="fs-14 pb-10 border-b"
                    style="color: #7D7E80;position: relative"
                  >
                    {{ homework.desc }}
                  </div>
                  <!--                  描述内容水印-->
                  <div class="content-water-mark">
                    <div v-for="(item, index) in waterMarkList" :key="index">
                      <div
                        class="mark d-flex justify-content-between align-items-center"
                      >
                        <div class="info">{{ item.value }}</div>
                        <div class="info">{{ item.value }}</div>
                        <div class="info">{{ item.value }}</div>
                      </div>
                      <div
                        v-if="contentWaterMark"
                        class="mark-two d-flex justify-content-between align-items-center"
                      >
                        <div class="info">{{ item.value }}</div>
                        <div class="info">{{ item.value }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="homework.status">
                  <div class="fs-15 pt-10 pb-10 fw-600" style="color: #323233">
                    批改结果
                  </div>
                  <div class="fs-14" style="color: #323233">
                    <div style="position: relative">
                      分值:
                      <span style="color:#FFBB00 "
                        >{{ homework.score }} 分</span
                      >
                      <div class="hege-box">
                        <img
                          v-if="homework.isQualified == 1"
                          class="img-hege"
                          src="@/assets/images/hege.png"
                          alt=""
                        />
                        <img
                          v-if="homework.isQualified == 0"
                          class="img-hege"
                          src="@/assets/images/buhege.png"
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      v-if="homework.remark !== null && homework.remark !== ''"
                      class="pt-10 pb-10"
                    >
                      评语:
                    </div>
                    <div
                      v-if="homework.remark !== null && homework.remark !== ''"
                      style="color:#646566 "
                    >
                      {{ homework.remark }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="homework.id == '' || homework.id == null"
              style="text-align: center"
            >
              <img class="no-msg" src="@/assets/images/noMsg.png" alt="" />
              <div class="pb-10">
                你还没有提交作业哦~
              </div>
              <div class="work-button" @click="workjob">
                交作业
              </div>
            </div>
          </div>
        </div>
        <div
          class="ml-10 mr-10 pl-10 pb-10 pr-10 pt-10 mb-10"
          v-if="PKMsg.homeWorkSubmits != null"
          style="background-color: #FFFFFF;border-radius: 3px"
        >
          <div>
            <img class="pkImg" src="@/assets/images/Group.png" alt="" />
          </div>
          <div class="pt-5">
            <span class="fs-12" style="color: #646566">pk时间: </span>
            <span
              class="fs-12"
              style="color: #969799"
              v-if="PKMsg.pkStartTime != null && PKMsg.pkEndTime != null"
            >
              <span
                v-if="
                  handleYear(classMsg.taskStartTime) !==
                    handleYear(classMsg.taskEndTime)
                "
              >
                {{ PKMsg.pkStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                  PKMsg.pkEndTime | date("yyyy-MM-dd hh:mm")
                }}
              </span>
              <span v-else>
                {{ PKMsg.pkStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
                  PKMsg.pkEndTime | date1("yyyy-MM-dd hh:mm")
                }}
              </span>
            </span>
            <span class="fs-12" style="color: #969799" v-else> 不限</span>
          </div>
          <div v-for="(item, index) in PKMsg.homeWorkSubmits" :key="index">
            <div class="fs-13 fw-400 pb-10 clearfloat pt-12">
              <div class="left fw-500" style="color: #323233">
                {{ item.accountName }}
              </div>
              <div
                @click="pkHide(index)"
                v-if="isShowPk(index)"
                class="right fs-13 requirement"
                style="color:#2780F8 "
              >
                <div class="pr-20">
                  收起
                </div>
                <img
                  class="requirement-img"
                  align="absmiddle"
                  src="@/assets/images/up.png"
                  alt=""
                />
              </div>
              <div
                @click="pkShow(index)"
                v-if="!isShowPk(index)"
                class="right fs-13 requirement"
                style="color:#2780F8 "
              >
                <div class="pr-20">
                  展开
                </div>
                <img
                  class="requirement-img"
                  align="absmiddle"
                  src="@/assets/images/down.png"
                  alt=""
                />
              </div>
            </div>
            <div
              class="w-100 no-line-to"
              style="width: 100%;white-space: nowrap;overflow-x: auto;-webkit-overflow-scrolling:touch;z-index: 1;"
            >
              <div
                class="swipe-loder mr-12"
                v-for="(item1, index1) of item.datas"
                :key="index1"
              >
                <div v-if="isShowPk(index)">
                  <img
                    v-if="item1.type == 0"
                    style="width: 210px;height: 125px"
                    @click="sceneImgOne(item1.value)"
                    :src="item1.value"
                    alt=""
                  />
                  <img
                    v-if="item1.type == 1"
                    style="width: 210px;height: 125px"
                    src="@/assets/images/video.png"
                    alt=""
                    :data="item1.value"
                    @click="videoPlay(item1)"
                  />
                  <img
                    v-if="item1.type == 3"
                    style="width: 210px;height: 125px"
                    src="@/assets/images/file.png"
                    @click="computerFileShow(item1.value)"
                    alt=""
                  />
                  <img
                    v-if="item1.type == 2"
                    style="width: 210px;height: 125px"
                    src="@/assets/images/music.png"
                    @click="videoPlay(item1)"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div
              v-if="isShowPk(index) && item.desc !== null && item.desc !== ''"
              class="fs-13 mt-5"
              style="color: #7D7E80"
            >
              {{ item.desc }}
            </div>
            <div
              v-if="
                isShowPk(index) && item.pkTime !== null && item.pkTime !== ''
              "
              class="fs-13 pt-10 pb-12 border-b"
              style="color: #969799"
            >
              {{ item.pkTime | date1("yyyy-MM-dd hh:mm") }}
            </div>
          </div>
        </div>
        <!--    提交作业-->
        <jobSubmit
          @close="closeWork"
          v-if="jobsub"
          @submit="submit"
          ref="submit"
          :jobObj="jobObj"
        ></jobSubmit>
        <van-popup v-model="isVideoPlayer">
          <div v-if="isVideoPlayer" style="width: 375px;margin: 0 auto">
            <VideoPlayer
              :vid="liveId"
              :video-container-height="200"
              :mediaType="mediaType"
            ></VideoPlayer>
          </div>
        </van-popup>
      </div>
      <!--        网络有问题展示-->
      <div class="no-network" v-if="!isWifi">
        <div>
          <div class="set">
            <div style="padding-top: 30%">
              <img src="../../../../assets/images/network.png" alt="" />
            </div>
            <div style="padding-top: 30px;color: #646566;font-size: 14px">
              网络请求失败
            </div>
            <div style="padding-top: 10px">请检查您的网络，重新加载试试吧</div>
            <div class="refresh" @click="wifiGo">刷新</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isDocShow">
      <documentPreview
        @backDoc="backDoc"
        :huihuiNumber="classMsg.huihuiNumber"
        ref="documentPreview"
      ></documentPreview>
    </div>
  </div>
</template>

<script src="./task-details.js"></script>
<style lang="scss">
.lai-active {
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
</style>
<style scoped>
.van-action-sheet__cancel,
.van-action-sheet__item {
  display: block;
  width: 100%;
  font-size: 16px;
  line-height: 50px;
  text-align: center;
  background-color: #2780f8;
  color: #ffffff;
  border: 0;
  font-weight: 500;
}
/deep/.van-circle__text {
  color: #ffffff;
}
/deep/.van-uploader__preview-image {
  display: block;
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 8px;
}
/deep/.van-uploader__file {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: #f7f8fa;
  border-radius: 8px;
}
/deep/.van-uploader__upload {
  border: none;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  margin: 0 8px 8px 0;
  background-color: #f7f8fa;
  border-radius: 8px;
}
.van-action-sheet__cancel::before {
  display: none;
}
</style>
<style lang="scss" scoped>
.content-water-mark {
  pointer-events: none;
  width: 100%;
  position: absolute;
  top: 3px;
  left: 0;
  .mark {
    margin: 60px 0px;
    .info {
      transform: rotate(-35deg);
      font-weight: 600;
      font-size: 13px;
      color: rgba(48, 49, 51, 0.1);
    }
  }
  .mark-two {
    margin: 70px 20%;
    .info {
      transform: rotate(-35deg);
      font-weight: 600;
      font-size: 13px;
      color: rgba(48, 49, 51, 0.1);
    }
  }
}
.mask-water {
  pointer-events: none;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  .mask-info {
    position: absolute;
    transform: rotate(-35deg);
    font-weight: 600;
    font-size: 13px;
    color: rgba(48, 49, 51, 0.1);
  }
  .info-1 {
    top: 103px;
    left: 45px;
  }
  .info-2 {
    top: 163px;
    left: 251px;
  }
  .info-3 {
    top: 272px;
    left: 45px;
  }
  .info-4 {
    top: 332px;
    left: 251px;
  }
  .info-5 {
    top: 441px;
    left: 45px;
  }
  .info-6 {
    top: 501px;
    left: 251px;
  }
  .info-7 {
    top: 610px;
    left: 45px;
  }
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
.img-hege {
  width: 70px;
}
.hege-box {
  position: absolute;
  left: 120px;
  top: -30px;
}
.loding-video {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  text-align: center;
  background-color: rgba(50, 50, 51, 0.88);
}
.work-button {
  color: #2780f8;
  border: 1px solid #2780f8;
  border-radius: 15px;
  width: 80px;
  padding: 3px 0;
  font-size: 14px;
  margin: 0 auto;
}
.mt-4 {
  margin-top: -3px;
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
.loading {
  text-align: center;
  width: 130px;
  margin: 350px auto 0;
  background-color: #222222;
  height: 80px;
  border-radius: 5px;
  line-height: 80px;
  .loadingmsg {
    color: #ffffff;
    font-size: 14px;
  }
}
.sidebar-down {
  height: 400px;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
}
.requirement {
  position: relative;
  .requirement-img {
    width: 16px;
    position: absolute;
    right: 0;
    top: 0;
  }
}
.no-msg {
  width: 60px;
  height: 60px;
}
.border-b {
  border-bottom: 1px solid rgba(220, 222, 224, 1);
}
.left {
  float: left;
}
.right {
  float: right;
}
.pkImg {
  width: 47px;
  height: 14px;
}
.swipe-loder {
  width: 60%;
  vertical-align: middle;
  background-color: white;
  display: inline-block;
}
</style>
