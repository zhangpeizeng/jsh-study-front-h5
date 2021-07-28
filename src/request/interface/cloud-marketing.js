/**
 *
 * 微服务定制服务
 */

const PREFIX = `/jsh-study-service-marketing${process.env.VUE_APP_SERVER_SUFFIX}`;
// 接口列表
export default {
  //    通过id获取token
  getaccesstokenbyaid: `${PREFIX}/api/page/meeting/get-access-token-by-aid`,
  //    获取token
  checkauthtoken: `${PREFIX}/api/page/meeting/check-auth-token`,
  //    营销学员跳转中台获取aid
  getAuthTokenTicketToOp: `${PREFIX}/api/page/op/get-auth-token-ticket-to-op`,
  //    激活账户
  getactivattoken: `${PREFIX}/api/page/meeting/activat-token`,
  // 查询直销员登录信息
  getZxyDetail: `${PREFIX}/api/page/meeting/get-zxy-detail`,
  // banner图
  bannerTu: `${PREFIX}/api/marketing/page/comment/check-advert-status`,
  // 机构banner图
  checkAdvertStatusOrganization: `${PREFIX}/api/marketing/page/comment/check-advert-status-organization`,
  // 广告弹窗
  tanchuang: `${PREFIX}/api/marketing/page/comment/get-home-page-window`,
  //    刷新token
  refreshtoken: `${PREFIX}/api/page/meeting/refresh-token`,
  // 最近直播
  recentLive: `${PREFIX}/api/marketing/page/college/management/list-app-live-course`,
  // 最近直播的悬浮
  recentFloa: `${PREFIX}/api/marketing/page/college/last-live-course-index`,
  // 证书的列表
  honorlist: `${PREFIX}/api/marketing/page/attainment/list-certificate-by-account-id`,
  // 勋章列表
  xunzahng: `${PREFIX}/api/marketing/page/attainment/list-medal-by-account-id`,
  joinStudy: `${PREFIX}/api/marketing/page/college/management/save-college-marketing-customer`,
  //  直播回放
  huifang: `${PREFIX}/api/marketing/page/college/get-play-back-by-base-id`,

  // 获取当前时间
  getNowDateTime: `${PREFIX}/api/marketing/page/college/management/get-date-now`,
  // 获取课程详情-app
  getCourseDetail: `${PREFIX}/api/marketing/page/college/management/get-course-detail`,
  // 获取讲师介绍
  getlecturerInfo: `${PREFIX}/api/page/teaching/lecturer/get-lecturer-by-base-id`,
  // 课程详情-加入学习/报名
  toStudy: `${PREFIX}/api/marketing/page/college/management/save-college-marketing-customer`,
  // 课程详情-直播回放
  playback: `${PREFIX}/api/marketing/page/college/management/get-college-marketing-play-back`,
  // 课程详情-查询归属系列课
  attributionQry: `${PREFIX}/api/marketing/page/college/management/list-cource-from-series`,
  // 课程详情-新增留言
  addComment: `${PREFIX}/api/marketing/page/comment/add-comment-message`,
  // 课程详情-留言管理列表
  getCommentList: `${PREFIX}/api/marketing/page/comment/list-message-board`,
  // 课程详情-查询课时信息列表
  getSeriesCoursesList: `${PREFIX}/api/marketing/page/college/management/list-series-courses-by-base_id`,
  // 课程详情-查询自建课时详情
  getSeriesCoursesDetail: `${PREFIX}/api/marketing/page/college/management/get-series-cource-detail`,
  // 课程详情-查询直播/录播视频文档信息
  getRecordedInfo: `${PREFIX}/api/marketing/page/college/management/get-lives-by-base_id`,
  // 课程详情-参与PK
  updatePkStatus: `${PREFIX}/api/marketing/page/college/update-pk-status`,
  // 课程详情-获取回放信息
  getPlayBack: `${PREFIX}/api/marketing/page/college/get-play-back-by-base-id`,
  // 课程详情-获取口令
  getvhallCode: `${PREFIX}/api/marketing/page/college/management/get-vhall-live-url-student`,
  // 课程详情-判断是否报名
  getSignUpStatus: `${PREFIX}/api/marketing/page/college/management/get-sign-up-status`,
  // 课程详情-查询考试状态
  getExamStatus: `${PREFIX}/api/marketing/page/wenjuanxing/check-participate-exam`,
  // 列表局部刷新
  partialRefresh: `${PREFIX}/api/marketing/page/college/get-course-detail`,

  /*
   *
   * 任务接口
   */
  //课程列表-考试-缺考
  unExamfinishAbandon: `${PREFIX}/api/marketing/page/college/list-exams-by-account-id-unfinish-abandon`,
  //课程列表-作业-未提交
  unfinishAbandon: `${PREFIX}/api/marketing/page/college/list-homeworks-by-account-id-unfinish-abandon`,
  //课程列表-任务-待学习
  searchAppCourseTodo: `${PREFIX}/api/marketing/page/task/management/search-app-course-todo`,
  //课程列表-任务-已学习
  searchAppCourseLearned: `${PREFIX}/api/marketing/page/task/management/search-app-course-learned`,
  //任务-作业-未完成
  homeworktaskHomework: `${PREFIX}/api/marketing/page/college/list-homeworks-by-account-id-unfinish`,
  //任务-作业-已完成
  taskHomeworkList: `${PREFIX}/api/marketing/page/college/list-homeworks-by-account-id-finish`,
  //任务-作业-不合格
  listHomeworksByAccountIdUnqualified: `${PREFIX}/api/marketing/page/college/list-homeworks-by-account-id-unqualified`,
  //课程列表-任务-考试未完成
  homeworktaskTest: `${PREFIX}/api/marketing/page/college/list-exams-by-account-id-unfinish`,
  //课程列表-任务-考试已完成
  homeworkTestFinish: `${PREFIX}/api/marketing/page/college/list-exams-by-account-id-finish`,
  //课程列表-任务-考试未达标
  listExamsByAccountIdFail: `${PREFIX}/api/marketing/page/college/list-exams-by-account-id-fail`,
  //任务-PK墙
  homeworktaskPkWall: `${PREFIX}/api/marketing/page/college/list-homework-pks-by-college-ids`,
  //问卷星
  getexamurl: `${PREFIX}/api/marketing/page/college/get-exam-url`,
  //问卷星结果集
  getexamresulturl: `${PREFIX}/api/marketing/page/wenjuanxing/joinrelquery`,

  //获取分类
  searchTreeNode: `${PREFIX}/api/marketing/page/classify/search-tree-node`,
  //课程详情-加入学习/报名
  saveCollegeMarketingCustomer: `${PREFIX}/api/marketing/page/college/management/save-college-marketing-customer`,
  /*~
   *
   * 作业接口
   */
  //作业获取作业详情
  getHomeworkSubmitDetail: `${PREFIX}/api/marketing/page/college/get-homework-submit-detail`,
  saveclasshomework: `${PREFIX}/api/marketing/page/class/management/app/save-class-homework`,
  getClassHomeworkSubmitDetail: `${PREFIX}/api/marketing/page/class/management/app/get-class-homework-submit-detail`,
  //获取课程详情
  getCollegeMarketingById: `${PREFIX}/api/marketing/page/college/management/get-college-marketing-by-id`,
  //pk墙详情
  listHomeworkPks: `${PREFIX}/api/marketing/page/college/list-homework-submit-pk`,
  //保存作业
  saveHomework: `${PREFIX}/api/marketing/page/college/save-homework`,
  //获取图片的地址
  uploadImgFile: `${PREFIX}/api/marketing/page/college/management/upload-img-file`,
  //视频转码
  transcodejob: `${PREFIX}/api/marketing/page/college/management/trans-code-job`,
  /*~
   *
   * 首页列表接口
   */
  //分类-获取课程分类的所有一级分类
  listClassClassifyNodesOneLevel: `${PREFIX}/api/marketing/page/classify/list-class-classify-nodes-one-level`,
  //首页banner图
  listHomePageBanner: `${PREFIX}/api/marketing/page/comment/list-home-page-banner`,
  //首页-课程列表-即将直播
  listAppLiveCourseIndex: `${PREFIX}/api/marketing/page/college/management/list-app-live-course-index`,
  //主题分类
  listThemeCourse: `${PREFIX}/api/marketing/page/college/management/list-theme-course`,
  //悬浮
  lastLiveCourseIndex: `${PREFIX}/api/marketing/page/college/last-live-course-index`,
  //搜索列表
  listAppLiveCourseIndexByCondition: `${PREFIX}/api/marketing/page/college/management/list-app-live-course-index-by-condition`,
  // 课程分类页面
  listClassClassifyCourses: `${PREFIX}/api/marketing/page/college/management/list-class-classify-courses`,
  // 首页弹窗广告
  getHomePageWindow: `${PREFIX}/api/marketing/page/comment/get-home-page-window`,
  // 首页-弹窗广告日志新增
  saveHomePageWindowLog: `${PREFIX}/api/marketing/page/comment/save-home-page-window_log`,
  // 主题分类列表
  listCourseByThemeId: `${PREFIX}/api/marketing/page/college/management/list-course-by-theme-id`,
  //上传视频 - 获取上传信息
  getUploadVideoInfo: `${PREFIX}/api/marketing/page/college/management/get-sts-token`,
  /*~
   *
   * 组件接口
   */
  //获取视频播放码
  getplayauth: `${PREFIX}/api/marketing/page/college/management/get-play-auth`,
  //获取视频播地址-加密
  getplayaddress: `${PREFIX}/api/marketing/page/college/management/get-play-address`,
  //获取视频播地址-普通
  getremotevodaddress: `${PREFIX}/api/marketing/page/college/get-remote-vod-address`,
  //获取视频播轮训时间间隔
  getaccountinfo: `${PREFIX}/api/marketing/page/college/management/get-account-info`,
  //课程详情-学习进度上报
  savestudyprogress: `${PREFIX}/api/marketing/page/college/management/save-study-progress`,
  //查询文档上传结果
  getFileResult: `${PREFIX}/api/marketing/page/college/management/get-file-result`,
  //获得文档图片流
  getDocPicUrl: `${PREFIX}/api/marketing/page/college/management/get-doc-pic-url`,
  //获得文档图片流-商品中心
  searchDocPicUrl: `${PREFIX}/api/marketing/page/college/management/search-doc-pic-url`,

  //获取视频转码状态
  gettranscodetaskinfo: `${PREFIX}/api/marketing/page/college/management/get-trans-code-task-info`,

  /*~
   *
   * 机构运营
   */
  //机构运营-获取课程分类的所有二级分类
  listClassClassifyNodesTwoLevel: `${PREFIX}/api/marketing/page/app/list-class-classify-nodes-two-level`,
  //机构运营-首页-banner图
  listHomePageBannerOrganization: `${PREFIX}/api/marketing/page/comment/list-home-page-banner-organization`,
  //机构运营-机构运营首页-即将直播
  listAppLiveCourseTwoLevel: `${PREFIX}/api/marketing/page/college/management/list-app-live-course-two-level`,
  //机构运营-获取主题分类及对应的课程
  listThemeCourseOrganization: `${PREFIX}/api/marketing/page/college/management/list-theme-course-organization`,
  //机构运营-获取某个主题分类下的课程等信息
  listCourseByThemeOrganizationId: `${PREFIX}/api/marketing/page/college/management/list-course-by-theme-organization-id`,
  //机构运营-课程列表-任务-数量
  getAppTaskNum: `${PREFIX}/api/marketing/page/task/management/get-app-task-num`,
  //机构运营App直播列表
  listAppLiveTwoLevel: `${PREFIX}/api/marketing/page/college/management/list-app-live-two-level`,
  // 根据商品编码查询商品详情
  getitembasicdetail: `${PREFIX}/api/marketing/page/college/management/get-item-basic-detail-for-study-marketing`,
  // 商品点击数统计
  updateProductClickCount: `${PREFIX}/api/marketing/page/college/management/update-product-click-count`,
  // 文档上传
  uploadFile: `${PREFIX}/api/marketing/page/college/management/upload-file`,
  // 获取pdf的base64
  getPicture: `${PREFIX}/api/marketing/page/college/management/get-picture`,
  // 课程评价点赞-app
  listappreviews: `${PREFIX}/api/marketing/page/comment/app/list-app-reviews`,
  // 课程评价点赞-app
  addreviewslike: `${PREFIX}/api/marketing/page/comment/app/add-reviews-like`,

  // 课程评价新增
  addreviews: `${PREFIX}/api/marketing/page/comment/app/add-reviews`,
  // 课程详情-课程推荐-APP
  getCourseRecommendation: `${PREFIX}/api/marketing/page/course/management/get-course-recommendation`,
  // 学习报告详情
  getStudyReport: `${PREFIX}/api/marketing/page/study/report/get-study-report`,
  // 团队学习报告
  listOrgStudyReport: `${PREFIX}/api/marketing/page/study/report/list-org-study-report`,
  // 学习勤奋榜
  studyReportRankingList: `${PREFIX}/api/marketing/page/study/report/study-report-ranking-list`,
  // 学习报告图片分享
  studyReportShare: `${PREFIX}/api/marketing/page/study/report/study-report-share`,
  // 学习报告点赞
  addReportLike: `${PREFIX}/api/marketing/page/study/report/add-report_like`,
  // 学习报告起初
  saveStudyReport: `${PREFIX}/api/marketing/page/study/report/save-study-report`,
  // 课程排行列表
  listCourseRankingList: `${PREFIX}/api/marketing/page/college/management/list-course-ranking-list`,
  // 查询运营电话
  listStudyTerminalPhone: `${PREFIX}/api/marketing/page/authorization/list-study-terminal-phone`,

  //---------------------------------------------班级管理-----------------------------------------------------------
  // 班级管理-APP首页（机构运营）班级列表查询
  getClassList: `${PREFIX}/api/marketing/page/class/management/app/list-class-management`,
  // APP班级课程表-列表
  getCurriculum: `${PREFIX}/api/marketing/page/class/management/app/list-class-management-courses`,
  // 班级列表
  // 班级管理-APP班级列表查询（正在学）
  listClassManagementStudying: `${PREFIX}/api/marketing/page/class/management/app/list-class-management-studying`,
  // 班级管理-APP班级列表查询（未加入）
  listClassManagementUnStudy: `${PREFIX}/api/marketing/page/class/management/app/list-class-management-unStudy`,
  // 班级管理-APP班级列表查询（已学完）
  listClassManagementStudy: `${PREFIX}/api/marketing/page/class/management/app/list-class-management-study`,
  // 班级管理-APP班级 报名，加入学习，不感兴趣
  updateClassStudentStatus: `${PREFIX}/api/marketing/page/class/management/app/update-class-student-status`,
  // 班级详情
  // 班级详情-班级基本信息
  classBaseInfoById: `${PREFIX}/api/marketing/page/class/management/app/get-class-base-info-by-id`,
  // 班级详情-班级课表
  listClassManagementCoursesRela: `${PREFIX}/api/marketing/page/class/management/app/list-class-management-courses-rela`,
  // 班级详情-考试列表
  listClassExamDataByClassId: `${PREFIX}/api/marketing/page/class/management/app/list-class-exam-data-by-class-id`,
  // 班级管理-APP-考试列表统计数据
  listClassExamDataSum: `${PREFIX}/api/marketing/page/class/management/app/list-class-exam-data-sum`,
  // 班级详情-作业列表
  listClassHomeworkDataByClassId: `${PREFIX}/api/marketing/page/class/management/app/list-class-homework-data-by-class-id`,
  //班级管理-APP-作业列表统计数据
  listClassHomeworkDataSum: `${PREFIX}/api/marketing/page/class/management/app/list-class-homework-data-sum`,
  // 班级详情-证书列表
  listCertificateByClassId: `${PREFIX}/api/marketing/page/class/management/app/list-certificate-by-class-id`,
  // 班级管理-APP-查询讲师信息
  getLecturerById: `${PREFIX}/api/marketing/page/class/management/app/get-lecturer-by-id`
};
