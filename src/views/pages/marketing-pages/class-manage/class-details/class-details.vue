<template>
  <div class="class-details" style="height: 100%">
    <!--        一级标题-->
    <div class="jsh-header">
      <jshHeader ref="childHeader" :header="header"></jshHeader>
    </div>
    <van-pull-refresh
      v-model="isPullLoading"
      @refresh="onRefresh"
      class="pull-warp"
      success-text="加载成功"
      style="min-height: 100%; background: #ffffff; padding-bottom: 30px"
    >
      <class-details-header
        :classBasicInfo="classBasicInfo"
        :lecturerObj="lecturerObj"
        :searchType="searchType"
        :classId="classId"
        :defaultLecturerUrl="defaultLecturerUrl"
      ></class-details-header>
      <div class="class-details_list-title-box">
        <span class="class-details_list-title">课程大纲</span>
        <span class="class-details_list-sum">
          {{ `共${classTimetable.length}个课程` }}
        </span>
      </div>
      <div class="class-details_list">
        <div
          class="class-details_list-item"
          v-for="(item, index) in classTimetableinList"
          :key="index"
          @click="viewCourse(item)"
        >
          <div class="list-item_title-box">
            <span class="list-item_serial-number">
              {{ index | getSerialNumber }}
            </span>
            <!-- 直播课icon -->
            <img
              v-if="item.courseType * 1 === COURSE_TYPE.DIRECT_SEEDING"
              class="list-item_tag"
              src="@/assets/images/icon-live.png"
              alt=""
            />
            <!-- 系列课icon -->
            <img
              v-if="item.courseType * 1 === COURSE_TYPE.SERIES"
              class="list-item_tag"
              src="@/assets/images/icon-series.png"
              alt=""
            />
            <!-- 研讨课icon -->
            <img
              v-if="item.courseType * 1 === COURSE_TYPE.DISCUSS"
              class="list-item_tag"
              src="@/assets/images/icon-discuss.png"
              alt=""
            />
            <!-- 录播文档icon -->
            <!-- <img
              v-if="item.courseType * 1 === COURSE_TYPE.RECORD_BROADCAT_DOC"
              class="list-item_tag"
              src="@/assets/images/icon-doc.png"
              alt=""
            /> -->
            <span class="list-item_title">
              {{ item.courseName }}
            </span>
          </div>
          <div
            class="list-item_date"
            v-if="
              handleYear(item.studyStartTime) !== handleYear(item.studyEndTime)
            "
          >
            课程时间：{{ item.studyStartTime | date("yyyy-MM-dd hh:mm") }}至{{
              item.studyEndTime | date("yyyy-MM-dd hh:mm")
            }}
          </div>

          <div class="list-item_date" v-else>
            课程时间：{{ item.studyStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
              item.studyEndTime | date1("yyyy-MM-dd hh:mm")
            }}
          </div>
          <div class="list-item_teacher-poster">
            <img
              class="teacher-poster"
              :src="item.lecturerImg || defaultLecturerUrl"
              alt=""
            />
            <span class="teacher-name">
              {{ item.lecturerName }}
            </span>
            <div class="class-status_box">
              <span class="class-status" v-if="!item.progress"> 未学习 </span>
              <span
                class="class-status is_learning"
                v-if="item.progress && item.progress < 100"
              >
                已学{{ item.progress }}%
              </span>
              <span
                class="class-status is_learned"
                v-if="item.progress === 100"
              >
                <!-- {{ getCourseStatus(item) }} -->
                已学完
              </span>
              <span class="class-status_dividing">|</span>
              <span class="class-status_sum">
                {{ `${item.studyNum | 0}人学过` }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="class-details_list-drop-icon"
          v-if="classTimetable.length > 3"
          style="
            text-align: center;
            font-size: 12px;
            color: #969799;
            line-height: 14px;
          "
        >
          <div
            class="class-details_list-drop"
            @click="dropDown"
            v-if="!dropDownFlag"
          >
            <span>{{ dropDownFlag ? "收起" : "查看全部" }} </span>
            <img
              :class="['drop_icon', { down: dropDownFlag }]"
              src="@/assets/images/drop_down.png"
              alt=""
            />
          </div>
        </div>
        <nodata-page :contentTxt="'暂无课程~'" v-if="noData"></nodata-page>
        <div class="synopsis_box">
          <div class="synopsis_title">简介内容</div>
          <div class="synopsis_content">
            <u-editor-box
              :content="classBasicInfo.classDescription"
            ></u-editor-box>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <network-error :onRefresh="onRefresh" v-if="isNetworkError"></network-error>
    <div class="class-details_footer">
      <div v-if="searchType === 1 && Object.values(classBasicInfo).length">
        <!-- 未报名或者未加入学习显示 -->
        <van-notice-bar
          color="#F86E21"
          v-if="classBasicInfo.status === COURSE_STATUS.SIGN_UP_NOW"
        >
          距离报名结束仅剩<van-count-down
            class="fs-10 h-15 ml-10"
            style="color: #f86e21; display: inline-block; padding: 0; margin: 0"
            :time="classBasicInfo.classStartTime - classBasicInfo.systemTime"
          />
        </van-notice-bar>
        <!-- 报名已驳回显示 -->
        <van-notice-bar
          color="#F86E21"
          v-if="
            classBasicInfo.status === COURSE_STATUS.REFISTRATION_REVIEW_REJECTED
          "
        >
          报名驳回
        </van-notice-bar>
        <!-- 报名确认中显示 -->
        <van-notice-bar
          color="#F86E21"
          v-if="
            classBasicInfo.status === COURSE_STATUS.REFISTRATION_TO_BE_APPROVED
          "
        >
          报名确认中
        </van-notice-bar>
        <!-- 未报名显示 -->
        <van-button
          type="info"
          size="large"
          @click="
            updateClassStudentStatus(classId, 1, COURSE_STATUS.SIGN_UP_NOW)
          "
          v-if="classBasicInfo.status === COURSE_STATUS.SIGN_UP_NOW"
        >
          立即报名
        </van-button>
        <!-- 未加入学习 -->
        <van-notice-bar
          color="#F86E21"
          v-if="
            classBasicInfo.status === COURSE_STATUS.TO_BE_CONFIRMED_BY_STUDENT
          "
        >
          距离班级结束<van-count-down
            class="fs-10 h-15 ml-10"
            style="color: #f86e21; display: inline-block; padding: 0; margin: 0"
            :time="classBasicInfo.classEndTime - classBasicInfo.systemTime"
          />
        </van-notice-bar>
        <van-button
          type="info"
          size="large"
          @click="
            updateClassStudentStatus(
              classId,
              2,
              COURSE_STATUS.TO_BE_CONFIRMED_BY_STUDENT
            )
          "
          v-if="
            classBasicInfo.status === COURSE_STATUS.TO_BE_CONFIRMED_BY_STUDENT
          "
        >
          加入学习
        </van-button>
      </div>
    </div>
  </div>
</template>

<script src="./class-details.js"></script>

<style lang="scss" scoped>
.class-details {
  background-color: #fff;
  .class-details_list-title-box {
    height: 39px;
    padding: 0 15px;
    .class-details_list-title {
      font-size: 15px;
      font-weight: 500;
      color: #323233;
      line-height: 39px;
    }
    .class-details_list-sum {
      display: inline-block;
      margin-left: 10px;
      font-size: 13px;
      color: #999999;
      line-height: 39px;
    }
  }
  .class-details_list {
    padding: 10px 10px 30px;
    .class-details_list-item {
      padding: 10px;
      background: #f7f9fd;
      border-radius: 10px;
      height: 114px;
      margin-bottom: 10px;
      .list-item_title-box {
        word-break: break-all;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        .list-item_serial-number {
          vertical-align: top;
          font-size: 14px;
          color: #323233;
        }
        .list-item_tag {
          height: 15px;
          vertical-align: top;
          margin: 0 3px 0 6px;
        }
        .list-item_title {
          vertical-align: top;
          font-size: 14px;
          color: #323233;
          line-height: 20px;
        }
      }
      .list-item_date {
        font-size: 12px;
        color: #969799;
        line-height: 12px;
        margin: 5px 0 10px;
      }
      .list-item_teacher-poster {
        .teacher-poster {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          overflow: hidden;
        }
        .teacher-name {
          vertical-align: top;
          font-size: 12px;
          color: #646566;
          line-height: 12px;
          margin-left: 5px;
          line-height: 24px;
        }
        .class-status_box {
          float: right;
          font-size: 12px;
          color: #969799;
          line-height: 24px;
          .class-status_dividing {
            margin: 0 4px;
          }
          .is_learning {
            color: #ffbb00;
          }
          .is_learned {
            color: #227ef7;
          }
        }
      }
    }
    .class-details_list-drop-icon {
      text-align: center;
      font-size: 12px;
      color: #969799;
      line-height: 14px;
      .class-details_list-drop {
        display: inline-block;
        .drop_icon {
          width: 10px;
          margin-left: 3px;
          &.down {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
  .synopsis_box {
    padding: 0 10px 15px;
    .synopsis_title {
      font-size: 14px;
      font-weight: 500;
      color: #323233;
      line-height: 14px;
      margin: 5px 0 10px;
    }
    .synopsis_content {
      font-size: 13px;
      color: #969799;
      line-height: 15px;
    }
  }
  .class-details_empty {
    height: 30px;
    background-color: #fff;
  }
  .class-details_footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
