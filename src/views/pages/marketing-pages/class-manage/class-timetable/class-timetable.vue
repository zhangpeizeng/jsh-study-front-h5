<template>
  <div class="class-timetable">
    <!--        一级标题-->
    <div class="jsh-header">
      <jshHeader ref="childHeader" :header="header"></jshHeader>
    </div>
    <div v-if="!isNetwork">
      <div>
        <canlen @dateTime="dateTimeFun"></canlen>
      </div>
      <div
        class="new-list"
        v-if="
          todayNoStudyList.length > 0 ||
            sevenDayNoStudyList.length > 0 ||
            completedList.length > 0 ||
            expiredList.length > 0
        "
      >
        <div class="status-title">当天({{ todayNoStudyList.length }})</div>
        <div
          v-for="(item, index) in todayNoStudyList"
          :key="index + 'today'"
          class="item"
          :class="{ itemMb: index === todayNoStudyList.length - 1 }"
          @click="gotoCourseDetail(item)"
        >
          <div
            class="d-flex align-items-start justify-content-between"
            style="position: relative"
          >
            <div class="class-name">
              <span>{{ item.courseName }}</span>
            </div>
            <div>
              <span v-if="item.progress" class="tag" style="color: #FFBB00;"
                >已学{{ item.progress }}%</span
              >
              <span v-else class="tag">未学习</span>
            </div>
          </div>
          <div class="dec d-flex align-items-center justify-content-between">
            <div class="class-des">
              {{ item.className }}
            </div>
          </div>
          <div
            class="effect-time d-flex align-items-center justify-content-between"
          >
            <span
              v-if="
                handleYear(item.studyStartTime) !==
                  handleYear(item.studyEndTime)
              "
            >
              课程时间:{{ item.studyStartTime | date("yyyy-MM-dd") }} 至{{
                item.studyEndTime | date("yyyy-MM-dd")
              }}
            </span>
            <span v-else>
              课程时间:{{ item.studyStartTime | date1("yyyy-MM-dd") }} 至{{
                item.studyEndTime | date1("yyyy-MM-dd")
              }}
            </span>
          </div>
        </div>
        <div class="status-title">
          接下来7天({{ sevenDayNoStudyList.length }})
        </div>
        <div
          v-for="(item, index) in sevenDayNoStudyList"
          :key="index + 'aa'"
          class="item"
          :class="{ itemMb: index === sevenDayNoStudyList.length - 1 }"
          @click="gotoCourseDetail(item)"
        >
          <div
            class="d-flex align-items-start justify-content-between"
            style="position: relative"
          >
            <div class="class-name">
              <span>{{ item.courseName }}</span>
            </div>
            <div>
              <span
                v-if="item.progress === 100"
                class="tag"
                style="color: #FFBB00;"
                >已学完</span
              >
              <span
                v-else-if="item.progress"
                class="tag"
                style="color: #FFBB00;"
                >已学{{ item.progress }}%</span
              >
              <span v-else class="tag">未学习</span>
            </div>
          </div>
          <div class="dec d-flex align-items-center justify-content-between">
            <div class="class-des">
              {{ item.className }}
            </div>
          </div>
          <div
            class="effect-time d-flex align-items-center justify-content-between"
          >
            <span
              v-if="
                handleYear(item.studyStartTime) !==
                  handleYear(item.studyEndTime)
              "
            >
              课程时间:{{ item.studyStartTime | date("yyyy-MM-dd") }} 至{{
                item.studyEndTime | date("yyyy-MM-dd")
              }}
            </span>
            <span v-else>
              课程时间:{{ item.studyStartTime | date1("yyyy-MM-dd") }} 至{{
                item.studyEndTime | date1("yyyy-MM-dd")
              }}
            </span>
          </div>
        </div>
        <div
          class="status-title d-flex align-items-center justify-content-between "
          :class="{ mt10: !isLearned }"
          @click="checkLearned()"
          v-if="expiredFlag"
        >
          <div>当天已完成({{ completedList.length }})</div>
          <div>
            <van-icon v-show="isLearned" name="arrow-up" color="#999999" />
            <van-icon v-show="!isLearned" name="arrow-down" color="#999999" />
          </div>
        </div>
        <div
          v-show="isLearned"
          v-for="(item, index) in completedList"
          :key="index + 'bb'"
          class="item"
          :class="{ itemMb: index === completedList.length - 1 }"
          @click="gotoCourseDetail(item)"
        >
          <div
            class="d-flex align-items-start justify-content-between"
            style="position: relative"
          >
            <div class="class-name">
              <span>{{ item.courseName }}</span>
            </div>
            <div>
              <span class="tag" style="color: #FFBB00;">已学完</span>
            </div>
          </div>
          <div class="dec d-flex align-items-center justify-content-between">
            <div class="class-des">
              {{ item.className }}
            </div>
          </div>
          <div
            class="effect-time d-flex align-items-center justify-content-between"
          >
            <span
              v-if="
                handleYear(item.studyStartTime) !==
                  handleYear(item.studyEndTime)
              "
            >
              课程时间:{{ item.studyStartTime | date("yyyy-MM-dd") }} 至{{
                item.studyEndTime | date("yyyy-MM-dd")
              }}
            </span>
            <span v-else>
              课程时间:{{ item.studyStartTime | date1("yyyy-MM-dd") }} 至{{
                item.studyEndTime | date1("yyyy-MM-dd")
              }}
            </span>
          </div>
        </div>
        <div
          class="status-title d-flex align-items-center justify-content-between"
          :class="{ mt10: !isOverdue }"
          @click="checkOverdue()"
          v-if="expiredFlag"
        >
          <div>当天已过期({{ expiredList.length }})</div>
          <div>
            <van-icon v-show="isOverdue" name="arrow-up" color="#999999" />
            <van-icon v-show="!isOverdue" name="arrow-down" color="#999999" />
          </div>
        </div>
        <div
          v-show="isOverdue"
          v-for="(item, index) in expiredList"
          :key="index + 'cc'"
          class="item"
          @click="gotoCourseDetail(item)"
        >
          <div
            class="d-flex align-items-start justify-content-between"
            style="position: relative"
          >
            <div class="class-name">
              <span>{{ item.courseName }}</span>
            </div>
            <div>
              <span
                v-if="item.progress === 100"
                class="tag"
                style="color: #FFBB00;"
                >已学完</span
              >
              <span
                v-else-if="item.progress"
                class="tag"
                style="color: #FFBB00;"
                >已学{{ item.progress }}%</span
              >
              <span v-else class="tag">未学习</span>
            </div>
          </div>
          <div class="dec d-flex align-items-center justify-content-between">
            <div class="class-des">
              {{ item.className }}
            </div>
          </div>
          <div
            class="effect-time d-flex align-items-center justify-content-between"
          >
            <span
              v-if="
                handleYear(item.studyStartTime) !==
                  handleYear(item.studyEndTime)
              "
            >
              课程时间:{{ item.studyStartTime | date("yyyy-MM-dd") }} 至{{
                item.studyEndTime | date("yyyy-MM-dd")
              }}
            </span>
            <span v-else>
              课程时间:{{ item.studyStartTime | date1("yyyy-MM-dd") }} 至{{
                item.studyEndTime | date1("yyyy-MM-dd")
              }}
            </span>
          </div>
        </div>
      </div>
      <!--        列表无数据-->
      <div
        class="no-list"
        v-if="
          todayNoStudyList.length === 0 &&
            sevenDayNoStudyList.length === 0 &&
            completedList.length === 0 &&
            expiredList.length === 0
        "
      >
        <div style="padding-top: 20%">
          <img src="@/assets/images/no-search-data.png" alt="" />
        </div>
        <div style="padding-top: 10px">暂无学习课程</div>
      </div>
    </div>
    <!--        网络有问题展示-->
    <div class="no-network" v-if="isNetwork">
      <div>
        <div class="set">
          <div style="padding-top: 30%">
            <img src="@/assets/images/network.png" alt="" />
          </div>
          <div style="padding-top: 30px;color: #646566;font-size: 14px">
            网络请求失败
          </div>
          <div style="padding-top: 10px">请检查您的网络，重新加载试试吧</div>
          <div class="refresh" @click="initData()">刷新</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./class-timetable.js"></script>

