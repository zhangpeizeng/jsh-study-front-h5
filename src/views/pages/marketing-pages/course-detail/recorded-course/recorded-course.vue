<template>
  <div>
    <div class="no-network" v-if="isNetwork">
      <jshHeader :header="header" @leftClick="gobackto"></jshHeader>
      <div>
        <div class="set">
          <div style="padding-top: 30%">
            <!-- <img src="../../../../../assets/images/network.png" alt="" /> -->
            <img :src="netWorkImg" alt="" />
          </div>
          <div style="padding-top: 30px;color: #646566;font-size: 14px">
            网络请求失败
          </div>
          <div style="padding-top: 10px">请检查您的网络，重新加载试试吧</div>
          <div class="refresh" @click="refreshClick">刷新</div>
        </div>
      </div>
    </div>
    <div v-show="productDetailFlag && docViewFlag && !isNetwork">
      <jshHeader :header="header" @leftClick="gobackto"></jshHeader>
      <div
        style="width: 100%;position: relative;"
        v-if="
          signUpStatus &&
            mediaList.length > 0 &&
            mediaItem.selected &&
            (mediaItem.liveType === '1' || mediaItem.liveType === '2')
        "
      >
        <div v-for="(item, index) in mediaList" :key="index">
          <VideoPlayer
            ref="videoRef"
            :numPage="index"
            :vid="mediaItem.liveId"
            :baseId="detailObj.id"
            :autoplay="autoPlay"
            :coursesType="detailObj.courseType"
            :liveType="mediaItem.liveType"
            :sourceId="detailObj.id"
            :cover="courseImg"
            :video-container-height="200"
            :mediaType="mediaItem.mediaType"
            @play="videoPlay(item)"
            @pause="videoPause"
            @ended="videoEnded(item)"
            v-if="
              mediaItem.transcodingStatus && item.liveId === mediaItem.liveId
            "
          />
          <div
            style="width: 100%;position: relative;color: white;"
            v-if="!mediaItem.transcodingStatus"
          >
            <img :src="courseImg" style="width: 100%;height: 200px;" />
            <div
              style="width: 100%;height: 200px;opacity: 0.5;position: absolute;top: 0;left: 0;background-color: #333333;"
            ></div>
            <div
              style="width: 100%;position: absolute;bottom: 20px;text-align: center;left: 0;"
            >
              <van-loading type="spinner" v-if="videoshowto" />
              <div
                style="width: 100%;text-align: center;font-size: 13px;padding-top: 13px;"
              >
                学习内容即将播放，请稍等...
              </div>
              <div style="width: 100%;text-align: center;padding-top: 13px;">
                <div
                  style="width: 86px;height: 24px;line-height:24px;text-align: center;border-radius: 12px;color: #ffffff;font-size:14px;display: inline-block;"
                  class="border-yuan"
                  @click="getvideotask(mediaItem)"
                >
                  刷新
                </div>
              </div>
            </div>
          </div>
          <div
            style="height: 16px;font-size: 11px;color: white;background-color: #2780F8;padding: 0 5px;border-radius: 5px 0 0 0;position: absolute;bottom: 0;right: 0;z-index: 10;display: flex;justify-content: flex-start;align-items: center;"
            v-if="mediaItem.progress && videoPlayFlag"
          >
            <span>已学习</span>
            <span>{{ mediaItem.progress }}%</span>
            <img
              src="../../../../../assets/images/answer.png"
              style="width: 12px;height: 12px;"
              @click="toProgress"
            />
          </div>
          <div
            style="height: 16px;font-size: 11px;color: white;background-color: #C0C4CC;padding: 0 5px;border-radius: 5px 0 0 0;position: absolute;bottom: 0;right: 0;z-index: 10;display: flex;justify-content: flex-start;align-items: center;"
            v-if="!mediaItem.progress && videoPlayFlag"
          >
            <span>未学习</span>
            <img
              src="../../../../../assets/images/answer.png"
              style="width: 12px;height: 12px;"
              @click="toProgress"
            />
          </div>
        </div>
      </div>
      <div
        class="header-cover"
        v-if="
          signUpStatus &&
            mediaList.length > 0 &&
            mediaItem.selected &&
            mediaItem.liveType === '3'
        "
      >
        <div class="header-layer"></div>
        <van-image width="375px" height="200px" :src="detailObj.courseImg">
          <template v-slot:error>
            <img
              class="media-cover"
              src="../../../../../assets/images/imgfengmian.png"
            />
          </template>
        </van-image>
        <div class="play-box">
          <img
            src="../../../../../assets/images/media-doc.png"
            style="width:47px;height:52px;margin-bottom:11px"
            @click="gotoView(mediaItem)"
          />
          <div class="fs-13" style="color:#ffffff">
            点击学习文档
          </div>
        </div>
        <div class="header-progress" v-if="mediaItem.progress">
          已学习{{ mediaItem.progress }}%
          <img
            src="../../../../../assets/images/answer.png"
            class="header-img"
            @click.stop="toProgress"
          />
        </div>
        <div class="header-progress back-info" v-if="!mediaItem.progress">
          未学习
          <img
            src="../../../../../assets/images/answer.png"
            class="header-img"
            @click.stop="toProgress"
          />
        </div>
      </div>
      <div class="courseware-box" v-show="signUpStatus && mediaList.length > 0">
        <div class="courseware-top">
          <div class="d-flex justify-content-between align-items-center">
            <div class="courseware-span">课件</div>
            <div
              class="courseware-title"
              v-if="mediaObj.liveList.length > 0"
              @click="mediaChange"
            >
              <img
                src="../../../../../assets/images/recorded-video.png"
                style="width:10px;height:10px;margin-right: 3px;"
              />{{ mediaObj.liveList.length }}个视频
            </div>
            <div
              class="courseware-title"
              v-if="mediaObj.mp4List.length > 0"
              @click="mediaChange"
            >
              <img
                src="../../../../../assets/images/recorded-music.png"
                style="width:5px;height:11px;margin-right: 3px;"
              />{{ mediaObj.mp4List.length }}个音频
            </div>
            <div
              class="courseware-title"
              v-if="mediaObj.textList.length > 0"
              @click="mediaChange"
            >
              <img
                src="../../../../../assets/images/recorded-doc.png"
                style="width:9px;height:10px;margin-right: 3px;"
              />{{ mediaObj.textList.length }}个文档
            </div>
          </div>
          <div class="d-flex align-items-center" @click="mediaChange">
            <div style="font-size:12px;color:#969799" v-show="mediaFlag">
              全部
            </div>
            <img
              v-show="mediaFlag"
              src="../../../../../assets/images/right.png"
              style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px;margin-top: 2px;"
            />
            <img
              v-show="!mediaFlag"
              src="../../../../../assets/images/re-close.png"
              style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px;"
            />
          </div>
        </div>
        <div class="courseware-bottom no-line-to" v-show="mediaFlag">
          <div v-for="(item, index) in mediaList" :key="index">
            <div
              class="courseware-item"
              @click="mediaClick(item)"
              :class="item.selected ? 'courseware-item-selected' : ''"
            >
              <div
                class="loader d-flex align-items-end"
                v-show="item.isVideoPlay"
              >
                <div class="loader-inner"></div>
                <div class="loader-inner"></div>
                <div class="loader-inner"></div>
              </div>
              <div
                style=" font-size: 13px;color: #323233;"
                v-show="!item.isVideoPlay"
              >
                {{ index + 1 }}.
              </div>
              <div
                class="courseware-progress"
                v-if="!item.isVideoPlay && item.progress == 100"
              >
                <img
                  src="../../../../../assets/images/re-com.png"
                  style="width:12px;height:12px;"
                />
              </div>
              <div
                class="courseware-progress"
                v-if="!item.isVideoPlay && item.progress && item.progress < 100"
              >
                <img
                  src="../../../../../assets/images/re-load.png"
                  style="width:12px;height:12px;"
                />
              </div>
              <div class="courseware-item-span">{{ item.liveName }}</div>
              <img
                v-if="item.liveType === '1'"
                src="../../../../../assets/images/re-video.png"
                class="position-type"
              />
              <img
                v-if="item.liveType === '2'"
                src="../../../../../assets/images/re-music.png"
                class="position-type"
              />
              <img
                v-if="item.liveType === '3'"
                src="../../../../../assets/images/re-doc.png"
                class="position-type"
              />
            </div>
          </div>
        </div>
        <div class="courseware-all" v-show="!mediaFlag">
          <div v-for="(item, index) in mediaList" :key="index">
            <div
              class="courseware-item"
              :class="item.selected ? 'courseware-item-selected' : ''"
              @click="mediaClick(item)"
            >
              <div
                class="loader d-flex align-items-end"
                v-show="item.isVideoPlay"
              >
                <div class="loader-inner"></div>
                <div class="loader-inner"></div>
                <div class="loader-inner"></div>
              </div>
              <div
                style=" font-size: 13px;color: #323233;"
                v-show="!item.isVideoPlay"
              >
                {{ index + 1 }}.
              </div>
              <div
                class="courseware-progress"
                v-if="!item.isVideoPlay && item.progress == 100"
              >
                <img
                  src="../../../../../assets/images/re-com.png"
                  style="width:12px;height:12px;"
                />
              </div>
              <div
                class="courseware-progress"
                v-if="!item.isVideoPlay && item.progress && item.progress < 100"
              >
                <img
                  src="../../../../../assets/images/re-load.png"
                  style="width:12px;height:12px;"
                />
              </div>
              <div class="courseware-item-span">{{ item.liveName }}</div>
              <img
                v-if="item.liveType === '1'"
                src="../../../../../assets/images/re-video.png"
                class="position-type"
              />
              <img
                v-if="item.liveType === '2'"
                src="../../../../../assets/images/re-music.png"
                class="position-type"
              />
              <img
                v-if="item.liveType === '3'"
                src="../../../../../assets/images/re-doc.png"
                class="position-type"
              />
            </div>
          </div>
        </div>
      </div>
      <!--录播文档页签end -->
      <div v-show="mediaFlag">
        <div class="course-box">
          <van-row type="flex" class="text-content">
            <van-col span="18">
              <span class="title-span">{{ detailObj.courseName }}</span>
            </van-col>
            <van-col span="6" class="text-right">
              <span
                class="title-study"
                v-if="detailObj.progress && detailObj.progress < 100"
              >
                已学习{{ detailObj.progress }}%
              </span>
              <span
                class="title-study"
                style="color:#227ef7"
                v-if="detailObj.progress == 100"
              >
                已学完
              </span>
              <span
                class="title-study"
                style="color:#969799"
                v-if="!detailObj.progress"
              >
                未学习
              </span>
            </van-col>
          </van-row>
          <van-row
            type="flex"
            justify="space-between"
            align="center"
            class="text-content mt-10"
          >
            <van-col span="4">
              <van-image
                width="44px"
                height="44px"
                fit="cover"
                radius="40"
                :src="lecturerObj.lecturerImg"
                @click="toView"
              >
              </van-image>
            </van-col>
            <van-col span="17">
              <span class="fs-14 color-black" @click="toView">
                {{ lecturerObj.lecturerName }}
              </span>
            </van-col>
            <van-col span="2">
              <span class="fs-12 color-gray" @click="toView">查看</span>
            </van-col>
            <van-col span="1">
              <img
                src="../../../../../assets/images/right.png"
                style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px;margin-top: -2px;"
                @click="toView"
              />
            </van-col>
          </van-row>
          <van-row
            type="flex"
            class="text-content mt-10"
            v-if="detailObj.studyStartTime && detailObj.studyEndTime"
          >
            <van-col
              span="5"
              v-if="detailObj.studyStartTime && detailObj.studyEndTime"
            >
              <span class="fs-12 color-brown">学习时间:</span>
            </van-col>
            <van-col
              span="18"
              v-if="detailObj.studyStartTime && detailObj.studyEndTime"
            >
              <span
                class="fs-12 color-gray"
                v-if="detailObj.studyStartTime && detailObj.studyEndTime"
              >
                <span
                  v-if="
                    handleYear(detailObj.studyStartTime) !==
                      handleYear(detailObj.studyEndTime)
                  "
                >
                  {{ detailObj.studyStartTime | date("yyyy-MM-dd hh:mm") }}
                  至{{ detailObj.studyEndTime | date("yyyy-MM-dd hh:mm") }}
                </span>
                <span v-else>
                  {{ detailObj.studyStartTime | date1("yyyy-MM-dd hh:mm") }}
                  至{{ detailObj.studyEndTime | date1("yyyy-MM-dd hh:mm") }}
                </span>
              </span>
              <!--<span class="fs-12 color-gray" v-else>-->
              <!--不限-->
              <!--</span>-->
            </van-col>
          </van-row>
        </div>
        <div class="course-box" style="padding: 15px 15px 0 15px;">
          <div
            class="text-content mb-16"
            v-if="detailObj.testStatus == 1 && signUpStatus"
          >
            <div class="d-flex justify-content-between">
              <div>
                <div class="fs-14 color-brown">考试时间</div>
                <div
                  v-if="
                    handleYear(detailObj.testStartTime) !==
                      handleYear(detailObj.testEndTime)
                  "
                  class="fs-12 color-gray mt-10"
                >
                  {{ detailObj.testStartTime | date("yyyy-MM-dd hh:mm") }}
                  至{{ detailObj.testEndTime | date("yyyy-MM-dd hh:mm") }}
                </div>
                <div v-else class="fs-12 color-gray mt-10">
                  {{ detailObj.testStartTime | date1("yyyy-MM-dd hh:mm") }}
                  至{{ detailObj.testEndTime | date1("yyyy-MM-dd hh:mm") }}
                </div>
                <div
                  class="fs-12 color-gray mt-10"
                  v-if="
                    !detailObj.accountTestStatus &&
                      nowTime > detailObj.testEndTime
                  "
                >
                  本次课程考试已结束，下次不要再错过哦~~~
                </div>
              </div>
              <div
                class="d-flex align-items-center"
                v-if="detailObj.accountTest === 1"
              >
                <div class="lai-btn" @click="goToExam">
                  补考
                </div>
              </div>
              <div
                class="d-flex align-items-center"
                v-if="detailObj.accountTest === 2"
              >
                <div class="lai-btn" @click="goToExam">
                  去考试
                </div>
              </div>
              <div
                class="d-flex align-items-center"
                v-if="detailObj.accountTest === 3"
                @click="goToExam"
              >
                <span class="fs-12" style="color:#969799">
                  已考试
                </span>
                <img
                  src="../../../../../assets/images/right.png"
                  class="img-right"
                />
              </div>
            </div>
            <div
              class="fs-13 color-brown mt-10"
              v-if="detailObj.certificateName"
            >
              考试通过后可获得《{{ detailObj.certificateName }}》
            </div>
          </div>
          <div
            class="text-content mb-16"
            v-if="detailObj.taskStatus == 1 && signUpStatus"
          >
            <div class="d-flex justify-content-between">
              <div>
                <div class="fs-14 color-brown">作业时间</div>
                <div
                  class="fs-12 color-gray mt-10"
                  v-if="detailObj.taskStartTime && detailObj.taskEndTime"
                >
                  <span
                    v-if="
                      handleYear(detailObj.taskStartTime) !==
                        handleYear(detailObj.taskEndTime)
                    "
                  >
                    {{ detailObj.taskStartTime | date("yyyy-MM-dd hh:mm") }}
                    至{{ detailObj.taskEndTime | date("yyyy-MM-dd hh:mm") }}
                  </span>
                  <span v-else>
                    {{ detailObj.taskStartTime | date1("yyyy-MM-dd hh:mm") }}
                    至{{ detailObj.taskEndTime | date1("yyyy-MM-dd hh:mm") }}
                  </span>
                </div>
                <div class="fs-12 color-gray mt-10" v-else>
                  随时
                </div>
                <div
                  class="fs-12 color-gray mt-10"
                  v-if="detailObj.taskStartTime && detailObj.taskEndTime"
                >
                  <span
                    v-if="
                      !detailObj.accountTaskStatus &&
                        nowTime > detailObj.taskEndTime
                    "
                  >
                    本次课程提交作业已结束，下次不要再错过哦~~~
                  </span>
                </div>
              </div>
              <div
                class="d-flex align-items-center"
                v-if="!detailObj.accountTaskStatus"
              >
                <div
                  class="lai-btn"
                  v-if="taskShowStatus && detailObj.taskId"
                  @click="handHomeWork(1)"
                >
                  去交作业
                </div>
              </div>
              <div
                class="d-flex align-items-center"
                v-if="detailObj.accountTaskStatus"
              >
                <!--                <van-button-->
                <!--                  plain-->
                <!--                  hairline-->
                <!--                  round-->
                <!--                  type="info"-->
                <!--                  class="button-height"-->
                <!--                  v-if="modify && detailObj.taskId"-->
                <!--                  @click="handHomeWork(2)"-->
                <!--                >-->
                <!--                  修改作业-->
                <!--                </van-button>-->
                <span
                  v-if="modify && detailObj.taskId"
                  class="lai-btn"
                  @click="handHomeWork(2)"
                >
                  修改作业
                </span>
                <span
                  v-else
                  @click="gotoHomeWork"
                  class="fs-12"
                  style="color:#969799"
                >
                  已交作业
                  <img
                    src="../../../../../assets/images/right.png"
                    class="img-right1"
                  />
                </span>
              </div>
            </div>
          </div>
          <div
            class="text-content mb-16"
            v-if="
              detailObj.taskStatus == 1 &&
                detailObj.pkStatus == 1 &&
                signUpStatus
            "
          >
            <div class="d-flex justify-content-between">
              <div>
                <div class="fs-14 color-brown">PK时间</div>
                <div
                  class="fs-12 color-gray mt-10"
                  v-if="detailObj.pkStartTime && detailObj.pkEndTime"
                >
                  <span
                    v-if="
                      handleYear(detailObj.pkStartTime) !==
                        handleYear(detailObj.pkEndTime)
                    "
                  >
                    {{ detailObj.pkStartTime | date("yyyy-MM-dd hh:mm") }}
                    至{{ detailObj.pkEndTime | date("yyyy-MM-dd hh:mm") }}
                  </span>
                  <span v-else>
                    {{ detailObj.pkStartTime | date1("yyyy-MM-dd hh:mm") }}
                    至{{ detailObj.pkEndTime | date1("yyyy-MM-dd hh:mm") }}
                  </span>
                </div>
                <div class="fs-12 color-gray mt-10" v-else>
                  随时
                </div>
                <div
                  class="fs-12 color-gray mt-10"
                  v-if="detailObj.pkStartTime && detailObj.pkEndTime"
                >
                  <span
                    v-if="
                      !detailObj.accountPkStatus &&
                        nowTime > detailObj.pkEndTime
                    "
                  >
                    本次课程作业PK参与时间已结束，下次不要再错过哦~~~
                  </span>
                </div>
              </div>
              <div
                class="d-flex align-items-center"
                v-if="!detailObj.accountPkStatus"
              >
                <van-button
                  plain
                  hairline
                  round
                  type="info"
                  class="button-height"
                  v-if="pkShowStatus && detailObj.taskSubmitId"
                  @click="updatePkStatus"
                >
                  参与PK
                </van-button>
              </div>
              <div
                class="d-flex align-items-center"
                v-if="detailObj.accountPkStatus"
                @click="gotoHomeWork"
              >
                <span class="fs-12" style="color:#969799">
                  已参与
                </span>
                <img
                  src="../../../../../assets/images/right.png"
                  class="img-right"
                />
              </div>
            </div>
          </div>
          <div class="text-content pb-16" v-if="detailObj.courseDescription">
            <div class="fs-14 color-brown">简介内容</div>
            <div class="fs-14 color-gray mt-10">
              <div class="course-description">
                <u-editor-box
                  :content="detailObj.courseDescription"
                ></u-editor-box>
              </div>
            </div>
          </div>
          <div class="text-content" v-if="detailObj.productList">
            <div class="fs-14 color-brown mb-16">参考素材</div>
            <div class="material">
              <div>
                <div
                  class="item"
                  v-for="(item, index) in detailObj.productList"
                  :key="index"
                  @click="toDetail(item)"
                >
                  <div class="d-flex align-items-start">
                    <div class="pic">
                      <img
                        style="height: 89px; width: 89px"
                        :src="item.majorPicture"
                        alt=""
                      />
                    </div>
                    <div class="introduce">
                      <div class="title">{{ item.itemName }}</div>
                      <div class="line">型号:{{ item.productCode }}</div>
                      <div class="line content">编码:{{ item.itemModel }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="text-content pb-16"
            v-if="detailObj.content"
            style="position: relative"
            id="waterMark"
          >
            <div class="fs-14 color-brown">课程内容</div>
            <div class="fs-14 color-gray mt-10" v-if="signUpStatus">
              <div class="course-description">
                <u-editor-box :content="detailObj.content"></u-editor-box>
              </div>
            </div>
            <div class="fs-14 color-gray mt-10" v-if="!signUpStatus">
              先报名才能学习内容哦~
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
          <div class="text-content pb-16" v-if="sysCourseList.length > 0">
            <div class="fs-14 color-brown">归属系列课</div>
            <div
              class="d-flex justify-content-between align-items-center mt-10"
              v-for="(item, index) in sysCourseList"
              :key="index"
              @click="gotoSeriseCourse(item)"
            >
              <div class="fs-14 color-gray van-ellipsis">
                {{ item.courseName }} ——第{{ item.sort }}课时
              </div>
              <div class="d-flex align-items-center">
                <img
                  src="../../../../../assets/images/right.png"
                  style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px;margin-top: -2px;"
                />
              </div>
            </div>
          </div>
          <div
            style="width: 100%;height: 3px;margin-top: -2px;background-color: white;z-index: 10;position: relative;"
          ></div>
        </div>
        <!--      课程推荐-->
        <div
          v-show="recommendList.length > 0"
          class="course-recommend-box"
          id="courseRef"
        >
          <div class="title">
            相关课程
          </div>
          <courseRecommend @list="getListLength" :baseId="id"></courseRecommend>
        </div>
        <div class="course-box" id="LeaveRef" style="padding-bottom: 0">
          <div class="text-content">
            <div class="clearfix">
              <div class="fs-14 color-brown float-left">
                课程评价({{ evaluateTotal }})
              </div>
              <div
                class="float-right fs-13"
                style="color: #969799"
                @click="toEvaluate"
              >
                查看全部
                <img
                  src="../../../../../assets/images/right.png"
                  class="img-right2"
                />
              </div>
            </div>
            <div class="content">
              <div
                v-if="tableList.length != 0"
                class="clearfix pt-16 pb-16 border-b"
              >
                <van-rate
                  class="float-left"
                  v-model="rate"
                  color="#F5A623"
                  readonly
                />
                <span class="float-left ml-16 fs-16" style="color: #F5A623"
                  >{{ yuanRate }}分</span
                >
              </div>
              <div
                class="pt-16 pb-16"
                v-for="(item, index) in tableList"
                :key="index"
                :class="index == 0 ? '' : 'border-t'"
              >
                <div class="clearfix">
                  <div class="float-left">
                    <div class="clearfix fs-14">
                      <span class="float-left" style="color: #323233">{{
                        item.userName
                      }}</span>
                      <van-rate
                        class="float-left ml-16"
                        color="#F5A623"
                        :count="item.grade"
                        size="15px"
                        readonly
                        v-model="item.grade"
                      />
                    </div>
                  </div>
                  <div
                    class="float-right"
                    style="color: #1989FA"
                    :style="{
                      color: item.likeStatus == 0 ? '#1989FA' : '#969799'
                    }"
                    @click="likeClick(item, index)"
                  >
                    <img
                      class="dianzan"
                      v-if="Number(item.likeStatus) === 0"
                      src="@/assets/images/dianzanAct.png"
                      alt=""
                    />
                    <img
                      class="dianzan"
                      v-if="Number(item.likeStatus) === 1"
                      src="@/assets/images/dianzan.png"
                      alt=""
                    />
                    {{ item.likeNum }}
                  </div>
                </div>
                <div style="color: #969799" class="company mt-6 mb-6 fs-12">
                  <div
                    @click.stop="checkTip(index)"
                    style="width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                  >
                    <span :id="gernerateId(index)"
                      >{{ item.companyAbbreviation }}
                      <span
                        v-if="
                          item.companyAbbreviation &&
                            item.departmentAbbreviation
                        "
                        >-</span
                      >
                      {{ item.departmentAbbreviation }}</span
                    >
                  </div>
                  <div v-show="item.isShow && item.iswidth" class="content">
                    {{ item.companyAbbreviation }}
                    <span
                      v-if="
                        item.companyAbbreviation && item.departmentAbbreviation
                      "
                      >-</span
                    >
                    {{ item.departmentAbbreviation }}
                  </div>
                </div>
                <div style="color: #7D7E80" class="mt-6 mb-6 fs-13">
                  {{ item.content }}
                </div>
                <div style="color: #969799" class="fs-12">
                  {{ item.createTime | date1("yyyy-MM-dd") }}
                </div>
              </div>
            </div>
            <div
              v-if="tableList.length == 0"
              class="fs-13 color-brown mt-10 pb-10"
            >
              暂无评价
            </div>
          </div>
        </div>
      </div>
      <div class="layout-block"></div>
      <lecturerPopup ref="lecturerPopup"></lecturerPopup>
      <progressPopup ref="progressPopup"></progressPopup>
      <jobSubmit
        @submit="submitHomeWork"
        @close="closeHomeWork"
        ref="submit"
      ></jobSubmit>
      <course-detail-foot
        v-show="mediaFlag"
        @comments="comments"
        @buttonClick="footButton"
        ref="courseDetailFoot"
      ></course-detail-foot>
    </div>
    <homework-learning
      ref="learning"
      :huihuiNumber="detailObj.huihuiNumber"
      @backDoc="backDoc"
      v-if="!docViewFlag && !isNetwork"
    ></homework-learning>
    <productDetail
      ref="product"
      :productCode="productCode"
      @backPro="backProduct"
      v-if="!productDetailFlag && !isNetwork"
    ></productDetail>
  </div>
