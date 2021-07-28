<template>
  <div>
    <div class="no-network" v-if="isNetwork">
      <div>
        <div class="set">
          <div style="padding-top: 30%">
            <img src="../../../../../assets/images/network.png" alt="" />
          </div>
          <div style="padding-top: 30px;color: #646566;font-size: 14px">
            网络请求失败
          </div>
          <div style="padding-top: 10px">请检查您的网络，重新加载试试吧</div>
          <div class="refresh" @click="refreshClick">刷新</div>
        </div>
      </div>
    </div>
    <div v-else>
      <jshHeader :header="header" @leftClick="gobackto"></jshHeader>
      <div class="header-box">
        <div style="width:150px">
          <van-image
            width="150px"
            height="80px"
            radius="5"
            :src="detailObj.courseImg"
          >
            <template v-slot:error>
              <img src="../../../../../assets/images/imgfengmian.png" />
            </template>
          </van-image>
        </div>
        <div class="d-flex flex-column justify-content-between ml-10">
          <div class="header-title">{{ detailObj.courseName }}</div>
          <div class="d-flex align-items-end">
            <van-image
              width="28px"
              height="28px"
              fit="cover"
              radius="40"
              :src="lecturerObj.lecturerImg"
              @click="toView"
            >
            </van-image>
            <div class="fs-12" style="margin-left:4px;color:#323233">
              {{ lecturerObj.lecturerName }}
            </div>
            <img
              src="../../../../../assets/images/right.png"
              style="width:14px;height:14px;display: inline-block;vertical-align: middle;padding-left: 3px;margin-top: -2px;"
              @click="toView"
            />
          </div>
        </div>
      </div>
      <div class="class-box">
        <div class="class-title">
          <div class="title">课时</div>
          <div class="time">
            学习时间:<span
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
            <span v-else>
              不限
            </span>
          </div>
        </div>
        <div class="progress">
          <div>
            已学{{ detailObj.completeCounts }}课/共{{ detailObj.allCounts }}课
            进度{{ detailObj.seriesCounts }}%
          </div>
          <img
            src="../../../../../assets/images/answer-s.png"
            style="width:14px;height:14px;margin-left:5px"
            @click="toProgress"
          />
        </div>
        <div class="class-list">
          <div
            class="class-item"
            v-for="(item, index) in classList"
            :key="index"
            @click="gotoClassDetail(item)"
          >
            <div class="d-flex">
              <img
                src="../../../../../assets/images/class-video.png"
                style="width:16px;height:16px;margin-right:5px"
              />
              <div class="fs-14 text-ellipsis" style="color:#323233">
                {{ item.sort | numberFilter }}.{{ item.name }}
              </div>
            </div>
            <div class="d-flex" style="margin-left:21px;margin-top:2px">
              <div class="fs-12 color-gray" v-if="!item.progress">未学习</div>
              <div
                class="fs-12 color-yellow"
                v-if="item.progress && item.progress != 100"
              >
                已学习{{ item.progress }}%
              </div>
              <div class="fs-12 color-blue" v-if="item.progress == 100">
                已学完
              </div>
              <div class="fs-12 color-gray">
                |{{ item.studyStudentsNum }}人学过
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="course-box">
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
              <van-button
                plain
                hairline
                round
                type="info"
                class="button-height"
                @click="goToExam"
              >
                去补考
              </van-button>
            </div>
            <div
              class="d-flex align-items-center"
              v-if="detailObj.accountTest === 2"
            >
              <van-button
                plain
                hairline
                round
                type="info"
                class="button-height"
                @click="goToExam"
              >
                去考试
              </van-button>
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
          <div class="fs-13 color-brown mt-10" v-if="detailObj.certificateName">
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
              <van-button
                plain
                hairline
                round
                type="info"
                class="button-height button-padding"
                v-if="taskShowStatus && detailObj.taskId"
                @click="handHomeWork(1)"
              >
                去交作业
              </van-button>
            </div>
            <div
              class="d-flex align-items-center"
              v-if="detailObj.accountTaskStatus"
            >
              <van-button
                plain
                hairline
                round
                type="info"
                class="button-height button-padding"
                v-if="modify && detailObj.taskId"
                @click="handHomeWork(2)"
              >
                修改作业
              </van-button>
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
            detailObj.taskStatus == 1 && detailObj.pkStatus == 1 && signUpStatus
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
                    !detailObj.accountPkStatus && nowTime > detailObj.pkEndTime
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
        <div class="text-content" v-if="detailObj.courseDescription">
          <div class="fs-14 color-brown">简介内容</div>
          <div class="fs-14 mt-10">
            <div class="course-description">
              <u-editor-box
                :content="detailObj.courseDescription"
              ></u-editor-box>
            </div>
          </div>
        </div>
      </div>
      <!--      课程推荐-->
      <div v-show="recommendList.length > 0" class="course-recommend-box">
        <div class="title">
          相关课程
        </div>
        <courseRecommend @list="getListLength" :baseId="id"></courseRecommend>
      </div>
      <div class="course-box" style="padding-bottom: 0">
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
                        item.companyAbbreviation && item.departmentAbbreviation
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
      <div class="layout-block"></div>
      <lecturerPopup ref="lecturerPopup"></lecturerPopup>
      <progressPopup ref="progressPopup"></progressPopup>
      <jobSubmit @submit="submitHomeWork" ref="submit"></jobSubmit>
      <course-detail-foot
        @comments="comments"
        @buttonClick="footButton"
        ref="courseDetailFoot"
      ></course-detail-foot>
    </div>
  </div>
