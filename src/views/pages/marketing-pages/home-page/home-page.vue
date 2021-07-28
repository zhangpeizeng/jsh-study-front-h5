<template>
  <div class="home-one-page">
    <div
      v-if="firstEnter === 'true' && guideNum < 4 && screenSize < 2"
      class="guide-pic"
      @click="addGuideNum()"
    >
      <img
        v-show="guideNum === 1"
        src="../../../../assets/images/short-guide-one.png"
        alt=""
      />
      <img
        v-show="guideNum === 2"
        src="../../../../assets/images/short-guide-two.png"
        alt=""
      />
      <img
        v-show="guideNum === 3"
        src="../../../../assets/images/short-guide-three.png"
        alt=""
      />
    </div>
    <div
      v-else-if="firstEnter === 'true' && guideNum < 4 && screenSize > 2"
      class="guide-pic"
      @click="addGuideNum()"
    >
      <img
        v-show="guideNum === 1"
        src="../../../../assets/images/long-guide-one.png"
        alt=""
      />
      <img
        v-show="guideNum === 2"
        src="../../../../assets/images/long-guide-two.png"
        alt=""
      />
      <img
        v-show="guideNum === 3"
        src="../../../../assets/images/long-guide-three.png"
        alt=""
      />
    </div>
    <div v-else>
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh"
        success-text="刷新成功"
      >
        <div style="position: absolute;width: 100%;height: 112px;top: 43px;">
          <img
            style="width: 100%;height: 100%"
            src="../../../../assets/images/rectangle-new.png"
            alt=""
          />
        </div>
        <!--        首页弹出广告-->
        <van-overlay
          v-if="isAdvert"
          style="z-index:9999"
          :show="show"
          @click="closeShow()"
        >
          <div class="wrapper">
            <div class="block-img" @click="toadvertisement">
              <van-image
                v-if="kaiping.advertJumpType !== '5'"
                width="325px"
                height="440px"
                :src="advertUrl | matchImgUrl(800)"
              >
              </van-image>
              <div
                v-if="kaiping.advertJumpType === '5'"
                style="position: relative;"
              >
                <van-image
                  width="300px"
                  height="320px"
                  :src="
                    require('../../../../assets/images/background-home.png')
                  "
                >
                </van-image>
                <div class="block-month">
                  <van-image
                    v-if="kaiping.advertUrl === '1'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-1.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '2'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-2.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '3'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-3.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '4'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-4.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '5'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-5.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '6'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-6.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '7'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-7.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '8'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-8.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '9'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-9.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '10'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-10.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '11'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-11.png')"
                  >
                  </van-image>
                  <van-image
                    v-if="kaiping.advertUrl === '12'"
                    width="72px"
                    height="69px"
                    :src="require('../../../../assets/images/month-12.png')"
                  >
                  </van-image>
                </div>
              </div>
            </div>
            <img
              src="../../../../assets/images/cancel.png"
              class="wrapper-img"
              @click="closeAdvert()"
            />
          </div>
        </van-overlay>
        <!--        头部搜索框-->
        <div class="jsh-header">
          <div class="header">
            <div style="padding-top: 5px" class="left">
              <img
                v-if="studyTerminalCode === '3'"
                @click="goToPersonal"
                style="width: 28px;height: 28px;padding-top: 2px"
                src="../../../../assets/images/new-photo.png"
                alt=""
              />

              <van-icon
                v-else
                @click="backTo()"
                size="5vw"
                color="#999999"
                name="arrow-left"
              />
            </div>
            <van-search
              @click="goSearchList()"
              disabled
              placeholder="请输入搜索关键词"
            />
            <div class="right1" @click="goHonor()">
              <img
                style="width: 22px;height: 22px;padding-top:10px;"
                src="../../../../assets/images/medal.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div style="height: 40px;width: 100%"></div>

        <!--        轮播图-->
        <div
          style="margin: 15px;border-radius: 8px;overflow: hidden;transform: translateY(0);"
        >
          <van-swipe :autoplay="5000">
            <van-swipe-item v-for="(item, index) of bannerlist" :key="index">
              <div @click="bannerGoClassDetail(item)" class="w-100">
                <div class="w-100 swipe-list">
                  <van-image
                    class="swipe-item bg-cover"
                    width=""
                    height=""
                    radius="10"
                    :src="item.advertUrl | matchImgUrl(800)"
                  >
                  </van-image>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
        <!--        分类-->
        <div class="classification">
          <van-swipe :loop="false">
            <van-swipe-item
              v-for="(item, index) of classifyList"
              :key="index"
              style="padding:0px 20px"
            >
              <div class="classification-box d-flex">
                <div
                  v-for="(item1, index1) of item"
                  @click="goClassificationPage(item1)"
                  :key="index1"
                  class="item"
                >
                  <div class="picture"><img :src="item1.picUrl" alt="" /></div>
                  <div>{{ item1.classifyName }}</div>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
        <!--        即将直播-->
        <div
          v-show="
            (liveList && liveList.length > 0) ||
              (preLiveList && preLiveList.length > 0) ||
              (overLiveList && overLiveList.length > 0)
          "
          class="live-broadcast"
        >
          <div class="jsh-conter-bordy-seven" style="position: relative;">
            <div class="w-100">
              <span class="soon-live-title">即将直播</span>
              <span
                class="fs-15 color-999 "
                style="float: right;margin-top: 1px;"
                @click="goLatelyLivePage()"
              >
                <span class="fs-13">全部</span>
                <img
                  src="../../../../assets/images/right.png"
                  style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px"
                />
              </span>
            </div>
            <div id="recordSoon" class="w-100 no-line-to">
              <van-swipe :loop="false">
                <van-swipe-item
                  v-for="(item, index) of preLiveList"
                  :key="index"
                  style="padding:0px 20px"
                >
                  <div
                    class="swipe-loder d-flex align-items-start"
                    v-for="(item1, overindex) of item"
                    :class="{
                      loderBack1: item1.num === 0,
                      loderBack2: item1.num === 1,
                      loderBack3: item1.num === 2,
                      loderBack4: item1.num === 3
                    }"
                    :key="'over' + overindex"
                    @click="goClassDetail(item1, 3)"
                  >
                    <div class="pic">
                      <img
                        v-if="item1.courseImg"
                        style="width: 130px;height: 69px"
                        :src="item1.courseImg | matchImgUrl(300)"
                        alt=""
                      />
                      <img
                        v-if="!item1.courseImg"
                        style="width: 130px;height: 69px"
                        src="../../../../assets/images/backlogo.png"
                        alt=""
                      />
                      <div class="people-num">
                        <img
                          style="width: 13px;height: 12px;margin-right: 6px;vertical-align: middle"
                          src="../../../../assets/images/people-icon2.png"
                          alt=""
                        />
                        <span style="vertical-align: middle">{{
                          item1.studyStudentsNum
                        }}</span>
                      </div>
                      <div
                        v-if="item1.flag === 2"
                        style="background: #c0c4cc"
                        class="live-now"
                      >
                        <!--                                                    <img src="../../../../assets/images/live-now.png" alt="">-->
                        <span>直播结束</span>
                      </div>
                      <div v-if="item1.flag === 1" class="live-now">
                        <img
                          style="margin-left: 5px"
                          src="../../../../assets/images/live-now.png"
                          alt=""
                        />
                        <span style="padding-left: 5px">直播中</span>
                      </div>
                      <div
                        v-if="item1.flag === 3"
                        class="live-down d-flex align-items-center"
                      >
                        <div class="circle"></div>
                        <div class="d-flex align-items-center">
                          <div style="line-height: 14px">即将直播:</div>
                          <van-count-down
                            @finish="reviseSoonStatus(item1.id)"
                            :time="item1.countdown"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="content" style="flex-grow: 1">
                      <div style="min-height: 45px">
                        <div class="p-wrap">
                          <img
                            v-if="item1.courseType === '2'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-live.png"
                            alt=""
                          />
                          <img
                            v-if="item1.courseType === '3'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-discuss.png"
                            alt=""
                          />
                          <img
                            v-if="item1.courseType === '4'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-series.png"
                            alt=""
                          />
                          <span style="vertical-align: middle">{{
                            item1.courseName
                          }}</span>
                        </div>
                      </div>
                      <div
                        class="d-flex align-items-center justify-content-between"
                      >
                        <div></div>
                        <div
                          :style="{
                            background: item1.num === 1 ? '#FF9114' : ''
                          }"
                          @click.stop="nowAppointment(item1)"
                          v-if="item1.status === 1"
                          class="status"
                        >
                          立即预约
                        </div>
                        <div
                          v-if="item.status === 2"
                          style="background:#C0C4CC"
                          class="status"
                        >
                          已预约
                        </div>
                        <div
                          v-if="item.status === 3"
                          style="background:#C0C4CC"
                          class="status"
                        >
                          报名截止
                        </div>
                        <div
                          @click.stop="viewPlay(item1)"
                          v-if="item1.status === 4"
                          class="status"
                          :style="{
                            background: item1.num === 1 ? '#FF9114' : ''
                          }"
                        >
                          观看直播
                        </div>
                        <div
                          :style="{
                            background: item1.num === 1 ? '#FF9114' : ''
                          }"
                          v-if="item1.status === 5"
                          class="status"
                        >
                          直播回放
                        </div>
                        <div
                          @click.stop="signUp(item1)"
                          v-if="item1.status === 6"
                          class="status"
                        >
                          立即报名
                        </div>
                        <div
                          v-if="item1.status === 7"
                          style="background:#C0C4CC"
                          class="status"
                        >
                          已报名
                        </div>
                        <div
                          :style="{
                            background: item1.num === 1 ? '#FF9114' : ''
                          }"
                          v-if="
                            item1.status === 8 &&
                              (item1.courseType === '2' ||
                                item1.courseType === '3')
                          "
                          class="status"
                        >
                          直播回放
                        </div>
                      </div>
                    </div>
                  </div>
                </van-swipe-item>
              </van-swipe>
            </div>
          </div>
        </div>
        <!--        班级列表-->
        <div
          class="class-home-list"
          :class="{ noList: classList.length === 0 }"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div class="class-title">
              <img
                v-show="classList.length === 0"
                src="../../../../assets/images/icon-class.png"
                style="width:16px;height:16px;display: inline-block;vertical-align: middle;padding-left: 3px"
              />
              班级
              <span class="fs-12 fw-400" style="color:#969799"
                >在这里与大家一起成长进阶</span
              >
            </div>
            <div class="class-more" @click="goClassList()">
              <span>全部</span>
              <img
                src="../../../../assets/images/right.png"
                style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px"
              />
            </div>
          </div>
          <classHomeList
            @classList="classListMethod"
            ref="classRef"
          ></classHomeList>
        </div>
        <!--        主题分类-->
        <div
          v-for="(item, index) of topicList"
          class="theme-classification"
          :key="index"
        >
          <div class="pl-16 pr-16">
            <div
              class="jsh-conter-bordy-seven mt-10"
              style="position: relative;"
            >
              <div class="w-100 pb-6">
                <span
                  style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 280px;display: inline-block"
                  class="theme-title"
                >
                  <img
                    style="width:13px;height: 13px "
                    src="@/assets/images/soon-live-icon.png"
                    alt=""
                  />
                  {{ item.classifyName }}</span
                >
                <span
                  class="fs-15 color-999 "
                  style="float: right;margin-top: 1px;"
                  @click="goTopicClassPage(item)"
                >
                  <span class="fs-13">全部</span>
                  <img
                    src="../../../../assets/images/right.png"
                    style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px"
                  />
                </span>
              </div>
              <div
                :id="gernerateId(index)"
                class="d-flex align-items-center justify-content-between"
                style="flex-wrap: wrap"
              >
                <div
                  v-for="(item1, index1) of item.courses"
                  @click="goClassDetail(item1, 2, item)"
                  class="swipe-loder mb-10"
                  :key="index1"
                >
                  <div
                    v-if="item1.leftTopStatusCode === 3"
                    class="live-down d-flex align-items-center"
                  >
                    <div class="circle"></div>
                    <div class="align-items-center d-flex">
                      <div style="line-height: 14px">即将开始:</div>
                      <van-count-down
                        @finish="reviseStatus(item1.id)"
                        :time="item1.countdown"
                      />
                    </div>
                  </div>
                  <div v-if="item1.leftTopStatusCode === 1" class="live-now">
                    <img src="../../../../assets/images/live-now.png" alt="" />
                    <span>直播中</span>
                  </div>
                  <div
                    v-if="item1.leftTopStatusCode === 2"
                    style="background: #c0c4cc !important;"
                    class="live-now"
                  >
                    <span>直播结束</span>
                  </div>
                  <img
                    class="big-img"
                    v-if="item1.courseImg"
                    style="width: 100%;height:90px;border-radius: 6px 6px 0px 0px;"
                    :src="item1.courseImg | matchImgUrl(300)"
                    alt=""
                  />
                  <img
                    class="big-img"
                    v-if="!item1.courseImg"
                    style="width: 100%;height:90px;border-radius: 6px 6px 0px 0px;"
                    src="../../../../assets/images/backlogo.png"
                    alt=""
                  />
                  <div style="min-height: 45px">
                    <div class="p-wrap">
                      <img
                        v-if="item1.courseType === '2'"
                        style="width: 26px;height: 15px;vertical-align:middle;border-radius: 0px !important;"
                        src="@/assets/images/icon-live.png"
                        alt=""
                      />
                      <img
                        v-if="item1.courseType === '3'"
                        style="border-radius: 0px !important;width: 26px;height: 15px;vertical-align: middle;border-radius: 0px"
                        src="@/assets/images/icon-discuss.png"
                        alt=""
                      />
                      <img
                        v-if="item1.courseType === '4'"
                        style="border-radius: 0px !important;width: 26px;height: 15px;vertical-align: middle;border-radius: 0px"
                        src="@/assets/images/icon-series.png"
                        alt=""
                      />
                      <span style="vertical-align: middle">{{
                        item1.courseName
                      }}</span>
                    </div>
                  </div>
                  <div class="people-num">
                    <img
                      style="width: 12px;height: 12px;margin-right: 6px;vertical-align: middle"
                      src="../../../../assets/images/people-icon2.png"
                      alt=""
                    />
                    <span style="vertical-align: middle">{{
                      item1.studyStudentsNum
                    }}</span>
                  </div>

                  <!--                  <div v-if="item1.rightBottomStatusCode === 1" class="status">-->
                  <!--                    立即预约-->
                  <!--                  </div>-->
                  <!--                  <div-->
                  <!--                    v-if="item1.rightBottomStatusCode === 2"-->
                  <!--                    style="background:#C0C4CC"-->
                  <!--                    class="status"-->
                  <!--                  >-->
                  <!--                    已预约-->
                  <!--                  </div>-->
                  <!--                  <div-->
                  <!--                    v-if="item1.rightBottomStatusCode === 3"-->
                  <!--                    style="background:#C0C4CC"-->
                  <!--                    class="status"-->
                  <!--                  >-->
                  <!--                    报名截止-->
                  <!--                  </div>-->
                  <!--                  <div v-if="item1.rightBottomStatusCode === 4" class="status">-->
                  <!--                    观看直播-->
                  <!--                  </div>-->
                  <!--                  <div v-if="item1.rightBottomStatusCode === 5" class="status">-->
                  <!--                    直播回放-->
                  <!--                  </div>-->
                  <!--                  <div v-if="item1.rightBottomStatusCode === 6" class="status">-->
                  <!--                    立即报名-->
                  <!--                  </div>-->
                  <!--                  <div-->
                  <!--                    v-if="item1.rightBottomStatusCode === 7"-->
                  <!--                    style="background:#C0C4CC"-->
                  <!--                    class="status"-->
                  <!--                  >-->
                  <!--                    已报名-->
                  <!--                  </div>-->
                  <!--                  <div-->
                  <!--                    v-if="-->
                  <!--                      item1.rightBottomStatusCode === 8 &&-->
                  <!--                        (item1.courseType === '2' || item1.courseType === '3')-->
                  <!--                    "-->
                  <!--                    class="status"-->
                  <!--                  >-->
                  <!--                    直播回放-->
                  <!--                  </div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--        课程排行-->
        <div
          v-if="hotList.length > 0 || newList.length > 0 || starList.length > 0"
          class="course-ranking"
        >
          <div class="jsh-conter-bordy-seven mt-10" style="position: relative;">
            <div class="w-100 pr-16 pl-16">
              <span class="ranking-title">
                <img
                  style="width:13px;height: 13px "
                  src="@/assets/images/ranking-icon.png"
                  alt=""
                  @click="toDebugPage"
                />
                课程排行</span
              >
            </div>
            <div
              id="rankListSoon"
              class="w-100 no-line-to"
              style="flex-wrap:wrap; flex-direction: column;display:flex; max-height:360px; width: 100%;white-space: nowrap;overflow-x: auto;-webkit-overflow-scrolling:touch;padding-top: 6px;z-index: 1;"
            >
              <div v-if="hotList.length > 0" class="swipe-loder">
                <div
                  class="d-flex align-items-center justify-content-between title"
                >
                  <div>热门排行</div>
                  <div><img src="@/assets/images/hot.png" alt="" /></div>
                </div>
                <div style="height:220px">
                  <div
                    @click="goClassDetail(item, 1)"
                    class="detail d-flex align-items-start justify-content-between"
                    v-for="(item, index) in hotList"
                    :key="index"
                  >
                    <div class="pic d-flex align-items-center">
                      <div class="num">
                        <img
                          v-if="index === 0"
                          src="@/assets/images/one.png"
                          alt=""
                        />
                        <img
                          v-if="index === 1"
                          src="@/assets/images/two.png"
                          alt=""
                        />
                        <img
                          v-if="index === 2"
                          src="@/assets/images/three.png"
                          alt=""
                        />
                      </div>
                      <img v-if="item.courseImg" :src="item.courseImg" alt="" />
                      <img
                        v-if="!item.courseImg"
                        src="../../../../assets/images/backlogo.png"
                        alt=""
                      />
                    </div>
                    <div class="content">
                      <div style="min-height: 35px">
                        <div class="name">
                          <img
                            v-if="item.courseType === '2'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-live.png"
                            alt=""
                          />
                          <img
                            v-if="item.courseType === '3'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-discuss.png"
                            alt=""
                          />
                          <img
                            v-if="item.courseType === '4'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-series.png"
                            alt=""
                          />
                          <span style="vertical-align: middle">{{
                            item.courseName
                          }}</span>
                        </div>
                      </div>
                      <div class="pople-num">
                        <img
                          src="../../../../assets/images/people-icon.png"
                          alt=""
                        />
                        {{ item.studyStudentsNum }}
                      </div>
                    </div>
                  </div>
                </div>
                <div @click="goRankingList('1')" class="look-all">
                  查看全部<img
                    src="../../../../assets/images/right.png"
                    style="width:8px;height:10px;display: inline-block;vertical-align: middle;padding-left: 3px"
                  />
                </div>
              </div>
              <div v-if="newList.length > 0" class="swipe-loder">
                <div
                  class="d-flex align-items-center justify-content-between title"
                >
                  <div>新课排行</div>
                  <div>
                    <img
                      style="width: 34px;height: 12px"
                      src="@/assets/images/new.png"
                      alt=""
                    />
                  </div>
                </div>
                <div style="height:220px">
                  <div
                    @click="goClassDetail(item, 1)"
                    class="detail d-flex align-items-start justify-content-between"
                    v-for="(item, index) in newList"
                    :key="index"
                  >
                    <div class="pic d-flex align-items-center">
                      <div class="num">
                        <img
                          v-if="index === 0"
                          src="@/assets/images/one.png"
                          alt=""
                        />
                        <img
                          v-if="index === 1"
                          src="@/assets/images/two.png"
                          alt=""
                        />
                        <img
                          v-if="index === 2"
                          src="@/assets/images/three.png"
                          alt=""
                        />
                      </div>
                      <img v-if="item.courseImg" :src="item.courseImg" alt="" />
                      <img
                        v-if="!item.courseImg"
                        src="../../../../assets/images/backlogo.png"
                        alt=""
                      />
                    </div>
                    <div class="content">
                      <div style="min-height: 35px">
                        <div class="name">
                          <img
                            v-if="item.courseType === '2'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-live.png"
                            alt=""
                          />
                          <img
                            v-if="item.courseType === '3'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-discuss.png"
                            alt=""
                          />
                          <img
                            v-if="item.courseType === '4'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-series.png"
                            alt=""
                          />
                          <span style="vertical-align: middle">{{
                            item.courseName
                          }}</span>
                        </div>
                      </div>
                      <div class="pople-num">
                        <img
                          src="../../../../assets/images/people-icon.png"
                          alt=""
                        />
                        {{ item.studyStudentsNum }}
                      </div>
                    </div>
                  </div>
                </div>
                <div @click="goRankingList('2')" class="look-all">
                  查看全部<img
                    src="../../../../assets/images/right.png"
                    style="width:8px;height:10px;display: inline-block;vertical-align: middle;padding-left: 3px"
                  />
                </div>
              </div>
              <div v-if="starList.length > 0" class="swipe-loder">
                <div
                  class="d-flex align-items-center justify-content-between title"
                >
                  <div>五星课程</div>
                  <div>
                    <img
                      style="width: 15px;height: 15px"
                      src="@/assets/images/star.png"
                      alt=""
                    />
                  </div>
                </div>
                <div style="height:220px">
                  <div
                    @click="goClassDetail(item, 1)"
                    class="detail d-flex align-items-start justify-content-between"
                    v-for="(item, index) in starList"
                    :key="index"
                  >
                    <div class="pic d-flex align-items-center">
                      <div class="num">
                        <img
                          v-if="index === 0"
                          src="@/assets/images/one.png"
                          alt=""
                        />
                        <img
                          v-if="index === 1"
                          src="@/assets/images/two.png"
                          alt=""
                        />
                        <img
                          v-if="index === 2"
                          src="@/assets/images/three.png"
                          alt=""
                        />
                      </div>
                      <img v-if="item.courseImg" :src="item.courseImg" alt="" />
                      <img
                        v-if="!item.courseImg"
                        src="../../../../assets/images/backlogo.png"
                        alt=""
                      />
                    </div>
                    <div class="content">
                      <div style="min-height: 35px">
                        <div class="name">
                          <img
                            v-if="item.courseType === '2'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-live.png"
                            alt=""
                          />
                          <img
                            v-if="item.courseType === '3'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-discuss.png"
                            alt=""
                          />
                          <img
                            v-if="item.courseType === '4'"
                            style="width: 26px;height: 15px;vertical-align: middle"
                            src="@/assets/images/icon-series.png"
                            alt=""
                          />
                          <span style="vertical-align: middle">{{
                            item.courseName
                          }}</span>
                        </div>
                      </div>
                      <div class="pople-num">
                        <img
                          src="../../../../assets/images/people-icon.png"
                          alt=""
                        />
                        {{ item.studyStudentsNum }}
                      </div>
                    </div>
                  </div>
                </div>
                <div @click="goRankingList('3')" class="look-all">
                  查看全部<img
                    src="../../../../assets/images/right.png"
                    style="width:8px;height:10px;display: inline-block;vertical-align: middle;padding-left: 3px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="height:80px" id="viewbottom"></div>
      </van-pull-refresh>
      <img src="../../../../assets/images/network.png" style="display: none" />
      <!--        直播提示框-->
      <div v-show="isNav" style="position: fixed;bottom: 10%;left: 15px;">
        <liveFrame ref="childLive" v-show="this.GLOBAL.liveFrame"></liveFrame>
      </div>
      <Tabbar type="1"></Tabbar>
      <!--      跳转到运营中台的可拖拽悬浮框  暂时注释掉第二周不上了-->
      <div
        v-if="studyTerminalCode === '1' || studyTerminalCode === '3'"
        @touchstart.stop="touchstartHandle('dragBox', $event)"
        @touchmove.stop="touchmoveHandle('dragBox', $event)"
        class="operation-center"
        ref="dragBox"
      >
        <img
          @click.prevent="toMgCenter()"
          style="width: 90%;height: 90%;"
          src="../../../../assets/images/mg-center.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import liveFrame from "../../../../components/live-frame/live-frame.vue";
