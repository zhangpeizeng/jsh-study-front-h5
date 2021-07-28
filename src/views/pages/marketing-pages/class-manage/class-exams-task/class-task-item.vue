<template>
  <div class="class-task_list-item">
    <span class="class-task_index"></span>
    <div class="list-item_title ellipsis">
      <span>{{ index | getSerialNumber }}</span>
      <span>
        {{ `作业主题 ：${examType === 1 ? item.homeworkTheme : "课程作业"}` }}
      </span>
      <!-- <span>查看更多</span> -->
    </div>
    <div class="list-item_source" v-if="item.courseName && examType === 2">
      <span
        class="list-item_source-word ellipsis"
        @click="toViewCourseDetail(item)"
      >
        {{ `课程名称：${item.courseName}` }}
      </span>
    </div>
    <div class="list-item_date-btn">
      <span
        class="list-item_date"
        v-if="!item.homeworkStartTime || !item.homeworkEndTime"
      >
      </span>
      <span
        class="list-item_date"
        v-else-if="
          handleYear(item.homeworkStartTime) !==
            handleYear(item.homeworkEndTime)
        "
      >
        提交时间：{{ item.homeworkStartTime | date("yyyy-MM-dd hh:mm") }}至{{
          item.homeworkEndTime | date("yyyy-MM-dd hh:mm")
        }}
      </span>
      <span v-else class="list-item_date">
        提交时间：{{ item.homeworkStartTime | date1("yyyy-MM-dd hh:mm") }}至{{
          item.homeworkEndTime | date1("yyyy-MM-dd hh:mm")
        }}
      </span>
      <span
        class="list-item_btn to_exam"
        v-if="searchType === 1"
        @click="submitTask(item)"
      >
        去提交
      </span>
      <span class="list-item_btn tested" v-if="searchType === 2">未提</span>
      <span
        class="list-item_btn tested"
        @click="submitTask(item)"
        v-if="searchType === 3 && !item.correctStatus"
        >{{ `已交>` }}</span
      >
      <span
        class="list-item_btn tested"
        @click="submitTask(item)"
        v-if="
          (searchType === 4 || searchType === 3) &&
            item.correctStatus &&
            (item.isQualified || (!item.isQualified && !item.updateStatus))
        "
      >
        {{ `${item.score || 0}分>` }}
      </span>
      <span
        class="list-item_btn to_exam"
        v-if="item.updateStatus"
        @click="handHomeWork(item)"
      >
        修改作业
      </span>
    </div>
  </div>
</template>

<script>
import { handleYear } from "@/utils/utils.js";
import Vue from "vue";
import { Toast } from "vant";

Vue.use(Toast);
export default {
  props: {
    index: {
      require: true,
      type: Number
    },
    item: {
      require: true,
      type: Object
    },
    searchType: {
      require: true,
      type: Number
    },
    examType: {
      require: true,
      type: Number
    }
  },
  data() {
    return {
      handleYear: handleYear
    };
  },
  filters: {
    getSerialNumber: index => {
      return (index + 1 > 9 ? "" : "0") + (index + 1);
    }
  },
  methods: {
    handHomeWork(item) {
      this.$emit("handHomeWork", item);
    },
    submitTask(item) {
      this.$router.push({
        path: "/public/taskDetails",
        query: {
          homeworkId: item.id,
          courseId: item.baseId,
          homeworkSubmitId: item.homeworkSubmitId,
          classId: this.$route.query.classId || "",
          classJump: this.examType === 1 ? this.examType : "",
          isType: item.homeworkSubmitId == null ? true : false
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
.class-task_list-item {
  background: #ffffff;
  border-radius: 10px;
  padding: 15px 10px;
  margin-bottom: 10px;
  .list-item_title {
    font-size: 14px;
    font-weight: 400;
    color: #323233;
    line-height: 20px;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