</template>
<script src="./recorded-course.js"></script>

<style lang="scss">
.course-description {
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

<style lang="scss" scoped>
.loader {
  display: flex;
  margin-right: 3px;
}

.loader-inner:nth-child(1) {
  -webkit-animation-delay: 0.05s;
  animation-delay: 0.05s;
}

.loader-inner:nth-child(2) {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.loader-inner:nth-child(3) {
  -webkit-animation-delay: 0.15s;
  animation-delay: 0.15s;
}

@keyframes loader {
  50% {
    height: 12px;
  }
}

.loader-inner {
  margin-right: 2px;
  background: linear-gradient(130deg, #17a5ff 0%, #0ae2ff 100%);
  height: 5px;
  margin-left: 2px;
  opacity: 1;
  width: 2px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  /*-webkit-animation: loader 1.1s infinite ease-in-out;*/
  /*-moz-animation: loader 1.1s infinite ease-in-out;*/
  /*-o-animation: loader 1.1s infinite ease-in-out;*/
  animation: loader 1.1s infinite ease-in-out;
}
.material {
  .item {
    padding: 5px 0;
    display: inline-block;
    vertical-align: middle;
    width: 308px !important;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(150, 151, 153, 1);
    .pic {
      margin-right: 11px;
    }
    .introduce {
      width: 64%;
      .title {
        min-height: 35px;
        white-space: normal;
        width: 100%;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #323233;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .line {
        width: 100%;
        white-space: normal;
        padding-top: 6px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #969799;
      }
      .content {
        min-height: 35px;
        white-space: normal;
        width: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
.company {
  position: relative;
  .content {
    /*display: none;*/
    color: white;
    position: absolute;
    background: rgba(50, 50, 51, 0.9);
    box-shadow: 0px 1px 6px 2px rgba(201, 201, 201, 0.48);
    top: 20px;
    left: 0px;
    font-size: 13px;
    padding: 9px 12px;
    border-radius: 5px;
  }
  .content:before {
    content: "";
    color: black;
    position: absolute;
    top: -10px;
    left: 10px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 11px solid rgba(50, 50, 51, 0.9);
  }
}
.content-water-mark {
  pointer-events: none;
  width: 100%;
  position: absolute;
  top: 20px;
  left: 0;
  .mark {
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
.header-cover {
  position: relative;
  width: 100%;
  height: 200px;
  .header-layer {
    position: absolute;
    width: 100%;
    height: 200px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }
  .header-progress {
    position: absolute;
    right: 0;
    bottom: 0px;
    height: 16px;
    line-height: 16px;
    background: #2780f8;
    font-size: 11px;
    color: #ffffff;
    padding: 0px 5px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 3px 0px 0px 0px;
    z-index: 10;
  }
  .header-img {
    width: 14px;
    height: 14px;
    margin-left: 3px;
    z-index: 10;
  }
  .media-cover {
    width: 100%;
  }
  .back-info {
    width: 70px;
    background: #c0c4cc;
  }
  .play-box {
    position: absolute;
    left: 41%;
    top: 64px;
    text-align: center;
    z-index: 10;
    .play-button {
      margin-bottom: 5px;
      width: 60px;
      height: 60px;
    }
  }
}
.course-recommend-box {
  background: #ffffff;
  margin: 10px 0px 10px 15px;
  padding: 15px 0px 0px 10px;
  border-radius: 5px 0px 0px 5px;
  .title {
    padding-left: 10px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #646566;
  }
}
.lai-btn {
  display: inline-block;
  padding: 0 10px;
  height: 24px;
  color: #2780f8;
  font-size: 14px;
  text-align: center;
  line-height: 22px;
  border: 1px solid #2780f8;
  border-radius: 15px;
}
.content {
  background-color: #ffffff;
}
.border-b {
  border-bottom: 1px solid #dcdee0;
}
.border-t {
  border-top: 1px solid #dcdee0;
}
.dianzan {
  width: 18px;
}
.course-box {
  background: #ffffff;
  margin: 10px 15px;
  padding: 15px;
  border-radius: 5px;
  .text-content {
    .title-span {
      font-weight: 700;
      color: #323233;
      font-size: 15px;
    }
    .title-study {
      color: #ffbb00;
      font-size: 12px;
    }
    .color-black {
      color: #323233;
    }
    .color-gray {
      color: #969799;
    }
    .color-brown {
      color: #646566;
    }
    .mt-4 {
      margin-top: 4px;
    }
    .button-height {
      height: 24px;
      line-height: 24px;
    }
    .icon-teacher {
      margin-left: 5px;
      width: 30px;
      height: 15px;
      line-height: 15px;
      border-radius: 3px;
      text-align: center;
      font-size: 11px;
      color: #ffbb00;
      border: 1px solid #ffbb00;
    }
  }
  .border-bottom-solid {
    border-bottom: 1px solid #dcdee0;
  }
}
.img-right {
  width: 14px;
  height: 14px;
  margin-left: 5px;
}
.layout-block {
  height: 44px;
}
.custom-indicator {
  width: 100%;
  position: absolute;
  z-index: 100;
  color: white;
  top: 0;
  left: 0;
  .custom-title {
    width: 80%;
    padding-left: 5px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis; //超出部分以省略号显示
    white-space: nowrap;
  }
  .custom-text {
    width: 18%;
    display: inline-block;
    vertical-align: middle;
    float: right;
    text-align: right;
    padding-right: 10px;
  }
}
.img-right1 {
  width: 14px;
  height: 14px;
  margin-bottom: -3px;
}
.img-right2 {
  width: 14px;
  height: 14px;
  margin-bottom: -2px;
}
.my-swipe {
  width: 100%;
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
.border-yuan {
  border: 1px solid #ffffff !important;
}
.courseware-box {
  padding: 10px 15px;
  background: #ffffff;
  .courseware-top {
    display: flex;
    justify-content: space-between;
    .courseware-span {
      font-size: 14px;
      color: #323233;
    }
    .courseware-title {
      margin-left: 5px;
      padding: 2px 10px;
      background: #fef0ec;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fe6f3b;
      font-size: 11px;
    }
  }
  .courseware-bottom {
    margin-top: 10px;
    display: flex;
    overflow-x: auto;
  }
  .courseware-item {
    position: relative;
    padding: 0 15px;
    margin-right: 10px;
    width: 157px;
    height: 44px;
    line-height: 44px;
    display: flex;
    align-items: center;
    border: 1px solid #ebeef5;
    border-radius: 5px;
    .courseware-item-span {
      width: 100px;
      font-size: 13px;
      color: #323233;
      overflow: hidden;
      text-overflow: ellipsis; //超出部分以省略号显示
      white-space: nowrap;
    }
    .position-type {
      width: 28px;
      height: 15px;
      border-radius: 0px 5px 0px 5px;
      position: absolute;
      top: -1px;
      right: -1px;
    }
  }
  .courseware-all {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .courseware-item {
      width: 345px;
      margin-right: 0px;
      margin-bottom: 10px;
    }
    .courseware-item-span {
      width: 280px;
    }
  }
  .courseware-item-selected {
    border: 1px solid #bde4ff;
  }
  .courseware-progress {
    width: 30px;
    position: absolute;
    top: 0px;
    left: 2px;
  }
}
</style>
