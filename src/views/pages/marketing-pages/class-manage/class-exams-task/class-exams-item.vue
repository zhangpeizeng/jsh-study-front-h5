<template>
  <div class="class-exams_list-item">
    <div class="list-item_title ellipsis">
      {{ examType === 1 ? item.examTheme : "课程考试" }}
    </div>
    <div
      class="list-item_source ellipsis"
      v-if="item.courseName && examType === 2"
    >
      <span
        class="list-item_source-word ellipsis"
        @click="toViewCourseDetail(item)"
      >
        {{ `课程名称：${item.courseName}` }}
      </span>
    </div>
    <div class="list-item_certificate" v-if="item.certificateName">
      <span class="list-item_certificate-title">考试通过可获得</span>
      <img src="" alt="" />
      <span class="list-item_certificate-name"
        >《{{ item.certificateName }}》</span
      >
    </div>
    <img
      class="icon_exams"
      v-if="(searchType === 4 || searchType === 3) && item.fillTestFlag"
      src="@/assets/images/makeUp-exam-icon.png"
      alt=""
    />
    <img
      class="icon_exams"
      v-if="(searchType === 4 || searchType === 3) && !item.fillTestFlag"
      src="@/assets/images/tested-icon.png"
      alt=""
    />
    <div class="list-item_date-btn">
      <span
        class="list-item_date"
        v-if="!item.examStartTime || !item.examEndTime"
      ></span>
      <span
        class="list-item_date"
        v-else-if="
          handleYear(item.examStartTime) !== handleYear(item.examEndTime)
        "
      >
        考试时间：{{ item.examStartTime | date("yyyy-MM-dd hh:mm") }}至{{
          item.examEndTime | date("yyyy-MM-dd hh:mm")
        }}
      </span>
      <span class="list-item_date" v-else>
        考试时间：{{ item.examStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
          item.examEndTime | date1("yyyy-MM-dd hh:mm")
        }}
      </span>

      <span
        class="list-item_btn to_exam"
        v-if="searchType === 1"
        @click="goToExam(examType === 1 ? item.id || '' : item.baseId || '')"
        >去考试</span
      >
      <span
        class="list-item_btn to_make-up-exam"
        v-if="(searchType === 4 || searchType === 3) && item.fillTestFlag"
        @click="goToExam(examType === 1 ? item.id || '' : item.baseId || '')"
      >
        去补考
      </span>
      <span
        class="list-item_btn tested"
        v-if="(searchType === 4 || searchType === 3) && !item.fillTestFlag"
        >已考</span
      >
    </div>
  </div>
</template>

<script>
import { handleYear } from "@/utils/utils.js";
import JSH from "@/core";
import { CloudMarketing } from "@/request";
import { Toast } from "vant";
import Vue from "vue";
Vue.use(Toast);
export default {
  props: {
    item: {
      type: Object,
      require: true
    },
    searchType: {
      type: Number,
      require: true
    },
    examType: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      handleYear: handleYear
    };
  },
  methods: {
    //问卷星
    goToExam(baseId) {
      const owner = this;
      JSH.request({
        url: CloudMarketing.getexamurl,
        method: "get",
        params: { baseId, type: this.examType === 1 ? 2 : 1 },
        success(data) {
          if (data.success) {
            owner.testUrl = "";
            owner.testUrl = data.data;
            // owner.show = true;
            // owner.scoreshow = false;
            owner.$router.push({
              path: "/public/examQuestions",
              query: {
                testUrl: owner.testUrl
              }
            });
          } else {
            owner.show = false;
            Toast(data.errorMsg);
          }
        },
        error() {
          console.log("服务器错误");
        }
      });
    },
    toViewCourseDetail(item) {
      // 查看课程详情

      if (item.studyWarningMsg) {
        Toast(item.studyWarningMsg);
        return;
      }
      let path = "";
      switch (item.courseType) {
        case "1":
          path = "/public/recorded-course";
          break;
        case "2":
          path = "/public/live-course";
          break;
        case "3":
          path = "/public/discussion-course";
          break;
        case "4":
          path = "/public/series-course";
          break;
        case "6":
          path = "/public/class-detail";
          break;
        default:
          break;
      }
      // 路由跳转
      this.$router.push({
        path,
        query: {
          id: item.baseId
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.class-exams_list-item {
  background: #ffffff;
  border-radius: 10px;
  padding: 15px 10px;
  margin-bottom: 10px;
  position: relative;
  .list-item_title {
    font-size: 14px;
    font-weight: 400;
    color: #323233;
    line-height: 20px;
  }
  .list-item_source {
    height: 24px;
    padding: 0 15px;
    margin: 2px 0 5px;
    background: linear-gradient(
      270deg,
      #ffffff 0%,
      rgba(39, 128, 248, 0.0588) 59%,
      rgba(39, 128, 248, 0.0588) 97%
    );
    // opacity: 0.06;
    .list-item_source-word {
      font-size: 13px;
      font-weight: 400;
      color: #2780f8;
      line-height: 24px;
    }
  }
  .list-item_certificate {
    margin-top: 3px;
    .list-item_certificate-title {
      font-size: 12px;
      color: #969799;
      line-height: 17px;
    }
    .list-item_certificate-name {
      font-size: 12px;
      color: #ff751f;
      line-height: 17px;
    }
  }
  .icon_exams {
    position: absolute;
    right: 15px;
    top: 5px;
    width: 28px;
    z-index: 0;
  }
  .list-item_date-btn {
    margin-top: 5px;

    .list-item_date {
      display: inline-block;
      line-height: 28px;
      font-size: 12px;
      color: #969799;
    }

    .list-item_btn {
      line-height: 28px;
      float: right;
      vertical-align: top;
      &.tested {
        font-size: 13px;
        color: #666666;
      }
      &.to_exam,
      &.to_make-up-exam {
        height: 28px;
        color: #ffffff;
        border-radius: 14px;
        padding: 0 18px;
      }
      &.to_make-up-exam {
        background: #ff751f;
      }
      &.to_exam {
        background: #2780f8;
      }
    }
  }
}
</style>
