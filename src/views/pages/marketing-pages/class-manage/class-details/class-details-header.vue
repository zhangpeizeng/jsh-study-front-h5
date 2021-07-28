<template>
  <div class="class-details_header">
    <div class="class-dateils_basicInfor">
      <div class="class-dateils_basicInfor-title">
        {{ classBasicInfo.className }}
      </div>
      <div class="class-dateils_basicInfor-date-box">
        <!-- <span class="class-dateils_primary-category">
          {{ classBasicInfo.classifyName }}
        </span> -->
        <span
          v-if="
            handleYear(classBasicInfo.classStartTime) !==
              handleYear(classBasicInfo.classEndTime)
          "
        >
          {{ classBasicInfo.classStartTime | date("yyyy-MM-dd hh:mm") }}至{{
            classBasicInfo.classEndTime | date("yyyy-MM-dd hh:mm")
          }}
        </span>
        <span class="class-dateils_date" v-else>
          {{ classBasicInfo.classStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
            classBasicInfo.classEndTime | date1("yyyy-MM-dd hh:mm")
          }}
        </span>
      </div>
      <div class="class-dateils_basicInfor-teacher" @click="toViewLecturer">
        <img
          class="teacher-poster"
          :src="classBasicInfo.lecturerImg || defaultLecturerUrl"
          alt=""
        />
        <span class="teacher-name">{{ classBasicInfo.lecturerName }}</span>
        <img class="teacher-tag" src="@/assets/images/headmaster.png" alt="" />
      </div>
    </div>
    <div class="class-details_tab" v-if="searchType !== 1">
      <div class="class-details_tab-item" @click="viewSecondPage(1)">
        <div class="class-details_tab-icon-box exams-item">
          <img src="@/assets/images/exams_icon.png" alt="" />
        </div>
        <div class="class-details_tab-name">考试</div>
        <span class="unread-flag" v-if="classBasicInfo.examStatus"></span>
      </div>
      <div class="class-details_tab-item" @click="viewSecondPage(2)">
        <div class="class-details_tab-icon-box task-item">
          <img src="@/assets/images/task_icon.png" alt="" />
        </div>
        <div class="class-details_tab-name">作业</div>
        <span class="unread-flag" v-if="classBasicInfo.homeWorkStatus"></span>
      </div>
      <div class="class-details_tab-item" @click="viewSecondPage(3)">
        <div class="class-details_tab-icon-box certificate-item">
          <img src="@/assets/images/certificate_icon.png" alt="" />
        </div>
        <div class="class-details_tab-name">证书</div>
      </div>
    </div>
    <lecturerPopup ref="lecturerPopup"></lecturerPopup>
  </div>
</template>

<script>
import { handleYear } from "@/utils/utils.js";
import lecturerPopup from "@/components/course-detail/lecturer-popup/lecturer-popup.vue";
const defaultLecturerUrl = require("@/assets/images/default_avatar.png");
export default {
  name: "classDetailsHeader",
  filters: {},
  props: {
    classBasicInfo: {
      type: Object,
      require: true
    },
    searchType: {
      type: Number,
      require: true
    },
    lecturerObj: {
      type: Object,
      require: true
    },
    classId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      handleYear: handleYear,
      defaultLecturerUrl: defaultLecturerUrl
    };
  },
  components: { lecturerPopup },
  methods: {
    // 查看班主任信息
    toViewLecturer() {
      this.$refs.lecturerPopup.initData(this.lecturerObj);
    },
    viewSecondPage(status) {
      let path = "";
      switch (status) {
        case 1:
          path = "/public/class-exams";
          break;
        case 2:
          path = "/public/class-task";
          break;
        case 3:
          path = "/public/class-certificate";
          break;
      }
      this.$router.push({
        path,
        query: {
          classId: this.classId,
          pageType: status
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.class-dateils_basicInfor {
  padding: 15px 13px 10px;
  .class-dateils_basicInfor-title {
    font-size: 14px;
    font-weight: 600;
    color: #323233;
    line-height: 20px;
  }
  .class-dateils_basicInfor-date-box {
    margin-top: 13px;
    .class-dateils_primary-category {
      font-size: 12px;
      font-weight: 400;
      color: #ff751f;
      background: #feeed7;
      line-height: 20px;
      padding: 0 5px;
    }
    .class-dateils_date {
      margin-left: 5px;
      height: 20px;
      background: #f7f9fd;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #969799;
      line-height: 20px;
      padding: 0 5px;
    }
  }
  .class-dateils_basicInfor-teacher {
    overflow: hidden;
    margin-top: 10px;
    .teacher-poster {
      width: 29px;
      height: 29px;
      border-radius: 50%;
      overflow: hidden;
      line-height: 29px;
      font-size: 12px;
      font-weight: 400;
      color: #646566;
    }
    .teacher-name {
      display: inline-block;
      height: 29px;
      line-height: 29px;
      font-size: 12px;
      font-weight: 400;
      color: #646566;
      margin: 0 3px 0 4px;
      vertical-align: top;
    }
    .teacher-tag {
      display: inline-block;
      height: 14px;
      line-height: 14px;
      padding: 0 4px;
      margin-top: 7.5px;
      vertical-align: top;
    }
  }
}
.class-details_tab {
  display: flex;
  justify-content: center;
  .class-details_tab-item {
    width: 44px;
    text-align: center;
    position: relative;
    margin: 0 30px;
    .class-details_tab-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 32px;
      img {
        width: 100%;
      }
    }
    .class-details_tab-name {
      margin-top: 5px;
      font-size: 13px;
      font-weight: 500;
      color: #646566;
      line-height: 14px;
    }
    .unread-flag {
      position: absolute;
      top: 2px;
      right: 0;
      width: 9px;
      height: 9px;
      background: #ff0000;
      border-radius: 50%;
      border: 1px solid #ffffff;
    }
  }
}
</style>
