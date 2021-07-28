import Home from "@/views/pages/marketing-pages/home/Home.vue";
import HomeTwo from "@/views/pages/marketing-pages/home/Home-two.vue"; // 直销员端用的中转页
import HomeNoData from "@/views/pages/marketing-pages/home/Home-no-data.vue";
import HomePage from "@/views/pages/marketing-pages/home-page/home-page.vue";
import OrganHome from "@/views/pages/marketing-pages/organ-home/organ-home.vue";
import OrganClassifyList from "@/views/pages/marketing-pages/organ-classify-list/organ-classify-list.vue";
import Freeze from "@/views/pages/marketing-pages/home/freeze.vue";
import noDirect from "@/views/pages/marketing-pages/home/no-direct.vue";
import searchList from "@/views/pages/marketing-pages/search-list/search-list.vue";
import courseList from "@/views/pages/marketing-pages/course-classification-list/course-classification-list.vue";
import themeClassificationList from "@/views/pages/marketing-pages/theme-classification-list/theme-classification-list.vue";
import rankingList from "@/views/pages/marketing-pages/ranking-list/ranking-list.vue";
import classList from "@/views/pages/marketing-pages/class-manage/class-list/class-list.vue";
import classTimeTable from "@/views/pages/marketing-pages/class-manage/class-timetable/class-timetable.vue";
import classDetails from "@/views/pages/marketing-pages/class-manage/class-details/class-details.vue";
import classExamsTask from "@/views/pages/marketing-pages/class-manage/class-exams-task/class-exams-task.vue";
import TaskHomework from "@/views/pages/marketing-pages/task-homework/task-homework.vue";
import recordedCourse from "@/views/pages/marketing-pages/course-detail/recorded-course/recorded-course.vue";
import liveCourse from "@/views/pages/marketing-pages/course-detail/live-course/live-course.vue";
import discussionCourse from "@/views/pages/marketing-pages/course-detail/discussion-course/discussion-course.vue";
import seriesCourse from "@/views/pages/marketing-pages/course-detail/series-course/series-course.vue";
import taskList from "@/views/pages/marketing-pages/task-list/task-list.vue";
import taskDetails from "@/views/pages/marketing-pages/task-details/task-details.vue";
import classDetail from "@/views/pages/marketing-pages/course-detail/class-detail/class-detail.vue";
import RecentLine from "@/views/pages/marketing-pages/recentline/recentline.vue";
import Honor from "@/views/pages/marketing-pages/honor/honor.vue";
import Nologin from "@/views/pages/marketing-pages/home/nologin.vue";
import Advertisement from "@/views/pages/marketing-pages/advertisement/advertisement.vue";
import PersonalData from "@/views/pages/marketing-pages/personal-data/personal-data.vue";
import productCenterDetails from "@/views/pages/marketing-pages/product-center/product-center-details/product-center-details.vue";
import courseEvaluation from "@/views/pages/marketing-pages/course-evaluation/course-evaluation.vue";
import examQuestions from "@/views/pages/marketing-pages/task-homework/exam-questions.vue";
import studyReport from "@/views/pages/marketing-pages/study-report/study-report.vue";
import teamStudyReport from "@/views/pages/marketing-pages/team-study-report/team-study-report.vue";
import studyList from "@/views/pages/marketing-pages/study-list/study-list.vue";
/**
 * 各入口页面
 *
 * meta 可配置参数
 * @param {boolean} keepAlive 是否缓存页面,一般默认为false
 * @param {string} title 页面标题
 * @param {string} permission 页面访问权限码,无此属性则不设权限
 */