import classHomeList from "@/components/class-massage/class-home-list/class-home-list";
import Tabbar from "../../../../components/tabbar/tabbar.vue";
import {
  Field,
  CellGroup,
  Swipe,
  SwipeItem,
  Search,
  Toast,
  CountDown,
  PullRefresh,
  Dialog
} from "vant";
import { CloudMarketing } from "@/request";
import JSH from "@/core";

Vue.use(Field);
Vue.use(CellGroup);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Search);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(PullRefresh);
export default {
  name: "home-page",
  components: {
    liveFrame,
    Tabbar,
    classHomeList
  },
  data() {
    return {
      debugTimer: null,
      debugCount: 15,
      isMgCenter: true, //跳转到运营中台的防重复点击
      againTrigger: false, //按钮防重复点击
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
      windowHeight: document.documentElement.clientHeight, //实时屏幕高度
      screenSize: 1.8, //屏幕比例
      //是否是第一次进入
      firstEnter: "true",
      //引导图
      guideNum: 1,
      //下拉刷新
      isLoading: true,
      //悬浮框是否展示
      i: null,
      haha: null,
      //首页弹框广告
      show: true,
      //悬浮展示
      isNav: true,
      // 广告图片地址
      advertUrl: "",
      // 弹出广告id
      advertId: "",
      // 是否展示广告
      isAdvert: "",
      //轮播背景图
      bannerlist: [],
      //分类list
      classifyList: [],
      // 直播中的列表
      liveList: [],
      //即将直播的列表
      preLiveList: [],
      //已结束列表
      overLiveList: [],
      //主题分类列表
      topicList: [],
      //记录主题分类列表得位置
      recordTopicList: [],
      //记录即将直播列表位置
      recordSoon: 0,
      //记录课程排行的位置
      rankListSoon: 0,
      kaiping: "",
      //终端
      studyTerminalCode: "1",
      coordinate: {
        client: {},
        elePosition: {}
      },
      hotList: [], //热门排行
      newList: [], //新课排行
      starList: [], //五星排行
      classList: [] //班级列表
    };
  },
  mounted() {},
  activated() {
    if (document.getElementById("rankListSoon")) {
      document.getElementById("rankListSoon").scrollLeft = this.rankListSoon;
    }
    this.isNav = true;
    //上滑，下滑的监听
    window.addEventListener("scroll", this.handleScroll, true);
    this.obtainBannerList();
    this.classificationList();
    this.topicClassList();
    this.listAppLiveCourse();
    this.advertisement();
    this.rankingList(1);
    this.rankingList(2);
    this.rankingList(3);
    this.$refs.classRef.getClassList();
    this.$forceUpdate();
  },
  created() {
    this.studyTerminalCode = this.$route.query.studyTerminalCode;
    this.firstEnter = this.$route.query.firstEnter;
    this.screenSize = this.windowHeight / this.windowWidth;
    localStorage.setItem("studyTerminalCode", Number(this.studyTerminalCode));
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    toDebugPage() {
      if (process.env.VUE_APP_SERVER_SUFFIX === "") return;
      this.debugCount--;
      if (this.debugCount <= 0) {
        this.$router.push("/demo");
      }
      clearTimeout(this.debugTimer);
      this.debugTimer = setTimeout(() => {
        this.debugCount = 15;
      }, 500);
    },
    touchstartHandle(refName, e) {
      let element = e.targetTouches[0];
      // 记录点击的坐标
      this.coordinate.client = {
        x: element.clientX,
        y: element.clientY
      };
      // 记录需要移动的元素坐标
      this.coordinate.elePosition.left = this.$refs[refName].offsetLeft;
      this.coordinate.elePosition.top = this.$refs[refName].offsetTop;
    },
    touchmoveHandle(refName, e) {
      e.preventDefault();
      let element = e.targetTouches[0];
      // 根据初始 client 位置计算移动距离(元素移动位置=元素初始位置+光标移动后的位置-光标点击时的初始位置)
      let x =
        this.coordinate.elePosition.left +
        (element.clientX - this.coordinate.client.x);
      let y =
        this.coordinate.elePosition.top +
        (element.clientY - this.coordinate.client.y);
      // 限制可移动距离，不超出可视区域
      x =
        x <= 0
          ? 0
          : x >= innerWidth - this.$refs[refName].offsetWidth
          ? innerWidth - this.$refs[refName].offsetWidth
          : x;
      y =
        y <= 0
          ? 0
          : y >= innerHeight - this.$refs[refName].offsetHeight
          ? innerHeight - this.$refs[refName].offsetHeight
          : y;
      // 移动当前元素
      this.$refs[refName].style.left = x + "px";
      this.$refs[refName].style.top = y + "px";
    },
    /**
     * 跳转到运营中台
     */
    toMgCenter() {
      let owner = this;
      if (!owner.isMgCenter) {
        return;
      }
      owner.isMgCenter = false;
      let prems = "";
      // 获取一级分类接口
      JSH.request({
        url: CloudMarketing.getAuthTokenTicketToOp,
        method: "get",
        params: {},
        success(data) {
          if (data.success) {
            if (data.data) {
              owner.isMgCenter = true;
              if (
                CloudMarketing.getAuthTokenTicketToOp ===
                "/jsh-study-service-marketing-dev/api/page/op/get-auth-token-ticket-to-op"
              ) {
                prems = "https://mg-op.ylhtest.com/h5/index?aid=" + data.data;
              } else if (
                CloudMarketing.getAuthTokenTicketToOp ===
                "/jsh-study-service-marketing-pre/api/page/op/get-auth-token-ticket-to-op"
              ) {
                prems = "https://mg-op-pre.jsh.com/h5/index?aid=" + data.data;
              } else {
                prems = "https://mg-op.jsh.com/h5/index?aid=" + data.data;
              }
              //安卓调用方式  nativeRoute是具体的方法名,
              if (window.collegeNative) {
                window.collegeNative.gotoMgOp(prems);
              }
              //ios调用方式  nativeRoute是具体的方法名,
              if (window.webkit && window.webkit.messageHandlers) {
                window.webkit.messageHandlers.gotoMgOp.postMessage(prems);
              }
            }
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    /**
     * 切换引导页面
     */
    addGuideNum() {
      this.guideNum++;
      if (this.guideNum == 4) {
        //安卓调用方式
        if (window.collegeNative) {
          window.collegeNative.changeGuideStatus();
        }
        //ios调用方式  nativeRoute是具体的方法名,
        if (window.webkit && window.webkit.messageHandlers) {
          window.webkit.messageHandlers.changeGuideStatus.postMessage("");
        }
      }
      this.$forceUpdate();
    },
    gernerateId: function(index) {
      return "person_" + index;
    },
    toadvertisement() {
      const owner = this;
      // gio统计--弹出广告-点击次数
      setTimeout(() => {
        window.gio("track", "ad_click_count", {
          ad_status: owner.kaiping.status, // 广告状态
          client_platform: owner.studyTerminalCode, // 所属学习终端
          ad_name: owner.advertName, // 广告名称
          ad_id: owner.advertId // 广告ID
        });
      }, 50);
      this.advertDaily();
      // 去广告详情页
      this.recordStatus();
      if (
        owner.kaiping.advertJumpType === "2" ||
        owner.kaiping.advertJumpType === "3"
      ) {
        JSH.request({
          url: CloudMarketing.bannerTu,
          method: "post",
          params: {
            type: owner.kaiping.advertJumpType,
            advertJumpAddress: owner.kaiping.advertJumpAddress
          },
          success(data) {
            if (data.success) {
              if (data.data.throwStatus == "2") {
                if (data.data.deleteFlag == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
                // 已下架
                if (data.data.status == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
                if (data.data.studyStartStatus == "2") {
                  owner.$toast("学习未开始");
                  return;
                }
                if (data.data.studyEndStatus == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
              } else if (data.data.throwStatus == "1") {
                // return ;
                if (owner.kaiping.advertJumpType === "2") {
                  if (owner.kaiping.courseType === "1") {
                    owner.$router.push({
                      path: "/public/recorded-course",
                      query: {
                        courseType: owner.kaiping.courseType,
                        id: owner.kaiping.advertJumpAddress
                      }
                    });
                  } else if (owner.kaiping.courseType === "2") {
                    owner.$router.push({
                      path: "/public/live-course",
                      query: {
                        courseType: owner.kaiping.courseType,
                        id: owner.kaiping.advertJumpAddress
                      }
                    });
                  } else if (owner.kaiping.courseType === "3") {
                    owner.$router.push({
                      path: "/public/discussion-course",
                      query: {
                        courseType: owner.kaiping.courseType,
                        id: owner.kaiping.advertJumpAddress
                      }
                    });
                  } else if (owner.kaiping.courseType === "4") {
                    owner.$router.push({
                      path: "/public/series-course",
                      query: {
                        courseType: owner.kaiping.courseType,
                        id: owner.kaiping.advertJumpAddress
                      }
                    });
                  }
                } else if (owner.kaiping.advertJumpType === "3") {
                  owner.$router.push({
                    path: "/public/theme-classification-list",
                    query: {
                      id: owner.kaiping.advertJumpAddress,
                      title: owner.kaiping.themeName
                    }
                  });
                }
              }
            } else {
              Toast(data.errorMsg);
            }
          },
          error(e) {
            console.log(e);
          }
        });
      } else if (owner.kaiping.advertJumpType === "1") {
        return;
      } else if (owner.kaiping.advertJumpType == "4") {
        owner.$router.push({
          path: "/public/advertisement",
          query: {
            title: owner.kaiping.advertName,
            content: owner.kaiping.content
          }
        });
      } else if (owner.kaiping.advertJumpType == "5") {
        // 跳转学习报告
        owner.$router.push({
          path: "/public/study-report",
          query: {
            id: 2
          }
        });
      }
    },
    backTo() {
      //安卓调用方式  nativeRoute是具体的方法名,
      if (window.collegeNative) {
        window.collegeNative.backToNative();
      }
      //ios调用方式  nativeRoute是具体的方法名,
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.backToNative.postMessage("");
      }
    },
    /**
     * 跳转到个人信息页面
     */
    goToPersonal() {
      this.$router.push("/public/personal-data");
    },

    /**
     * 跳转到班级列表
     */
    goClassList() {
      this.$router.push("/public/class-list");
    },
    classListMethod(data) {
      this.classList = data;
    },
    /**
     * 下拉刷新
     */

    onRefresh() {
      setTimeout(() => {
        // Toast('刷新成功');
        this.obtainBannerList();
        this.classificationList();
        this.topicClassList();
        this.listAppLiveCourse();
        this.rankingList(1);
        this.rankingList(2);
        this.rankingList(3);
        this.$refs.childLive.getLiveFrame();
      }, 500);
      this.$refs.classRef.getClassList();
    },
    /**
     *
     * 修改列表标签的状态
     */
    reviseStatus(id) {
      const _that = this;
      _that.topicList.forEach(item => {
        item.courses.forEach(item1 => {
          if (item1.id === id) {
            item1.leftTopStatusCode = 1;
          }
        });
      });
    },
    reviseSoonStatus(id) {
      const _that = this;
      _that.preLiveList.forEach(item => {
        item.forEach(item1 => {
          if (item1.id === id) {
            item1.flag = 1;
          }
        });
      });
      _that.$forceUpdate();
    },
    /**
     * 监听上滑下滑
     */
    handleScroll() {
      // 页面滚动距顶部距离
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // let scrollTop = document
      //   .getElementById("viewbottom")
      //   .getBoundingClientRect().top;
      let scroll = scrollTop - this.i;
      this.haha = scroll;
      if (scroll > 10) {
        this.i = scrollTop;
        this.isNav = false;
      } else if (scroll < -10) {
        this.i = scrollTop;
        this.isNav = true;
      }
    },
    /**
     * 开屏广告
     */
    advertisement() {
      const _that = this;
      // 获取一级分类接口
      JSH.request({
        url: CloudMarketing.getHomePageWindow,
        method: "post",
        params: {},
        success(data) {
          if (data.success) {
            if (data.data) {
              _that.isAdvert = "true";
              _that.advertId = data.data.id;
              _that.advertUrl = data.data.advertUrl;
              _that.advertName = data.data.advertName;
              _that.kaiping = data.data;
              // gio统计--弹窗广告-弹出次数
              setTimeout(() => {
                window.gio("track", "ad_show_count", {
                  ad_status: _that.kaiping.status, // 广告状态
                  client_platform: _that.studyTerminalCode, // 所属学习终端
                  ad_name: _that.advertName, // 广告名称
                  ad_id: _that.advertId // 广告ID
                });
              }, 50);
            } else {
              _that.isAdvert = "";
            }
            this.storage();
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    /**
     * 开屏广告不展示
     */
    closeShow() {
      // 点击灰色区域不关闭弹窗广告
      // sessionStorage.setItem("advert", "true");
      // setTimeout(() => {
      //   this.storage();
      // }, 200);
    },
    closeAdvert() {
      this.show = false;
      this.advertDaily();
    },
    /**
     * 首页-弹窗广告日志新增
     */
    advertDaily() {
      const _that = this;
      // 获取一级分类接口
      JSH.request({
        url: CloudMarketing.saveHomePageWindowLog,
        method: "post",
        params: { advertId: _that.advertId },
        success(data) {
          if (data.success) {
            console.log(data);
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    storage() {
      let advert = sessionStorage.getItem("advert") || "";
      if (advert) {
        this.isAdvert = "";
      } else {
        this.isAdvert = "true";
      }
    },
    /**
     * 把一个数组按照一定长度分割成若干数组
     * @param array
     * @param subGroupLength
     * @returns {[]}
     */
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    /**
     * 获取分类列表
     * @type {number[]}
     */
    classificationList() {
      const _that = this;
      // 获取一级分类接口
      JSH.request({
        url: CloudMarketing.listClassClassifyNodesOneLevel,
        method: "get",
        params: {},
        success(data) {
          if (data.success) {
            _that.classifyList = data.data;
            _that.classifyList = _that.group(_that.classifyList, 10);
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    /**
     * 跳转搜索列表
     */
    goSearchList() {
      this.recordStatus();
      this.$router.push("/public/search-list");
    },
    /**
     * 跳转荣誉页面
     */
    goHonor() {
      this.recordStatus();
      this.$router.push("/public/honor");
    },
    /**
     * 获取banner轮播图列表
     */
    obtainBannerList() {
      const _that = this;
      // 获取一级分类接口
      JSH.request({
        url: CloudMarketing.listHomePageBanner,
        method: "post",
        params: {},
        success(data) {
          if (data.success) {
            _that.bannerlist = data.data;
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    /**
     * 跳转到课程分类页面
     */
    goClassificationPage(item) {
      const owner = this;
      owner.recordStatus();
      // gio统计--一级课程分类点击次数
      setTimeout(() => {
        window.gio("track", "course_category_click_time", {
          course_category: item.classifyName, // 一级分类名称
          client_platform: owner.studyTerminalCode // 所属学习终端
        });
      }, 50);
      owner.$router.push({
        path: "/public/organ-home",
        query: {
          classifyName: item.classifyName,
          id: item.id,
          classifyId: item.classifyId
        }
      });
    },
    /**
     * 跳转到最近直播页面
     */
    goLatelyLivePage() {
      this.recordStatus();
      this.$router.push("/public/recentline");
    },
    /**
     * 获取即将直播列表
     */
    listAppLiveCourse() {
      const _that = this;
      // this.$loading.show(9000);
      // Toast.loading({
      //   message: "加载中...",
      //   forbidClick: true,
      //   duration: 0
      // });
      _that.ht.$emit("loading", true);
      // 获取直播列表接口
      JSH.request({
        url: CloudMarketing.listAppLiveCourseIndex,
        method: "get",
        params: {},
        success(data) {
          if (data.success) {
            // _that.$loading.hide();
            _that.ht.$emit("loading", false);
            _that.isLoading = false;
            _that.liveList = data.data.liveList;
            _that.preLiveList = data.data.preLiveList;
            _that.overLiveList = data.data.overLiveList;
            _that.preLiveList.forEach((item, index) => {
              // item.flag = 1;
              item.num = index;
            });
            _that.preLiveList = _that.group(_that.preLiveList, 2);
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          Toast.clear();
          console.log(e);
        }
      });
    },
    /**
     * 跳转到课程详情页面
     */
    goClassDetail(item, type, themeItem) {
      this.recordStatus();
      const owner = this;
      if (type === 2) {
        // gio统计--首页运营主题课程数量
        setTimeout(() => {
          window.gio("track", "op_theme_course_count", {
            course_name: item.courseName, // 课程名称
            subject_name: themeItem.classifyName, // 运营主题名称
            ad_status: 1, // 1生效
            client_platform: owner.studyTerminalCode // 所属学习终端
          });
        }, 50);
        // gio统计--首页运营主题课程点击次数
        setTimeout(() => {
          window.gio("track", "op_theme_course_click", {
            course_name: item.courseName, // 课程名称
            subject_name: themeItem.classifyName, // 运营主题名称
            ad_status: 1, // 1生效
            client_platform: owner.studyTerminalCode // 所属学习终端
          });
        }, 50);
      }

      if (item.studyStartTime !== null && item.studyStartTime !== "") {
        //    有值判断 在前 还是在后
        const now = Date.parse(new Date());
        const start = item.studyStartTime;
        const end = item.studyEndTime;
        if (now < start) {
          owner.$toast("学习未开始");
          return;
        }
        if (now > end) {
          owner.$toast(
            "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
          );
          return;
        }
        // const startTime = value.studyStartTime
      }
      //路由地址需要之后再改
      if (item.courseType === "1") {
        this.$router.push({
          path: "/public/recorded-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      } else if (item.courseType === "2") {
        this.$router.push({
          path: "/public/live-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      } else if (item.courseType === "3") {
        this.$router.push({
          path: "/public/discussion-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      } else if (item.courseType === "4") {
        this.$router.push({
          path: "/public/series-course",
          query: {
            courseType: item.courseType,
            id: item.id
          }
        });
      }
    },
    /**
     * 记录页面位置
     */
    recordStatus() {
      if (document.getElementById("rankListSoon")) {
        this.rankListSoon = document.getElementById("rankListSoon").scrollLeft;
      }
    },
    /**
     * bannner跳转到课程详情页面
     */
    bannerGoClassDetail(item) {
      this.recordStatus();
      const owner = this;
      // gio统计--首页Banner点击次数
      setTimeout(() => {
        window.gio("track", "banner_home_click_count", {
          ad_status: item.status, // 广告状态
          client_platform: owner.studyTerminalCode, // 所属学习终端
          ad_name: item.advertName, // 广告名称
          ad_id: item.id // bannerID
        });
      }, 50);
      if (item.advertJumpType === "2" || item.advertJumpType === "3") {
        JSH.request({
          url: CloudMarketing.bannerTu,
          method: "post",
          params: {
            type: item.advertJumpType,
            advertJumpAddress: item.advertJumpAddress
          },
          success(data) {
            if (data.success) {
              if (data.data.throwStatus == "2") {
                if (data.data.deleteFlag == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
                // 已下架
                if (data.data.status == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
                if (data.data.studyStartStatus == "2") {
                  owner.$toast("学习未开始");
                  return;
                }
                if (data.data.studyEndStatus == "2") {
                  owner.$toast(
                    "哎哟，已错过课程学习时间，下次早点来呀，你可以先学习其他课程"
                  );
                  return;
                }
              } else if (data.data.throwStatus == "1") {
                // return ;
                if (item.advertJumpType == "2") {
                  if (item.courseType === "1") {
                    owner.$router.push({
                      path: "/public/recorded-course",
                      query: {
                        courseType: item.courseType,
                        id: item.advertJumpAddress
                      }
                    });
                  } else if (item.courseType === "2") {
                    owner.$router.push({
                      path: "/public/live-course",
                      query: {
                        courseType: item.courseType,
                        id: item.advertJumpAddress
                      }
                    });
                  } else if (item.courseType === "3") {
                    owner.$router.push({
                      path: "/public/discussion-course",
                      query: {
                        courseType: item.courseType,
                        id: item.advertJumpAddress
                      }
                    });
                  } else if (item.courseType === "4") {
                    owner.$router.push({
                      path: "/public/series-course",
                      query: {
                        courseType: item.courseType,
                        id: item.advertJumpAddress
                      }
                    });
                  }
                } else if (item.advertJumpType == "3") {
                  owner.$router.push({
                    path: "/public/theme-classification-list",
                    query: {
                      id: item.advertJumpAddress,
                      title: item.themeName
                    }
                  });
                }
              }
            } else {
              Toast(data.errorMsg);
            }
          },
          error(e) {
            console.log(e);
          }
        });
      } else if (item.advertJumpType === "1") {
        return;
      } else if (item.advertJumpType == "4") {
        owner.$router.push({
          path: "/public/advertisement",
          query: {
            title: item.advertName,
            content: item.content
          }
        });
      }
    },
    /**
     * 获取主题分类列表
     */
    topicClassList() {
      const _that = this;
      // 获取主题分类列表接口
      JSH.request({
        url: CloudMarketing.listThemeCourse,
        method: "post",
        params: {},
        success(data) {
          if (data.success) {
            _that.topicList = data.data.list;
            //去掉没有课程的主题分类
            for (let i = _that.topicList.length - 1; i >= 0; i--) {
              if (
                _that.topicList[i].courses === null ||
                _that.topicList[i].courses.length === 0
              ) {
                _that.topicList.splice(i, 1);
              }
            }
            _that.$forceUpdate();
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    /**
     * 跳转到主题分类页面
     */
    goTopicClassPage(item) {
      this.recordStatus();
      this.$router.push({
        path: "/public/theme-classification-list",
        query: {
          id: item.id,
          title: item.classifyName
        }
      });
    },
    /**
     * 获取课程排行列表列表
     */
    rankingList(type) {
      const owner = this;
      const params = {
        searchType: type,
        pageSize: 3,
        pageNum: 1
      };
      // 获取主题分类列表接口
      JSH.request({
        url: CloudMarketing.listCourseRankingList,
        method: "post",
        params,
        success(data) {
          if (data.success) {
            if (type === 1) {
              owner.hotList = data.data.list;
            } else if (type === 2) {
              owner.newList = data.data.list;
            } else if (type === 3) {
              owner.starList = data.data.list;
            }
            owner.$forceUpdate();
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    /**
     * 跳转到排行列表
     */
    goRankingList(type) {
      let title = "";
      if (type === "1") {
        title = "热门排行";
      } else if (type === "2") {
        title = "新课排行";
      } else if (type === "3") {
        title = "五星课程";
      }
      this.recordStatus();
      this.$router.push({
        path: "/public/ranking-list",
        query: {
          type: type,
          title: title
        }
      });
    },
    /**
     * 立即预约
     */
    nowAppointment(item) {
      const owner = this;
      Dialog.confirm({
        title: "确定预约提醒此课程",
        message: "本课程将于开课前2小时短信提醒"
      })
        .then(() => {
          owner.goStudy(3, item.id);
        })
        .catch(() => {});
    },
    /**
     * 加入学习
     */
    addStudy(item) {
      const owner = this;
      if (owner.againTrigger) {
        return;
      }
      owner.againTrigger = true;
      owner.goStudy(1, item.id);
    },
    /**
     * 报名
     */
    signUp(item) {
      const owner = this;
      if (owner.againTrigger) {
        return;
      }
      owner.againTrigger = true;
      if (item.courseType === "2" || item.courseType === "3") {
        Dialog.confirm({
          title: "确定立即报名",
          message: "本课程将于开课前2小时短信提醒"
        })
          .then(() => {
            owner.goStudy(2, item.id);
          })
          .catch(() => {});
      } else {
        owner.goStudy(2, item.id);
      }
    },
    /**
     * 加入学习/报名/预约接口
     */
    goStudy(type, id) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.toStudy,
        method: "post",
        params: { type: type, baseId: id },
        success(res) {
          if (res.success) {
            if (type == 1) {
              Toast("已加入到任务-【待学习】");
            } else if (type == 2) {
              Toast("报名成功");
            } else if (type == 3) {
              Toast("预约成功");
            }
            //局部刷新
            owner.localRefresh(id);
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    /**
     * 局部刷新
     */
    localRefresh(id) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.partialRefresh,
        method: "get",
        params: {
          baseId: id
        },
        success(data) {
          if (data.success) {
            owner.againTrigger = false;
            if (owner.preLiveList.length > 0) {
              owner.preLiveList.forEach(item => {
                item.forEach(item1 => {
                  if (item1.id == data.data.id) {
                    item1.status = data.data.status;
                    item1.flag = data.data.leftStatusCode;
                    item1.countdown = data.data.countdown;
                  }
                });
              });
            }
            if (owner.topicList.length > 0) {
              owner.topicList.forEach(item => {
                item.courses.forEach(item1 => {
                  if (item1.id == data.data.id) {
                    item1.rightBottomStatusCode = data.data.status;
                    item1.leftTopStatusCode = data.data.leftStatusCode;
                    item1.countdown = data.data.countdown;
                  }
                });
              });
            }
          } else {
            owner.$toast(data.errorMsg);
          }
        },
        error() {}
      });
    },
    /**
     * 观看直播
     * 跳原生直播
     */
    viewPlay(item) {
      const owner = this;
      if (owner.againTrigger) {
        return;
      }
      owner.againTrigger = true;
      if (item.courseLiveType === "APP") {
        let key = this.$md5(localStorage.getItem("accountId") + item.anthCode);
        let liveUrl =
          "http://mudu.tv/activity.php?id=" +
          item.vhallLiveId +
          "&userid=" +
          localStorage.getItem("accountId") +
          "&name=" +
          localStorage.getItem("accountName") +
          "&expire=36000000" +
          "&a=userAssign" +
          "&key=" +
          key;
        //安卓调用方式  nativeRoute是具体的方法名,
        if (window.collegeNative) {
          window.collegeNative.loadMuduLive(
            liveUrl,
            item.vhallLiveId,
            item.id,
            ""
          );
        }
        //ios调用方式  nativeRoute是具体的方法名,
        if (window.webkit && window.webkit.messageHandlers) {
          let params = {
            baseId: item.id,
            sourceId: "",
            eduId: item.vhallLiveId,
            url: liveUrl
          };
          window.webkit.messageHandlers.loadMuduLive.postMessage(
            JSON.stringify(params)
          );
        }
        setTimeout(() => {
          owner.againTrigger = false;
        }, 1500);
      } else {
        //先获取原生的获取口令
        JSH.request({
          url: CloudMarketing.getvhallCode,
          method: "get",
          params: { classId: item.vhallLiveId },
          success(res) {
            if (res.success) {
              owner.vhallObj = res.data;
              let prems = {
                param: {
                  baseId: item.id,
                  sourceId: "",
                  eduId: item.vhallLiveId,
                  invitationCode: owner.vhallObj.student_pwd,
                  lecturerId: item.lecturerId.toString(),
                  lecturerName: item.lecturerName
                },
                routePath: "com.jsh.marketingcollege.ui.VhLiveClassActivity"
              };
              //安卓调用方式  nativeRoute是具体的方法名,
              if (window.collegeNative) {
                window.collegeNative.nativeRoute(JSON.stringify(prems));
              }
              //ios调用方式  nativeRoute是具体的方法名,
              if (window.webkit && window.webkit.messageHandlers) {
                window.webkit.messageHandlers.nativeRoute.postMessage(
                  JSON.stringify(prems)
                );
              }
              setTimeout(() => {
                owner.againTrigger = false;
              }, 1500);
            } else {
              Toast(res.errorMsg);
            }
          },
          error() {
            Toast("接口异常");
          }
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.operation-center {
  width: 90px;
  height: 90px;
  border-radius: 75px;
  position: fixed;
  bottom: 150px;
  right: 0;
  img {
    text-align: left;
  }
  z-index: 1001;
}
.guide-pic {
  height: 100%;
  img {
    height: 100%;
    width: 100%;
  }
}
.van-overlay {
  z-index: 9999 !important;
}

.p-wrap {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  text-overflow: ellipsis;
  font-weight: 400;
  white-space: pre-wrap;
  margin-left: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 281px;
  height: 308px;
  background-color: #fff;
  padding: 24px;
  border-radius: 4px;

  .block-img {
    float: left;
    width: 120px;
    height: 140px;
    margin-right: 15px;
  }
}

.wrapper-img {
  margin-top: 15px;
  width: 40px;
  height: 40px;
}
.block-month {
  position: absolute;
  top: 75px;
  left: 75px;
}

.jsh-header {
  background-color: #ffffff;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100% !important;

  .header {
    display: flex;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;
    font-size: 17px;
    position: relative;

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      width: 270px;
      height: 44px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .van-search {
      width: 90%;
    }

    .van-search__content {
      border-radius: 30px;
    }

    .primary {
      background: #1bb5f1;
      color: #fff;
      border: 0;
    }

    .danger {
      background: #ef4f4f;
      color: #fff;
      border: 0;
    }

    .left {
      padding: 0 8px 0 15px;
      font-size: 14px;
      color: #333;
    }

    .right {
      padding: 0 15px 0 8px;
      font-size: 14px;
      color: #666666;
    }

    .right1 {
      padding: 0 15px 0 8px;
      font-size: 14px;
      color: #666666;
    }
  }
}

.swipe-list {
  text-align: center;

  .swipe-item {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    height: 160px;
    border-radius: 8px !important;
  }
}

.van-swipe__indicator {
  background-color: #bbbbbb;
}

.van-swipe__indicator--active {
  width: 2.66667vw;
  height: 1.33333vw;
  border-radius: 0.8vw;
  opacity: 1;
  background-color: white;
}

.classification {
  .van-swipe {
    padding-bottom: 30px;
  }

  .van-swipe__indicator--active {
    background-color: #227ef7;
  }

  .van-swipe__indicators {
    bottom: 6px;
  }

  text-align: center;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(50, 50, 51, 1);

  img {
    width: 33px;
    height: 33px;
    border-radius: 44px;
    padding-bottom: 5px;
  }

  .classification-box {
    flex-wrap: wrap;
    padding: 0 10px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;

    .item {
      padding-top: 15px;
      width: 20%;

      .picture {
        /*height: 44px;*/
        /*width: 44px;*/
        /*background: indianred;*/
        /*border-radius: 50px;*/
      }

      img {
        border-radius: 50px;
        width: 45px;
        height: 45px;
      }
    }
  }
}

.live-broadcast {
  border-radius: 10px;
  margin: 15px;
  background: white;
  padding: 15px 10px;
  .soon-live-title {
    display: inline-block;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;
    margin-bottom: 15px;
  }
  .loderBack1 {
    background: #e3efff !important;
  }
  .loderBack2 {
    background: #ffeec2 !important;
  }
  .loderBack3 {
    background: #eafdff !important;
  }
  .loderBack4 {
    background: #ffeaef !important;
  }
  .swipe-loder {
    padding: 7px;
    position: relative;
    vertical-align: middle;
    border-radius: 6px;
    background: #e3efff;
    margin-bottom: 10px;
    .pic {
      position: relative;
      width: 130px;
      height: 69px;
      img {
        border-radius: 6px;
      }
      .people-num {
        right: 5px;
        bottom: 5px;
        position: absolute;
        display: inline-block;
        padding: 0.5px 7px 0.5px 7px;
        background: rgba(48, 49, 51, 0.8);
        transform: scale(0.8);
        /*background: #303133;*/
        border-radius: 13px;
        color: #f3f3f3;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }

    .live-down {
      position: absolute;
      top: 0px;
      left: 0px;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      padding: 1px 6px;
      background: linear-gradient(
        127deg,
        rgba(225, 57, 118, 1) 0%,
        rgba(234, 52, 37, 1) 100%
      );
      border-radius: 4px;

      .circle {
        width: 4px;
        height: 4px;
        border-radius: 4px;
        background: white;
        margin-right: 3px;
      }
    }

    .live-now {
      position: absolute;
      top: 0px;
      left: 0px;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      /*background: rgba(255, 187, 0, 1);*/
      border-radius: 4px;
      background: linear-gradient(
        127deg,
        rgba(225, 57, 118, 1) 0%,
        rgba(234, 52, 37, 1) 100%
      );

      img {
        width: 10px;
        height: 10px;
        vertical-align: middle;
        padding-right: 2px;
        border-radius: 0px;
      }

      span {
        display: inline-block;
        vertical-align: middle;
        padding: 1px 6px;
      }
    }

    .status {
      display: flex;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      padding: 5px 8px;
      background: rgba(39, 128, 248, 1);
      border-radius: 20px;
    }
  }
}

.course-ranking {
  .ranking-title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;
  }
  .swipe-loder {
    width: 315px;
    padding: 15px 10px;
    position: relative;
    vertical-align: top;
    display: inline-block;
    border-radius: 10px;
    background: white;
    margin-left: 16px;
    .title {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #323233;
      img {
        width: 33px;
        height: 14px;
      }
    }
    .detail {
      margin-top: 12px;
      .pic {
        padding-right: 7px;
        .num {
          padding-right: 7px;
          img {
            border-radius: 0px;
            width: 14px;
            height: 14px;
          }
        }
        img {
          border-radius: 6px;
          width: 104px;
          height: 66px;
        }
      }
      .content {
        width: 35%;
        flex-grow: 1;
        .name {
          white-space: normal;
          width: 100%;
          font-size: 15px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #323233;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pople-num {
          padding-top: 6px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #969799;
          img {
            width: 13px;
            height: 11px;
          }
        }
      }
    }
    .look-all {
      text-align: center;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #969799;
      padding-top: 20px;
    }
  }
}

.theme-classification {
  .theme-title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;
  }
  .swipe-loder {
    vertical-align: middle;
    display: inline-block;
    width: 48%;
    position: relative;
    background: white;
    border-radius: 8px;
    .people-num {
      display: inline-block;
      padding: 0px 8px;
      height: 19px;
      line-height: 15px;
      position: absolute;
      transform: scale(0.8);
      background: rgba(48, 49, 51, 0.8);
      border-radius: 19px;
      top: 67px;
      right: 1px;
      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #f3f3f3;
      }
    }

    .big-img {
      border-radius: 6px 6px 0px 0px;
    }

    .live-down {
      position: absolute;
      top: 0px;
      left: 0px;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      padding: 3px 6px;
      background: linear-gradient(127deg, #ff3880 0%, #ff2d1c 100%);
      border-radius: 4px;

      .circle {
        width: 4px;
        height: 4px;
        border-radius: 4px;
        background: white;
        margin-right: 3px;
      }
    }

    .live-now {
      position: absolute;
      top: 0px;
      left: 0px;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      /*background: rgba(255, 187, 0, 1);*/
      background: linear-gradient(127deg, #ff3880 0%, #ff2d1c 100%);
      border-radius: 4px;

      img {
        width: 10px;
        height: 10px;
        vertical-align: middle;
        padding-right: 2px;
      }

      span {
        display: inline-block;
        padding: 1px 6px;
        vertical-align: middle;
      }
    }

    .status {
      position: absolute;
      top: 62px;
      right: 0px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      padding: 5px 8px;
      background: rgba(39, 128, 248, 1);
      border-radius: 6px 0px 0px 0px;
    }
  }
}
.class-home-list {
  padding: 0;
  .class-title {
    padding: 0 15px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #323233;
  }
  .class-more {
    padding-right: 15px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #646566;
  }
}
.noList {
  background: white;
  padding: 15px;
  margin: 0 15px;
  border-radius: 30px;
  .class-title {
    padding: 0 !important;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #323233;
  }
  .class-more {
    padding-right: 0 !important;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #646566;
  }
}
</style>
<style lang="scss">
.home-one-page {
  /*background: url(../../../../assets/images/rectangle.png) no-repeat 0px 44px;*/
  /*background-size:100% auto;*/
  height: 100% !important;
  .van-search {
    padding: 10px 0px;
  }

  .van-field__left-icon .van-icon,
  .van-field__right-icon .van-icon {
    font-size: 18px;
  }
  .jsh-header {
    .van-search {
      .van-field__control:disabled {
        color: #c8c9cc;
        cursor: not-allowed;
        opacity: 1;
      }
    }
  }
}

.van-swipe__indicator {
  background-color: #bbbbbb;
}

.van-swipe__indicator--active {
  border-radius: 0.8vw;
  opacity: 1;
  background-color: white;
}

.classification {
  .van-swipe__indicator--active {
    background-color: #227ef7;
  }

  .van-swipe__indicators {
    bottom: 6px;
  }
}
.live-broadcast {
  .van-swipe {
    padding-bottom: 10px;
  }
  .van-swipe__indicator:not(:last-child) {
    margin-right: 0px;
  }
  .van-swipe__indicators {
    bottom: 1px;
    border-radius: 20px;
    overflow: hidden;
  }
  .van-swipe__indicator--active {
    background-color: #227ef7;
  }
  .van-swipe__indicator {
    width: 30px;
    height: 4px;
    border-radius: 0px;
  }
}
</style>