</template>

<script src="./series-course.js"></script>
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
.header-box {
  display: flex;
  padding: 5px 15px 15px 15px;
  background: #ffffff;
  .header-img {
    width: 300px;
    height: 160px;
  }
  .header-title {
    font-weight: 700;
    color: #323233;
    font-size: 16px;
    width: 100%;
    display: -webkit-box;
    white-space: normal;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
.class-box {
  margin: 10px 15px;
  padding: 20px 15px 5px 15px;
  background: #ffffff;
  border-radius: 10px;
  position: relative;
  .class-title {
    display: flex;
    align-items: center;
    .title {
      font-size: 15px;
      color: #646566;
      margin-right: 5px;
    }
    .time {
      padding: 2px 5px;
      font-size: 11px;
      color: #969799;
      background: #f7f9fd;
      border-radius: 16px;
    }
  }
  .progress {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    background: #fef0ec;
    color: #fe6f3b;
    padding: 2px 5px;
    border-radius: 0px 5px 0px 8px;
    font-size: 11px;
  }
  .class-list {
    margin-top: 20px;
    .class-item {
      padding-bottom: 15px;
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
    .mt-4 {
      margin-top: 4px;
    }
    .button-height {
      height: 24px;
      line-height: 24px;
    }
    .button-padding {
      padding: 0 8px;
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
    .class-count {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #227ef7;
      width: 30px;
      height: 30px;
      border-radius: 40px;
      color: #ffffff;
      font-size: 13px;
    }
  }
  .border-bottom-solid {
    border-bottom: 1px solid #dcdee0;
  }
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
.color-yellow {
  color: #ffbb00;
}
.color-blue {
  color: #227ef7;
}
.text-ellipsis {
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis; //超出部分以省略号显示
  white-space: nowrap;
}
.border-b {
  border-bottom: 1px solid #dcdee0;
}
.content {
  background-color: #ffffff;
}
.border-t {
  border-top: 1px solid #dcdee0;
}
.img-right2 {
  width: 14px;
  height: 14px;
  margin-bottom: -2px;
}
.dianzan {
  width: 18px;
}
.img-right {
  width: 14px;
  height: 14px;
  margin-left: 5px;
}
.img-right1 {
  width: 14px;
  height: 14px;
  margin-bottom: -3px;
}
.layout-block {
  height: 44px;
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
</style>