const MODULE_PATH = "/public";
export default [
  {
    path: MODULE_PATH + "/home",
    component: Home,
    name: "hometo",
    meta: {
      title: "登录",
      keepAlive: true,
      rank: 1
    }
  },
  {
    path: MODULE_PATH + "/homeTwo",
    component: HomeTwo,
    name: "HomeTwo",
    meta: {
      title: "登录",
      keepAlive: true,
      rank: 1
    }
  },
  {
    path: MODULE_PATH + "/home-nodata",
    component: HomeNoData,
    name: "home-nodata",
    meta: {
      title: "无数据",
      keepAlive: true,
      rank: 1
    }
  },
  {
    path: MODULE_PATH + "/nologin",
    component: Nologin,
    name: "nologin",
    meta: {
      title: "重新登录",
      keepAlive: true,
      rank: 1
    }
  },
  {
    path: MODULE_PATH + "/freeze",
    component: Freeze,
    name: "freeze",
    meta: {
      title: "冻结",
      keepAlive: true,
      rank: 1
    }
  },
  {
    path: MODULE_PATH + "/noDirect",
    component: noDirect,
    name: "noDirect",
    meta: {
      title: "非直销员",
      keepAlive: true,
      rank: 1
    }
  },
  {
    path: MODULE_PATH + "/recentline",
    component: RecentLine,
    meta: {
      title: "最近直播",
      keepAlive: true,
      rank: 2.1
    }
  },
  {
    path: MODULE_PATH + "/advertisement",
    component: Advertisement,
    meta: {
      title: "",
      keepAlive: true,
      rank: 3
    }
  },
  {
    path: MODULE_PATH + "/home-page",
    component: HomePage,
    meta: {
      title: "home-page",
      keepAlive: true,
      rank: 1
    }
  },
  {
    path: MODULE_PATH + "/organ-home",
    component: OrganHome,
    meta: {
      title: "organ-home",
      keepAlive: true,
      rank: 1.1
    }
  },
  {
    path: MODULE_PATH + "/organ-classify-list",
    component: OrganClassifyList,
    meta: {
      title: "organ-classify-list",
      keepAlive: true,
      rank: 1.2
    }
  },
  {
    path: MODULE_PATH + "/personal-data",
    component: PersonalData,
    meta: {
      title: "personal-data",
      keepAlive: true,
      rank: 1.1
    }
  },
  {
    path: MODULE_PATH + "/honor",
    component: Honor,
    meta: {
      title: "honor",
      keepAlive: true,
      rank: 2.1
    }
  },
  {
    path: MODULE_PATH + "/search-list",
    component: searchList,
    name: "search-list",
    meta: {
      title: "search-list",
      keepAlive: true,
      rank: 2.2
    }
  },
  {
    path: MODULE_PATH + "/theme-classification-list",
    component: themeClassificationList,
    name: "theme-classification-list",
    meta: {
      title: "search-list",
      keepAlive: true,
      rank: 2.1
    }
  },
  {
    path: MODULE_PATH + "/ranking-list",
    component: rankingList,
    name: "ranking-list",
    meta: {
      title: "ranking-list",
      keepAlive: true,
      rank: 2.1
    }
  },
  {
    path: MODULE_PATH + "/class-list",
    component: classList,
    name: "class-list",
    meta: {
      title: "class-list",
      keepAlive: true,
      rank: 2.1
    }
  },
  {
    path: MODULE_PATH + "/class-search-list",
    component: classList,
    name: "class-search-list",
    meta: {
      title: "class-search-list",
      keepAlive: true,
      rank: 2.1
    }
  },

  {
    path: MODULE_PATH + "/class-timetable",
    component: classTimeTable,
    name: "classTimeTable",
    meta: {
      title: "class-timetable",
      keepAlive: true,
      rank: 2.2
    }
  },
  {
    path: MODULE_PATH + "/class-details",
    component: classDetails,
    name: "class-details",
    meta: {
      title: "class-details",
      keepAlive: true,
      rank: 3.1
    }
  },
  {
    path: MODULE_PATH + "/class-task",
    component: classExamsTask,
    name: "class-task",
    meta: {
      title: "class-task",
      keepAlive: true,
      rank: 3.1
    }
  },
  {
    path: MODULE_PATH + "/class-exams",
    component: classExamsTask,
    name: "class-exams",
    meta: {
      title: "class-exams",
      keepAlive: true,
      rank: 3.1
    }
  },
  {
    path: MODULE_PATH + "/class-certificate",
    component: classExamsTask,
    name: "class-certificate",
    meta: {
      title: "class-certificate",
      keepAlive: true,
      rank: 3.1
    }
  },
  {
    path: MODULE_PATH + "/course-classification-list",
    component: courseList,
    name: "course-classification-list",
    meta: {
      title: "course-classification-list",
      keepAlive: true,
      rank: 2.1
    }
  },
  {
    path: MODULE_PATH + "/taskList",
    component: taskList,
    meta: {
      title: "taskList",
      keepAlive: true,
      rank: 2
    }
  },
  {
    path: MODULE_PATH + "/taskDetails",
    component: taskDetails,
    meta: {
      title: "taskDetails",
      rank: 2.1
    }
  },
  /**
   * 录播文档课详情
   * id 课程id
   *
   */
  {
    path: MODULE_PATH + "/recorded-course",
    component: recordedCourse,
    meta: {
      title: "录播文档课",
      rank: 3.1
    }
  },
  /**
   * 直播课详情
   * id 课程id
   *
   */
  {
    path: MODULE_PATH + "/live-course",
    component: liveCourse,
    meta: {
      title: "直播课",
      rank: 3.1
    }
  },
  /**
   * 研讨课详情
   * id 课程id
   *
   */
  {
    path: MODULE_PATH + "/discussion-course",
    component: discussionCourse,
    meta: {
      title: "研讨课",
      rank: 3.1
    }
  },
  /**
   * 系列课详情
   * id 课程id
   *
   */
  {
    path: MODULE_PATH + "/series-course",
    component: seriesCourse,
    meta: {
      title: "系列课",
      rank: 3.1
    }
  },
  {
    path: MODULE_PATH + "/task-homework",
    component: TaskHomework,
    meta: {
      title: "任务作业",
      keepAlive: true,
      rank: 3.1
    }
  },
  /**
   * 系列课课时详情
   * id 课程id
   *
   */
  {
    path: MODULE_PATH + "/class-detail",
    component: classDetail,
    meta: {
      title: "课时详情",
      rank: 4.1
    }
  },
  /**
   * 产品中心-商品详情
   *
   */
  {
    path: MODULE_PATH + "/productCenterDetails",
    component: productCenterDetails,
    meta: {
      title: "产品中心-商品详情",
      rank: 4.1
    }
  },
  /**
   * 课程评价-列表
   *
   */
  {
    path: MODULE_PATH + "/courseEvaluation",
    component: courseEvaluation,
    meta: {
      title: "课程评价",
      rank: 4.1
    }
  },
  /**
   * 课程评价-列表
   *
   */
  {
    path: MODULE_PATH + "/examQuestions",
    component: examQuestions,
    meta: {
      title: "考试",
      rank: 3.9
    }
  },
  /**
   * 学习报告
   *
   */
  {
    path: MODULE_PATH + "/study-report",
    component: studyReport,
    meta: {
      title: "学习报告",
      keepAlive: true,
      rank: 2.2
    }
  },
  /**
   * 团队学习报告
   *
   */
  {
    path: MODULE_PATH + "/team-study-report",
    component: teamStudyReport,
    meta: {
      title: "团队学习报告",
      rank: 2.3
    }
  },
  /**
   * 学习勤奋榜
   *
   */
  {
    path: MODULE_PATH + "/study-list",
    component: studyList,
    meta: {
      title: "学习勤奋榜",
      rank: 2.3
    }
  }
];
