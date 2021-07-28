const COURSE_TYPE = {
  RECORD_BROADCAT_DOC: 1,
  DIRECT_SEEDING: 2, // 直播课
  DISCUSS: 3, // 研讨课
  SERIES: 4 // 系列课
};

const SEARCH_TYPE = {
  NOT_JOINED: 1, // 未加入
  LEARNING: 2, // 正在学
  FINISHED: 3 // 已学完
};

// 0-立即报名 1-报名待审核，2-审核通过，3-审核驳回，4-待确认，5-已拒绝，6-已加入，7-已移除，8-不感兴趣，9-待评定，10-已评定
const COURSE_STATUS = {
  SIGN_UP_NOW: 0, // 立即报名
  REFISTRATION_TO_BE_APPROVED: 1, // 报名待审核
  REFISTRATION_APPROVED: 2, // 报名审核通过
  REFISTRATION_REVIEW_REJECTED: 3, // 报名审核驳回
  TO_BE_CONFIRMED_BY_STUDENT: 4, // 待学员确认
  STUDENT_REJECTED: 5, // 学员已拒绝
  JOINED: 6, // 已加入
  REMOVED: 7, // 已移除
  UNINTERESTED: 8, // 不感兴趣
  TO_BE_EVALUATED_BY_TEACHER: 9, // 待评定
  EVALUATED_BY_TEACHER: 10 // 已评定
};

export default {
  COURSE_TYPE,
  SEARCH_TYPE,
  COURSE_STATUS
};