<style scoped lang="scss">
.new-list {
  .mt10 {
    margin-bottom: 10px;
  }
  .time-table {
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #323233;
    margin: 0 10px;
    padding: 12px;
    background: white;
    border-radius: 10px;
  }
  .status-title {
    padding: 10px 16px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #2780f8;
    background: #ecf4ff;
  }
  .itemMb {
    margin-bottom: 0px !important;
  }
  .item {
    margin: 0 10px 10px 10px;
    padding: 15px 10px;
    background: white;
    border-radius: 10px;
    .tag {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #227ef7;
    }
    .class-name {
      display: inline-block;
      width: 80%;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #323233;
    }
    .dec {
      margin-top: 8px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #646566;
      img {
        width: 24px;
        height: 24px;
      }
      .time {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ff751f;
        background: #ffffff;
        border-radius: 2px;
        border: 1px solid #ff751f;
        padding: 2px 6px;
      }
      .class-des {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .effect-time {
      padding-top: 10px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #969799;
    }
  }
  .content {
    /*display: none;*/
    color: white;
    position: absolute;
    background: rgba(50, 50, 51, 0.9);
    box-shadow: 0px 1px 6px 2px rgba(201, 201, 201, 0.48);
    top: 30px;
    right: -15px;
    font-size: 13px;
    padding: 9px 12px;
    border-radius: 5px;
  }
  .content:before {
    content: "";
    color: black;
    position: absolute;
    top: -10px;
    right: 12px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 11px solid rgba(50, 50, 51, 0.9);
  }
}

.no-list {
  padding-bottom: 20%;
  text-align: center;
  width: 100%;
  background-color: white;

  img {
    width: 67px;
    height: 49px;
  }

  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}

.no-network {
  top: 0%;
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
<style lang="scss">
.van-count-down {
  color: #ffffff;
  font-size: 10px !important;
  padding-left: 3px;
  line-height: 10px;
}

.class-timetable {
  .activeHeight {
    padding-top: 120px !important;
  }
  .van-pull-refresh {
    min-height: 100%;
    padding-top: 45px;
  }
}
</style>
