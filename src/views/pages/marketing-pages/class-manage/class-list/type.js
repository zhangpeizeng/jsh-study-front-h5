const SEARCH_TYPE = {
  UNLIMITED: 0,
  NOT_JOINED: 1, // 未加入
  LEARNING: 2, // 正在学
  FINISHED: 3 // 已学完
};

// 操作和提示状态
const OPERATIONSTATUS = {
  REGISTERED_NOT_OPEN: 0, // 加入学习后待开班
  SIGN_UP: 1, // 去报名
  JOIN_LEARNING: 2, // 加入学习
  GO_TO_CLASS: 3, // 去上课
  REJECTED: 4, // 报名驳回
  REGISTERED_BEING_CONFIRMED: 5 // 报名待确认
};

export default {
  SEARCH_TYPE,
  OPERATIONSTATUS
};
